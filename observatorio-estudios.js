(() => {
 'use strict';

 const $ = id => document.getElementById(id);
 const base = 'datos/';
 const numbers = new Intl.NumberFormat('es', {maximumFractionDigits:1});
 const percent = new Intl.NumberFormat('es', {style:'percent', maximumFractionDigits:1});
 const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
 };
 const clean = title => title.replace(/^Sección \d+\.\s*/,'');
 const groupHeading = title => {
  const heading = node('h3');
  window.escribirTextoDelPortal(heading, clean(title));
  return heading;
 };
 const questionId = (study, q) => 'result-' + study.id + '-' + q.id;

 async function load(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudieron cargar los datos.');
  return response.json();
 }

 function chartBar(label, value, fraction, variant = '') {
  const row = node('li','','vbar obs-chart-bar'+(variant?' '+variant:''));
  const heading = node('div','','bar-top');
  heading.append(node('span',label),node('strong',value));
  const rail = node('div','','bar-rail');
  rail.setAttribute('aria-hidden','true');
  const fill = node('div','','bar-fill');
  fill.style.width = Math.max(0,Math.min(1,fraction))*100+'%';
  rail.append(fill);
  row.append(heading,rail);
  return row;
 }

 function infographicLink(study,q,label) {
  const link = node('a',label);
  link.href = '#'+questionId(study,q);
  return link;
 }

 function profileInfographic(study, result, root) {
  const questions = study.sections.flatMap(section=>section.questions);
  for (const [id,title] of [
   ['P02','Situación actual'], ['P09','Experiencia profesional'],
   ['P14','Principal vía de aprendizaje'], ['P22','Conocimientos percibidos']
  ]) {
   const question = questions.find(q=>q.id===id);
   if (!question) continue;
   const values = result?.questions?.[id];
   const card = node('article','','obs-infographic-card');
   card.append(node('h3',title));
   if (values) {
    card.append(node('p',numbers.format(values.n)+' respuestas','obs-sample-size'));
    if (Number.isFinite(values.mean)) {
     card.append(node('p',numbers.format(values.mean)+' de 5','obs-infographic-number'));
    }
    const categories = question.options.filter(option=>Number.isInteger(values.counts?.[option.id]))
     .map(option=>[option,values.counts[option.id]]);
    const list = node('ul','','study-result-bars');
    for (const [option,count] of categories.slice(0,5)) {
     list.append(chartBar(option.label,numbers.format(count)+' · '+percent.format(count/values.n),count/values.n));
    }
    if (list.children.length) card.append(list);
    if (values.partial) card.append(node('p','Se reservan las categorías con pocas respuestas.','obs-sample-size'));
   } else {
    card.append(node('p','Todavía no hay datos publicables para este indicador.','obs-sample-size'));
   }
   card.append(infographicLink(study,question,'Ver desglose de '+title.toLowerCase()));
   root.append(card);
  }
 }

 function caseInfographic(study, result, root) {
  for (const item of study.cases) {
   const title = clean(item.title);
   const card = node('article','','obs-infographic-card');
   card.append(node('h3',title));
   const list = node('ul','','study-result-bars');
   for (const [index,label,variant] of [[3,'Confianza','obs-bar-confidence'],[4,'Dificultad','obs-bar-difficulty']]) {
    const question = item.questions[index];
    const value = result?.questions?.[question.id];
    if (Number.isFinite(value?.mean)) {
     const row = chartBar(label,numbers.format(value.mean)+' de 5',value.mean/5,variant);
     row.append(node('p',numbers.format(value.n)+' respuestas','obs-sample-size'));
     list.append(row);
    }
   }
   card.append(list.children.length ? list : node('p','Aún no hay valoraciones publicables para este caso.','obs-sample-size'));
   const link = node('a','Ver las respuestas del caso');
   link.href = '#result-case-'+item.id;
   card.append(link);
   root.append(card);
  }
 }

 function question(study, q, result, countries) {
  const card = node('details', '', 'obs-panel study-result');
  card.id = questionId(study,q);
  const summary = node('summary',q.id + '. ' + q.text);
  card.append(summary);
  if (!result) {
   card.append(node('p','Todavía no hay datos publicables para esta pregunta.'));
   return card;
  }
  card.append(node('p',numbers.format(result.n) + ' respuestas a esta pregunta.'));
  if (Number.isFinite(result.mean)) {
   card.append(node('p','Valoración media: ' + numbers.format(result.mean) + ' de 5.'));
  }
  if (q.type === 'text' || study.id === 'E1' && q.id === 'P07') {
   card.append(node('p','Se publica la cobertura de esta pregunta.'));
   return card;
  }
  const available = q.type === 'country' ? [...q.options,...countries] : q.options;
  const list = node('ul','','study-result-bars');
  for (const option of available) {
   const count = result.counts?.[option.id];
   if (!Number.isInteger(count)) continue;
   list.append(chartBar(option.label,numbers.format(count)+' · '+percent.format(count/result.n),count/result.n));
  }
  if (list.children.length) card.append(list);
  if (result.partial) card.append(node('p','Algunas categorías se reservan para proteger grupos pequeños.'));
  return card;
 }

 function renderStudy(study, results, countries, root) {
  const sections = [...study.sections, ...(study.cases || [])];
  if (study.controlQuestions?.length) sections.push({title:'Condiciones de realización',questions:study.controlQuestions});
  for (const section of sections) {
   const group = node('div','','study-results-group');
   if (study.cases?.includes(section)) {
    group.id = 'result-case-'+section.id;
    group.tabIndex = -1;
   }
   group.append(groupHeading(section.title));
   for (const q of section.questions) group.append(question(study,q,results?.questions[q.id],countries));
   root.append(group);
  }
 }

 function highlight(root, title, metric, context, target) {
  const card = node('article','','insight');
  card.append(node('h3',title),node('strong',metric,'insight-number'),node('p',context));
  const link = node('a','Ver el desglose de la pregunta');
  link.href = (target.startsWith('result-E1-') ? 'observatorio-estudio-1.html' : 'observatorio-estudio-2.html')+'#'+target;
  card.append(link);
  root.append(card);
 }

 function renderTotals(snapshot, onlyStudy) {
  for (const [id,number,label] of [
   ['E1',snapshot.studies?.E1?.total,'participaciones en el Estudio 1'],
   ['E2',snapshot.studies?.E2?.total,'participaciones en el Estudio 2'],
   ['combined',snapshot.paired,'participaciones vinculadas entre los estudios']
  ]) {
   if ((onlyStudy && onlyStudy!==id) || !Number.isInteger(number)) continue;
   const card = node('div','','kpi');
   card.append(node('strong',numbers.format(number)),node('span',label));
   $('results-kpis').append(card);
  }
 }

 function renderHighlights(first, second, snapshot) {
  const profile = $('profile-insights');
  const wcag = $('wcag-insights');
  const firstQuestions = first.sections.flatMap(section=>section.questions);
  for (const [id,label] of [['P14','Principal vía de aprendizaje'],['P22','Conocimientos autopercibidos']]) {
   const q = firstQuestions.find(q=>q.id===id);
   const result = snapshot.studies?.E1?.questions[id];
   if (Number.isFinite(result?.mean)) {
    highlight(profile,label,numbers.format(result.mean)+' de 5','Valoración media · '+numbers.format(result.n)+' respuestas.',questionId(first,q));
    continue;
   }
   if (!result?.counts || result.partial) continue;
   const sorted = Object.entries(result.counts).sort((a,b)=>b[1]-a[1]);
   if (!sorted.length) continue;
   const [option,count] = sorted[0];
   if (sorted[1]?.[1] === count) continue;
   highlight(profile,label,percent.format(count/result.n),q.options.find(o=>o.id===option).label+' · '+numbers.format(result.n)+' respuestas.',questionId(first,q));
  }
  for (const [index,label] of [[4,'Mayor dificultad percibida'],[3,'Mayor confianza al responder']]) {
   const cases = second.cases.map(item=>{
    const q = item.questions[index];
    return {item,q,result:snapshot.studies?.E2?.questions[q.id]};
   });
   if (!cases.every(entry=>Number.isFinite(entry.result?.mean))) continue;
   cases.sort((a,b)=>b.result.mean-a.result.mean);
   const [top,next] = cases;
   if (top.result.mean <= next.result.mean) continue;
   highlight(wcag,label,numbers.format(top.result.mean)+' de 5',
    clean(top.item.title)+' · '+numbers.format(top.result.n)+' respuestas.',questionId(second,top.q));
  }
  if (!profile.children.length) profile.append(node('p','Aún no hay resultados destacados publicables para el Estudio 1.'));
  if (!wcag.children.length) wcag.append(node('p','Aún no hay resultados destacados publicables para el Estudio 2.'));
  const hasGroups = Object.values(snapshot.combined || {}).some(group=>Object.keys(group).length);
  if (!hasGroups) $('combined-insight').textContent = 'Aún no hay grupos publicables para comparar ambos estudios.';
 }

 function renderCombined(study, combined) {
  const root = $('combined-results');
  for (const [id, title] of [['P09','Por experiencia profesional'],['P14','Por principal vía de aprendizaje']]) {
   const q = study.sections.flatMap(section=>section.questions).find(q=>q.id===id);
   const groups = combined?.[id] || {};
   const list = node('ul','','study-result-bars');
   for (const option of q.options) {
    const result = groups[option.id];
    if (!result) continue;
    const item = chartBar(option.label,numbers.format(result.mean)+' de 5',result.mean/5,'obs-bar-confidence');
    item.append(node('p',numbers.format(result.n)+' personas','obs-sample-size'));
    list.append(item);
   }
   if (list.children.length) root.append(groupHeading(title),list);
  }
  if (!root.children.length) root.append(node('p','Aún no hay grupos publicables para comparar ambos estudios.'));
 }

 function openQuestion() {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.tagName === 'DETAILS') {
   target.open = true;
   target.querySelector('summary').focus();
  } else if (target?.id.startsWith('result-case-')) {
   target.focus();
  }
 }

 async function start() {
  const [first,second,config,countries] = await Promise.all(
   ['estudio1','estudio2','config','paises'].map(name=>load(base+name+'.json'))
  );
  const isHighlights = Boolean($('profile-insights'));
  const profileRoot = $('profile-questions');
  const wcagRoot = $('wcag-questions');
  const onlyStudy = profileRoot && !wcagRoot ? 'E1' : wcagRoot && !profileRoot ? 'E2' : null;
  let snapshot = {};
  let status = 'Aún no hay resultados publicados.';
  if (config.submitUrl) {
   try {
    const url = new URL(config.submitUrl);
    url.searchParams.set('action','observatorio');
    const data = await load(url);
    if (data.ok && data.studies && data.versions?.E1 === first.version && data.versions?.E2 === second.version) {
     snapshot = data;
     const date = new Intl.DateTimeFormat('es',{dateStyle:'long'}).format(new Date(snapshot.generatedAt));
     status = (onlyStudy ? snapshot.studies[onlyStudy]?.total : Object.values(snapshot.studies).some(study=>study.total))
      ? 'Última actualización: '+date+'.'
      : 'La muestra aún es insuficiente para publicar resultados.';
    }
   } catch { status = 'Los resultados no están disponibles en este momento.'; }
  }
  renderTotals(snapshot,onlyStudy);
  if ($('profile-infographic')) profileInfographic(first,snapshot.studies?.E1,$('profile-infographic'));
  if ($('wcag-infographic')) caseInfographic(second,snapshot.studies?.E2,$('wcag-infographic'));
  if (isHighlights) {
   renderHighlights(first,second,snapshot);
  } else {
   if (profileRoot) renderStudy(first,snapshot.studies?.E1,countries,profileRoot);
   if (wcagRoot) renderStudy(second,snapshot.studies?.E2,countries,wcagRoot);
   if ($('combined-results')) renderCombined(first,snapshot.combined);
   openQuestion();
   addEventListener('hashchange',openQuestion);
  }
  $('results-status').textContent = status;
 }

 start().catch(() => { $('results-status').textContent = 'No se pudo cargar el Observatorio. Vuelve a cargar la página para reintentarlo.'; });
})();
