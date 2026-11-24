const RESPONSE_PREFIX_ = 'Respuestas_v';
const DICTIONARY_PREFIX_ = 'Diccionario_v';
const META_COLUMNS_ = ['Marca temporal', 'ID de envío web', 'ID del cuestionario', 'Versión'];
const DICTIONARY_HEADER_ = ['Campo', 'Pregunta o fila', 'Tipo', 'Opciones (ID → etiqueta)', 'Obligatoria', 'Condición de visibilidad'];

class SheetConfigurationError_ extends Error {}

function responseHeaders_() {
  return [...META_COLUMNS_, ...QUESTIONNAIRE_SCHEMA.fields.map(field => field.id)];
}

function spreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new SheetConfigurationError_('Falta SHEET_ID en las propiedades del script.');
  try {
    return SpreadsheetApp.openById(id);
  } catch {
    throw new SheetConfigurationError_('Apps Script no puede abrir la hoja. Comprueba SHEET_ID y los permisos de la cuenta.');
  }
}

function tabName_(prefix) {
  return prefix + QUESTIONNAIRE_SCHEMA.version.replace(/\./g, '_');
}

function validateHeaders_(sheet, headers) {
  if (sheet.getLastColumn() !== headers.length ||
      !sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0].every((cell, index) => cell === headers[index])) {
    throw new SheetConfigurationError_('Los encabezados de «' + sheet.getName() + '» no coinciden con el cuestionario.');
  }
}

function prepareTab_(spreadsheet, name, headers, rows = []) {
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  if (sheet.getLastRow()) {
    validateHeaders_(sheet, headers);
    return;
  }
  if (headers.length > sheet.getMaxColumns()) {
    const current = sheet.getMaxColumns();
    sheet.insertColumnsAfter(current, headers.length - current);
  }
  sheet.getRange(1, 1, rows.length + 1, headers.length).setValues([headers, ...rows]);
  sheet.setFrozenRows(1);
}

function prepararHoja() {
  const lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    const spreadsheet = spreadsheet_();
    prepareTab_(spreadsheet, tabName_(RESPONSE_PREFIX_), responseHeaders_());
    const rows = QUESTIONNAIRE_SCHEMA.fields.map(field => [
      field.id, literalCell_(field.title), field.type,
      field.options ? JSON.stringify(field.options) : '',
      field.required ? 'Sí' : 'No',
      field.visibleIf ? field.visibleIf.question_id + ' = ' + field.visibleIf.option_id : ''
    ]);
    prepareTab_(spreadsheet, tabName_(DICTIONARY_PREFIX_), DICTIONARY_HEADER_, rows);
    SpreadsheetApp.flush();
    console.log('Pestaña de respuestas y diccionario preparados. Las respuestas existentes se conservan.');
  } finally {
    lock.releaseLock();
  }
}

function responseTab_() {
  const name = tabName_(RESPONSE_PREFIX_);
  const sheet = spreadsheet_().getSheetByName(name);
  if (!sheet) throw new SheetConfigurationError_('Falta la pestaña «' + name + '». Ejecuta prepararHoja en Apps Script.');
  validateHeaders_(sheet, responseHeaders_());
  return sheet;
}

function comprobarConfiguracion() {
  const sheet = responseTab_();
  console.log('Configuración correcta. Pestaña «' + sheet.getName() + '» con ' + QUESTIONNAIRE_SCHEMA.fields.length + ' campos de respuesta.');
}

function validateAnswers_(answers) {
  const fields = QUESTIONNAIRE_SCHEMA.fields;
  if (!answers || Array.isArray(answers) || typeof answers !== 'object') return 'Envío no válido.';
  if (answers.CI !== QUESTIONNAIRE_SCHEMA.consent) return 'Se requiere el consentimiento afirmativo.';
  const keys = new Set(fields.map(field => field.id));
  if (Object.keys(answers).some(key => !keys.has(key))) return 'El envío contiene campos desconocidos. Recarga el cuestionario.';

  for (const field of fields) {
    const value = answers[field.id];
    const condition = field.visibleIf;
    if (condition && ![answers[condition.question_id]].flat().includes(condition.option_id)) {
      if (value !== undefined) return 'La pregunta ' + field.id + ' no corresponde a estas respuestas.';
      continue;
    }
    if (value === undefined && !field.required) continue;
    const validText = text => typeof text === 'string' && Boolean(text.trim()) && text.length <= 4000;
    const matchesOption = item => typeof item === 'string' && Object.prototype.hasOwnProperty.call(field.options, item);
    let valid;
    if (field.type === 'multi_select') {
      valid = Array.isArray(value) && value.length > 0 && new Set(value).size === value.length &&
        value.every(matchesOption) && !(value.length > 1 && field.exclusive?.some(id => value.includes(id)));
    } else if (field.options) {
      valid = matchesOption(value);
    } else if (field.format === 'email') {
      valid = validText(value) && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else {
      valid = validText(value);
    }
    if (!valid) return 'Revisa la respuesta de ' + field.id + '.';
  }
  return '';
}

function literalCell_(value) {
  if (value === undefined) return '';
  if (Array.isArray(value)) return JSON.stringify(value);
  return /^[\s]*[=+@-]/.test(value) ? "'" + value : value;
}

function isSubmissionId_(value) {
  return typeof value === 'string' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
}

function doPost(event) {
  const json = result => ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  const raw = event?.postData?.contents;
  if (!raw || raw.length > 50000) return json({ok: false, message: 'Envío no válido.'});

  let request;
  try {
    request = JSON.parse(raw);
  } catch {
    return json({ok: false, message: 'Envío no válido.'});
  }
  const {submissionId, questionnaireId, version, answers} = request || {};
  if (questionnaireId !== QUESTIONNAIRE_SCHEMA.questionnaireId || version !== QUESTIONNAIRE_SCHEMA.version) {
    return json({ok: false, message: 'La versión del cuestionario no coincide con la configurada en Google Sheets.'});
  }
  if (!isSubmissionId_(submissionId)) {
    return json({ok: false, message: 'Envío no válido.'});
  }
  const error = validateAnswers_(answers);
  if (error) return json({ok: false, message: error});

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(8000);
    const sheet = responseTab_();
    const lastRow = sheet.getLastRow();
    if (lastRow > 1 && sheet.getRange(2, 2, lastRow - 1, 1)
        .createTextFinder(submissionId).matchEntireCell(true).findNext()) {
      return json({ok: true});
    }
    const row = [new Date(), submissionId, questionnaireId, "'" + version,
      ...QUESTIONNAIRE_SCHEMA.fields.map(field => literalCell_(answers[field.id]))];
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    return json({ok: true});
  } catch (error) {
    if (error instanceof SheetConfigurationError_) return json({ok: false, message: error.message});
    console.error('No se pudo confirmar la escritura en Google Sheets.');
    return json({ok: false, message: 'No se pudo confirmar el envío en Google Sheets. Tus respuestas siguen en la página. Puedes reintentar.'});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

const PUBLIC_MINIMUM_ = 5;

function publicCounts_(rows) {
  const fields = QUESTIONNAIRE_SCHEMA.fields;
  const byId = Object.fromEntries(fields.map((field, index) => [field.id, index + META_COLUMNS_.length]));
  const minimum = PUBLIC_MINIMUM_;
  const total = rows.length >= minimum ? rows.length : null;
  const results = {};
  if (total === null) return {total, results};

  for (const field of fields) {
    const counts = Object.fromEntries(Object.keys(field.options || {}).map(key => [key, 0]));
    let eligible = 0;
    let answered = 0;
    for (const row of rows) {
      const condition = field.visibleIf;
      if (condition && !cellOptions_(row[byId[condition.question_id]]).includes(condition.option_id)) continue;
      eligible++;
      const cell = row[byId[field.id]];
      if (cell === '' || cell == null) continue;
      answered++;
      for (const value of new Set(cellOptions_(cell))) {
        if (Object.prototype.hasOwnProperty.call(counts, value)) counts[value]++;
      }
    }
    const safe = count => count === 0 || count >= minimum;
    const coverage = eligible >= minimum && safe(answered) && safe(eligible - answered)
      ? {answered, eligible}
      : null;
    const publishOptions = coverage && answered >= minimum && field.id !== 'P05' &&
      Object.values(counts).every(count => safe(count) && safe(answered - count));
    results[field.id] = {coverage, counts: publishOptions && field.options ? counts : null};
  }
  return {total, results};
}

function cellOptions_(value) {
  if (typeof value !== 'string') return [];
  if (!value.startsWith('[')) return [value];
  try {
    const list = JSON.parse(value);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function publicarObservatorio() {
  const lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    const sheet = responseTab_();
    const size = sheet.getLastRow() - 1;
    const stored = size > 0 ? sheet.getRange(2, 1, size, responseHeaders_().length).getValues() : [];
    // The verified headers and versioned tab identify the version even if Sheets reformats its cell.
    const rows = stored.filter(row => isSubmissionId_(row[1]) && row[2] === QUESTIONNAIRE_SCHEMA.questionnaireId);
    console.log('Pestaña «' + sheet.getName() + '»: ' + stored.length + ' filas leídas, ' + rows.length + ' participaciones incluidas.');
    const snapshot = {available: true, questionnaireId: QUESTIONNAIRE_SCHEMA.questionnaireId,
      version: QUESTIONNAIRE_SCHEMA.version, minimum: PUBLIC_MINIMUM_, ...publicCounts_(rows)};
    const spreadsheet = spreadsheet_();
    const name = tabName_('Agregados_v');
    const tab = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
    tab.getRange('A1').setValue(JSON.stringify(snapshot));
    SpreadsheetApp.flush();
    console.log('Instantánea de agregados preparada para el Observatorio.');
  } finally {
    lock.releaseLock();
  }
}

function doGet(event) {
  const json = data => ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  if (event?.parameter?.action !== 'observatorio' ||
      PropertiesService.getScriptProperties().getProperty('PUBLICAR_OBSERVATORIO') !== 'true') {
    return json({available: false});
  }
  try {
    const tab = spreadsheet_().getSheetByName(tabName_('Agregados_v'));
    if (!tab) return json({available: false});
    const snapshot = JSON.parse(tab.getRange('A1').getValue());
    if (snapshot.questionnaireId !== QUESTIONNAIRE_SCHEMA.questionnaireId ||
        snapshot.version !== QUESTIONNAIRE_SCHEMA.version) return json({available: false});
    return json(snapshot);
  } catch {
    console.error('No se pudieron leer los agregados del Observatorio.');
    return json({available: false});
  }
}
