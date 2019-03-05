import { Map } from '../modules/pages/map/map.js'
import { Accessibility } from '../modules/pages/accessibility/accessibility.js';
import { Home } from '../modules/pages/home/home.js';
import { Frequency } from '../modules/pages/frequency/frequency.js';
import { Reliability } from '../modules/pages/reliability/reliability.js';



const ChangeLogo = section =>{
  const colors = {
    gap : "#8bb234",
    reliability: "#e89234",
    frequency: "#d8c72e",
    accessibility: "#06bf9c"
  }

  // does the logo exist?
  if (!document.querySelector('object').contentDocument.querySelector('.logo-fill')) {
    // wait for it to load
    document.querySelector('object').onload = e =>{ 
      let fillElements = document.querySelector('object').contentDocument.querySelectorAll('.logo-fill')
      if (colors[section]) for (let elem of fillElements) elem.setAttribute('fill', colors[section])
      else for (let elem of fillElements) elem.setAttribute('fill', '#6d6e71')
    }
  }
  // just go ahead and do it
  else{
    let fillElements = document.querySelector('object').contentDocument.querySelectorAll('.logo-fill')
    if (colors[section]) for (let elem of fillElements) elem.setAttribute('fill', colors[section])
    else for (let elem of fillElements) elem.setAttribute('fill', '#6d6e71')
  }
}


const LoadMain = target =>{
  let main = document.querySelector('main')
  main.innerHTML = ''
  target = target != undefined ? target.toLowerCase() : undefined
  switch(target){
    case 'gap':
      new Map();
      ChangeLogo(target)
      break;
    case 'accessibility':
      new Accessibility();
      ChangeLogo(target)
      break;
    case 'frequency':
      new Frequency();
      ChangeLogo(target)
      break;
    case 'reliability':
      new Reliability();
      ChangeLogo(target)
      break;
    default: 
      new Home();
      ChangeLogo(target)
      break;
  }
  document.querySelector(`[data-tool="${target}"]`).classList.add('active')
}

export {LoadMain, ChangeLogo};