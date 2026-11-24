import {readFileSync, writeFileSync} from 'node:fs';

const source = new URL('../datos/cuestionario_v1.7.json', import.meta.url);
const output = new URL('./Esquema.gs', import.meta.url);
const questionnaire = JSON.parse(readFileSync(source, 'utf8'));
const fields = questionnaire.sections.flatMap(({questions}) => questions.flatMap(question => {
  const {id, title, type, required, options = [], rows = []} = question;
  const field = {id, title, type, required};
  if (question.visible_if) field.visibleIf = question.visible_if;
  if (question.validation?.format === 'email') field.format = 'email';
  if (question.exclusive_option_ids) field.exclusive = question.exclusive_option_ids;
  if (options.length) field.options = Object.fromEntries(options.map(option => [option.id, option.label]));
  if (type === 'grid_single_select') {
    return rows.map(row => ({...field, id: row.id, title: title + ' · ' + row.label, type: 'single_select'}));
  }
  const other = options.find(option => option.allow_other_text);
  return other ? [field, {
    id: id + '_otro', title: title + ' · Otra respuesta', type: 'short_text', required: true,
    visibleIf: {question_id: id, option_id: other.id}
  }] : [field];
}));
const consent = questionnaire.sections.flatMap(section => section.questions).find(question => question.id === 'CI');
const schema = {
  questionnaireId: questionnaire.questionnaire_id,
  version: questionnaire.version,
  consent: consent.options.find(option => option.next_action !== 'end_without_research').id,
  fields
};
writeFileSync(output, '// Generado desde el JSON con node integracion-google/generar-esquema.mjs\n' +
  'const QUESTIONNAIRE_SCHEMA = ' + JSON.stringify(schema, null, 2) + ';\n');
