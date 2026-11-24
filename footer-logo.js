/* Mostrar el gráfico oficial cuando se haya cargado; de lo contrario mantener el rótulo GRIHO. */
(()=>{'use strict';
 for(const img of document.querySelectorAll('.griho-logo-wrap img')){
  const show=()=>{if(img.naturalWidth>0)img.classList.add('is-loaded');};
  if(img.complete)show();else img.addEventListener('load',show,{once:true});
 }
})();
