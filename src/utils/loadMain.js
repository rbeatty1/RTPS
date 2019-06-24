import { Map } from '../modules/pages/map/map.js'
import { Accessibility } from '../modules/pages/accessibility/accessibility.js';
import { Home } from '../modules/pages/home/home.js';
import { Frequency } from '../modules/pages/frequency/frequency.js';
import { Reliability } from '../modules/pages/reliability/reliability.js';
import { Header } from '../modules/header/header.js'
import { Footer } from '../modules/footer/footer.js'
import { SetNewURL } from './routing.js';



const ChangeLogo = section =>{
  const colors = {
    gap : "#8bb234",
    reliability: "#e89234",
    frequency: "#d8c72e",
    accessibility: "#06bf9c"
  }

  // does the logo exist?
  if (!document.querySelector('.logo-fill')) {
    // wait for it to load
    document.querySelector('svg').onload = e =>{ 
      let fillElements = document.querySelectorAll('.logo-fill')
      if (colors[section]) for (let elem of fillElements) elem.setAttribute('fill', colors[section])
      else for (let elem of fillElements) elem.setAttribute('fill', '#6d6e71')
    }
  }
  // just go ahead and do it
  else{
    let fillElements = document.querySelectorAll('.logo-fill')
    if (colors[section]) for (let elem of fillElements) elem.setAttribute('fill', colors[section])
    else for (let elem of fillElements) elem.setAttribute('fill', '#6d6e71')
  }
}


const LoadMain = (target, type) =>{
  let main = document.querySelector('main')
  main.innerHTML = ''
  target = target != undefined ? target.toLowerCase() : undefined
  if (!document.querySelector('header')) new Header();  

  // determine which page to build
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
    // @TODO: fix SetNewURL to update invalid routes to '/' or remove it b/c invalid routes will be handled by our main page anyways
    case 'error':
      alert('invalid request for ' + location.href + '. Rerouting to home')
      SetNewURL(false)
      break;
    default:
      new Home();
      ChangeLogo(target)
  }

  let link = document.querySelector(`[data-tool="${target}"]`),
    descriptor = document.getElementById('page-title')
  
  if (link){
    link.classList.add('active')
    descriptor.innerText = link.getAttribute('data-name')
    link.style.boxShadow = `0 0 10px ${link.style.background}`
  }
  
  if (!document.querySelector('footer')) new Footer();

}

export {LoadMain, ChangeLogo};