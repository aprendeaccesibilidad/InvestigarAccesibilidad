# Integración con Google Sheets

## Estudios 1 y 2

1. Abre el proyecto de Apps Script de la hoja nueva. Pega el archivo completo [AppsScript-Estudios.gs](AppsScript-Estudios.gs) en `Código.gs` y guarda. El código ya contiene el identificador de la hoja. Las funciones de esta implementación corresponden al proyecto nuevo.
2. Selecciona `prepararHoja` y pulsa **Ejecutar**. Autoriza el acceso a Sheets. Comprueba que aparecen `Estudio_1`, `Estudio_2`, `Contactos` y `Agregados_Estudios`. Mantén la hoja con acceso restringido.
3. En **Implementar → Nueva implementación → Aplicación web**, selecciona **Ejecutar como Yo** y acceso para **Cualquier persona**. Copia la URL de la aplicación web que termina en `/exec` y colócala en `submitUrl` de [config.json](../datos/config.json). Si ya hay una implementación, crea una versión nueva en **Gestionar implementaciones** para que se ejecute el código actualizado.
4. Prueba un envío del Estudio 1. Comprueba que aparece en `Estudio_1` y que el correo opcional comparte el ID de participación en `Contactos`. El Estudio 2 se completa en el navegador y no crea filas nuevas.
5. Cuando quieras actualizar el Observatorio, ejecuta `publicarObservatorio`. En **Configuración del proyecto → Propiedades de secuencia de comandos**, establece `PUBLICAR_OBSERVATORIO` con valor `true` para que el Observatorio pueda leer la instantánea. Repite la ejecución para actualizar los resultados. Cada estudio y los desgloses tienen un mínimo de cinco respuestas.

La configuración vacía habilita una vista previa local sin envíos. Las respuestas antiguas de la versión 1.7 siguen en su hoja anterior y no se incorporan a los nuevos agregados.

Si cambian las preguntas o sus opciones, vuelve a generar el archivo de Apps Script desde la raíz con `node integracion-google/generar-estudios.mjs`. Para cambios de estructura con datos ya recogidos, prepara pestañas versionadas antes de desplegar.

### Actualizar las columnas de tiempo y contexto

1. Copia el archivo completo `AppsScript-Estudios.gs` en `Código.gs` del proyecto de la hoja actual y guarda.
2. Ejecuta `prepararHoja`. Añade columnas a la derecha de las respuestas conservadas. Las filas históricas quedan vacías en las columnas nuevas. La función puede ejecutarse de nuevo sin duplicarlas.
3. Edita la implementación actual en **Implementar → Gestionar implementaciones**, elige **Nueva versión** y vuelve a implementar. Comprueba que se ejecuta como tú y permite el acceso a cualquier persona. Conserva la URL `/exec` para mantener la conexión configurada en el portal.
4. Publica la versión actual del portal y envía una participación de prueba en cada estudio. Verifica la fecha y hora de inicio y fin, el tipo de dispositivo, la familia del navegador, el idioma de respuesta y las duraciones numéricas en segundos. El Estudio 2 agrega seis columnas de tiempo activo, una por caso.

El inicio se registra al dar el consentimiento y pulsar **Comenzar cuestionario**. El fin se toma al enviar un cuestionario que ha superado la validación. La duración total incluye las pausas y los días entre sesiones. La interacción activa es una estimación que suma los intervalos en primer plano hasta 60 segundos después de la última interacción. Los borradores anteriores a esta actualización empiezan a medir cuando se retoman. Las fechas son valores de fecha y hora que se muestran en la zona horaria de la hoja.

### Guardar varias participaciones de la misma persona

Vuelve a copiar el archivo generado, ejecuta `prepararHoja` y despliega una nueva versión de la aplicación web antes de publicar el portal actualizado. La función añade `ID de envío` al final de las dos pestañas de resultados. Se conservan las filas anteriores. Un segundo cuestionario del mismo estudio genera una fila con el mismo `ID de participación`, un nuevo `ID de envío` y sus propias fechas. Reintentar el mismo envío conserva el `ID de envío` y evita duplicar la fila.

El Observatorio agrega la primera respuesta válida de la versión actual por participante y por estudio, ordenada por fecha de recepción. Las demás participaciones siguen disponibles en Google Sheets para el análisis de repeticiones.

### Versiones 1.4 del Estudio 1 y 1.3 del Estudio 2

Los JSON actuales están en `datos/` y sus recursos multimedia en `datos/assets/`. Copia el último `AppsScript-Estudios.gs`, ejecuta `prepararHoja` y publica una nueva versión de la implementación web actual. En `Estudio_2`, la columna nueva `P03__o08` se añade a la derecha de las columnas existentes. Después ejecuta `publicarObservatorio` para publicar una instantánea de las versiones actuales. Las respuestas anteriores se conservan en la hoja con su versión.
