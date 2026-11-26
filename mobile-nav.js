/* Indica la sección activa en los menús del portal. */
(() => {
 'use strict';

 function init() {
  const links = document.querySelectorAll('[data-site-item], [data-mobile-item]');
  const page = location.pathname.split('/').pop() || 'index.html';
  const sections = {
   'index.html': 'inicio',
   'estudios.html': 'estudios',
   'participa.html': 'estudios',
   'participa-estudios.html': 'estudios',
   'observatorios.html': 'observatorios',
   'observatorio.html': 'observatorios',
   'observatorio-estudios.html': 'observatorios',
   'observatorio-estudio-1.html': 'observatorios',
   'observatorio-estudio-2.html': 'observatorios',
   'observatorio-destacados.html': 'observatorios',
   'sobre-el-proyecto.html': 'proyecto'
  };

  const landing = document.querySelector('.home #inicio') !== null;
  function update() {
   const fragment = location.hash.slice(1);
   const sectionLink = landing && ['estudios','observatorios','proyecto'].includes(fragment);
   const current = sectionLink ? fragment : sections[page];
   const currentType = sectionLink || !['inicio',undefined].includes(current) ? 'location' : 'page';
   for (const link of links) {
    const item = link.dataset.siteItem || link.dataset.mobileItem;
    if (item === current) link.setAttribute('aria-current', currentType);
    else link.removeAttribute('aria-current');
   }
  }

  if (landing) {
   const header = document.querySelector('.site-header');
   const stickyLayout = matchMedia('(min-width: 1025px)');
   const updateAnchorOffset = () => {
    const height = stickyLayout.matches ? header.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty('--home-sticky-header', height+'px');
   };
   updateAnchorOffset();
   new ResizeObserver(updateAnchorOffset).observe(header);
   stickyLayout.addEventListener('change',updateAnchorOffset);
   window.addEventListener('hashchange',update);
  }
  update();
 }

 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
 else init();
})();
