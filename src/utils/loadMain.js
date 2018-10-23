import { Map } from '../modules/pages/map/map.js'
import { Accessibility } from '../modules/pages/accessibility/accessibility.js';
import { Home } from '../modules/pages/home/home.js';
import { ComingSoon } from '../modules/pages/soon/soon.js';


const LoadMain = target =>{
  let main = document.querySelector('#main')
  main.innerHTML = ''
  switch(target){
    case 'Gap':
      new Map();
      break;
    case 'Accessibility':
      new Accessibility();
      break;
    case 'Frequency':
      console.log('frequency page');
      new ComingSoon();
      break;
    case 'Reliability':
      console.log('reliability page')
      new ComingSoon();
      break;
    default: 
      new Home();
      break;
  }
}

export {LoadMain};