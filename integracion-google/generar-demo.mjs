import { mkdir, readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const script = await readFile(new URL('AppsScript-Estudios.gs', import.meta.url), 'utf8');
const buildDemo = vm.runInNewContext(script + `
 (function () {
  const total = 20;
  const participants = Array.from({length:total}, (_, index) =>
   '00000000-0000-4000-8000-' + String(index+1).padStart(12,'0'));
  const contacts = participants.map((participant,index)=>({
   participant, email:'participante-'+(index+1)+'@example.org', consent:true
  }));
  const rows = {};
  const submissions = {};
  for (const [id,study] of Object.entries(STUDIES)) {
   const columns = columns_(study);
   submissions[id] = participants.map((participant,index)=>{
    const cohort = Math.floor(index / 5);
    const answers = {};
    if (study.confirmation) answers[study.confirmation] = true;
    for (const [position,q] of study.questions.entries()) {
     if (q.type === 'text') {
      answers[q.id] = 'Respuesta ficticia para la demostración.';
      continue;
     }
     if (q.type === 'country') {
      answers[q.id] = ['ES','AR','MX','CO'][cohort];
      continue;
     }
     const options = options_(q,answers);
     const available = options.filter(option=>!option.exclusive && !option.allowOtherText);
     const candidates = available.length ? available : options;
     if (!candidates.length) continue;
     const offset = (cohort + position) % candidates.length;
     const choice = candidates[offset];
     const second = candidates[(offset+1)%candidates.length];
     const selected = q.type==='multiple' && !choice.exclusive && !second.exclusive && choice!==second
      ? [choice,second] : [choice];
     answers[q.id] = q.type==='multiple' ? selected.map(option=>option.id) : choice.id;
     for (const option of selected) {
      if (option.allowOtherText) answers[q.id+'__'+option.id] = 'Ejemplo ficticio';
     }
    }
    return {participant,version:study.version,answers};
   });
   rows[id] = submissions[id].map(({participant,answers})=>{
    const cells = cells_(study,answers);
    return columns.map((column,index)=>index===1 ? participant : cells[column] ?? '');
   });
  }
  return {
   records:{submissions,contacts},
   snapshot:{
    ok:true, demo:true,
    versions:{E1:STUDIES.E1.version,E2:STUDIES.E2.version},
    paired:total, combined:combined_(rows.E1,rows.E2),
    studies:{E1:aggregate_(STUDIES.E1,rows.E1,'E1'),E2:aggregate_(STUDIES.E2,rows.E2,'E2')}
   }
  };
 })
`);

const {records,snapshot} = buildDemo();
const destination = new URL('../datos/demo/', import.meta.url);
await mkdir(destination,{recursive:true});
await Promise.all([
 writeFile(new URL('respuestas.json',destination),JSON.stringify(records,null,2)+'\n'),
 writeFile(new URL('agregados.json',destination),JSON.stringify(snapshot,null,2)+'\n')
]);
console.log('Demostración local generada con 20 respuestas por estudio y 20 contactos ficticios.');
