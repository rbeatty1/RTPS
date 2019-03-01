import { Map } from '../modules/pages/map/map.js'
import { Accessibility } from '../modules/pages/accessibility/accessibility.js';
import { Home } from '../modules/pages/home/home.js';
import { Frequency } from '../modules/pages/frequency/frequency.js';
import { Reliability } from '../modules/pages/reliability/reliability.js';


const LoadMain = target =>{
  let main = document.querySelector('main')
  main.innerHTML = ''
  console.log(target)
  switch(target){
    case 'gap':
      new Map();
      break;
    case 'accessibility':
      new Accessibility();
      break;
    case 'frequency':
      new Frequency();
      break;
    case 'reliability':
      new Reliability();
      break;
    default: 
      new Home();
      break;
  }
}

export {LoadMain};