import { readFile, writeFile } from 'node:fs/promises';

const data = new URL('../datos/', import.meta.url);
const read = async name => JSON.parse(await readFile(new URL(name + '.json', data), 'utf8'));
const [first, second, countries, backend] = await Promise.all([
  read('estudio1'), read('estudio2'), read('paises'),
  readFile(new URL('estudios-backend.gs', import.meta.url), 'utf8')
]);
const studies = Object.fromEntries([first, second].map((source, index) => [source.id, {
  tab: 'Estudio_' + (index + 1),
  version: source.version,
  confirmation: source.caseInstructions?.confirmation.id,
  cases: (source.cases || []).map(item => item.id),
  questions: [
    ...source.sections.flatMap(section => section.questions),
    ...(source.cases || []).flatMap(item => item.questions),
    ...(source.controlQuestions || [])
  ].map(({id,type,required,options,maxLength,visibility,dynamicOptions}) => ({
    id,type,required,maxLength,visibility,dynamicOptions,
    options:options?.map(({id,exclusive,allowOtherText,score}) => ({id,exclusive,allowOtherText,score}))
  }))
}]));
const pairs = second.sections.flatMap(section => section.questions)
  .filter(q => q.reuseFrom).map(q => [q.reuseFrom.questionId,q.id]);
await writeFile(new URL('AppsScript-Estudios.gs', import.meta.url),
  '// Generado con node integracion-google/generar-estudios.mjs.\n' +
  'const STUDIES = ' + JSON.stringify(studies) + ';\n' +
  'const STUDY_COUNTRIES = ' + JSON.stringify(countries.map(country => country.id)) + ';\n' +
  'const STUDY_PAIRS = ' + JSON.stringify(pairs) + ';\n\n' + backend);
