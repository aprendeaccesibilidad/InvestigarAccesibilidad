// Generado desde el JSON con node integracion-google/generar-esquema.mjs
const QUESTIONNAIRE_SCHEMA = {
  "questionnaireId": "comprension_wcag",
  "version": "1.7",
  "consent": "CI_O01",
  "fields": [
    {
      "id": "CI",
      "title": "¿Aceptas participar en esta investigación tras leer la información del estudio?",
      "type": "single_select",
      "required": true,
      "options": {
        "CI_O01": "Sí, acepto participar.",
        "CI_O02": "No, no deseo participar."
      }
    },
    {
      "id": "P00",
      "title": "¿Cómo has conocido este estudio?",
      "type": "single_select",
      "required": true,
      "options": {
        "P00_O01": "Congreso, seminario o jornada profesional",
        "P00_O02": "LinkedIn",
        "P00_O03": "Otras redes sociales",
        "P00_O04": "Comunidades o asociaciones profesionales",
        "P00_O05": "Recomendación de compañeros, docentes o profesionales",
        "P00_O06": "Otros canales (especificar)"
      }
    },
    {
      "id": "P00_otro",
      "title": "¿Cómo has conocido este estudio? · Otra respuesta",
      "type": "short_text",
      "required": true,
      "visibleIf": {
        "question_id": "P00",
        "option_id": "P00_O06"
      }
    },
    {
      "id": "P01",
      "title": "¿Cuál es tu situación actual? (Puedes marcar varias opciones.)",
      "type": "multi_select",
      "required": true,
      "exclusive": [
        "P01_O04"
      ],
      "options": {
        "P01_O01": "Estudiante",
        "P01_O02": "Profesional en activo",
        "P01_O03": "Docente o investigador/a",
        "P01_O04": "Actualmente no trabajo ni estudio",
        "P01_O05": "Otra situación"
      }
    },
    {
      "id": "P02",
      "title": "¿En qué ámbitos trabajas o estudias?",
      "type": "multi_select",
      "required": true,
      "exclusive": [
        "P02_O09"
      ],
      "options": {
        "P02_O01": "Diseño digital y diseño de experiencia e interfaces de usuario (UX/UI)",
        "P02_O02": "Desarrollo web o software",
        "P02_O03": "Evaluación, auditoría o consultoría de accesibilidad",
        "P02_O04": "Pruebas de calidad de productos digitales (QA)",
        "P02_O05": "Creación y gestión de contenidos digitales",
        "P02_O06": "Gestión de proyectos o productos digitales",
        "P02_O07": "Docencia o investigación",
        "P02_O08": "Otro ámbito",
        "P02_O09": "No trabajo ni estudio en ninguna de estas áreas"
      }
    },
    {
      "id": "P03",
      "title": "¿Qué actividades de accesibilidad digital realizas?",
      "type": "multi_select",
      "required": true,
      "exclusive": [
        "P03_O09"
      ],
      "options": {
        "P03_O01": "Diseño accesible",
        "P03_O02": "Desarrollo accesible",
        "P03_O03": "Evaluación y auditoría",
        "P03_O04": "Corrección de problemas de accesibilidad",
        "P03_O05": "Creación de contenidos y documentos accesibles",
        "P03_O06": "Formación, investigación o divulgación",
        "P03_O07": "Gestión de la accesibilidad",
        "P03_O08": "Otras actividades",
        "P03_O09": "Ninguna"
      }
    },
    {
      "id": "P04",
      "title": "¿Qué importancia tiene la accesibilidad digital en tu trabajo o estudios?",
      "type": "single_select",
      "required": true,
      "options": {
        "P04_O01": "Es mi actividad principal",
        "P04_O02": "Es una parte importante de mi actividad",
        "P04_O03": "Es una parte secundaria de mi actividad",
        "P04_O04": "Solo realizo actividades relacionadas de forma ocasional",
        "P04_O05": "No forma parte de mi actividad actual"
      }
    },
    {
      "id": "P05",
      "title": "¿Tienes alguna discapacidad o dificultad funcional que afecte a cómo utilizas productos digitales?",
      "type": "multi_select",
      "required": false,
      "exclusive": [
        "P05_O08",
        "P05_O09"
      ],
      "options": {
        "P05_O01": "Discapacidad visual total",
        "P05_O02": "Baja visión",
        "P05_O03": "Discapacidad auditiva",
        "P05_O04": "Discapacidad física o motriz",
        "P05_O05": "Discapacidad cognitiva",
        "P05_O06": "Dificultades específicas de aprendizaje",
        "P05_O07": "Otra discapacidad o dificultad funcional",
        "P05_O08": "Ninguna de las anteriores",
        "P05_O09": "Prefiero no responder"
      }
    },
    {
      "id": "P06",
      "title": "¿En qué país trabajas o estudias principalmente?",
      "type": "dropdown",
      "required": true,
      "options": {
        "P06_O01": "España",
        "P06_O02": "Argentina",
        "P06_O03": "Bolivia",
        "P06_O04": "Brasil",
        "P06_O05": "Chile",
        "P06_O06": "Colombia",
        "P06_O07": "Costa Rica",
        "P06_O08": "Cuba",
        "P06_O09": "Ecuador",
        "P06_O10": "El Salvador",
        "P06_O11": "Guatemala",
        "P06_O12": "Haití",
        "P06_O13": "Honduras",
        "P06_O14": "México",
        "P06_O15": "Nicaragua",
        "P06_O16": "Panamá",
        "P06_O17": "Paraguay",
        "P06_O18": "Perú",
        "P06_O19": "Puerto Rico",
        "P06_O20": "República Dominicana",
        "P06_O21": "Uruguay",
        "P06_O22": "Venezuela",
        "P06_O23": "Otro país (especificar)"
      }
    },
    {
      "id": "P06b",
      "title": "Indica el país",
      "type": "short_text",
      "required": true,
      "visibleIf": {
        "question_id": "P06",
        "option_id": "P06_O23"
      }
    },
    {
      "id": "P07",
      "title": "¿Cuánto tiempo llevas trabajando, estudiando o aprendiendo sobre accesibilidad digital? Incluye también el aprendizaje por tu cuenta.",
      "type": "single_select",
      "required": true,
      "options": {
        "P07_O01": "Ninguna experiencia",
        "P07_O02": "Menos de 1 año",
        "P07_O03": "De 1 a menos de 3 años",
        "P07_O04": "De 3 a menos de 6 años",
        "P07_O05": "De 6 a menos de 10 años",
        "P07_O06": "10 años o más"
      }
    },
    {
      "id": "P08",
      "title": "Cuando evalúas la accesibilidad de un producto digital, ¿con qué frecuencia utilizas las pautas WCAG?",
      "type": "single_select",
      "required": true,
      "options": {
        "P08_O01": "Nunca",
        "P08_O02": "Casi nunca",
        "P08_O03": "Algunas veces",
        "P08_O04": "Frecuentemente",
        "P08_O05": "Siempre o casi siempre",
        "P08_O06": "No realizo evaluaciones de accesibilidad"
      }
    },
    {
      "id": "P09",
      "title": "¿Cómo evalúas la accesibilidad digital?",
      "type": "multi_select",
      "required": true,
      "exclusive": [
        "P09_O08"
      ],
      "options": {
        "P09_O01": "Herramientas automáticas",
        "P09_O02": "Revisión manual de interfaces y código",
        "P09_O03": "Listas de verificación WCAG y metodologías de evaluación",
        "P09_O04": "Pruebas con teclado y tecnologías de apoyo",
        "P09_O05": "Pruebas con usuarios con discapacidad",
        "P09_O06": "Herramientas de inteligencia artificial",
        "P09_O07": "Otros métodos",
        "P09_O08": "No realizo evaluaciones"
      }
    },
    {
      "id": "P10",
      "title": "¿Cómo has aprendido sobre accesibilidad digital?",
      "type": "multi_select",
      "required": true,
      "exclusive": [
        "P10_O08"
      ],
      "options": {
        "P10_O01": "Estudios oficiales (universidad o formación profesional)",
        "P10_O02": "Cursos especializados, talleres, microcredenciales o preparación de certificaciones",
        "P10_O03": "Experiencia en el trabajo y colaboración con compañeros o expertos",
        "P10_O04": "Congresos, jornadas, comunidades, foros o redes sociales",
        "P10_O05": "Aprendizaje por mi cuenta (libros, documentación, tutoriales, vídeos o práctica)",
        "P10_O06": "Aprendizaje con ayuda de inteligencia artificial",
        "P10_O07": "Otras vías de aprendizaje",
        "P10_O08": "Todavía no he aprendido sobre accesibilidad digital"
      }
    },
    {
      "id": "P11",
      "title": "¿Sobre qué ámbitos de accesibilidad digital has aprendido?",
      "type": "multi_select",
      "required": true,
      "options": {
        "P11_O01": "Fundamentos: discapacidad, barreras y necesidades de los usuarios",
        "P11_O02": "Pautas WCAG y normativa",
        "P11_O03": "Diseño de interfaces accesibles",
        "P11_O04": "Desarrollo web accesible",
        "P11_O05": "Evaluación de accesibilidad",
        "P11_O06": "Documentos digitales accesibles",
        "P11_O07": "Inteligencia artificial aplicada a la accesibilidad",
        "P11_O08": "Otros ámbitos",
        "P11_O09": "Ninguno"
      }
    },
    {
      "id": "P12",
      "title": "¿Qué acreditaciones en accesibilidad digital has obtenido?",
      "type": "multi_select",
      "required": true,
      "exclusive": [
        "P12_O07"
      ],
      "options": {
        "P12_O01": "Certificación profesional (CPACC, WAS, CPWA u otras)",
        "P12_O02": "Titulación universitaria especializada",
        "P12_O03": "Microcredencial universitaria",
        "P12_O04": "Certificado de superación de un curso",
        "P12_O05": "Certificado de asistencia a un curso o jornada",
        "P12_O06": "Otras acreditaciones",
        "P12_O07": "Ninguna"
      }
    },
    {
      "id": "P13_R01",
      "title": "¿Cómo valoras tus conocimientos y capacidades en accesibilidad digital? · Conocimientos generales de accesibilidad digital",
      "type": "single_select",
      "required": true,
      "options": {
        "P13_O01": "1 · Muy bajo",
        "P13_O02": "2 · Bajo",
        "P13_O03": "3 · Medio",
        "P13_O04": "4 · Alto",
        "P13_O05": "5 · Muy alto"
      }
    },
    {
      "id": "P13_R02",
      "title": "¿Cómo valoras tus conocimientos y capacidades en accesibilidad digital? · Conocimientos de los criterios WCAG",
      "type": "single_select",
      "required": true,
      "options": {
        "P13_O01": "1 · Muy bajo",
        "P13_O02": "2 · Bajo",
        "P13_O03": "3 · Medio",
        "P13_O04": "4 · Alto",
        "P13_O05": "5 · Muy alto"
      }
    },
    {
      "id": "P13_R03",
      "title": "¿Cómo valoras tus conocimientos y capacidades en accesibilidad digital? · Confianza para evaluar el cumplimiento de las WCAG",
      "type": "single_select",
      "required": true,
      "options": {
        "P13_O01": "1 · Muy bajo",
        "P13_O02": "2 · Bajo",
        "P13_O03": "3 · Medio",
        "P13_O04": "4 · Alto",
        "P13_O05": "5 · Muy alto"
      }
    },
    {
      "id": "P14_R01",
      "title": "¿Cómo valoras los siguientes aspectos de tu actividad en accesibilidad digital? · Grado de satisfacción",
      "type": "single_select",
      "required": false,
      "options": {
        "P14_O01": "1 · Muy bajo",
        "P14_O02": "2 · Bajo",
        "P14_O03": "3 · Medio",
        "P14_O04": "4 · Alto",
        "P14_O05": "5 · Muy alto",
        "P14_O06": "No aplica",
        "P14_O07": "Prefiero no responder"
      }
    },
    {
      "id": "P14_R02",
      "title": "¿Cómo valoras los siguientes aspectos de tu actividad en accesibilidad digital? · Grado de disfrute",
      "type": "single_select",
      "required": false,
      "options": {
        "P14_O01": "1 · Muy bajo",
        "P14_O02": "2 · Bajo",
        "P14_O03": "3 · Medio",
        "P14_O04": "4 · Alto",
        "P14_O05": "5 · Muy alto",
        "P14_O06": "No aplica",
        "P14_O07": "Prefiero no responder"
      }
    },
    {
      "id": "C1_P1",
      "title": "¿Se cumple el requisito WCAG relacionado con este caso?",
      "type": "single_select",
      "required": true,
      "options": {
        "C1_P1_O01": "Falla",
        "C1_P1_O02": "Pasa",
        "C1_P1_O03": "Información insuficiente",
        "C1_P1_O04": "No lo sé"
      }
    },
    {
      "id": "C1_P2",
      "title": "¿Por qué?",
      "type": "short_text",
      "required": true
    },
    {
      "id": "C1_P3",
      "title": "¿Qué confianza tienes en tu respuesta?",
      "type": "single_select",
      "required": true,
      "options": {
        "C1_P3_O01": "1 · Ninguna",
        "C1_P3_O02": "2 · Poca",
        "C1_P3_O03": "3 · Confianza moderada",
        "C1_P3_O04": "4 · Bastante",
        "C1_P3_O05": "5 · Mucha"
      }
    },
    {
      "id": "A1_P1",
      "title": "¿Se cumple el requisito WCAG relacionado con este caso?",
      "type": "single_select",
      "required": true,
      "options": {
        "A1_P1_O01": "Falla",
        "A1_P1_O02": "Pasa",
        "A1_P1_O03": "Información insuficiente",
        "A1_P1_O04": "No lo sé"
      }
    },
    {
      "id": "A1_P2",
      "title": "¿Por qué?",
      "type": "short_text",
      "required": true
    },
    {
      "id": "A1_P3",
      "title": "¿Qué confianza tienes en tu respuesta?",
      "type": "single_select",
      "required": true,
      "options": {
        "A1_P3_O01": "1 · Ninguna",
        "A1_P3_O02": "2 · Poca",
        "A1_P3_O03": "3 · Confianza moderada",
        "A1_P3_O04": "4 · Bastante",
        "A1_P3_O05": "5 · Mucha"
      }
    },
    {
      "id": "C2_P1",
      "title": "¿Se cumple el requisito WCAG relacionado con este caso?",
      "type": "single_select",
      "required": true,
      "options": {
        "C2_P1_O01": "Falla",
        "C2_P1_O02": "Pasa",
        "C2_P1_O03": "Información insuficiente",
        "C2_P1_O04": "No lo sé"
      }
    },
    {
      "id": "C2_P2",
      "title": "¿Por qué?",
      "type": "short_text",
      "required": true
    },
    {
      "id": "C2_P3",
      "title": "¿Qué confianza tienes en tu respuesta?",
      "type": "single_select",
      "required": true,
      "options": {
        "C2_P3_O01": "1 · Ninguna",
        "C2_P3_O02": "2 · Poca",
        "C2_P3_O03": "3 · Confianza moderada",
        "C2_P3_O04": "4 · Bastante",
        "C2_P3_O05": "5 · Mucha"
      }
    },
    {
      "id": "B2_P1",
      "title": "¿Se cumple el requisito WCAG relacionado con este caso?",
      "type": "single_select",
      "required": true,
      "options": {
        "B2_P1_O01": "Falla",
        "B2_P1_O02": "Pasa",
        "B2_P1_O03": "Información insuficiente",
        "B2_P1_O04": "No lo sé"
      }
    },
    {
      "id": "B2_P2",
      "title": "¿Por qué?",
      "type": "short_text",
      "required": true
    },
    {
      "id": "B2_P3",
      "title": "¿Qué confianza tienes en tu respuesta?",
      "type": "single_select",
      "required": true,
      "options": {
        "B2_P3_O01": "1 · Ninguna",
        "B2_P3_O02": "2 · Poca",
        "B2_P3_O03": "3 · Confianza moderada",
        "B2_P3_O04": "4 · Bastante",
        "B2_P3_O05": "5 · Mucha"
      }
    },
    {
      "id": "A2_P1",
      "title": "¿Se cumple el requisito WCAG relacionado con este caso?",
      "type": "single_select",
      "required": true,
      "options": {
        "A2_P1_O01": "Falla",
        "A2_P1_O02": "Pasa",
        "A2_P1_O03": "Información insuficiente",
        "A2_P1_O04": "No lo sé"
      }
    },
    {
      "id": "A2_P2",
      "title": "¿Por qué?",
      "type": "short_text",
      "required": true
    },
    {
      "id": "A2_P3",
      "title": "¿Qué confianza tienes en tu respuesta?",
      "type": "single_select",
      "required": true,
      "options": {
        "A2_P3_O01": "1 · Ninguna",
        "A2_P3_O02": "2 · Poca",
        "A2_P3_O03": "3 · Confianza moderada",
        "A2_P3_O04": "4 · Bastante",
        "A2_P3_O05": "5 · Mucha"
      }
    },
    {
      "id": "B1_P1",
      "title": "¿Se cumple el requisito WCAG relacionado con este caso?",
      "type": "single_select",
      "required": true,
      "options": {
        "B1_P1_O01": "Falla",
        "B1_P1_O02": "Pasa",
        "B1_P1_O03": "Información insuficiente",
        "B1_P1_O04": "No lo sé"
      }
    },
    {
      "id": "B1_P2",
      "title": "¿Por qué?",
      "type": "short_text",
      "required": true
    },
    {
      "id": "B1_P3",
      "title": "¿Qué confianza tienes en tu respuesta?",
      "type": "single_select",
      "required": true,
      "options": {
        "B1_P3_O01": "1 · Ninguna",
        "B1_P3_O02": "2 · Poca",
        "B1_P3_O03": "3 · Confianza moderada",
        "B1_P3_O04": "4 · Bastante",
        "B1_P3_O05": "5 · Mucha"
      }
    },
    {
      "id": "P15",
      "title": "Correo electrónico (opcional)",
      "type": "short_text",
      "required": false,
      "format": "email"
    }
  ]
};
