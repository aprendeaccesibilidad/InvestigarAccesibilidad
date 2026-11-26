const STUDIES_SHEET = '1k4R_tc3kXyl5SNvLlx0xs6G_pivhS-3lTY7fLh231Cg';
const STUDIES_MIN = 5;
const STUDIES_HEADERS = ['Marca temporal', 'ID de participación', 'Versión', 'Consentimiento', 'Reutilización'];
const METADATA_HEADERS = ['Inicio del cuestionario', 'Fin del cuestionario', 'Duración total (s)',
  'Interacción activa (s)', 'Tipo de dispositivo', 'Navegador', 'Idioma de respuesta'];
const CASE_HEADER = 'Tiempo activo del caso ';
const SUBMISSION_HEADER = 'ID de envío';
const APPENDED_ANSWER_COLUMNS = ['P03__o08'];
const CONTACT_HEADERS = ['Marca temporal', 'ID de participación', 'Correo electrónico', 'Consentimiento'];
const SNAPSHOT_HEADERS = ['Resultados agregados'];
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function book_() {
  return SpreadsheetApp.openById(STUDIES_SHEET);
}

function answerColumns_(study) {
  const questions = study.questions.flatMap(q => [q.id, ...(q.options || [])
    .filter(o => o.allowOtherText).map(o => q.id + '__' + o.id)]);
  return STUDIES_HEADERS.concat(study.confirmation || [], questions);
}

function historicalAnswerColumns_(study) {
  return answerColumns_(study).filter(header => study.tab !== 'Estudio_2' || !APPENDED_ANSWER_COLUMNS.includes(header));
}

function timingColumns_(study) {
  return historicalAnswerColumns_(study).concat(METADATA_HEADERS, study.cases.map(id => CASE_HEADER + id + ' (s)'));
}

function columns_(study) {
  const existing = timingColumns_(study).concat(SUBMISSION_HEADER);
  return existing.concat(answerColumns_(study).filter(header => !existing.includes(header)));
}

function ensureColumns_(tab, count) {
  const extra = count - tab.getMaxColumns();
  if (extra > 0) tab.insertColumnsAfter(tab.getMaxColumns(), extra);
}

function sheet_(book, name, headers, create, previousLayouts = []) {
  let tab = book.getSheetByName(name);
  if (!tab && create) tab = book.insertSheet(name);
  if (!tab) throw new Error('Falta una pestaña del estudio.');
  if (create && !tab.getLastRow()) {
    ensureColumns_(tab, headers.length);
    tab.getRange(1, 1, 1, headers.length).setValues([headers]);
    tab.setFrozenRows(1);
  }
  const previous = create && previousLayouts.find(layout => layout.length < headers.length &&
    tab.getLastColumn() === layout.length &&
    tab.getRange(1, 1, 1, layout.length).getValues()[0].join('\n') === layout.join('\n'));
  if (previous) {
    ensureColumns_(tab, headers.length);
    const added = headers.slice(previous.length);
    tab.getRange(1, previous.length + 1, 1, added.length).setValues([added]);
  }
  if (tab.getLastColumn() !== headers.length ||
      tab.getRange(1, 1, 1, headers.length).getValues()[0].join('\n') !== headers.join('\n')) {
    throw new Error('Los encabezados de ' + name + ' han cambiado.');
  }
  return tab;
}

function locked_(operation) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try { return operation(); } finally { lock.releaseLock(); }
}

function prepararHoja() {
  locked_(() => {
    const book = book_();
    for (const study of Object.values(STUDIES)) {
      const previous = historicalAnswerColumns_(study);
      const timing = timingColumns_(study);
      const tab = sheet_(book, study.tab, columns_(study), true, [previous,timing,timing.concat(SUBMISSION_HEADER)]);
      const rows = tab.getMaxRows() - 1;
      tab.getRange(2, 1, rows, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
      tab.getRange(2, previous.length + 1, rows, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    }
    contactSheet_(book);
    sheet_(book, 'Agregados_Estudios', SNAPSHOT_HEADERS, true);
    SpreadsheetApp.flush();
    console.log('Hoja preparada: ' + book.getName() + ' — ' + book.getUrl());
  });
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e?.parameter?.action !== 'observatorio') return json_({
    ok:true, service:'estudios', versions:{E1:STUDIES.E1.version,E2:STUDIES.E2.version}
  });
  if (PropertiesService.getScriptProperties().getProperty('PUBLICAR_OBSERVATORIO') !== 'true') {
    return json_({ok: false});
  }
  try {
    const snapshot = sheet_(book_(), 'Agregados_Estudios', SNAPSHOT_HEADERS).getRange('A2').getValue();
    return snapshot ? json_(JSON.parse(snapshot)) : json_({ok: false});
  } catch (error) { console.error(error.message); return json_({ok: false}); }
}

function fail_(message) {
  throw new Error('VALIDACION: ' + message);
}

function options_(q, answers) {
  if (!q.dynamicOptions) return q.options || [];
  const ids = [].concat(answers[q.dynamicOptions.sourceQuestion] || [])
    .flatMap(value => [].concat(q.dynamicOptions.map[value] || []));
  return q.options.filter(o => ids.includes(o.id));
}

function cells_(study, answers) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) fail_('Faltan las respuestas.');
  const cells = {};
  if (study.confirmation) {
    if (answers[study.confirmation] !== true) fail_('Debes confirmar las condiciones.');
    cells[study.confirmation] = true;
  }
  for (const q of study.questions) {
    const value = answers[q.id];
    if (q.visibility) {
      const rule = q.visibility;
      const match = [].concat(answers[rule.question] || []).some(v => rule.optionIds.includes(v));
      const visible = rule.operator === 'notContains' ? !match : match;
      if (!visible) { cells[q.id] = 'not_applicable'; continue; }
    }
    if (value == null || value === '') {
      if (q.required) fail_('Falta la respuesta a ' + q.id + '.');
      continue;
    }
    if (q.type === 'text') {
      if (typeof value !== 'string' || value.length > (q.maxLength || 4000) || (q.required && !value.trim())) {
        fail_('Revisa la respuesta a ' + q.id + '.');
      }
      cells[q.id] = safe_(value.trim());
      continue;
    }
    const options = options_(q, answers);
    const values = q.type === 'multiple' ? value : [value];
    if (!Array.isArray(values) || !values.length || new Set(values).size !== values.length ||
        values.some(v => typeof v !== 'string' || !(options.some(o => o.id === v) || q.type === 'country' && STUDY_COUNTRIES.includes(v))) ||
        values.length > 1 && options.some(o => o.exclusive && values.includes(o.id))) {
      fail_('Revisa las opciones de ' + q.id + '.');
    }
    cells[q.id] = q.type === 'multiple' ? JSON.stringify(values) : safe_(value);
    for (const o of options.filter(o => o.allowOtherText && values.includes(o.id))) {
      const key = q.id + '__' + o.id;
      const other = answers[key];
      if (typeof other !== 'string' || !other.trim() || other.length > 250) fail_('Detalla la opción de ' + q.id + '.');
      cells[key] = safe_(other.trim());
    }
  }
  return cells;
}

function safe_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function find_(tab, id, column = 2) {
  const count = tab.getLastRow() - 1;
  return count > 0 ? tab.getRange(2, column, count, 1).createTextFinder(id).matchEntireCell(true).findNext() : null;
}

function metadataCells_(study, metadata) {
  if (metadata == null) return [];
  const {startedAt, finishedAt, activeSeconds, caseSeconds, device, browser, language} = metadata;
  const start = typeof startedAt === 'string' ? new Date(startedAt) : new Date(NaN);
  const finish = typeof finishedAt === 'string' ? new Date(finishedAt) : new Date(NaN);
  const total = Math.floor((finish.getTime() - start.getTime()) / 1000);
  const categories = ['Móvil','Tableta','Ordenador','Otro'];
  const browsers = ['Edge','Opera','Samsung Internet','Firefox','Chrome','Safari','Otro'];
  if (!Number.isFinite(total) || total < 0 || !Number.isInteger(activeSeconds) || activeSeconds < 0 ||
      !categories.includes(device) || !browsers.includes(browser) ||
      typeof language !== 'string' || !/^[a-z]{2,3}(-[a-z0-9]{2,8}){0,3}$/i.test(language)) {
    fail_('No se pudieron validar los datos de duración del cuestionario.');
  }
  const active = Math.min(activeSeconds, total);
  const cases = study.cases.map(id => caseSeconds && Object.prototype.hasOwnProperty.call(caseSeconds,id) ? caseSeconds[id] : 0);
  if (cases.some(value => !Number.isInteger(value) || value < 0) ||
      cases.reduce((sum,value) => sum + value, 0) > activeSeconds) {
    fail_('No se pudieron validar las duraciones de los casos.');
  }
  let remaining = active;
  const boundedCases = cases.map(value => {
    const seconds = Math.min(value, remaining);
    remaining -= seconds;
    return seconds;
  });
  return [start, finish, total, active, device, browser, language, ...boundedCases];
}

function saveStudy_(data) {
  if (data.studyId === 'E2') fail_('El Estudio 2 se completa sin guardar respuestas.');
  const study = Object.prototype.hasOwnProperty.call(STUDIES, data.studyId) && STUDIES[data.studyId];
  if (!study) fail_('El servicio de guardado no reconoce este estudio.');
  if (study.version !== data.version) {
    const label = data.studyId === 'E1' ? 'Estudio 1' : 'Estudio 2';
    fail_('La versión publicada del servicio de guardado solo acepta la versión '+study.version+' del '+label+'. El equipo debe actualizar Apps Script.');
  }
  if (data.consent !== true) fail_('Falta el consentimiento informado para enviar el cuestionario.');
  if (typeof data.participant !== 'string' || !ID_PATTERN.test(data.participant)) {
    fail_('El código de participación de este navegador no es válido. Recarga el cuestionario para volver a intentarlo.');
  }
  const submissionId = data.submissionId;
  if (submissionId != null && (typeof submissionId !== 'string' || !ID_PATTERN.test(submissionId))) {
    fail_('El identificador de envío no es válido.');
  }
  const cells = cells_(study, data.answers);
  const metadata = metadataCells_(study, data.metadata);
  return locked_(() => {
    const book = book_();
    const headers = columns_(study);
    const tab = sheet_(book, study.tab, headers);
    if (submissionId) {
      const previous = find_(tab, submissionId, headers.indexOf(SUBMISSION_HEADER) + 1);
      if (previous) {
        if (tab.getRange(previous.getRow(), 2).getValue() !== data.participant) fail_('El identificador de envío no coincide.');
        return {ok:true,submissionId};
      }
    } else if (find_(tab, data.participant)) {
      return {ok:true};
    }
    const reused = {};
    const other = STUDIES[data.studyId === 'E1' ? 'E2' : 'E1'];
    const entries = Object.entries(data.reused || {});
    if (entries.length) {
      const otherHeaders = columns_(other);
      const otherTab = sheet_(book, other.tab, otherHeaders);
      const count = otherTab.getLastRow() - 1;
      const matches = count > 0 ? otherTab.getRange(2, 2, count, 1)
        .createTextFinder(data.participant).matchEntireCell(true).findAll() : [];
      const expected = data.studyId === 'E1' ? 'E2' : 'E1';
      const checks = entries.map(([key,label]) => {
        const pair = STUDY_PAIRS.find(pair => pair[data.studyId === 'E1' ? 0 : 1] === key);
        const source = pair?.[data.studyId === 'E1' ? 1 : 0];
        if (label !== expected || !source) fail_('No se pudo comprobar la respuesta común de ' + key + '.');
        reused[key] = label;
        return [otherHeaders.indexOf(source),cells[key]];
      });
      const valid = matches.some(match => {
        const row = otherTab.getRange(match.getRow(), 1, 1, otherHeaders.length).getValues()[0];
        return row[2] === other.version && checks.every(([column,value])=>row[column] === value);
      });
      if (!valid) fail_('No se pudieron comprobar las respuestas comunes de la participación anterior.');
    }
    const row = [new Date(), data.participant, study.version, true, JSON.stringify(reused)];
    const metadataHeaders = timingColumns_(study).slice(historicalAnswerColumns_(study).length);
    const extra = Object.fromEntries(metadataHeaders.map((header,index) => [header,metadata[index] ?? '']));
    extra[SUBMISSION_HEADER] = submissionId || '';
    for (const header of headers.slice(row.length)) row.push(cells[header] ?? extra[header] ?? '');
    tab.appendRow(row);
    SpreadsheetApp.flush();
    return submissionId ? {ok:true,submissionId} : {ok:true};
  });
}

function contactSheet_(book) {
  const tab = book.getSheetByName('Contactos');
  if (tab && tab.getLastColumn() === CONTACT_HEADERS.length) {
    const legacy = CONTACT_HEADERS.slice();
    legacy[1] = 'ID de contacto';
    if (tab.getRange(1, 1, 1, legacy.length).getValues()[0].join('\n') === legacy.join('\n')) {
      tab.getRange(1, 2).setValue(CONTACT_HEADERS[1]);
    }
  }
  return sheet_(book, 'Contactos', CONTACT_HEADERS, true);
}

function saveContact_(data) {
  if (data.studyId === 'E2') fail_('El Estudio 2 no recoge correos electrónicos.');
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const study = Object.prototype.hasOwnProperty.call(STUDIES, data.studyId) && STUDIES[data.studyId];
  if (!study || !ID_PATTERN.test(data.participant) || !ID_PATTERN.test(data.submissionId) ||
      data.consent !== true || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail_('Revisa tu correo y la autorización.');
  return locked_(() => {
    const book = book_();
    const headers = columns_(study);
    const answersTab = sheet_(book, study.tab, headers);
    const submission = find_(answersTab, data.submissionId, headers.indexOf(SUBMISSION_HEADER) + 1);
    if (!submission || answersTab.getRange(submission.getRow(), 2).getValue() !== data.participant) {
      fail_('No se pudo comprobar el envío asociado al correo.');
    }
    const tab = contactSheet_(book);
    const previous = find_(tab, data.participant);
    const savedEmail = safe_(email);
    const row = [new Date(), data.participant, savedEmail, true];
    if (!previous) tab.appendRow(row);
    else if (tab.getRange(previous.getRow(), 3).getValue() !== email) {
      tab.getRange(previous.getRow(), 1, 1, row.length).setValues([row]);
    }
    SpreadsheetApp.flush();
    return {ok: true};
  });
}

function doPost(e) {
  try {
    const body = e?.postData?.contents;
    if (!body || body.length > 150000) fail_('El envío no es válido.');
    const data = JSON.parse(body);
    if (data.kind === 'study') return json_(saveStudy_(data));
    if (data.kind === 'contact') return json_(saveContact_(data));
    fail_('El envío no es válido.');
  } catch (error) {
    const message = error.message || '';
    if (message.startsWith('VALIDACION: ')) return json_({ok: false, message: message.slice(12)});
    console.error(message);
    const sheetSetup = message.startsWith('Los encabezados de ') || message === 'Falta una pestaña del estudio.';
    return json_({ok:false, message:sheetSetup
      ? 'La hoja de respuestas necesita actualizarse. El equipo debe ejecutar prepararHoja en Apps Script.'
      : 'El servicio no pudo confirmar el guardado en Google Sheets. Puedes reintentar el envío.'});
  }
}

function studyRows_(book, study) {
  const tab = sheet_(book, study.tab, columns_(study));
  const seen = new Set();
  return tab.getDataRange().getValues().slice(1).sort((a,b)=>a[0]-b[0]).filter(row => {
    if (row[2] !== study.version || row[3] !== true || seen.has(row[1])) return false;
    seen.add(row[1]);
    return true;
  });
}

function counts_(values, groups) {
  const distribution = {};
  let hidden = 0;
  for (const [key,count] of Object.entries(groups)) {
    if (count >= STUDIES_MIN && (values === count || values - count >= STUDIES_MIN)) distribution[key] = count;
    else if (count > 0) hidden += 1;
  }
  // Una sola categoría omitida se podría calcular por diferencia en selección única.
  return {distribution, hidden};
}

function aggregate_(study, rows, id) {
  if (rows.length < STUDIES_MIN) return {total:null, questions:{}};
  const columns = columns_(study);
  const questions = {};
  for (const q of study.questions) {
    const column = columns.indexOf(q.id);
    const values = rows.map(row => row[column]).filter(value => value !== '' && value !== 'not_applicable');
    if (values.length < STUDIES_MIN || rows.length !== values.length && rows.length-values.length < STUDIES_MIN) continue;
    const result = {n:values.length};
    if (q.type !== 'text' && !(id === 'E1' && q.id === 'P07')) {
      const tally = Object.create(null);
      for (const value of values) {
        const selected = q.type === 'multiple' ? JSON.parse(value) : [value];
        for (const option of selected) tally[option] = (tally[option] || 0) + 1;
      }
      const {distribution, hidden} = counts_(values.length, tally);
      if (!(q.type !== 'multiple' && hidden === 1)) result.counts = distribution;
      result.partial = hidden > 0;
      if (q.options?.length && q.options.every(o => Number.isFinite(o.score))) {
        const scores = new Map(q.options.map(o => [o.id,o.score]));
        result.mean = Math.round(values.reduce((sum,value) => sum + scores.get(value),0) / values.length * 10) / 10;
      }
    }
    questions[q.id] = result;
  }
  return {total:rows.length, questions};
}

function combined_(rows1, rows2) {
  const profile = new Map(rows1.map(row => [row[1],row]));
  const experience = columns_(STUDIES.E1).indexOf('P09');
  const learning = columns_(STUDIES.E1).indexOf('P14');
  const confidence = ['P14','P21','P28','P35','P42','P49'];
  const indices = confidence.map(id => columns_(STUDIES.E2).indexOf(id));
  const scales = confidence.map(id => new Map(STUDIES.E2.questions.find(q => q.id === id).options.map(o => [o.id,o.score])));
  const groups = {P09:{},P14:{}};
  for (const row of rows2) {
    const first = profile.get(row[1]);
    if (!first) continue;
    const score = indices.reduce((sum,index,i) => sum + scales[i].get(row[index]),0) / indices.length;
    if (!Number.isFinite(score)) continue;
    for (const [question,value] of [['P09',first[experience]],['P14',first[learning]]]) {
      if (!value) continue;
      const scores = groups[question][value] || [];
      scores.push(score);
      groups[question][value] = scores;
    }
  }
  return Object.fromEntries(Object.entries(groups).map(([question,values]) => [
    question, Object.fromEntries(Object.entries(values).filter(([,scores]) => scores.length >= STUDIES_MIN)
      .map(([key,scores]) => [key,{n:scores.length,mean:Math.round(scores.reduce((a,b) => a+b,0) / scores.length * 10) / 10}]))
  ]));
}

function publicarObservatorio() {
  locked_(() => {
    const book = book_();
    const rows1 = studyRows_(book, STUDIES.E1);
    const rows2 = studyRows_(book, STUDIES.E2);
    const second = new Set(rows2.map(row => row[1]));
    const count = rows1.filter(row => second.has(row[1])).length;
    const paired = count >= STUDIES_MIN && [rows1.length, rows2.length].every(n => n === count || n-count >= STUDIES_MIN) ? count : null;
    const snapshot = {
      ok:true, generatedAt:new Date().toISOString(), versions:{E1:STUDIES.E1.version,E2:STUDIES.E2.version},
      paired, combined:paired ? combined_(rows1,rows2) : {},
      studies:{ E1:aggregate_(STUDIES.E1,rows1,'E1'), E2:aggregate_(STUDIES.E2,rows2,'E2') }
    };
    sheet_(book, 'Agregados_Estudios', SNAPSHOT_HEADERS).getRange('A2').setValue(JSON.stringify(snapshot));
    SpreadsheetApp.flush();
    console.log('Instantánea de los estudios preparada.');
  });
}
