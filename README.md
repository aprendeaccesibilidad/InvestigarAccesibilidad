# Investigar Accesibilidad Digital

Investigación, conocimiento y análisis de la accesibilidad digital.

- [Sitio en GitHub Pages](https://aprendeaccesibilidad.github.io/InvestigarAccesibilidad/)
- Primer observatorio: Observatorio de profesionales y estudiantes de la accesibilidad digital
- Primer estudio: Comprensión de la accesibilidad digital y las pautas WCAG

## Ejecutar en local

Desde la raíz del proyecto, inicia el servidor:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre [Inicio](http://127.0.0.1:8000/). La página **Participación** carga el cuestionario y envía respuestas a la aplicación web configurada en Apps Script.

## Archivos del portal

- `index.html` presenta el portal, los estudios y el Observatorio.
- `estudios.html` organiza los estudios activos.
- `observatorios.html` reúne los observatorios del portal.
- `participa-estudios.html`, `estudios-cuestionario.js` y `cuestionario-v15.css` muestran el consentimiento, los cuestionarios y el flujo de envío.
- `datos/estudio1.json` y `datos/estudio2.json` definen las preguntas y sus opciones. Los recursos de los casos están en `datos/assets/`.
- `observatorio-estudios.html` reúne los informes de cada estudio. `observatorio-estudios.js` carga los resultados agregados publicados.
- `sobre-el-proyecto.html` describe el proyecto. La información del estudio y privacidad está en `participa-estudios.html#privacidad`.
- `integracion-google/` contiene el código y las instrucciones para configurar Google Sheets y publicar los agregados. [Configuración de la integración](integracion-google/README.md)

La carpeta `xborrar/` conserva localmente los archivos retirados del portal. Está excluida de Git.

## Publicación

GitHub Pages sirve las páginas estáticas. Apps Script utiliza la hoja privada para guardar las respuestas y publica solo agregados para el Observatorio. Antes de desplegar, comprueba el consentimiento, el envío y la visualización de los resultados.

## Estudios actuales

La navegación pública abre `participa-estudios.html` y `observatorio-estudios.html`. Las preguntas, las demostraciones de los casos y la pantalla final se cargan desde `datos/`. Los borradores se guardan por estudio en el navegador. Para activar Google Sheets y publicar los resultados, consulta [la guía de integración](integracion-google/README.md#estudios-1-y-2).
