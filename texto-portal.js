/* Resalta la expresión de marca sin interpretar el texto como HTML. */
window.escribirTextoDelPortal = (container, text) => {
 const parts = text.split(/(\baccesibilidad digital\b)/gi);
 if (parts.length === 1) {
  container.textContent = text;
  return;
 }
 container.replaceChildren(...parts.map((part, index) => {
  if (index % 2 === 0) return document.createTextNode(part);
  const accent = document.createElement('span');
  accent.className = 'brand-accent';
  accent.textContent = part;
  return accent;
 }));
};
