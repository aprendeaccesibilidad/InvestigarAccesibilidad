/* Módulo de visualización; no contiene claves de corrección. */
(() => {
"use strict";
const labels = {"P04": {"title": "¿Cuánto tiempo llevas realizando actividades profesionales relacionadas con la accesibilidad digital?", "options": {"o01": "Ninguna experiencia profesional en accesibilidad digital.", "o02": "Menos de 1 año.", "o03": "De 1 a 3 años.", "o04": "De 3 a 6 años.", "o05": "De 6 a 10 años.", "o06": "10 años o más."}}, "P05": {"title": "¿Cuánto tiempo hace que empezaste a aprender sobre accesibilidad digital? Incluye tanto la formación organizada como el aprendizaje por tu cuenta.", "options": {"o01": "Todavía no he aprendido sobre accesibilidad digital.", "o02": "Menos de 1 año.", "o03": "De 1 a 3 años.", "o04": "De 3 a 6 años.", "o05": "De 6 a 10 años.", "o06": "10 años o más."}}, "P06": {"title": "¿Cuánto tiempo llevas realizando evaluaciones de accesibilidad digital con los criterios WCAG? Incluye evaluaciones profesionales, académicas y por tu cuenta.", "options": {"o01": "Nunca he realizado evaluaciones mediante las WCAG.", "o02": "Menos de 1 año.", "o03": "De 1 a 3 años.", "o04": "De 3 a 6 años.", "o05": "De 6 a 10 años.", "o06": "10 años o más."}}, "P07": {"title": "En los últimos 12 meses, ¿con qué frecuencia has utilizado los criterios WCAG cuando has evaluado la accesibilidad digital?", "options": {"o01": "Nunca.", "o02": "Casi nunca.", "o03": "Algunas veces.", "o04": "Frecuentemente.", "o05": "Siempre o casi siempre que realizo una evaluación.", "o06": "No he realizado evaluaciones de accesibilidad en los últimos 12 meses."}}, "P08": {"title": "¿Por qué vías has aprendido específicamente a interpretar y evaluar los criterios de conformidad de las WCAG?", "options": {"o01": "Asignaturas de estudios oficiales.", "o02": "Cursos o formación especializada.", "o03": "Formación interna en una empresa u organización.", "o04": "Formación para obtener certificaciones profesionales.", "o05": "Aprendizaje por mi cuenta.", "o06": "Aprendizaje mediante la práctica profesional.", "o07": "Otras vías de aprendizaje (especificar).", "o08": "No he aprendido específicamente sobre la evaluación de las WCAG."}}, "P09": {"title": "¿Cómo valoras tus conocimientos de los criterios de conformidad de las WCAG?", "options": {"o01": "1 · Muy limitados", "o02": "2 · Limitados", "o03": "3 · Intermedios", "o04": "4 · Avanzados", "o05": "5 · Muy avanzados"}}, "P10": {"title": "¿Qué confianza tienes en tu capacidad para decidir si una interfaz cumple o no un criterio WCAG?", "options": {"o01": "1 · Ninguna confianza", "o02": "2 · Poca confianza", "o03": "3 · Confianza moderada", "o04": "4 · Bastante confianza", "o05": "5 · Mucha confianza"}}};
const fmt = new Intl.NumberFormat('es-ES',{maximumFractionDigits:2});
const number = v => typeof v === 'number' && Number.isFinite(v);
const show = (v,s='') => number(v)?fmt.format(v)+s:'No disponible';
const el=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n;};
const names={correctas:'Correctas',incorrectas:'Incorrectas',informacionInsuficiente:'Información insuficiente',noLoSe:'No lo sé'};
const criteria={'1.1.1':'Contenido no textual','2.5.2':'Cancelación del puntero','3.3.4':'Prevención de errores'};
function section(root,id,title){const s=el('section',undefined,'obs-section oa-section');s.id=id;const h=el('h2',title,'obs-infographic-heading');h.id=id+'-title';s.setAttribute('aria-labelledby',h.id);s.append(h);root.append(s);return s;}
function panel(parent,title){const p=el('div',undefined,'oa-panel');if(title)p.append(el('h3',title));parent.append(p);return p;}
function table(parent,title,headers,rows){const d=el('details',undefined,'oa-table');d.append(el('summary','Consultar datos en formato tabla'));const wrap=el('div',undefined,'oa-table-wrap');const t=el('table');t.append(el('caption',title));const head=el('thead'),hr=el('tr');headers.forEach(x=>{const th=el('th',x);th.scope='col';hr.append(th);});head.append(hr);t.append(head);const body=el('tbody');rows.forEach(row=>{const tr=el('tr');row.forEach((v,i)=>{const cell=el(i?'td':'th',String(v));if(!i)cell.scope='row';tr.append(cell);});body.append(tr);});t.append(body);wrap.append(t);d.append(wrap);parent.append(d);}
function bar(parent,label,value,max=100,suffix='%',color='primary',note=''){const item=el('div',undefined,'oa-bar');const line=el('div',undefined,'oa-bar-label');line.append(el('span',label),el('strong',show(value,suffix)));item.append(line);if(note)item.append(el('p',note,'oa-note'));if(number(value)){const track=el('div',undefined,'oa-track');track.setAttribute('aria-hidden','true');const fill=el('div',undefined,'oa-fill oa-'+color);fill.style.width=Math.max(0,Math.min(100,value/max*100))+'%';track.append(fill);item.append(track);}parent.append(item);}
function unavailable(p){p.append(el('p','Datos no disponibles o reservados por privacidad.','oa-note'));}
function render(snapshot){
renderTop(snapshot);const root=document.getElementById('oa-root'),nav=document.getElementById('oa-nav');if(!root)return;root.replaceChildren();const a=snapshot?.aciertosE2;root.hidden=true;if(nav)nav.hidden=true;if(snapshot?.ok!==true||!a||a.version!=='1.5')return;root.hidden=false;if(nav)nav.hidden=false;
const g=a.global||{}, cases=Array.isArray(a.casos)?a.casos:[];
const p=panel(root,'Distribución de las respuestas');if(g.distribucion&&number(g.casosEvaluados)&&g.casosEvaluados>0){const rows=Object.entries(names).map(([key,label])=>{const n=g.distribucion[key],pc=number(n)?n/g.casosEvaluados*100:null;bar(p,label,pc,100,'%');return [label,show(n),show(pc,'%')];});table(p,'Distribución de respuestas',['Respuesta','Número','Porcentaje'],rows);}else unavailable(p);
}


const profileLabels = {"P13": {"o01": "Estudios de grado universitario o formación profesional.", "o03": "Másteres, posgrados o doctorado.", "o05": "Cursos especializados, microcredenciales, talleres o seminarios.", "o08": "Formación interna en empresas u organizaciones.", "o09": "Preparación de certificaciones profesionales.", "o10": "Experiencia práctica en proyectos profesionales.", "o11": "Colaboración con compañeros, expertos o personas con discapacidad.", "o14": "Congresos, conferencias y jornadas.", "o15": "Comunidades profesionales, asociaciones, foros y redes sociales.", "o18": "Consulta de documentación oficial, normativa, libros y recursos especializados.", "o22": "Tutoriales, vídeos y práctica por cuenta propia.", "o24": "Uso de asistentes de inteligencia artificial.", "o25": "Otras vías de aprendizaje (especificar).", "o26": "Todavía no he aprendido sobre accesibilidad digital."}, "P20": {"o01": "Sí.", "o02": "No, actualmente no tengo ninguna certificación profesional vigente.", "o03": "No lo sé."}, "P23": {"o01": "1 · Muy insatisfecho/a", "o02": "2 · Algo insatisfecho/a", "o03": "3 · Ni satisfecho/a ni insatisfecho/a", "o04": "4 · Algo satisfecho/a", "o05": "5 · Muy satisfecho/a", "o06": "No realizo actualmente actividades de accesibilidad digital", "o07": "Prefiero no responder"}};
function renderTop(snapshot){
 const root=document.getElementById('oa-top-kpis'); if(!root)return;
 root.replaceChildren(); root.hidden=true; if(snapshot?.ok!==true)return;
 const k=el('dl',undefined,'oa-top-grid');
 function card(title,value,note){const cell=el('div',undefined,'oa-top-card');cell.append(el('dt',title),el('dd',value),el('p',note,'oa-note'));k.append(cell);}
 if(document.getElementById('profile-questions')){
  const questions=snapshot.studies?.E1?.questions||{};
  // Desempate por orden de las opciones del cuestionario.
  function top(id,title){
   const q=questions[id];
   const valid=Object.keys(profileLabels[id]).map(key=>[key,q?.counts?.[key]]).filter(([key,n])=>number(n)&&n>0);
   if(!number(q?.n)||q.n<=0||!valid.length){card(title,'No disponible','Datos insuficientes o reservados.');return;}
   const max=Math.max(...valid.map(x=>x[1]));
   const winners=valid.filter(x=>x[1]===max);
   const key=winners[0][0];
   const short={P13:{o01:'Grado universitario o formación profesional',o03:'Másteres, posgrados o doctorado',o05:'Cursos y formación especializada'},P20:{o01:'Sí, tiene certificación vigente',o02:'Sin certificación vigente',o03:'No lo sabe'},P23:{o01:'Muy insatisfecho/a',o02:'Algo insatisfecho/a',o03:'Ni satisfecho/a ni insatisfecho/a',o04:'Algo satisfecho/a',o05:'Muy satisfecho/a',o06:'No realiza estas actividades',o07:'Prefiere no responder'}};
   const text=short[id]?.[key]||profileLabels[id][key];
   card(title,show(100*max/q.n,'%'),text+(winners.length>1?' (empate con '+winners.slice(1).map(([idKey])=>short[id]?.[idKey]||profileLabels[id][idKey]).join('; ')+')':'')+(q.partial?' · Entre opciones publicadas':''));
  }
  top('P13','Vía de aprendizaje más frecuente');
  top('P20','Certificación profesional vigente');
  top('P23','Satisfacción con las tareas');
 }else{
  const g=snapshot.aciertosE2?.version==='1.5'?snapshot.aciertosE2.global:null;
  const notice=document.getElementById('oa-publication-status');
  if(notice){notice.hidden=!!g&&number(g.porcentaje);notice.textContent=!g?'Las estadísticas de aciertos aún no están publicadas o no hay suficientes respuestas.':'El porcentaje global está reservado por privacidad.';}
  return; // El Estudio 2 conserva únicamente el total de participantes y la distribución global.
 }
 root.append(k);root.hidden=false;
}
function setupMobile(){const menu=document.querySelector('.oa-mobile-menu');if(!menu)return;const mq=matchMedia('(max-width: 760px)');const sync=()=>{menu.open=!mq.matches;};sync();mq.addEventListener('change',sync);menu.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&mq.matches)menu.open=false;});}
setupMobile();

window.renderObservatorioAciertos=render;
window.addEventListener('observatorio:datos',e=>render(e.detail));
})();
