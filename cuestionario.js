(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const form = $('research-form');
  const wizard = $('wizard');
  const error = $('wizard-error');
  const status = $('research-status');
  const submit = $('send-btn');
  const back = $('back-btn');
  const next = $('next-btn');
  const titles = ['Perfil y actividad', 'Experiencia en accesibilidad', 'Formación y aprendizaje', 'Conocimientos y comprensión', 'Casos WCAG', 'Finalizar participación'];
  const shortTitles = ['Perfil', 'Experiencia', 'Formación', 'Comprensión', 'Casos WCAG', 'Finalizar'];
  const explainers = [
    'Tu actividad y contexto profesional o académico.',
    'Tu experiencia práctica evaluando accesibilidad.',
    'La formación y las actividades que has realizado.',
    'Valora tus conocimientos y tu experiencia con la accesibilidad digital.',
    'Analiza seis situaciones prácticas y valora el cumplimiento de las WCAG.',
    'Envía tus respuestas al estudio.'
  ];
  const fieldDefinitions = new Map();
  const consentForm = $('start-form');
  const startButton = $('start-challenge');
  const startFeedback = $('start-feedback');
  const loading = $('questionnaire-loading');
  const agreement = $('study-accept');

  function element(tag, text, attributes = {}) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    return node;
  }

  function textParagraphs(container, text) {
    for (const paragraph of text?.split('\n').filter(Boolean) || []) container.append(element('p', paragraph));
  }

  function choiceInputs(container, name, options, type, required, helpId) {
    return options.map(option => {
      const input = element('input', null, {type, name, value: option.id});
      input.required = required && type === 'radio';
      if (helpId) input.setAttribute('aria-describedby', helpId);
      const label = element('label', null, {class: 'question-option'});
      label.append(input, element('span', option.label));
      container.append(label);
      return input;
    });
  }

  function helpText(container, question) {
    const text = question.help_text || (question.type === 'multi_select' ? 'Puedes seleccionar varias respuestas.' : '');
    if (!text) return '';
    const id = 'help-' + question.id;
    container.append(element('p', text, {id, class: 'questionnaire-help'}));
    return id;
  }

  function registerField(name, question, container, inputs, options, title) {
    fieldDefinitions.set(name, {name, question, container, inputs, options, title});
  }

  function questionPrompt(tag, text, attributes) {
    const prompt = element(tag, null, attributes);
    prompt.append(element('strong', text, {class: 'questionnaire-prompt'}));
    return prompt;
  }

  function renderQuestion(question) {
    const {id, title, type, required, options = [], rows = []} = question;
    const label = id + '. ' + title;
    const prompt = label + (required ? ' (obligatoria)' : '');
    if (type === 'grid_single_select') {
      const grid = element('div', null, {class: 'questionnaire-grid'});
      grid.append(questionPrompt('h4', prompt));
      const helpId = helpText(grid, question);
      for (const row of rows) {
        const group = element('fieldset', null, {class: 'questionnaire-field'});
        group.append(questionPrompt('legend', row.label));
        const controls = choiceInputs(group, row.id, options, 'radio', required, helpId);
        registerField(row.id, question, group, controls, options, label + ' · ' + row.label);
        grid.append(group);
      }
      return grid;
    }

    if (type === 'short_text' || type === 'dropdown') {
      const field = element('div', null, {class: 'questionnaire-field'});
      const inputId = 'question-' + id;
      field.append(questionPrompt('label', prompt, {for: inputId}));
      const helpId = helpText(field, question);
      const email = question.validation?.format === 'email';
      const tag = type === 'dropdown' ? 'select' : question.purpose || question.visible_if ? 'input' : 'textarea';
      const input = element(tag, null, {name: id, id: inputId});
      if (tag === 'select') {
        input.append(element('option', 'Selecciona una opción', {value: ''}));
        for (const option of options) input.append(element('option', option.label, {value: option.id}));
      } else {
        if (tag === 'input') input.type = email ? 'email' : 'text';
        else input.rows = 3;
        input.maxLength = email ? 254 : tag === 'input' ? 120 : 4000;
        if (email) input.autocomplete = 'email';
      }
      input.required = required;
      if (helpId) input.setAttribute('aria-describedby', helpId);
      field.append(input);
      registerField(id, question, field, [input], options, label);
      return field;
    }

    if (type !== 'single_select' && type !== 'multi_select') throw new Error('Tipo de pregunta no compatible');
    const group = element('fieldset', null, {class: 'questionnaire-field'});
    group.append(questionPrompt('legend', prompt));
    const helpId = helpText(group, question);
    const controls = choiceInputs(group, id, options, type === 'multi_select' ? 'checkbox' : 'radio', required, helpId);
    registerField(id, question, group, controls, options, label);
    const other = options.find(option => option.allow_other_text);
    if (other) {
      const field = element('div', null, {class: 'questionnaire-other'});
      const name = id + '_otro';
      const title = 'Especifica tu respuesta (obligatoria)';
      field.append(questionPrompt('label', title, {for: name}));
      const input = element('input', null, {type: 'text', id: name, name, maxlength: '250'});
      field.append(input);
      group.append(field);
      registerField(name, {required: true, visible_if: {question_id: id, option_id: other.id}}, field, [input], [], label + ' · Otra respuesta');
    }
    return group;
  }

  function renderSection(section, step, caseNumber) {
    const panel = element('section', null, {class: 'questionnaire-section', 'data-step-panel': step});
    panel.hidden = true;
    panel.dataset.reviewTitle = section.title;
    if (caseNumber) panel.dataset.case = caseNumber;
    if (section.title) panel.append(element('h3', section.title));
    textParagraphs(panel, section.description);
    textParagraphs(panel, section.scenario);
    const image = section.image;
    if (image?.path && image.alt_text) {
      const url = new URL(image.path, document.baseURI);
      if (url.origin !== location.origin) throw new Error('Imagen fuera del portal');
      const figure = element('figure');
      figure.append(element('img', null, {src: url.href, alt: image.alt_text, loading: 'lazy'}), element('figcaption', 'Vista móvil'));
      panel.append(figure);
    }
    if (section.code?.text) {
      const details = element('details');
      const pre = element('pre');
      pre.append(element('code', section.code.text));
      details.append(element('summary', 'Código HTML o JavaScript relacionado'), pre);
      panel.append(details);
    }
    for (const question of section.questions) panel.append(renderQuestion(question));
    return panel;
  }

  function updateConditions() {
    for (const definition of fieldDefinitions.values()) {
      const condition = definition.question.visible_if;
      if (!condition) continue;
      const source = fieldDefinitions.get(condition.question_id);
      const visible = source.inputs.some(input => input.value === condition.option_id &&
        (input.tagName === 'SELECT' || input.checked));
      definition.container.hidden = !visible;
      for (const input of definition.inputs) {
        input.disabled = !visible;
        input.required = visible && definition.question.required;
      }
    }
  }

  const caseStep = 4;
  const finalStep = titles.length - 1;
  const endpoint = form.dataset.submitUrl;
  const submissionId = crypto.randomUUID();
  let questionnaire;
  let panels = [];
  let cases = [];
  let pages = [];
  let consentQuestion;
  let consentValue;
  let page = 0;
  let reached = 0;
  let saved = false;

  async function loadQuestionnaire() {
    const response = await fetch(form.dataset.questionnaire);
    if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
    const data = await response.json();
    if (data.schema_version !== '1.0' || !Array.isArray(data.sections)) throw new Error('Formato de cuestionario no compatible');
    const sectionById = new Map(data.sections.map(section => [section.id, section]));
    const first = sectionById.get('S01');
    consentQuestion = first.questions.find(question => question.id === 'CI');
    const acceptance = consentQuestion?.options?.find(option => option.next_action !== 'end_without_research');
    if (consentQuestion?.type !== 'single_select' || !acceptance) {
      throw new Error('Falta la opción de consentimiento afirmativo');
    }
    consentValue = acceptance.id;

    const mount = $('questionnaire-panels');
    const overview = [['S02', 0], ['S03', 1], ['S04', 2], ['S05', 3], ['S06', 3], ['S07', caseStep]];
    for (const [id, step] of overview) mount.append(renderSection(sectionById.get(id), step));
    const orderedCases = data.sections.filter(section => section.case_id).sort((a, b) => a.order - b.order);
    orderedCases.forEach((section, index) => mount.append(renderSection(section, caseStep, index + 1)));
    const contact = sectionById.get('S14');
    if (contact) {
      const section = renderSection(contact, finalStep);
      section.hidden = false;
      section.removeAttribute('data-step-panel');
      $('questionnaire-contact').append(section);
    }

    for (const definition of fieldDefinitions.values()) {
      definition.error = element('p', null, {
        id: 'error-' + definition.name,
        class: 'questionnaire-error',
        role: 'alert'
      });
      definition.container.firstElementChild.after(definition.error);
    }

    panels = [...form.querySelectorAll('[data-step-panel]')];
    cases = panels.filter(panel => panel.dataset.case);
    pages = [{step: 0}, {step: 1}, {step: 2}, {step: 3}, {step: caseStep},
      ...cases.map(panel => ({step: caseStep, case: panel.dataset.case})), {step: finalStep}];
    updateConditions();
    questionnaire = data;
    const preview = !data.publication_ready || !endpoint;
    loading.textContent = preview ? 'Vista previa del cuestionario ' + data.version + '. Las respuestas no se guardan.' : '';
    if (preview) {
      $('questionnaire-contact').prepend(element('p', 'Puedes dejar el correo en blanco. Si quieres probar el campo, usa una dirección ficticia.', {class: 'field-help'}));
      submit.textContent = 'Finalizar vista previa';
    }
    startButton.disabled = false;
  }

  let invalidField;
  let fieldError;
  let originalDescription;
  function showError(message, field) {
    if (field) {
      invalidField = field;
      fieldError = fieldDefinitions.get(field.name)?.error || error;
      fieldError.textContent = message;
      originalDescription = field.getAttribute('aria-describedby');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', [originalDescription, fieldError.id].filter(Boolean).join(' '));
    } else {
      error.textContent = message;
    }
    (field || error).focus();
  }

  function clearError() {
    error.textContent = '';
    if (!invalidField) return;
    fieldError.textContent = '';
    invalidField.removeAttribute('aria-invalid');
    if (originalDescription) invalidField.setAttribute('aria-describedby', originalDescription);
    else invalidField.removeAttribute('aria-describedby');
    invalidField = null;
  }

  const belongsTo = (panel, current) =>
    Number(panel.dataset.stepPanel) === current.step &&
    (current.case ? panel.dataset.case === current.case : !panel.dataset.case);

  function renderReview() {
    const data = new FormData(form);
    const groups = new Map();
    for (const [name, definition] of fieldDefinitions) {
      if (definition.question.purpose) continue;
      const values = data.getAll(name).filter(value => value.trim())
        .map(value => definition.options.find(option => option.id === value)?.label || value);
      if (!values.length) continue;
      const panel = panels.find(item => item.contains(definition.container));
      const heading = panel?.dataset.reviewTitle || 'Respuestas';
      if (!groups.has(heading)) groups.set(heading, []);
      groups.get(heading).push({title: definition.title, values});
    }

    const sections = [...groups].map(([heading, entries], index) => {
      const details = element('details', null, {class: 'review-section'});
      details.open = index === 0;
      const summary = element('summary');
      const count = entries.length;
      summary.append(element('span', heading), element('span', count + (count === 1 ? ' respuesta' : ' respuestas'), {class: 'review-count'}));
      const list = element('dl');
      for (const {title, values} of entries) {
        const row = element('div', null, {class: 'review-answer'});
        const answer = element('dd');
        if (values.length === 1) {
          answer.textContent = values[0];
        } else {
          const options = element('ul');
          options.append(...values.map(value => element('li', value)));
          answer.append(options);
        }
        row.append(element('dt', title), answer);
        list.append(row);
      }
      details.append(summary, list);
      return details;
    });
    $('research-review').replaceChildren(...sections);
  }

  function showPage(index) {
    page = index;
    reached = Math.max(reached, page);
    const current = pages[page];
    const {step} = current;
    const finishing = step === finalStep;
    clearError();
    $('step-kicker').textContent = 'Cuestionario · Paso ' + (step + 1) + ' de ' + titles.length;
    $('step-heading').textContent = titles[step];
    $('step-explainer').textContent = explainers[step];
    $('progress-bar').style.width = ((step + 1) / titles.length * 100) + '%';
    $('step-progress').textContent = current.case
      ? 'Caso ' + current.case + ' de ' + cases.length
      : 'Paso ' + (step + 1) + ' de ' + titles.length;

    $('step-list').innerHTML = titles.map((title, index) => {
      const entry = pages.findIndex(item => item.step === index);
      const active = index === step;
      return `<li class="${active ? 'current' : index < step ? 'done' : ''}"><button type="button" class="step-link" data-page="${entry}" aria-label="Paso ${index + 1}: ${title}" ${active ? 'aria-current="step"' : ''} ${entry > reached ? 'disabled' : ''}><span class="count" aria-hidden="true">${index + 1}</span><span class="step-name step-name-long">${title}</span><span class="step-name step-name-short" aria-hidden="true">${shortTitles[index]}</span></button></li>`;
    }).join('');
    for (const panel of panels) panel.hidden = !belongsTo(panel, current);
    back.hidden = page === 0;
    next.hidden = finishing;
    submit.hidden = !finishing;
    if (finishing) renderReview();
    $('step-heading').focus();
  }

  function pageError(index, answers) {
    const pagePanels = panels.filter(panel => belongsTo(panel, pages[index]));
    for (const definition of fieldDefinitions.values()) {
      const {name, question, inputs, container} = definition;
      const field = inputs[0];
      if (field.disabled || !pagePanels.some(panel => panel.contains(container))) continue;
      const values = answers.getAll(name).filter(value => value.trim());
      if (question.required && !values.length) {
        const message = field.type === 'checkbox' || field.type === 'radio' || field.tagName === 'SELECT'
          ? 'Selecciona una respuesta para continuar.'
          : 'Escribe tu respuesta para continuar.';
        return {field, message};
      }
      if (question.exclusive_option_ids?.some(id => values.includes(id)) && values.length > 1) {
        return {field, message: 'En ' + name + ', la opción de ausencia o de no responder debe marcarse sola.'};
      }
      if (field.type === 'email' && !field.validity.valid) {
        return {field, message: 'Indica un correo electrónico válido o deja el campo vacío.'};
      }
    }
    return null;
  }

  form.addEventListener('change', () => {
    updateConditions();
    clearError();
  });
  agreement.addEventListener('change', () => {
    startFeedback.textContent = '';
    agreement.removeAttribute('aria-invalid');
  });
  consentForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!questionnaire) return;
    if (!agreement.checked) {
      startFeedback.textContent = 'Marca la casilla de participación voluntaria para continuar.';
      agreement.setAttribute('aria-invalid', 'true');
      agreement.focus();
      return;
    }
    $('intro').hidden = true;
    wizard.hidden = false;
    showPage(0);
  });
  loadQuestionnaire().catch(() => {
    loading.textContent = '';
    startFeedback.textContent = 'No se pudo cargar el cuestionario. Recarga la página para volver a intentarlo.';
  });

  function goForward() {
    clearError();
    const invalid = pageError(page, new FormData(form));
    if (invalid) showError(invalid.message, invalid.field);
    else showPage(page + 1);
  }
  next.addEventListener('click', goForward);
  back.addEventListener('click', () => showPage(page - 1));
  $('step-list').addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (button && !submit.disabled) showPage(Number(button.dataset.page));
  });

  function complete(title, message) {
    saved = true;
    wizard.classList.add('wizard-finished');
    $('step-heading').textContent = title;
    $('review-title').textContent = 'Resumen de tus respuestas';
    $('review-instructions').hidden = true;
    $('questionnaire-contact').hidden = true;
    $('action-row').hidden = true;
    $('step-navigation').hidden = true;
    status.textContent = message;
    status.focus();
  }

  // a11y: needs manual verification — los cambios de pantalla, el enfoque y los mensajes de envío con lector de pantalla.
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || saved) return;
    if (pages[page].step !== finalStep) {
      goForward();
      return;
    }
    clearError();
    const answers = new FormData(form);
    for (let index = 0; index < pages.length; index++) {
      const invalid = pageError(index, answers);
      if (!invalid) continue;
      showPage(index);
      showError(invalid.message, invalid.field);
      return;
    }
    if (!questionnaire.publication_ready || !endpoint) {
      complete('Vista previa completada', 'No se han guardado respuestas.');
      return;
    }
    const values = {[consentQuestion.id]: consentValue};
    for (const [name, definition] of fieldDefinitions) {
      const entries = answers.getAll(name).map(value => value.trim()).filter(Boolean);
      if (!entries.length) continue;
      values[name] = definition.question.type === 'multi_select' ? entries : entries[0];
    }
    submit.disabled = true;
    back.disabled = true;
    status.textContent = 'Enviando tus respuestas…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'text/plain;charset=UTF-8'},
        body: JSON.stringify({
          submissionId,
          questionnaireId: questionnaire.questionnaire_id,
          version: questionnaire.version,
          answers: values
        })
      });
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Apps Script no devolvió una confirmación. Comprueba el acceso a la aplicación web.');
      }
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || 'No se pudo confirmar el envío.');
      complete('Participación registrada', questionnaire.completion_message || 'Gracias por participar. Tus respuestas se han registrado.');
    } catch (problem) {
      status.textContent = '';
      showError(problem instanceof TypeError
        ? 'No se pudo conectar con Apps Script. Tus respuestas siguen en esta página. Puedes reintentar el envío.'
        : problem.message || 'No se pudo confirmar el envío. Vuelve a intentarlo.');
    } finally {
      submit.disabled = saved;
      back.disabled = saved;
    }
  });
})();
