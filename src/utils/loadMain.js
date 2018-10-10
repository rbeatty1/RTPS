import { Map } from '../modules/map/map.js'

const LoadMain = target =>{
  let main = document.querySelector('#main')
  main.innerHTML = ''
  switch(target){
    case 'Gap Analysis':
      new Map();
      break;
    default: 
      console.log('nah')
      break;
  }
}

export {LoadMain};