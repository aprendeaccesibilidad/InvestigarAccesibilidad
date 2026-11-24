# Envío directo a Google Sheets desde el cuestionario v1.7

El formulario de la web carga `datos/cuestionario_v1.7.json`. Apps Script utiliza `Esquema.gs`, generado a partir de ese archivo, para comprobar las respuestas y crear dos pestañas en la hoja que elijas:

- **Respuestas_v1_7** guarda una fila por envío. Las columnas incluyen la fecha, el identificador de envío, el cuestionario, su versión y los campos del JSON. El correo opcional queda en la columna **P15 de esa misma fila**, en blanco si se omite.
- **Diccionario_v1_7** identifica cada pregunta, fila de escala y opción. Las respuestas de selección se guardan por identificador, y las selecciones múltiples se guardan como listas JSON.

El script conserva las pestañas y las respuestas anteriores.

## Preparar la hoja

1. Abre una hoja privada de Google Sheets. Puedes reutilizar el archivo anterior o crear uno nuevo si prefieres guardar solo la versión 1.7. Copia el identificador que aparece en la URL entre `/d/` y `/edit`.
2. En tu proyecto existente de Apps Script, reemplaza `Code.gs` por el archivo de este directorio. Añade un archivo de script llamado **Esquema** y pega allí el contenido de `Esquema.gs`. Guarda ambos.
3. En **Configuración del proyecto → Propiedades del script**, define `SHEET_ID` con el identificador copiado. Para la hoja que ya compartiste, el valor es `1qPciPayzOi0Nnt9P98DCVxTu0fMO6bmSx3duiWd8hus`. El `gid` de la pestaña anterior ya no se usa.
4. En el selector de funciones, elige **prepararHoja** y pulsa **Ejecutar**. Autoriza el acceso a Google Sheets si se solicita. Comprueba que aparezcan las dos pestañas nuevas. Puedes ejecutar **comprobarConfiguracion** para verificar las columnas sin escribir respuestas.

## Activar la recogida

1. Cuando la versión esté lista para publicar, despliega Apps Script desde **Implementar → Gestionar implementaciones → Editar → Nueva versión**. Debe ejecutarse con la cuenta autorizada a editar la hoja. Selecciona **Cualquier persona** si el cuestionario se ofrece sin iniciar sesión.
2. En `datos/cuestionario_v1.7.json`, cambia `publication_ready` a `true` solo al activar la recogida. Si editaste la implementación existente, la URL `/exec` se conserva y ya está configurada en `participa.html`. Si creaste otra implementación, actualiza allí `data-submit-url`.
3. Desde la web, prueba un envío ficticio y comprueba que se crea una única fila. Prueba también un envío sin correo y comprueba que **P15** queda vacía.

Si cambias el JSON, regenera el archivo de Apps Script con `node integracion-google/generar-esquema.mjs` y actualiza `Esquema.gs` en Google. Si cambian los campos del cuestionario, incrementa su versión antes de preparar la nueva pestaña.

## Publicar resultados en el Observatorio

1. Despliega la versión de Apps Script que incluye `publicarObservatorio` y `doGet`. La web consulta la misma URL `/exec` con `?action=observatorio`.
2. Ejecuta **publicarObservatorio** en el editor. Se leerá **Respuestas_v1_7** y se creará la instantánea **Agregados_v1_7** en el mismo archivo. Puedes revisar esa pestaña antes de publicarla.
3. En **Propiedades del script**, fija **PUBLICAR_OBSERVATORIO** en **true** para mostrar la instantánea. Para actualizar los resultados, vuelve a ejecutar **publicarObservatorio**. Puedes pausar la publicación poniendo la propiedad en **false**.

Los agregados requieren al menos cinco participaciones y reservan los recuentos pequeños. La consulta pública no incluye correos, justificaciones, textos libres ni el desglose de discapacidad.
