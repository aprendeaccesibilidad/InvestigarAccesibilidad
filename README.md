# Investiga Accesibilidad

Investigación en accesibilidad digital.

- Dominio propuesto: `investigaaccesibilidad.udl.cat`
- Primer observatorio: Observatorio de profesionales de la accesibilidad digital
- Primer estudio: Conocimiento y comprensión de las WCAG

## Ejecutar en local

Desde la raíz del proyecto, inicia el servidor:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre [Inicio](http://127.0.0.1:8000/). La página **Participación** carga el cuestionario y envía respuestas a la aplicación web configurada en Apps Script.

## Archivos del portal

- `index.html` presenta el estudio.
- `participa.html`, `cuestionario.js` y `cuestionario-v15.css` muestran el consentimiento, el cuestionario y el flujo de envío.
- `datos/cuestionario_v1.7.json` contiene las preguntas, opciones, condiciones y referencias a las imágenes de los casos.
- `observatorio.html` y `observatorio-cuestionario.js` muestran las preguntas del estudio y los resultados agregados que se hayan publicado.
- `sobre-el-proyecto.html` e `informacion-estudio.html` describen el proyecto y la participación.
- `integracion-google/` contiene el código y las instrucciones para configurar Google Sheets y publicar los agregados. [Configuración de la integración](integracion-google/README.md)

La carpeta `xborrar/` conserva localmente los archivos retirados del portal. Está excluida de Git.

## Publicación

GitHub Pages sirve las páginas estáticas. Apps Script utiliza la hoja privada para guardar las respuestas y publica solo agregados para el Observatorio. Antes de desplegar, comprueba el consentimiento, el envío y la visualización de los resultados.
