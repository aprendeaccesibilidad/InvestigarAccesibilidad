/* Indica la página activa en la navegación inferior. */
(() => {
 'use strict';

 function init() {
  const nav = document.querySelector('.mobile-bottom-nav');
  if (!nav) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  const sections = {
   'index.html': 'inicio',
   'participa.html': 'participacion',
   'observatorio.html': 'observatorio',
   'observatorio-detallado.html': 'observatorio',
   'sobre-el-proyecto.html': 'proyecto'
  };
  const current = sections[page];
  const currentType = page === 'observatorio-detallado.html' ? 'location' : 'page';
  for (const link of nav.querySelectorAll('[data-mobile-item]')) {
   if (link.dataset.mobileItem === current) link.setAttribute('aria-current', currentType);
   else link.removeAttribute('aria-current');
  }
 }

 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
 else init();
})();
