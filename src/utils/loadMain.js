import { Map } from '../modules/pages/map/map.js'
import { Accessibility } from '../modules/pages/accessibility/accessibility.js';

const LoadMain = target =>{
  let main = document.querySelector('#main')
  main.innerHTML = ''
  switch(target){
    case 'Gap Analysis':
      new Map();
      break;
    case 'Accessibility':
      new Accessibility();
      break;
    default: 
      console.log('nah')
      break;
  }
}

export {LoadMain};