(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const base = 'datos/';
 const requested = new URLSearchParams(location.search).get('estudio');
 const id = requested === 'E2' ? 'E2' : 'E1';
 const repeating = new URLSearchParams(location.search).get('repetir') === '1';
 let submissionId = crypto.randomUUID();
 let restoringDraft = false;
 let contactDraft = null;
 let studySent = false;
 const stepLabel = index => 'Paso '+(index+(id==='E2'?0:1))+' de '+(groups.length-(id==='E2'?1:0));
 const mobileLayout = matchMedia('(max-width: 760px)');
 const mobileNavigation = matchMedia('(max-width: 1024px)');
 const view = name => {
  for (const panel of ['study-introduction','study-wizard','study-invitation','study-completion']) $(panel).hidden = panel !== name;
  document.body.classList.toggle('study-in-progress', name === 'study-wizard');
 };
 const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
 const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { return false; } return true; };
 const remove = key => { try { localStorage.removeItem(key); } catch {} };
 const text = (target, value) => { $(target).textContent = value || ''; };
 const heading = (target, value) => window.escribirTextoDelPortal($(target),value);
 const el = (tag, value, attrs = {}) => {
  const node = document.createElement(tag);
  if (value) node.textContent = value;
  for (const [key, val] of Object.entries(attrs)) node.setAttribute(key,val);
  return node;
 };
 const idKey = 'investigar:estudios:participante';
 const storedParticipant = read(idKey, '');
 const participant = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(storedParticipant) ? storedParticipant : crypto.randomUUID();
 const contactKey = 'investigar:estudios:correo:'+participant;
 let endpoint, study, final, countries, versions, draftKey, answers = {}, reused = {}, commonPairs = [], groups = [], step = 0, furthest = 0, started = false, sending = false;
 const controls = new Map();

 async function load(name) {
  const result = await fetch(base + name, {cache:'no-store'});
  const file = name.split('?')[0];
  if (!result.ok) throw new Error('No se pudo cargar el archivo '+file+'.');
  try {
   return await result.json();
  } catch {
   throw new Error('El archivo '+file+' contiene un error de formato JSON.');
  }
 }

 async function send(data) {
  let response;
  try {
   response = await fetch(endpoint, {
    method: 'POST', credentials:'omit',
    headers: {'Content-Type':'text/plain;charset=UTF-8'}, body: JSON.stringify(data)
   });
  } catch {
   throw new Error('No se pudo conectar con el servicio que guarda las respuestas.');
  }
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
   throw new Error('El servicio no devolvió una confirmación válida de Google Sheets.');
  }
  const result = await response.json();
  if (!result.ok) {
   if (data.kind==='study' && result.message==='No se pudo validar la participación.') {
    throw new Error('El servicio de guardado rechazó la versión '+data.version+' de este cuestionario. El equipo debe actualizar la implementación de Apps Script.');
   }
   if (data.kind==='study' && result.message==='Revisa las opciones de P02.' &&
       typeof data.answers.P02 === 'string') {
    throw new Error('El servicio de guardado aún tiene la configuración anterior de «¿Cuál es tu situación actual?». Hay que actualizar Apps Script para aceptar una sola opción.');
   }
   throw new Error(result.message || 'No se pudo guardar la respuesta.');
  }
  return result;
 }

 function available(q) {
  if (!q.dynamicOptions) return q.options || [];
  const selected = [].concat(answers[q.dynamicOptions.sourceQuestion] || []);
  const ids = new Set(selected.flatMap(value => [].concat(q.dynamicOptions.map[value] || [])));
  return q.options.filter(option => ids.has(option.id));
 }

 function isVisible(q) {
  if (!q.visibility) return true;
  const rule = q.visibility;
  const found = [].concat(answers[rule.question] || []).some(value => rule.optionIds.includes(value));
  return rule.operator === 'notContains' ? !found : found;
 }

 function otherKey(q, option) { return q.id + '__' + option.id; }

 function optionsFor(q) {
  return q.type === 'country' ? [...q.options, ...countries] : q.options || [];
 }

 const idleLimitMs = 60000;
 let timing = {startedAt:null,activeMs:0,caseMs:{}};
 let lastSample = null;
 let lastInteraction = null;

 function measureActivity(now = performance.now()) {
  if (lastSample === null || lastInteraction === null) return;
  const elapsed = Math.max(0,Math.min(now,lastInteraction + idleLimitMs)-lastSample);
  timing.activeMs += elapsed;
  const caseId = groups[step]?.dataset.caseId;
  if (caseId) timing.caseMs[caseId] = (timing.caseMs[caseId] || 0) + elapsed;
  lastSample = now;
 }

 function interact() {
  if (!started || sending || document.hidden || !document.hasFocus()) return;
  const now = performance.now();
  measureActivity(now);
  lastSample = now;
  lastInteraction = now;
 }

 function pauseActivity() {
  measureActivity();
  lastSample = null;
  lastInteraction = null;
  persist();
 }

 for (const event of ['pointerdown','keydown','input','wheel','touchmove','play']) {
  $('study-wizard').addEventListener(event,interact,{capture:true,passive:true});
 }
 window.addEventListener('blur',pauseActivity);
 window.addEventListener('focus',interact);
 window.addEventListener('pagehide',pauseActivity);
 window.addEventListener('pageshow',interact);
 document.addEventListener('visibilitychange',() => {
  if (document.hidden) pauseActivity();
  else interact();
 });
 setInterval(() => {
  if (!started || lastSample === null) return;
  measureActivity();
  persist();
 },10000);

 function participationMetadata() {
  measureActivity();
  const agent = navigator.userAgent;
  const browser = [
   ['Edge',/Edg(?:A|iOS)?\//], ['Opera',/OPR\/|OPiOS\//], ['Samsung Internet',/SamsungBrowser\//],
   ['Firefox',/Firefox\/|FxiOS\//], ['Chrome',/Chrome\/|CriOS\//], ['Safari',/Safari\//]
  ].find(([,pattern])=>pattern.test(agent))?.[0] || 'Otro';
  const tablet = /iPad|Tablet/i.test(agent) || /Android/i.test(agent) && !/Mobile/i.test(agent) ||
   /Macintosh/i.test(agent) && navigator.maxTouchPoints > 1;
  const device = tablet ? 'Tableta' : /Mobi|iPhone|iPod|Android/i.test(agent) ? 'Móvil' :
   /Windows|Macintosh|Linux|CrOS/i.test(agent) ? 'Ordenador' : 'Otro';
  return {
   startedAt:timing.startedAt,
   finishedAt:new Date().toISOString(),
   activeSeconds:Math.floor(timing.activeMs / 1000),
   caseSeconds:Object.fromEntries(Object.entries(timing.caseMs).map(([key,ms])=>[key,Math.floor(ms/1000)])),
   device,browser,language:document.documentElement.lang
  };
 }

 function persist() {
  if (!started || id==='E2') return;
  if (!write(draftKey, {layout:2, step, furthest, answers, reused, timing, submissionId, contactDraft, studySent})) {
   text('study-status','El navegador no permite guardar el borrador. Mantén esta página abierta para conservar tus respuestas.');
  }
 }

 function refresh() {
  let visibleNumber = 0;
  for (const item of controls.values()) {
   const {q, field, choices, others, input} = item;
   if (reused[q.id]) { field.hidden = true; continue; }
   const visible = isVisible(q);
   field.hidden = !visible;
   if (!visible) {
    answers[q.id] = 'not_applicable';
    for (const [option, inputField] of others) { delete answers[otherKey(q, option)]; inputField.control.value = ''; }
    continue;
   }
   if (id === 'E2') {
    item.displayNumber = String(++visibleNumber);
    item.numberLabel.textContent = item.displayNumber+'.';
   }
   if (answers[q.id] === 'not_applicable') delete answers[q.id];
   if (q.dynamicOptions) {
    const options = available(q);
    if (!options.some(option => option.id === answers[q.id])) delete answers[q.id];
    if (options.length === 1) answers[q.id] = options[0].id;
    for (const choice of choices) {
     choice.control.disabled = !options.some(option => option.id === choice.option.id);
     choice.label.hidden = choice.control.disabled;
    }
   }
   if (q.type === 'country' && answers[q.id] && !optionsFor(q).some(option => option.id===answers[q.id])) {
    const previous = answers[q.id];
    const names = new Intl.DisplayNames(['es'],{type:'region'});
    answers[q.id] = 'other';
    if (/^[A-Z]{2}$/.test(previous)) answers[q.id+'__other'] = names.of(previous);
   }
   const values = [].concat(answers[q.id] || []);
   for (const choice of choices) choice.control.checked = values.includes(choice.option.id);
   if (input && input.value !== (answers[q.id] || '')) input.value = answers[q.id] || '';
   for (const [option, item] of others) {
    item.label.hidden = !values.includes(option.id);
    item.control.disabled = item.label.hidden;
    if (item.label.hidden) delete answers[otherKey(q, option)];
    if (item.control.value !== (answers[otherKey(q,option)] || '')) item.control.value = answers[otherKey(q,option)] || '';
   }
  }
 }

 function connectInput(control, key) {
  control.addEventListener(control.tagName === 'SELECT' ? 'change' : 'input', () => {
   if (control.value) answers[key] = control.value;
   else delete answers[key];
   refresh();
   persist();
  });
 }

 const optionIcons = {
  fail:'✕', pass:'✓', insufficient:'ⓘ', unknown:'?'
 };

 function questionPrompt(q, numberLabel) {
  const prompt = el('span','',{class:'questionnaire-prompt'});
  prompt.append(numberLabel,' ');
  const emphasis = (q.emphasis || []).filter(part=>part && q.text.includes(part))
   .map(part=>({part,index:q.text.indexOf(part)})).sort((a,b)=>a.index-b.index);
  let offset = 0;
  for (const {part,index} of emphasis) {
   if (index < offset) continue;
   prompt.append(q.text.slice(offset,index),el('strong',part));
   offset = index + part.length;
  }
  prompt.append(q.text.slice(offset),q.required ? ' (obligatoria)' : ' (opcional)');
  return prompt;
 }

 function question(q, panel) {
  const field = el(q.type === 'text' || q.type === 'country' ? 'div' : 'fieldset', '', {class:'questionnaire-field'});
  const key = 'q-' + q.id;
  const title = field.tagName === 'FIELDSET' ? el('legend') : el('label', '', {for:key});
  const numberLabel = el('strong', id === 'E2' ? '' : q.id+'.');
  title.append(questionPrompt(q, numberLabel));
  const error = el('p', '', {id:key+'-error', role:'alert', class:'questionnaire-error'});
  const compact = q.presentation === 'compact-scale' ||
   ['single','ordinal'].includes(q.type) && q.options?.length >= 5 &&
   q.options.slice(0,5).every((option,index)=>option.score === index+1) &&
   q.options.slice(5).every(option=>option.score === undefined);
  const scoredOptions = optionsFor(q).filter(option=>Number.isInteger(option.score)).sort((a,b)=>a.score-b.score);
  const labelForScale = option => option.label.replace(/^\d+\s*·\s*/,'').trim();
  const mobileScaleHint = compact && scoredOptions.length >= 2
   ? q.mobileScaleHint || 'Selecciona un valor de 1 ('+labelForScale(scoredOptions[0])+') a 5 ('+labelForScale(scoredOptions.at(-1))+').'
   : '';
  if (compact) field.classList.add('has-compact-scale');
  const help = compact ? [q.options.length === 5
   ? 'Selecciona un valor de 1 a 5.'
   : 'Selecciona un valor de 1 a 5 o una de las opciones de abajo.'] : [...(q.instructions || [])];
  const instructions = el('p', help.join(' '), {id:key+'-help', class:'questionnaire-help'});
  field.append(title,error,instructions);
  if (mobileScaleHint) field.append(el('p',mobileScaleHint,{class:'questionnaire-mobile-scale-help'}));
  const item = {q, field, panel, error, numberLabel, displayNumber:id === 'E2' ? '' : q.id,
   choices:[], others:new Map(), input:null, help:key+'-help'};
  controls.set(q.id,item);
  if (reused[q.id]) {
   field.hidden = true;
   return field;
  }
  if (q.type === 'text' || q.type === 'country') {
   const input = el(q.type === 'text' ? 'textarea' : 'select', '', {id:key,'aria-describedby':item.help});
   if (q.type === 'country') {
    input.append(el('option','Selecciona un país',{value:''}));
    for (const option of optionsFor(q)) input.append(el('option',option.label,{value:option.id}));
   } else {
    input.rows=3; input.maxLength=q.maxLength || 4000;
   }
   input.required = Boolean(q.required);
   item.input = input;
   connectInput(input,q.id);
   field.append(input);
  } else {
   const optionsRoot = compact ? el('div','',{class:'study-scale'}) : field;
   if (compact) field.append(optionsRoot);
   let category;
   for (const option of optionsFor(q)) {
    if (option.group && category !== option.group) {
     field.append(el('p', option.group, {class:'question-group-title'}));
     category = option.group;
    }
    const label=el('label','',{class:'question-option'});
    const control=el('input','',{type:q.type==='multiple'?'checkbox':'radio',name:key,value:option.id,'aria-describedby':item.help});
    if (q.required && q.type!=='multiple') control.required=true;
    label.append(control);
    const scaleOption = compact && Number.isInteger(option.score);
    if (scaleOption) {
     label.classList.add('study-scale-option');
     label.append(el('span',String(option.score),{class:'study-scale-number'}),
      el('span',option.label.replace(/^\d+\s*·\s*/,''),{class:'study-scale-caption'}));
    } else {
     if (optionIcons[option.icon]) label.append(el('span',optionIcons[option.icon],{
      class:'study-option-icon study-option-icon--'+option.icon,'aria-hidden':'true'
     }));
     label.append(el('span',option.label));
    }
    item.choices.push({control,label,option});
    control.addEventListener('change', () => {
     if (q.type === 'multiple') {
      const current = [].concat(answers[q.id] || []);
      answers[q.id] = control.checked
       ? option.exclusive ? [option.id] : [...current.filter(value => !q.options.some(o=>o.id===value && o.exclusive)), option.id]
       : current.filter(value=>value!==option.id);
      if (!answers[q.id].length) delete answers[q.id];
     } else answers[q.id]=option.id;
     refresh(); persist();
    });
    (scaleOption ? optionsRoot : field).append(label);
   }
  }
  field.addEventListener('keydown', event => {
   const radio = event.target instanceof HTMLInputElement && event.target.type === 'radio';
   if (radio && (event.key === ' ' || event.key === 'Spacebar')) {
    event.preventDefault();
    if (!event.target.checked) {
     event.target.checked = true;
     event.target.dispatchEvent(new Event('change', {bubbles:true}));
    }
    return;
   }
   if (q.type !== 'multiple' || !['ArrowUp','ArrowDown'].includes(event.key) ||
       event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
   const visible = item.choices.filter(choice => !choice.control.disabled && !choice.label.hidden);
   const current = visible.findIndex(choice => choice.control === event.target);
   if (current < 0) return;
   event.preventDefault();
   const direction = event.key === 'ArrowUp' ? -1 : 1;
   const next = Math.max(0,Math.min(visible.length-1,current+direction));
   visible[next].control.focus();
  });
  for (const option of optionsFor(q).filter(o => o.allowOtherText)) {
   const other=otherKey(q,option);
   const label=el('label','',{class:'questionnaire-other'});
   const control=el('input','',{type:'text',maxlength:'250','aria-describedby':item.help});
   label.append(el('span','Especifica: ' + option.label),control);
   control.required=true;
   item.others.set(option,{label,control});
   connectInput(control,other);
   field.append(label);
  }
  return field;
 }

 function clearErrors() {
  for (const item of controls.values()) {
   item.error.textContent='';
   for (const control of [item.input, ...item.choices.map(choice=>choice.control), ...[...item.others.values()].map(other=>other.control)].filter(Boolean)) {
    control.removeAttribute('aria-invalid');
    control.setAttribute('aria-describedby',item.help);
   }
  }
 }

 function validate(panel) {
  clearErrors();
  for (const item of controls.values()) {
   const {q, field, input, choices, others} = item;
   if (item.panel !== panel || field.hidden) continue;
   const values = [].concat(answers[q.id] || []).filter(value => String(value).trim());
   let invalid = !values.length && q.required ? input || choices.find(choice=>!choice.control.disabled)?.control : null;
   let message = invalid && (q.type==='text' ? 'Escribe una respuesta para continuar.' : 'Selecciona una respuesta para continuar.');
   for (const [option, detail] of others) {
    if (!invalid && values.includes(option.id) && !answers[otherKey(q,option)]?.trim()) {
     invalid=detail.control; message='Especifica la opción que has seleccionado.';
    }
   }
   if (!invalid) continue;
   item.error.textContent=message;
   invalid.setAttribute('aria-invalid','true');
   invalid.setAttribute('aria-describedby',item.help+' '+item.error.id);
   item.field.scrollIntoView({block:'center',inline:'nearest'});
   invalid.focus({preventScroll:true});
   return false;
  }
  return true;
 }

 function updateCaseMedia(panel) {
  const variants = [...panel.querySelectorAll('[data-case-view]')];
  const preferred = mobileLayout.matches ? 'mobile' : 'desktop';
  const selected = variants.find(figure => figure.dataset.caseView === preferred) || variants[0];
  if (!selected) return;
  const previous = variants.find(figure => !figure.hidden);
  const moveFocus = previous && previous !== selected && previous.contains(document.activeElement);
  for (const figure of variants) {
   figure.hidden = figure !== selected;
   const video = figure.querySelector('video');
   if (!video) continue;
   if (figure.hidden) video.pause();
   else if (!video.hasAttribute('src')) video.src = video.dataset.src;
  }
  if (moveFocus) selected.querySelector('a, summary').focus();
 }

 mobileLayout.addEventListener('change', () => {
  if (!$('study-wizard').hidden) updateCaseMedia(groups[step]);
 });

 function showStep(index) {
  measureActivity();
  step=index;
  furthest=Math.max(index,furthest);
  for (const [i, item] of groups.entries()) {
   item.hidden=i!==index;
   if (item.hidden) for (const video of item.querySelectorAll('video')) video.pause();
  }
  updateCaseMedia(groups[index]);
  heading('current-step',groups[index].dataset.title);
  text('step-announcement',stepLabel(index));
  text('study-next',index===groups.length-1 ? (id==='E2' ? 'Finalizar cuestionario' : 'Enviar respuestas') : 'Continuar →');
  $('study-back').hidden=index===0 || studySent;
  $('study-next').hidden=groups[index].contains($('study-contact'));
  $('study-steps').replaceChildren(...groups.map((panel,i)=>{
   const li=el('li','',{class:i===index?'current':i<index?'done':''});
   const button=el('button',(i+(id==='E2'?0:1))+'. '+panel.dataset.short,{type:'button',class:'step-link'});
   if(i===index) button.setAttribute('aria-current','step');
   button.disabled=i>furthest || (studySent && i<groups.length-2);
   button.addEventListener('click',()=>{ if (!sending) showStep(i); });
   li.append(button);return li;
  }));
  if (index===groups.length-1) renderReview();
  const title = $('current-step');
  if (id==='E1' && mobileNavigation.matches) {
   title.focus({preventScroll:true});
   requestAnimationFrame(()=>{
    if (step===index && document.activeElement===title) {
     const top = window.scrollY + title.getBoundingClientRect().top - 16;
     window.scrollTo({top,behavior:'instant'});
    }
   });
  } else {
   title.focus();
  }
  persist();
 }

 function buildPanel(title, short) {
  const section=el('section','',{class:'questionnaire-section'});
  section.dataset.title=title;
  section.dataset.short=short || title;
  groups.push(section); $('study-panels').append(section);
  return section;
 }
 function paragraphs(parent, value) {
  for (const line of (value || '').split('\n').filter(Boolean)) parent.append(el('p',line));
 }
 function buildStudyIntroduction() {
  const data = study.caseInstructions || study.startInstructions;
  if (!data) return;
  const box = $('study-case-intro');
  box.hidden = false;
  $('study-case-intro-notes').hidden = !study.caseInstructions;
  $('study-case-intro-title').textContent = data.title;
  paragraphs($('study-case-intro-copy'),data.intro);
  paragraphs($('study-case-intro-copy'),data.instructions);
  for (const [index,rule] of data.conditions.entries()) {
   const item = el('li');
   if (data.ruleLabels?.[index]) item.append(el('strong',data.ruleLabels[index]));
   item.append(el('span',rule));
   $('study-case-rules').append(item);
  }
 }

 function build() {
  for (const section of study.sections) {
   const title=section.title.replace(/^Sección \d+\.\s*/,'');
   const panel=buildPanel(title,section.shortTitle);
   paragraphs(panel,section.description);
   if (section.questions.some(q=>reused[q.id])) panel.append(el('p','Se han recuperado las respuestas comunes que ya facilitaste en este navegador.',{class:'notice'}));
   for (const q of section.questions) panel.append(question(q,panel));
  }
  for (const item of (study.cases || [])) {
   const title = item.title.replace(/^Sección \d+\.\s*/,'');
   const panel = buildPanel(title,title.replace(/^Caso práctico \d+\.\s*/,''));
   panel.dataset.caseId = item.id;
   const evidence = el('div','',{class:'study-case-evidence'});
   paragraphs(evidence,item.instruction); paragraphs(evidence,item.description);
   const figures=el('div','',{class:'study-case-images'});
   for (const image of item.images) {
    const figure=el('figure','',{'data-case-view':image.view,hidden:''});
    const caption=image.view==='desktop'?'Vista de ordenador':'Vista móvil';
    figure.append(el('figcaption',caption));
    if (image.video) {
     const video=el('video','',{controls:'',playsinline:'',preload:'none',poster:base+image.src,'data-src':base+image.video,'aria-label':'Demostración · '+caption});
     if (image.alt) {
      const descriptionId = 'study-case-description-'+item.id+'-'+image.view;
      figure.append(el('p',image.alt,{id:descriptionId,class:'sr-only'}));
      video.setAttribute('aria-describedby',descriptionId);
     }
     if (item.captions) {
      video.append(el('track','',{kind:'captions',srclang:'es',label:'Español',src:base+item.captions}));
     }
     figure.append(video,el('a','Abrir el vídeo · '+caption.toLowerCase(),{href:base+image.video}));
    }
    figures.append(figure);
   }
   evidence.append(figures);
   if (item.transcriptSrc) {
    const transcript = el('details');
    const content = el('p','',{role:'status'});
    transcript.append(el('summary','Leer la transcripción del audio'),content);
    transcript.addEventListener('toggle',async ()=>{
     if (!transcript.open || content.dataset.loaded) return;
     content.dataset.loaded = 'true';
     try {
      const response = await fetch(base+item.transcriptSrc);
      if (!response.ok) throw new Error();
      content.textContent = await response.text();
     } catch {
      delete content.dataset.loaded;
      content.textContent = 'No se pudo cargar la transcripción.';
     }
    });
    evidence.append(transcript);
   }
   for (const example of item.code || []) {
    const detail=el('details');const pre=el('pre');
    pre.append(el('code',example.text));
    detail.append(el('summary','Consultar el código '+example.language),pre);evidence.append(detail);
   }
   panel.append(evidence);
   for (const q of item.questions) panel.append(question(q,panel));
  }
  if (id==='E1') {
   const contactPanel = buildPanel(final.contact.title,'Correo opcional');
   const contact = $('study-contact');
   contactPanel.append(contact);
   contact.hidden = false;
   configureContact();
  }
  if (study.controlQuestions?.length) {
   const panel=buildPanel('Antes de enviar','Revisión final');
   for (const q of study.controlQuestions) panel.append(question(q,panel));
   panel.append(el('p','Usa «Anterior» o el menú de pasos para revisar tus respuestas antes de finalizar.'));
  } else {
   const panel=buildPanel('Revisa tus respuestas','Envío');
   panel.append(el('p','Usa «Anterior» o el menú de pasos para revisar tus respuestas. Pulsa «Enviar respuestas» cuando hayas terminado.'));
  }
  const review = el('div','',{id:'study-review',class:'review'});
  const toggle = el('button','Mostrar toda la información',{
   id:'study-review-toggle',type:'button',class:'button outline','aria-controls':review.id
  });
  const status = el('p','',{class:'sr-only',role:'status'});
  toggle.addEventListener('click',()=>{
   const categories = [...review.querySelectorAll('details')];
   const expand = categories.some(category=>!category.open);
   for (const category of categories) category.open = expand;
   updateReviewToggle();
   status.textContent = expand ? 'Se han desplegado todas las categorías.' : 'Se han plegado todas las categorías.';
  });
  review.addEventListener('toggle',updateReviewToggle,true);
  groups.at(-1).append(toggle,status,review);
  refresh();
 }

 function updateReviewToggle() {
  const categories = [...$('study-review').querySelectorAll('details')];
  text('study-review-toggle',categories.every(category=>category.open) ? 'Mostrar solo categorías' : 'Mostrar toda la información');
 }

 function renderReview() {
  const root=$('study-review');
  const openCategories = new Set([...root.querySelectorAll('details[open]')].map(category=>category.dataset.title));
  root.replaceChildren();
  if (id==='E1') root.append(el('p', contactDraft
   ? 'El correo opcional se guardará al enviar las respuestas.'
   : 'Has elegido enviar las respuestas sin facilitar un correo electrónico.'));
  for (const panel of groups) {
   const fields=[...controls.values()].filter(item=>item.panel===panel && (!item.field.hidden || reused[item.q.id]));
   if (!fields.length) continue;
   const details=el('details','',{class:'review-section'});
   details.dataset.title = panel.dataset.title;
   details.open = openCategories.has(panel.dataset.title);
   const list=el('dl');
   for (const {q, displayNumber} of fields) {
    const values=[].concat(answers[q.id] || []);
    const response=values.map(value=>{
     const option=optionsFor(q).find(option=>option.id===value);
     const note=option && answers[otherKey(q,option)];
     return (option?.label || value) + (note ? ' — ' + note : '');
    }).join(', ');
    const prefix = displayNumber ? displayNumber+'. ' : '';
    list.append(el('dt',prefix+q.text),el('dd',response || 'Sin respuesta'));
   }
   details.append(el('summary',panel.dataset.title),list);
   root.append(details);
  }
  updateReviewToggle();
 }

 const courseCatalog = {
  design:['Diseño en Accesibilidad Digital','Diseña interfaces y componentes accesibles.','modulo2-diseno.html'],
  code:['Codificación en Accesibilidad Digital','Implementa interfaces web accesibles y mejora las interacciones con teclado.','modulo3-codificacion.html'],
  evaluation:['Evaluación en Accesibilidad Digital','Aprende a evaluar sitios web y a comunicar las barreras encontradas.','modulo4-evaluacion.html'],
  documents:['Documentos Digitales Accesibles','Crea y revisa documentos de Word, PowerPoint y PDF.','modulo5-documentos.html'],
  specialist:['Especialista Universitario en Accesibilidad Digital','Cursa el itinerario completo de cinco módulos: fundamentos, diseño, codificación, evaluación y documentos accesibles.','especialista-accesibilidad.html']
 };
 const coursesByArea = {
  o01:'design',o02:'code',o03:'evaluation',o04:'evaluation',
  o05:'documents',o06:'specialist',o07:'specialist',o08:'specialist',o09:'specialist'
 };
 function commonKey(studyId) {
  return 'investigar:estudios:comunes:'+studyId+':'+versions[studyId];
 }
 function renderCourses(destination) {
  const section = $('study-courses');
  destination.append(section);
  const areas = (id === 'E1' && answers.P03) || read(commonKey('E1'),{}).P03 || [];
  section.hidden = id !== 'E1' && areas.length === 0;
  if (section.hidden) return;
  const recommended = areas.map(area=>coursesByArea[area]).filter(key=>key && key !== 'specialist');
  const modules = [...new Set([...recommended,'specialist'])];
  $('study-course-list').replaceChildren(...modules.map(key=>{
   const [title,description,path] = courseCatalog[key];
   const specialist = key === 'specialist';
   const item = el('li','',{class:'card study-course-card','data-course':key});
   const link = el('a',title,{href:'https://aprendeaccesibilidad.udl.cat/'+path});
   const heading = el('h4');
   heading.append(link);
   item.append(el('p',specialist?'Itinerario completo · 15 ECTS':'Microcredencial · 3 ECTS',{class:'study-course-type'}),
    heading,el('p',description));
   return item;
  }));
 }

 function configureContact() {
  $('contact-email').value = contactDraft?.email || '';
  $('contact-consent').checked = Boolean(contactDraft);
  text('email-copy',final.contact.description);
  text('email-label',final.contact.emailLabel);
  text('contact-label',final.contact.consentLabel);
  text('contact-submit',final.contact.submitLabel);
  text('contact-skip',final.contact.skipLabel);
 }

 function completion() {
  const practice = study?.id === 'E2';
  text('completion-title',final.title);
  text('completion-copy',practice ? 'Has finalizado el Estudio 2. Las respuestas de los casos no se han guardado.' : final.description);
  const email = practice ? read(contactKey,'') : '';
  text('completion-email-value',email);
  $('completion-email').hidden = !email;
  text('results-title',final.results.title);
  text('results-copy',final.results.description);
  text('results-link',final.results.label);
  text('home-link',final.homeLabel);
  renderCourses($('study-completion'));
  view('study-completion');
  if (study) {
   const repeatLink = $('repeat-completed');
   repeatLink.href = study.id==='E2' ? 'participa-estudios.html?estudio=E2&repetir=1' : 'participa-estudios.html?repetir=1';
   repeatLink.hidden = !endpoint;
  } else if (endpoint) {
   $('repeat-completed').href = 'participa-estudios.html?repetir=1';
   $('repeat-completed').hidden = !read(commonKey('E1'),null);
  }
  $('completion-title').focus();
 }

 function completed(alreadyRecorded = false) {
  remove(draftKey);
  started=false;
  if (id==='E2') {
   remove(commonKey('E2'));
   write('investigar:estudios:completado:E2:'+study.version,true);
   completion();
   return;
  }
  if (!endpoint) {
   text('study-status','Vista previa completada. Las respuestas no se enviaron.');
  } else if (!alreadyRecorded) {
   write('investigar:estudios:completado:'+study.id+':'+study.version,true);
   const saved = Object.fromEntries(commonPairs.flatMap(([from,to]) => {
    const key=study.id==='E1'?from:to;
    const value=answers[key];
    // La opción «Otro» requiere texto libre y se vuelve a preguntar.
    return value && value!=='not_applicable' && !(key==='P01' && value==='o06') ? [[key,value]] : [];
   }));
   saved.P03 = answers.P03;
   write(commonKey(study.id),saved);
  }
  if (completedOther()) { completion(); return; }
  text('invitation-title',study.completion.title);
  text('invitation-description',endpoint?study.completion.description:'Has terminado la vista previa del Estudio 1.');
  text('invitation-question',study.completion.invitationTitle);
  const {invitationText,invitationEmphasis} = study.completion;
  const emphasisStart = invitationEmphasis ? invitationText.indexOf(invitationEmphasis) : -1;
  if (emphasisStart < 0) text('invitation-text',invitationText);
  else $('invitation-text').replaceChildren(
   invitationText.slice(0,emphasisStart),
   el('strong',invitationEmphasis),
   invitationText.slice(emphasisStart+invitationEmphasis.length)
  );
  text('invite-e2',study.completion.actions.find(action=>action.target==='E2').label);
  text('invite-finish',study.completion.actions.find(action=>action.target==='completion').label);
  $('repeat-profile').hidden = !endpoint;
  renderCourses($('study-invitation'));
  view('study-invitation');
  $('invitation-title').focus();
 }

 function completedOther() { return endpoint && read('investigar:estudios:completado:E2:'+versions.E2,false); }

 function advanceContact(saveEmail) {
  const email = $('contact-email');
  const consent = $('contact-consent');
  text('contact-email-error','');
  text('contact-error','');
  for (const input of [email,consent]) input.removeAttribute('aria-invalid');
  if (saveEmail && (!email.value.trim() || !email.validity.valid || !consent.checked)) {
   const invalidEmail = !email.value.trim() || !email.validity.valid;
   if (invalidEmail) {
    $('contact-email-error').append(
     el('span','⚠︎',{'aria-hidden':'true'}),
     ' Introduce un correo electrónico válido.'
    );
   }
   else text('contact-error','Marca la casilla si deseas recibir comunicaciones.');
   const input = invalidEmail ? email : consent;
   input.setAttribute('aria-invalid','true');
   input.focus();
   return;
  }
  if (saveEmail) {
   const address = email.value.trim();
   contactDraft = {email:address};
  } else {
   contactDraft = null;
   email.value = '';
   consent.checked = false;
  }
  text('submission-error','');
  showStep(step+1);
 }

 $('contact-submit').addEventListener('click',()=>advanceContact(true));
 $('contact-skip').addEventListener('click',()=>advanceContact(false));

 $('study-consent').addEventListener('submit',event=>{
  event.preventDefault();
  const agreement=$('study-agreement');
  if (!agreement.checked) {
   text('consent-error','Marca la casilla de participación voluntaria para comenzar.');
   agreement.setAttribute('aria-invalid','true');agreement.focus();return;
  }
  if (study.caseInstructions) answers[study.caseInstructions.confirmation.id] = true;
  if (!write(idKey,participant)) text('study-status','Este navegador bloquea el almacenamiento local. Mantén la página abierta para conservar tus respuestas.');
  timing.startedAt ||= new Date().toISOString();
  started=true;
  interact();
  agreement.removeAttribute('aria-invalid');text('consent-error','');
  view('study-wizard');showStep(step);
  if (restoringDraft) text('study-status','Se han recuperado el borrador y el último paso guardado.');
 });
 $('study-agreement').addEventListener('change',()=>{
  $('study-agreement').removeAttribute('aria-invalid');text('consent-error','');
 });
 const siteHeader = document.querySelector('.site-header');
 new ResizeObserver(() => {
  document.documentElement.style.setProperty('--study-header-height',siteHeader.getBoundingClientRect().height+'px');
 }).observe(siteHeader);
 $('study-back').addEventListener('click',()=>{ if (!sending) showStep(step-1); });
 $('study-answers').addEventListener('submit',async event=>{
  event.preventDefault();
  if (sending) return;
  if (groups[step].contains($('study-contact'))) { advanceContact(true);return; }
  if (!validate(groups[step])) return;
  if (step<groups.length-1) { showStep(step+1);return; }
  for (const [i,panel] of groups.entries()) {
   if (i === step) continue;
   panel.hidden = false;
   if (!validate(panel)) { showStep(i);validate(panel);return; }
   panel.hidden = true;
  }
  if (id==='E2' || !endpoint) { completed();return; }
  const metadata = participationMetadata();
  pauseActivity();
  sending=true; $('study-next').disabled=true; $('study-answers').setAttribute('aria-busy','true'); text('submission-error','');
  text('step-announcement','Guardando tus respuestas…');
  try {
   if (!studySent) {
    const result = await send({kind:'study',participant,submissionId,studyId:id,version:study.version,consent:true,answers,reused,metadata});
    if (result.submissionId !== submissionId) throw new Error('La aplicación de guardado debe actualizarse antes de confirmar este envío.');
    studySent = true;
    persist();
   }
   if (contactDraft) {
    await send({kind:'contact',participant,submissionId,studyId:id,email:contactDraft.email,consent:true});
    write(contactKey,contactDraft.email);
   }
   if (repeating) {
    const url = new URL(location.href);
    url.searchParams.delete('repetir');
    history.replaceState(null,'',url);
   }
   completed();
  } catch(error) {
   if (studySent) {
    showStep(step);
    text('submission-error','Tus respuestas se han guardado. El correo sigue pendiente. Pulsa «Enviar respuestas» para reintentar o vuelve a «Correo opcional» para continuar sin facilitarlo.');
   } else text('submission-error',error.message+' Tus respuestas siguen en el borrador.');
   $('submission-error').focus();
  }
  finally { sending=false; interact(); $('study-next').disabled=false; $('study-answers').removeAttribute('aria-busy'); if (!$('study-wizard').hidden) text('step-announcement',stepLabel(step)); }
 });

 async function start() {
  const [config, study1, study2, completionData, countryList, info] = await Promise.all([
   load('config.json'),load('estudio1.json'),load('estudio2.json'),load('pantalla_final.json?v=3'),load('paises.json'),
   load('privacidad.json')
  ]);
  endpoint = config.submitUrl; final=completionData; countries=countryList; versions={E1:study1.version,E2:study2.version};
  if (requested==='final') { text('study-crumb','Confirmación'); text('study-description','');
   if (!endpoint) text('study-status','Vista previa. Esta versión aún no está recogiendo respuestas.');
   completion();return; }
  study=id==='E2'?study2:study1;
  text('study-crumb',id==='E2' ? 'Estudio 2 · Pautas WCAG' : 'Estudio 1 · Perfil y experiencia');
  commonPairs=study2.sections.flatMap(section=>section.questions)
   .filter(q=>q.reuseFrom).map(q=>[q.reuseFrom.questionId,q.id]);
  draftKey='investigar:estudios:borrador:'+id+':'+study.version;
  const draft=id==='E1' ? read(draftKey,null) : null;
  if (id==='E2') {
   remove(draftKey);
   if (read(contactKey,'')) {
    text('study-status','Se ha recuperado el correo electrónico introducido en el Estudio 1.');
   }
  }
  const committed=read('investigar:estudios:completado:'+id+':'+study.version,false);
  if (endpoint && committed && !draft && !repeating && location.hash!=='#privacidad') {
   heading('study-title',study.title);text('study-description',study.description);completed(true);return;
  }
  if (draft) {
   restoringDraft = true;
   answers=draft.answers; reused=draft.reused;
   submissionId = draft.submissionId || submissionId;
   contactDraft = id==='E1' ? draft.contactDraft || null : null;
   studySent = id==='E1' && draft.studySent === true;
   const offset = id==='E2' && draft.layout!==2 ? 1 : 0;
   step = Math.max(0,(draft.step || 0)-offset);
   if (draft.timing) timing = draft.timing;
   furthest=Math.min(99,Math.max(0,(draft.furthest || draft.step || 0)-offset));
  } else if (!repeating && id==='E1') {
   const saved=read(commonKey('E2'),{});
   for(const [left,right] of commonPairs) {
    const from=id==='E1'?right:left, to=id==='E1'?left:right;
    if (!saved[from]) continue;
    answers[to]=saved[from]; reused[to]=id==='E1'?'E2':'E1';
   }
  }
  const situation = study.sections.flatMap(section=>section.questions).find(q=>q.id==='P02');
  if (situation?.type==='single' && !situation.options.some(option=>option.id===answers.P02)) {
   delete answers.P02;
   delete reused.P02;
  }
  heading('study-title',study.title);text('study-description',study.description);
  text('study-meta',(endpoint?'Estudio activo':'Vista previa')+' · '+study.durationMinutes+' minutos estimados');
  text('study-notice',study.introNotice || 'La participación es voluntaria. Puedes retomar un borrador desde este navegador.');
  for(const paragraph of info.paragraphs) $('privacy-copy').append(el('p',paragraph));
  $('privacy-copy').append(el('p',id==='E2'
   ? 'Las respuestas del Estudio 2 se mantienen abiertas durante esta sesión. Si recargas la página, tendrás que empezar de nuevo. Si ya facilitaste tu correo en el Estudio 1 desde este navegador, se mostrará en la pantalla final.'
   : 'El borrador se guarda en este navegador para que puedas retomarlo. Tras el envío, el navegador conserva el código de participación y las respuestas de selección comunes a ambos estudios. Si facilitas tu correo, se guarda con ese mismo código en la pestaña de contactos y en este navegador.'));
  const timingNotice = 'Para analizar la participación registramos la fecha y hora de inicio y fin, las duraciones, el tipo de dispositivo, la familia del navegador y el idioma del cuestionario.';
  if (id==='E1') $('privacy-copy').append(el('p',timingNotice));
  const contact=el('p',info.contactText);
  contact.append(el('a',info.contactLabel,{href:'mailto:'+info.contactEmail}),'.');
  $('privacy-copy').append(contact);
  text('agreement-label',info.consentDisplay.statement);
  buildStudyIntroduction();
  build();
  step = Math.min(groups.length-1,step);
  furthest = Math.min(groups.length-1,furthest);
  const confirmed = !study.caseInstructions || answers[study.caseInstructions.confirmation.id]===true;
  if (draft && confirmed && location.hash!=='#privacidad') {
   timing.startedAt ||= new Date().toISOString();
   started=true;interact();view('study-wizard');showStep(step);
   text('study-status','Se han recuperado el borrador y el último paso guardado.');
  } else {
   view('study-introduction');
   if (location.hash==='#privacidad') $('privacidad').open=true;
  }
 }
 start().catch(error=>text('study-status',error.message || 'No se pudo cargar el cuestionario.'));
})();
