import { Map } from '../modules/pages/map/map.js'
import { Accessibility } from '../modules/pages/accessibility/accessibility.js';
import { Home } from '../modules/pages/home/home.js';
import { Frequency } from '../modules/pages/frequency/frequency.js';
import { Reliability } from '../modules/pages/reliability/reliability.js';


const LoadMain = target =>{
  let main = document.querySelector('main')
  main.innerHTML = ''
  switch(target){
    case 'Gap':
      new Map();
      break;
    case 'Accessibility':
      new Accessibility();
      break;
    case 'Frequency':
      new Frequency();
      break;
    case 'Reliability':
      new Reliability();
      break;
    default: 
      new Home();
      break;
  }
}

export {LoadMain};