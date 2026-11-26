/* Observatorio de estudios 1.5. Configurar la URL de la implementación web existente. */
(() => {
'use strict';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIqWcNwRVOVp1CpLvvdKLVbE9KKoDzwdwcRNxEKsayFEPoxetW8zrzpi4THjPkCgNz/exec';
const definitions = {
  "E1": [
    {
      "id": "S2",
      "title": "Perfil",
      "questions": [
        {
          "id": "P01",
          "text": "¿Cómo has conocido este estudio?",
          "type": "single",
          "options": {
            "o01": "Congreso, seminario o jornada profesional",
            "o02": "LinkedIn",
            "o03": "Otras redes sociales",
            "o04": "Comunidades o asociaciones profesionales",
            "o05": "Recomendación de compañeros, docentes o profesionales",
            "o06": "Otros canales (especificar)"
          }
        },
        {
          "id": "P02",
          "text": "¿Cuál es tu situación actual?",
          "type": "single",
          "options": {
            "o01": "Estudiante",
            "o02": "Profesional en activo",
            "o03": "Docente o investigador/a",
            "o04": "Actualmente no trabajo ni estudio",
            "o05": "Otra situación"
          }
        },
        {
          "id": "P03",
          "text": "¿En qué áreas trabajas, estudias o investigas?",
          "type": "multiple",
          "options": {
            "o01": "Diseño digital y diseño de experiencia e interfaces de usuario (UX/UI)",
            "o02": "Desarrollo web o software",
            "o03": "Evaluación, auditoría o consultoría de accesibilidad",
            "o04": "Pruebas de calidad de productos digitales (QA)",
            "o05": "Creación y gestión de contenidos digitales",
            "o06": "Gestión de proyectos o productos digitales",
            "o07": "Docencia o investigación",
            "o08": "Otro ámbito",
            "o09": "No trabajo ni estudio en ninguna de estas áreas"
          }
        },
        {
          "id": "P04",
          "text": "¿En qué sector trabajas o estudias principalmente?",
          "type": "single",
          "options": {
            "o01": "Tecnologías de la información y comunicación",
            "o02": "Educación e investigación",
            "o03": "Administración pública",
            "o04": "Servicios y consultoría profesional",
            "o05": "Entidades sin ánimo de lucro (asociaciones, fundaciones, ONG)",
            "o06": "Otros sectores",
            "o07": "No aplica"
          }
        },
        {
          "id": "P05",
          "text": "¿Qué tareas de accesibilidad digital realizas habitualmente en tu trabajo o estudios?",
          "type": "multiple",
          "options": {
            "o01": "Diseño de interfaces accesibles.",
            "o02": "Desarrollo y corrección de productos digitales accesibles.",
            "o03": "Evaluación del cumplimiento de las WCAG.",
            "o04": "Pruebas con tecnologías de apoyo o usuarios con discapacidad.",
            "o07": "Creación de documentos digitales accesibles.",
            "o08": "Formación, investigación o divulgación.",
            "o09": "Gestión de la accesibilidad digital.",
            "o10": "Otras actividades.",
            "o11": "Actualmente ninguna."
          }
        },
        {
          "id": "P06",
          "text": "¿Qué papel tiene la accesibilidad digital en tu trabajo o estudios?",
          "type": "single",
          "options": {
            "o01": "Es el eje principal de mi actividad.",
            "o02": "Es un componente importante de mi actividad.",
            "o03": "Es un componente secundario de mi actividad.",
            "o04": "Tiene un papel marginal en mi actividad.",
            "o05": "No forma parte de mi actividad actual."
          }
        },
        {
          "id": "P07",
          "text": "¿Tienes alguna discapacidad o dificultad funcional que afecte a cómo utilizas productos digitales?",
          "type": "multiple",
          "options": {
            "o01": "Discapacidad visual total.",
            "o02": "Discapacidad visual baja visión.",
            "o03": "Discapacidad auditiva.",
            "o04": "Discapacidad motriz.",
            "o05": "Discapacidad cognitiva o dificultades de aprendizaje.",
            "o07": "Otra discapacidad o dificultad funcional.",
            "o08": "Ninguna de las anteriores.",
            "o09": "Prefiero no responder."
          }
        },
        {
          "id": "P08",
          "text": "¿En qué país trabajas o estudias principalmente?",
          "type": "country",
          "options": {
            "other": "Otro"
          }
        }
      ]
    },
    {
      "id": "S3",
      "title": "Experiencia",
      "questions": [
        {
          "id": "P09",
          "text": "¿Cuánto tiempo llevas realizando actividades profesionales relacionadas con la accesibilidad digital?",
          "type": "single",
          "options": {
            "o01": "Ninguna experiencia profesional en accesibilidad digital.",
            "o02": "Menos de 1 año.",
            "o03": "De 1 a 3 años.",
            "o04": "De 3 a 6 años.",
            "o05": "De 6 a 10 años.",
            "o06": "10 años o más."
          }
        },
        {
          "id": "P10",
          "text": "¿Cuánto tiempo hace que empezaste a aprender sobre accesibilidad digital? Incluye tanto la formación organizada como el aprendizaje por tu cuenta.",
          "type": "single",
          "options": {
            "o01": "Todavía no he aprendido sobre accesibilidad digital.",
            "o02": "Menos de 1 año.",
            "o03": "De 1 a 3 años.",
            "o04": "De 3 a 6 años.",
            "o05": "De 6 a 10 años.",
            "o06": "10 años o más."
          }
        },
        {
          "id": "P11",
          "text": "En una semana habitual, ¿cuántas horas dedicas a actividades de accesibilidad digital?",
          "type": "single",
          "options": {
            "o06": "No realizo estas actividades habitualmente",
            "o01": "Menos de 5 horas",
            "o02": "De 5 a 15 horas",
            "o03": "De 15 a 30 horas",
            "o05": "30 horas o más"
          }
        },
        {
          "id": "P12",
          "text": "¿Qué métodos o herramientas utilizas habitualmente cuando evalúas la accesibilidad digital?",
          "type": "multiple",
          "options": {
            "o01": "Herramientas automáticas de evaluación.",
            "o02": "Revisión manual del código y de la interfaz (incluidas las pruebas con teclado).",
            "o03": "Listas de verificación WCAG y metodologías de evaluación (WCAG-EM).",
            "o06": "Pruebas con tecnologías de apoyo (lectores de pantalla, magnificadores, etc.).",
            "o08": "Pruebas con usuarios con discapacidad.",
            "o09": "Asistentes de inteligencia artificial.",
            "o10": "Otros métodos o herramientas.",
            "o11": "No realizo evaluaciones de accesibilidad actualmente."
          }
        }
      ]
    },
    {
      "id": "S4",
      "title": "Formación",
      "questions": [
        {
          "id": "P13",
          "text": "¿Cómo has aprendido sobre accesibilidad digital?",
          "type": "multiple",
          "options": {
            "o01": "Estudios de grado universitario o formación profesional.",
            "o03": "Másteres, posgrados o doctorado.",
            "o05": "Cursos especializados, microcredenciales, talleres o seminarios.",
            "o08": "Formación interna en empresas u organizaciones.",
            "o09": "Preparación de certificaciones profesionales.",
            "o10": "Experiencia práctica en proyectos profesionales.",
            "o11": "Colaboración con compañeros, expertos o personas con discapacidad.",
            "o14": "Congresos, conferencias y jornadas.",
            "o15": "Comunidades profesionales, asociaciones, foros y redes sociales.",
            "o18": "Consulta de documentación oficial, normativa, libros y recursos especializados.",
            "o22": "Tutoriales, vídeos y práctica por cuenta propia.",
            "o24": "Uso de asistentes de inteligencia artificial.",
            "o25": "Otras vías de aprendizaje (especificar).",
            "o26": "Todavía no he aprendido sobre accesibilidad digital."
          }
        },
        {
          "id": "P14",
          "text": "¿Cuál ha sido tu principal vía de aprendizaje en accesibilidad digital?",
          "type": "single",
          "options": {
            "o01": "Formación reglada y académica.",
            "o02": "Formación especializada.",
            "o03": "Aprendizaje en el ámbito profesional.",
            "o04": "Aprendizaje mediante comunidades y eventos.",
            "o05": "Aprendizaje autónomo.",
            "o06": "Otras vías de aprendizaje.",
            "o07": "Todavía no he aprendido sobre accesibilidad digital."
          }
        },
        {
          "id": "P15",
          "text": "¿Sobre qué temas de accesibilidad digital has aprendido?",
          "type": "multiple",
          "options": {
            "o01": "Fundamentos de accesibilidad digital (discapacidad, necesidades y barreras).",
            "o02": "Pautas WCAG, legislación y normativa de accesibilidad.",
            "o04": "Diseño accesible de interfaces.",
            "o05": "Desarrollo web accesible (HTML, CSS, JavaScript y WAI-ARIA).",
            "o06": "Creación de documentos digitales accesibles.",
            "o07": "Evaluación y corrección de problemas de accesibilidad (evaluación manual, automática y WCAG-EM).",
            "o11": "Tecnologías de apoyo y evaluación con usuarios con discapacidad.",
            "o13": "Inteligencia artificial aplicada a la accesibilidad.",
            "o14": "Otros temas (especificar).",
            "o15": "Ninguno de los anteriores."
          }
        },
        {
          "id": "P16",
          "text": "¿En qué formatos has realizado cursos o formación organizada sobre accesibilidad digital?",
          "type": "multiple",
          "options": {
            "o01": "Formación presencial",
            "o02": "En línea, con clases en directo",
            "o03": "En línea, a mi propio ritmo",
            "o04": "Combinada (presencial y en línea)",
            "o05": "No he realizado cursos ni formación organizada"
          }
        },
        {
          "id": "P17",
          "text": "¿Qué actividades prácticas has realizado para aprender o mejorar tus competencias en accesibilidad digital?",
          "type": "multiple",
          "options": {
            "o01": "Análisis de ejemplos y resolución de casos prácticos WCAG.",
            "o03": "Evaluación de accesibilidad de productos digitales reales.",
            "o04": "Análisis de código y corrección de problemas de accesibilidad.",
            "o06": "Diseño o desarrollo de productos digitales accesibles.",
            "o08": "Uso práctico de tecnologías de apoyo.",
            "o09": "Pruebas con usuarios con discapacidad.",
            "o10": "Simulación o experimentación de barreras de accesibilidad.",
            "o11": "Otras actividades prácticas.",
            "o12": "No he realizado ninguna actividad práctica.",
            "o14": "Prefiero no responder."
          }
        },
        {
          "id": "P18",
          "text": "¿Cómo se han evaluado tus conocimientos y habilidades durante la formación en accesibilidad digital?",
          "type": "multiple",
          "options": {
            "o01": "Pruebas de conocimientos teóricos y normativa.",
            "o03": "Resolución de casos prácticos WCAG.",
            "o04": "Evaluación y corrección de problemas de accesibilidad en productos digitales.",
            "o06": "Diseño, desarrollo o realización de proyectos accesibles.",
            "o09": "Demostración del uso de tecnologías de apoyo.",
            "o10": "Otras actividades de evaluación.",
            "o11": "En alguna formación no se evaluó mi aprendizaje.",
            "o12": "No he realizado formación organizada.",
            "o13": "No lo recuerdo."
          }
        },
        {
          "id": "P19",
          "text": "¿Qué certificaciones profesionales, titulaciones o certificados de formación en accesibilidad digital has obtenido?",
          "type": "multiple",
          "options": {
            "o01": "CPACC (IAAP).",
            "o02": "WAS (IAAP).",
            "o03": "CPWA (IAAP).",
            "o04": "ADS (IAAP).",
            "o05": "Otras certificaciones profesionales.",
            "o06": "Máster, posgrado o título universitario de especialización en accesibilidad.",
            "o08": "Microcredencial universitaria.",
            "o09": "Otras acreditaciones académicas.",
            "o10": "Certificado de superación de un curso con evaluación del aprendizaje.",
            "o12": "Certificado de asistencia o participación sin evaluación del aprendizaje.",
            "o13": "Otros certificados de formación.",
            "o14": "Ninguna certificación, titulación o certificado.",
            "o15": "No sé qué tipo de acreditación he obtenido.",
            "o16": "Prefiero no responder."
          }
        },
        {
          "id": "P20",
          "text": "¿Tienes actualmente alguna certificación profesional en accesibilidad digital vigente?",
          "type": "single",
          "options": {
            "o01": "Sí.",
            "o02": "No, actualmente no tengo ninguna certificación profesional vigente.",
            "o03": "No lo sé."
          }
        }
      ]
    },
    {
      "id": "S5",
      "title": "Recursos, conocimientos",
      "questions": [
        {
          "id": "P21",
          "text": "¿Qué recursos consultas habitualmente cuando tienes dudas al evaluar la accesibilidad digital?",
          "type": "multiple",
          "options": {
            "o01": "Documentación oficial y normativa (W3C/WAI, WCAG, EN 301 549).",
            "o03": "Recursos especializados (webs, libros, publicaciones, ejemplos prácticos y repositorios de código).",
            "o06": "Compañeros, expertos y comunidades profesionales.",
            "o07": "Asistentes de inteligencia artificial.",
            "o08": "Otros recursos.",
            "o09": "No consulto recursos habitualmente.",
            "o10": "No realizo evaluaciones de accesibilidad."
          }
        },
        {
          "id": "P22",
          "text": "¿Cómo valoras tus conocimientos sobre accesibilidad digital?",
          "type": "ordinal",
          "options": {
            "o01": "1 · Muy limitados",
            "o02": "2 · Limitados",
            "o03": "3 · Intermedios",
            "o04": "4 · Avanzados",
            "o05": "5 · Muy avanzados"
          }
        }
      ]
    },
    {
      "id": "S6",
      "title": "Satisfacción, motivación",
      "questions": [
        {
          "id": "P23",
          "text": "¿Qué grado de satisfacción tienes con las tareas de accesibilidad digital que realizas?",
          "type": "ordinal",
          "options": {
            "o01": "1 · Muy insatisfecho/a",
            "o02": "2 · Algo insatisfecho/a",
            "o03": "3 · Ni satisfecho/a ni insatisfecho/a",
            "o04": "4 · Algo satisfecho/a",
            "o05": "5 · Muy satisfecho/a",
            "o06": "No realizo actualmente actividades de accesibilidad digital",
            "o07": "Prefiero no responder"
          }
        },
        {
          "id": "P24",
          "text": "¿Cuánto disfrutas realizando tareas de accesibilidad digital?",
          "type": "ordinal",
          "options": {
            "o01": "1 · Nada",
            "o02": "2 · Poco",
            "o03": "3 · Moderadamente",
            "o04": "4 · Bastante",
            "o05": "5 · Mucho",
            "o06": "No realizo actualmente actividades de accesibilidad digital",
            "o07": "Prefiero no responder"
          }
        }
      ]
    }
  ],
  "E2": [
    {
      "id": "S2",
      "title": "Perfil",
      "questions": [
        {
          "id": "P01",
          "text": "¿Cómo has conocido este estudio?",
          "type": "single",
          "options": {
            "o01": "Congreso, seminario o jornada profesional",
            "o02": "LinkedIn",
            "o03": "Otras redes sociales",
            "o04": "Comunidades o asociaciones profesionales",
            "o05": "Recomendación de compañeros, docentes o profesionales",
            "o06": "Otros canales (especificar)"
          }
        },
        {
          "id": "P02",
          "text": "¿Cuál es tu situación actual?",
          "type": "single",
          "options": {
            "o01": "Estudiante",
            "o02": "Profesional en activo",
            "o03": "Docente o investigador/a",
            "o04": "Actualmente no trabajo ni estudio",
            "o05": "Otra situación"
          }
        },
        {
          "id": "P03",
          "text": "¿En qué áreas trabajas, estudias o investigas?",
          "type": "multiple",
          "options": {
            "o01": "Diseño digital y UX/UI.",
            "o02": "Desarrollo web o software.",
            "o03": "Evaluación, auditoría, consultoría de accesibilidad y calidad digital (QA).",
            "o05": "Creación y gestión de contenidos digitales.",
            "o06": "Gestión de proyectos o productos digitales.",
            "o07": "Docencia e investigación.",
            "o08": "Otros ámbitos (especificar)."
          }
        },
        {
          "id": "P04",
          "text": "¿Cuánto tiempo llevas realizando actividades profesionales relacionadas con la accesibilidad digital?",
          "type": "single",
          "options": {
            "o01": "Ninguna experiencia profesional en accesibilidad digital.",
            "o02": "Menos de 1 año.",
            "o03": "De 1 a 3 años.",
            "o04": "De 3 a 6 años.",
            "o05": "De 6 a 10 años.",
            "o06": "10 años o más."
          }
        },
        {
          "id": "P05",
          "text": "¿Cuánto tiempo hace que empezaste a aprender sobre accesibilidad digital? Incluye tanto la formación organizada como el aprendizaje por tu cuenta.",
          "type": "single",
          "options": {
            "o01": "Todavía no he aprendido sobre accesibilidad digital.",
            "o02": "Menos de 1 año.",
            "o03": "De 1 a 3 años.",
            "o04": "De 3 a 6 años.",
            "o05": "De 6 a 10 años.",
            "o06": "10 años o más."
          }
        },
        {
          "id": "P06",
          "text": "¿Cuánto tiempo llevas realizando evaluaciones de accesibilidad digital con los criterios WCAG? Incluye evaluaciones profesionales, académicas y por tu cuenta.",
          "type": "single",
          "options": {
            "o01": "Nunca he realizado evaluaciones mediante las WCAG.",
            "o02": "Menos de 1 año.",
            "o03": "De 1 a 3 años.",
            "o04": "De 3 a 6 años.",
            "o05": "De 6 a 10 años.",
            "o06": "10 años o más."
          }
        },
        {
          "id": "P07",
          "text": "En los últimos 12 meses, ¿con qué frecuencia has utilizado los criterios WCAG cuando has evaluado la accesibilidad digital?",
          "type": "single",
          "options": {
            "o01": "Nunca.",
            "o02": "Casi nunca.",
            "o03": "Algunas veces.",
            "o04": "Frecuentemente.",
            "o05": "Siempre o casi siempre que realizo una evaluación.",
            "o06": "No he realizado evaluaciones de accesibilidad en los últimos 12 meses."
          }
        },
        {
          "id": "P08",
          "text": "¿Por qué vías has aprendido específicamente a interpretar y evaluar los criterios de conformidad de las WCAG?",
          "type": "multiple",
          "options": {
            "o01": "Asignaturas de estudios oficiales.",
            "o02": "Cursos o formación especializada.",
            "o03": "Formación interna en una empresa u organización.",
            "o04": "Formación para obtener certificaciones profesionales.",
            "o05": "Aprendizaje por mi cuenta.",
            "o06": "Aprendizaje mediante la práctica profesional.",
            "o07": "Otras vías de aprendizaje (especificar).",
            "o08": "No he aprendido específicamente sobre la evaluación de las WCAG."
          }
        },
        {
          "id": "P09",
          "text": "¿Cómo valoras tus conocimientos de los criterios de conformidad de las WCAG?",
          "type": "ordinal",
          "options": {
            "o01": "1 · Muy limitados",
            "o02": "2 · Limitados",
            "o03": "3 · Intermedios",
            "o04": "4 · Avanzados",
            "o05": "5 · Muy avanzados"
          }
        },
        {
          "id": "P10",
          "text": "¿Qué confianza tienes en tu capacidad para decidir si una interfaz cumple o no un criterio WCAG?",
          "type": "ordinal",
          "options": {
            "o01": "1 · Ninguna confianza",
            "o02": "2 · Poca confianza",
            "o03": "3 · Confianza moderada",
            "o04": "4 · Bastante confianza",
            "o05": "5 · Mucha confianza"
          }
        }
      ]
    },
    {
      "id": "C1",
      "title": "Sección 4. Caso práctico 1. Nueva transferencia",
      "questions": [
        {
          "id": "P11",
          "text": "Según la información del caso, ¿se cumple el requisito de accesibilidad WCAG relacionado con la situación descrita?",
          "type": "single",
          "options": {
            "o01": "Falla. No se cumple el requisito.",
            "o02": "Pasa. Se cumple el requisito.",
            "o03": "Información insuficiente. Faltan datos para decidir si se cumple.",
            "o04": "No lo sé. No sé cómo evaluar la situación."
          }
        },
        {
          "id": "P12",
          "text": "¿Por qué has elegido esa respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P13",
          "text": "¿Con qué criterio o criterios WCAG relacionas este caso?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P14",
          "text": "¿Qué confianza tienes en tu respuesta sobre el cumplimiento del criterio?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna confianza",
            "o02": "2 · Poca confianza",
            "o03": "3 · Confianza moderada",
            "o04": "4 · Bastante confianza",
            "o05": "5 · Mucha confianza"
          }
        },
        {
          "id": "P15",
          "text": "¿Qué dificultad has tenido para evaluar este caso?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna dificultad",
            "o02": "2 · Poca dificultad",
            "o03": "3 · Dificultad moderada",
            "o04": "4 · Bastante dificultad",
            "o05": "5 · Mucha dificultad"
          }
        },
        {
          "id": "P16",
          "text": "¿Qué más comprobarías para confirmar tu respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P17",
          "text": "Si no se cumpliera el requisito relacionado con este caso, ¿a qué personas podría afectar?",
          "type": "multiple",
          "options": {
            "o01": "Personas con discapacidad visual total",
            "o02": "Personas con baja visión",
            "o03": "Personas con discapacidad auditiva",
            "o04": "Personas con discapacidad motriz",
            "o05": "Personas con discapacidad cognitiva o dificultades de aprendizaje",
            "o06": "Ninguno de los perfiles anteriores",
            "o07": "No lo sé"
          }
        }
      ]
    },
    {
      "id": "A1",
      "title": "Sección 5. Caso práctico 2. Panel de ventas",
      "questions": [
        {
          "id": "P18",
          "text": "Según la información del caso, ¿se cumple el requisito de accesibilidad WCAG relacionado con la situación descrita?",
          "type": "single",
          "options": {
            "o01": "Falla. No se cumple el requisito.",
            "o02": "Pasa. Se cumple el requisito.",
            "o03": "Información insuficiente. Faltan datos para decidir si se cumple.",
            "o04": "No lo sé. No sé cómo evaluar la situación."
          }
        },
        {
          "id": "P19",
          "text": "¿Por qué has elegido esa respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P20",
          "text": "¿Con qué criterio o criterios WCAG relacionas este caso?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P21",
          "text": "¿Qué confianza tienes en tu respuesta sobre el cumplimiento del criterio?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna confianza",
            "o02": "2 · Poca confianza",
            "o03": "3 · Confianza moderada",
            "o04": "4 · Bastante confianza",
            "o05": "5 · Mucha confianza"
          }
        },
        {
          "id": "P22",
          "text": "¿Qué dificultad has tenido para evaluar este caso?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna dificultad",
            "o02": "2 · Poca dificultad",
            "o03": "3 · Dificultad moderada",
            "o04": "4 · Bastante dificultad",
            "o05": "5 · Mucha dificultad"
          }
        },
        {
          "id": "P23",
          "text": "¿Qué más comprobarías para confirmar tu respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P24",
          "text": "Si no se cumpliera el requisito relacionado con este caso, ¿a qué personas podría afectar?",
          "type": "multiple",
          "options": {
            "o01": "Personas con discapacidad visual total",
            "o02": "Personas con baja visión",
            "o03": "Personas con discapacidad auditiva",
            "o04": "Personas con discapacidad motriz",
            "o05": "Personas con discapacidad cognitiva o dificultades de aprendizaje",
            "o06": "Ninguno de los perfiles anteriores",
            "o07": "No lo sé"
          }
        }
      ]
    },
    {
      "id": "C2",
      "title": "Sección 6. Caso práctico 3. Contrato de alquiler de vehículo",
      "questions": [
        {
          "id": "P25",
          "text": "Según la información del caso, ¿se cumple el requisito de accesibilidad WCAG relacionado con la situación descrita?",
          "type": "single",
          "options": {
            "o01": "Falla. No se cumple el requisito.",
            "o02": "Pasa. Se cumple el requisito.",
            "o03": "Información insuficiente. Faltan datos para decidir si se cumple.",
            "o04": "No lo sé. No sé cómo evaluar la situación."
          }
        },
        {
          "id": "P26",
          "text": "¿Por qué has elegido esa respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P27",
          "text": "¿Con qué criterio o criterios WCAG relacionas este caso?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P28",
          "text": "¿Qué confianza tienes en tu respuesta sobre el cumplimiento del criterio?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna confianza",
            "o02": "2 · Poca confianza",
            "o03": "3 · Confianza moderada",
            "o04": "4 · Bastante confianza",
            "o05": "5 · Mucha confianza"
          }
        },
        {
          "id": "P29",
          "text": "¿Qué dificultad has tenido para evaluar este caso?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna dificultad",
            "o02": "2 · Poca dificultad",
            "o03": "3 · Dificultad moderada",
            "o04": "4 · Bastante dificultad",
            "o05": "5 · Mucha dificultad"
          }
        },
        {
          "id": "P30",
          "text": "¿Qué más comprobarías para confirmar tu respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P31",
          "text": "Si no se cumpliera el requisito relacionado con este caso, ¿a qué personas podría afectar?",
          "type": "multiple",
          "options": {
            "o01": "Personas con discapacidad visual total",
            "o02": "Personas con baja visión",
            "o03": "Personas con discapacidad auditiva",
            "o04": "Personas con discapacidad motriz",
            "o05": "Personas con discapacidad cognitiva o dificultades de aprendizaje",
            "o06": "Ninguno de los perfiles anteriores",
            "o07": "No lo sé"
          }
        }
      ]
    },
    {
      "id": "B2",
      "title": "Sección 7. Caso práctico 4. Eliminar del carrito",
      "questions": [
        {
          "id": "P32",
          "text": "Según la información del caso, ¿se cumple el requisito de accesibilidad WCAG relacionado con la situación descrita?",
          "type": "single",
          "options": {
            "o01": "Falla. No se cumple el requisito.",
            "o02": "Pasa. Se cumple el requisito.",
            "o03": "Información insuficiente. Faltan datos para decidir si se cumple.",
            "o04": "No lo sé. No sé cómo evaluar la situación."
          }
        },
        {
          "id": "P33",
          "text": "¿Por qué has elegido esa respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P34",
          "text": "¿Con qué criterio o criterios WCAG relacionas este caso?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P35",
          "text": "¿Qué confianza tienes en tu respuesta sobre el cumplimiento del criterio?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna confianza",
            "o02": "2 · Poca confianza",
            "o03": "3 · Confianza moderada",
            "o04": "4 · Bastante confianza",
            "o05": "5 · Mucha confianza"
          }
        },
        {
          "id": "P36",
          "text": "¿Qué dificultad has tenido para evaluar este caso?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna dificultad",
            "o02": "2 · Poca dificultad",
            "o03": "3 · Dificultad moderada",
            "o04": "4 · Bastante dificultad",
            "o05": "5 · Mucha dificultad"
          }
        },
        {
          "id": "P37",
          "text": "¿Qué más comprobarías para confirmar tu respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P38",
          "text": "Si no se cumpliera el requisito relacionado con este caso, ¿a qué personas podría afectar?",
          "type": "multiple",
          "options": {
            "o01": "Personas con discapacidad visual total",
            "o02": "Personas con baja visión",
            "o03": "Personas con discapacidad auditiva",
            "o04": "Personas con discapacidad motriz",
            "o05": "Personas con discapacidad cognitiva o dificultades de aprendizaje",
            "o06": "Ninguno de los perfiles anteriores",
            "o07": "No lo sé"
          }
        }
      ]
    },
    {
      "id": "A2",
      "title": "Sección 8. Caso práctico 5. Información sobre compostaje doméstico",
      "questions": [
        {
          "id": "P39",
          "text": "Según la información del caso, ¿se cumple el requisito de accesibilidad WCAG relacionado con la situación descrita?",
          "type": "single",
          "options": {
            "o01": "Falla. No se cumple el requisito.",
            "o02": "Pasa. Se cumple el requisito.",
            "o03": "Información insuficiente. Faltan datos para decidir si se cumple.",
            "o04": "No lo sé. No sé cómo evaluar la situación."
          }
        },
        {
          "id": "P40",
          "text": "¿Por qué has elegido esa respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P41",
          "text": "¿Con qué criterio o criterios WCAG relacionas este caso?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P42",
          "text": "¿Qué confianza tienes en tu respuesta sobre el cumplimiento del criterio?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna confianza",
            "o02": "2 · Poca confianza",
            "o03": "3 · Confianza moderada",
            "o04": "4 · Bastante confianza",
            "o05": "5 · Mucha confianza"
          }
        },
        {
          "id": "P43",
          "text": "¿Qué dificultad has tenido para evaluar este caso?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna dificultad",
            "o02": "2 · Poca dificultad",
            "o03": "3 · Dificultad moderada",
            "o04": "4 · Bastante dificultad",
            "o05": "5 · Mucha dificultad"
          }
        },
        {
          "id": "P44",
          "text": "¿Qué más comprobarías para confirmar tu respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P45",
          "text": "Si no se cumpliera el requisito relacionado con este caso, ¿a qué personas podría afectar?",
          "type": "multiple",
          "options": {
            "o01": "Personas con discapacidad visual total",
            "o02": "Personas con baja visión",
            "o03": "Personas con discapacidad auditiva",
            "o04": "Personas con discapacidad motriz",
            "o05": "Personas con discapacidad cognitiva o dificultades de aprendizaje",
            "o06": "Ninguno de los perfiles anteriores",
            "o07": "No lo sé"
          }
        }
      ]
    },
    {
      "id": "B1",
      "title": "Sección 9. Caso práctico 6. Enviar una incidencia de alumbrado público",
      "questions": [
        {
          "id": "P46",
          "text": "Según la información del caso, ¿se cumple el requisito de accesibilidad WCAG relacionado con la situación descrita?",
          "type": "single",
          "options": {
            "o01": "Falla. No se cumple el requisito.",
            "o02": "Pasa. Se cumple el requisito.",
            "o03": "Información insuficiente. Faltan datos para decidir si se cumple.",
            "o04": "No lo sé. No sé cómo evaluar la situación."
          }
        },
        {
          "id": "P47",
          "text": "¿Por qué has elegido esa respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P48",
          "text": "¿Con qué criterio o criterios WCAG relacionas este caso?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P49",
          "text": "¿Qué confianza tienes en tu respuesta sobre el cumplimiento del criterio?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna confianza",
            "o02": "2 · Poca confianza",
            "o03": "3 · Confianza moderada",
            "o04": "4 · Bastante confianza",
            "o05": "5 · Mucha confianza"
          }
        },
        {
          "id": "P50",
          "text": "¿Qué dificultad has tenido para evaluar este caso?",
          "type": "single",
          "options": {
            "o01": "1 · Ninguna dificultad",
            "o02": "2 · Poca dificultad",
            "o03": "3 · Dificultad moderada",
            "o04": "4 · Bastante dificultad",
            "o05": "5 · Mucha dificultad"
          }
        },
        {
          "id": "P51",
          "text": "¿Qué más comprobarías para confirmar tu respuesta?",
          "type": "text",
          "options": {}
        },
        {
          "id": "P52",
          "text": "Si no se cumpliera el requisito relacionado con este caso, ¿a qué personas podría afectar?",
          "type": "multiple",
          "options": {
            "o01": "Personas con discapacidad visual total",
            "o02": "Personas con baja visión",
            "o03": "Personas con discapacidad auditiva",
            "o04": "Personas con discapacidad motriz",
            "o05": "Personas con discapacidad cognitiva o dificultades de aprendizaje",
            "o06": "Ninguno de los perfiles anteriores",
            "o07": "No lo sé"
          }
        }
      ]
    },
    {
      "id": "control",
      "title": "Condiciones de realización",
      "questions": [
        {
          "id": "P53",
          "text": "Durante la resolución de los casos, ¿has consultado recursos externos o recibido ayuda para responder?",
          "type": "single",
          "options": {
            "o01": "No, he respondido sin consultar recursos externos ni recibir ayuda.",
            "o02": "Sí, he consultado recursos externos o recibido ayuda.",
            "o03": "Prefiero no responder."
          }
        }
      ]
    }
  ]
};
const $ = id => document.getElementById(id);
const fmt = new Intl.NumberFormat('es-ES',{maximumFractionDigits:2});
const finite = n => typeof n === 'number' && Number.isFinite(n);
const show = (n,s='') => finite(n)?fmt.format(n)+s:'No disponible';
const e = (tag,text,cls) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const country = new Intl.DisplayNames(['es'],{type:'region'});
function label(q,key){return q.options[key] || (q.type==='country' && /^[A-Z]{2}$/.test(key)?country.of(key):key);}
function bar(parent,title,n,max=100,suffix='%'){
 const row=e('div',undefined,'oa-bar'), line=e('div',undefined,'oa-bar-label');line.append(e('span',title),e('strong',show(n,suffix)));row.append(line);
 if(finite(n)){const track=e('div',undefined,'oa-track'),fill=e('div',undefined,'oa-fill');track.setAttribute('aria-hidden','true');fill.style.width=Math.max(0,Math.min(100,n/max*100))+'%';track.append(fill);row.append(track);}parent.append(row);
}
function table(parent,rows){const d=e('details',undefined,'oa-table');d.append(e('summary','Consultar datos en formato tabla'));const wrap=e('div',undefined,'oa-table-wrap'),t=e('table'),head=e('thead'),tr=e('tr');t.append(e('caption','Distribución de respuestas'));['Respuesta','Número','Porcentaje'].forEach(v=>{const h=e('th',v);h.scope='col';tr.append(h);});head.append(tr);t.append(head);const body=e('tbody');for(const r of rows){const line=e('tr');r.forEach((v,i)=>{const c=e(i?'td':'th',v);if(!i)c.scope='row';line.append(c);});body.append(line);}t.append(body);wrap.append(t);d.append(wrap);parent.append(d);}
function question(parent,q,data){const card=e('article',undefined,'oa-panel');card.id='pregunta-'+q.id;card.append(e('h4',q.id+'. '+q.text));if(!data){card.append(e('p','Datos no disponibles o reservados por privacidad.'));parent.append(card);return;}
 card.append(e('p','Respuestas: '+show(data.n),'oa-note'));
 if(finite(data.mean))card.append(e('p','Media: '+show(data.mean,' / 5')));
 if(q.type==='text'||!data.counts){card.append(e('p','Distribución no publicada.','oa-note'));parent.append(card);return;}
 const rows=[];for(const [key,n] of Object.entries(data.counts)){if(!finite(n)||!finite(data.n)||data.n<=0)continue;const pc=100*n/data.n;const name=label(q,key);bar(card,name,pc);rows.push([name,show(n),show(pc,'%')]);}
 if(rows.length)table(card,rows);else card.append(e('p','No hay categorías publicables.'));
 if(data.partial)card.append(e('p','Algunas categorías están reservadas por privacidad.','oa-note'));if(q.type==='multiple')card.append(e('p','Selección múltiple: los porcentajes pueden superar el 100 %.','oa-note'));parent.append(card);
}
function render(snapshot,id){const study=snapshot.studies[id],qs=study.questions||{}, profile=id==='E1', k=$('results-kpis'),root=$(profile?'profile-questions':'wcag-questions'),links=$(profile?'profile-results-links':'wcag-results-links'),info=$(profile?'profile-infographic':'wcag-infographic');
 for(const n of [k,root,links,info])if(n)n.replaceChildren();
 const card=e('div',undefined,'oa-top-card');const value=e('p',show(study.total),'oa-participant-number');value.style.fontSize='2rem';value.style.fontWeight='700';value.style.margin='.4rem 0';card.append(e('strong','Participantes'),value);const situation=qs.P02;
 const breakdown=e('dl',undefined,'oa-participant-breakdown');
 for(const [key,title] of [['o02','Profesionales'],['o01','Estudiantes'],['o03','Docentes o investigadores']]){
  const n=situation?.counts?.[key];
  const count=finite(n)?n:(situation?.counts && situation.partial===false && finite(situation.n)?0:null);
  const item=e('div');item.append(e('dt',title),e('dd',show(count)));breakdown.append(item);
 }
 card.append(breakdown);k.append(card);
 const caseIds=['C1','A1','C2','B2','A2','B1'];
 const caseImages={"C1": {"desktop": {"src": "datos/assets/C1_desktop.png", "alt": "Formulario de transferencia con cuenta de destino, importe, concepto y un botón para enviar la transferencia."}, "mobile": {"src": "datos/assets/C1_mobile.png", "alt": "Formulario de transferencia con cuenta de destino, importe, concepto y un botón para enviar la transferencia."}}, "A1": {"desktop": {"src": "datos/assets/A1_desktop.png", "alt": "Gráfico de barras de ventas mensuales de enero a junio. La barra de abril es ligeramente menor que la de marzo."}, "mobile": {"src": "datos/assets/A1_mobile.png", "alt": "Gráfico de barras de ventas mensuales de enero a junio. La barra de abril es ligeramente menor que la de marzo."}}, "C2": {"desktop": {"src": "datos/assets/C2_desktop.png", "alt": "Resumen de la reserva con el vehículo, las fechas, el precio y opciones para modificar o confirmar el alquiler."}, "mobile": {"src": "datos/assets/C2_mobile.png", "alt": "Resumen de la reserva con el vehículo, las fechas, el precio y opciones para modificar o confirmar el alquiler."}}, "B2": {"desktop": {"src": "datos/assets/B2_desktop.png", "alt": "Carrito con un producto y un botón para eliminarlo."}, "mobile": {"src": "datos/assets/B2_mobile.png", "alt": "Carrito con un producto y un botón para eliminarlo."}}, "A2": {"desktop": {"src": "datos/assets/A2_desktop.png", "alt": "Ilustración con los pasos del compostaje doméstico y una lista de pasos junto a ella."}, "mobile": {"src": "datos/assets/A2_mobile.png", "alt": "Ilustración con los pasos del compostaje doméstico y una lista de pasos junto a ella."}}, "B1": {"desktop": {"src": "datos/assets/B1_desktop.png", "alt": "Formulario municipal para avisar de una incidencia de alumbrado con un botón de envío."}, "mobile": {"src": "datos/assets/B1_mobile.png", "alt": "Formulario municipal para avisar de una incidencia de alumbrado con un botón de envío."}}};
 let caseSection=null, caseList=null;
 for(const group of definitions[id]){
  const caseIndex=profile?-1:caseIds.indexOf(group.id);
  if(!profile && group.id!=='S2' && caseIndex<0)continue;
  const section=e('section',undefined,'obs-section');section.id='grupo-'+group.id;
  const title=group.title.replace(/^Sección \d+\. Caso práctico \d+\. /,'');
  section.append(e(profile||caseIndex>=0?'h3':'h2',title,caseIndex>=0?'oa-group-title':profile?'oa-group-title':'obs-infographic-heading'));
  const li=e('li');const a=e('a',caseIndex>=0?(caseIndex+1)+'. '+title:title);a.href='#'+section.id;li.append(a);
  if(caseIndex===0){
   caseSection=e('section',undefined,'obs-section');caseSection.id='casos-wcag';caseSection.append(e('h2','Casos de criterios WCAG','obs-infographic-heading'));root.append(caseSection);
   const heading=e('li',undefined,'oa-case-menu-heading');const link=e('a','Casos WCAG');link.href='#casos-wcag';heading.append(link);caseList=e('ul');heading.append(caseList);links.append(heading);
  }
  if(caseIndex>=0){
   caseList.append(li);const q=group.questions[0];const c=snapshot.aciertosE2?.version==='1.5'?snapshot.aciertosE2.casos?.find(x=>x.id===group.id):null;
   const panel=e('article',undefined,'oa-panel');panel.id='pregunta-'+q.id;
   const views=caseImages[group.id];
   if(views){const picture=e('picture',undefined,'oa-case-picture');const source=e('source');source.media='(max-width: 767px)';source.srcset=views.mobile.src;const img=e('img');img.src=views.desktop.src;img.alt=views.desktop.alt;img.loading='lazy';img.decoding='async';picture.append(source,img);panel.append(picture);}
   if(c&&finite(c.n)&&c.n>0&&finite(c.aciertos)&&c.aciertos>=0&&c.aciertos<=c.n){
    const summary=e('dl',undefined,'oa-kpis oa-case-counts');
    for(const [label,n] of [['Participantes que han acertado',c.aciertos],['Participantes que no han acertado',c.n-c.aciertos]]){
     const cell=e('div');cell.append(e('dt',label),e('dd',show(n)));summary.append(cell);
    }
    panel.append(summary);
    const rows=[];
    for(const [key,label] of [['correctas','Correctas'],['incorrectas','Incorrectas'],['informacionInsuficiente','Información insuficiente'],['noLoSe','No lo sé']]){
     const n=c.distribucion?.[key], pc=finite(n)&&n>=0&&n<=c.n?100*n/c.n:null;
     rows.push([label,show(n),show(pc,'%')]);
    }
    table(panel,rows);
   }else panel.append(e('p','Datos de aciertos no disponibles o reservados por privacidad.','oa-note'));
   section.append(panel);caseSection.append(section);
  }else{links.append(li);for(const q of group.questions)question(section,q,qs[q.id]);root.append(section);}
 }
 if(profile&&info){for(const qid of ['P06','P09','P14']){const q=definitions.E1.flatMap(g=>g.questions).find(x=>x.id===qid);question(info,q,qs[qid]);const last=info.lastElementChild;last.id='resumen-'+qid;}}

 if(typeof window.renderObservatorioAciertos==='function'){try{window.renderObservatorioAciertos(snapshot);}catch(err){console.error('Error al representar indicadores adicionales',err);}}
 const date=new Date(snapshot.generatedAt);$('results-status').textContent=finite(date.getTime())?'Última actualización: '+new Intl.DateTimeFormat('es-ES',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Madrid'}).format(date):'Resultados cargados.';
 if(!finite(study.total))$('results-status').textContent+=' Datos insuficientes o reservados por privacidad.';
}
async function load(){const status=$('results-status');if(!status)return;const id=$('profile-questions')?'E1':'E2';status.textContent='Cargando los resultados…';let timer;
 try{if(APPS_SCRIPT_URL==='PEGA_AQUI_LA_URL_EXEC')throw new Error('Configura APPS_SCRIPT_URL en observatorio-estudios.js con la URL de la aplicación web de Apps Script (/exec).');const url=new URL(APPS_SCRIPT_URL);if(url.protocol!=='https:'||url.hostname!=='script.google.com'||!url.pathname.endsWith('/exec'))throw new Error('La URL debe ser la de la implementación web de Apps Script, terminada en /exec.');url.searchParams.set('action','observatorio');url.searchParams.set('_',Date.now().toString());const ctrl=new AbortController();timer=setTimeout(()=>ctrl.abort(),20000);const response=await fetch(url,{signal:ctrl.signal,cache:'no-store',credentials:'omit'});if(!response.ok)throw new Error('El servidor respondió con HTTP '+response.status);const snapshot=await response.json();if(snapshot.ok!==true)throw new Error('El servicio no publica resultados. Comprueba PUBLICAR_OBSERVATORIO y ejecuta publicarObservatorio.');if(!snapshot.studies?.[id])throw new Error('El JSON no contiene el estudio solicitado.');if(snapshot.versions?.[id]!=='1.5')throw new Error('La versión de los datos no coincide con la versión 1.5.');render(snapshot,id);}
 catch(err){console.error('Observatorio:',err);status.replaceChildren(e('span',err.name==='AbortError'?'La consulta ha superado el tiempo de espera.':'No se han podido cargar los resultados. '+err.message));const retry=e('button','Reintentar');retry.type='button';retry.addEventListener('click',load,{once:true});status.append(document.createTextNode(' '),retry);}finally{clearTimeout(timer);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();

/* v16: adapta la posición de la navegación lateral a la altura real de la cabecera. */
(function initStickyObservatorio() {
  function setup() {
    const header = document.querySelector('.site-header');
    const dashboard = document.querySelector('.obs-dashboard');
    if (!dashboard) return;
    const update = () => {
      const position = header ? getComputedStyle(header).position : '';
      const pinned = position === 'sticky' || position === 'fixed';
      const height = pinned ? header.getBoundingClientRect().height : 0;
      const top = pinned ? Math.max(0, parseFloat(getComputedStyle(header).top) || 0) : 0;
      dashboard.style.setProperty('--oa-sidebar-top', `${Math.ceil(height + top + 12)}px`);
    };
    update();
    window.addEventListener('resize', update, {passive:true});
    if (header && typeof ResizeObserver !== 'undefined') new ResizeObserver(update).observe(header);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, {once:true});
  else setup();
})();
