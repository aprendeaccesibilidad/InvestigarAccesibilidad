(() => {
  'use strict';
  const root = document.getElementById('resultados-publicos');
  const status = document.getElementById('results-status');
  const kpis = document.getElementById('results-kpis');
  const pages = document.getElementById('question-results');
  const number = new Intl.NumberFormat('es-ES');
  const percent = new Intl.NumberFormat('es-ES', {style: 'percent', maximumFractionDigits: 1});
  const targets = new Map();
  const chapters = [
    ['perfiles', '01 · Perfil', [['S02'], ['S01', 'S14']]],
    ['experiencia', '02 · Experiencia', [['S03']]],
    ['formacion', '03 · Aprendizaje', [['S04']]],
    ['conocimientos', '04 · Conocimientos', [['S05'], ['S06']]],
    ['comprension', '05 · Casos WCAG', []]
  ];

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function indicator(label, value) {
    const card = element('div', null, 'kpi');
    card.append(element('strong', value), element('span', label));
    return card;
  }

  function distributionTarget(id, options = [], privateField = false) {
    const node = element('div', null, 'question-distribution');
    const message = privateField ? 'Se muestra la cobertura cuando está disponible.' : 'Sin resultados publicados.';
    node.append(element('p', message, 'muted'));
    targets.set(id, {node, options, privateField});
    return node;
  }

  function questionCard(question, heading) {
    const card = element('article', null, 'card question-result');
    card.append(element(heading, question.id + '. ' + question.title));
    if (question.type === 'grid_single_select') {
      const rowHeading = heading === 'h3' ? 'h4' : 'h5';
      for (const row of question.rows) {
        const part = element('div', null, 'question-grid-result');
        part.append(element(rowHeading, row.label), distributionTarget(row.id, question.options));
        card.append(part);
      }
      return card;
    }
    card.append(distributionTarget(question.id, question.options, question.type === 'short_text' || question.id === 'P05'));
    if (question.options?.some(option => option.allow_other_text)) {
      card.append(element('p', 'Otra respuesta (texto libre)', 'question-grid-label'), distributionTarget(question.id + '_otro', [], true));
    }
    return card;
  }

  function renderQuestionnaire(data) {
    const byId = new Map(data.sections.map(section => [section.id, section]));
    const cases = data.sections.filter(section => section.case_id).sort((a, b) => a.order - b.order);
    const count = data.sections.reduce((sum, section) => sum + section.questions.length, 0);
    const total = element('strong', '—');
    const totalCard = element('div', null, 'kpi');
    totalCard.append(total, element('span', 'Participaciones publicables'));
    kpis.replaceChildren(totalCard, indicator('Preguntas del cuestionario', number.format(count)), indicator('Casos WCAG', number.format(cases.length)));

    for (const [id, title, groups] of chapters) {
      const chapter = element('section', null, 'obs-section questionnaire-results-section');
      chapter.id = id;
      chapter.tabIndex = -1;
      chapter.append(element('h2', title));
      if (id === 'comprension') {
        chapter.append(element('p', 'Consulta cómo se valoró cada situación y el nivel de confianza declarado.'));
        for (const item of cases) {
          const group = element('section', null, 'case-results');
          group.append(element('h3', item.title));
          const questions = element('div', null, 'question-results-grid');
          questions.append(...item.questions.map(question => questionCard(question, 'h4')));
          group.append(questions);
          chapter.append(group);
        }
      } else {
        groups.forEach((sectionIds, index) => {
          const group = index === 0 ? chapter : element('section', null, 'question-results-subsection');
          if (index > 0) {
            const profile = id === 'perfiles';
            group.id = profile ? 'participacion-y-contacto' : 'satisfaccion';
            group.append(element('h3', profile ? 'Consentimiento y contacto' : 'Satisfacción y disfrute'));
          }
          const questions = element('div', null, 'question-results-grid');
          for (const sectionId of sectionIds) {
            const section = byId.get(sectionId);
            if (section) questions.append(...section.questions.map(question => questionCard(question, index === 0 ? 'h3' : 'h4')));
          }
          group.append(questions);
          if (index > 0) chapter.append(group);
        });
      }
      pages.append(chapter);
    }
    return total;
  }

  function renderField({node, options, privateField}, field) {
    const coverage = field?.coverage;
    const counts = field?.counts;
    if (!coverage) {
      node.replaceChildren(element('p', 'Base insuficiente para publicar resultados.', 'muted'));
      return;
    }
    const text = number.format(coverage.answered) + ' de ' + number.format(coverage.eligible) + ' respuestas válidas';
    node.replaceChildren(element('p', text, 'question-coverage'));
    if (privateField) return;
    if (!counts || !coverage.answered) {
      node.append(element('p', 'Distribución no publicable.', 'muted'));
      return;
    }
    const list = element('ul', null, 'question-result-list');
    for (const {id, label} of options) {
      const count = counts[id];
      if (!Number.isSafeInteger(count) || count < 0 || count > coverage.answered) continue;
      const share = count / coverage.answered;
      const textRow = element('div', null, 'question-result-row');
      textRow.append(element('span', label), element('strong', percent.format(share) + ' · ' + number.format(count)));
      const track = element('div', null, 'question-result-track');
      track.setAttribute('aria-hidden', 'true');
      const fill = element('span');
      fill.style.width = share * 100 + '%';
      track.append(fill);
      const item = element('li');
      item.append(textRow, track);
      list.append(item);
    }
    node.append(list);
  }

  async function start() {
    let data;
    try {
      const response = await fetch(root.dataset.questionnaire);
      if (!response.ok) throw new Error();
      data = await response.json();
      if (!Array.isArray(data.sections)) throw new Error();
    } catch {
      status.textContent = 'No se pudieron cargar las preguntas. Recarga la página para volver a intentarlo.';
      return;
    }

    const total = renderQuestionnaire(data);
    status.textContent = 'Consultando resultados agregados…';
    try {
      const url = new URL(root.dataset.aggregatesUrl);
      url.searchParams.set('action', 'observatorio');
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const dataset = await response.json();
      if (dataset.available !== true || dataset.questionnaireId !== data.questionnaire_id || dataset.version !== data.version) {
        status.textContent = 'Aún no se han publicado resultados de este cuestionario.';
        return;
      }
      if (dataset.total === null) {
        status.textContent = 'Aún no hay suficientes participaciones para publicar resultados.';
        return;
      }
      total.textContent = number.format(dataset.total);
      for (const [id, view] of targets) renderField(view, dataset.results[id]);
      status.textContent = 'Resultados agregados del cuestionario v' + data.version + ' disponibles.';
    } catch {
      status.textContent = 'Aún no hay resultados disponibles en el Observatorio.';
    }
  }

  // a11y: needs manual verification — navegación por bloques y anuncio del estado de carga con lector de pantalla.
  start();
})();
