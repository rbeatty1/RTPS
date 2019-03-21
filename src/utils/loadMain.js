import { Map } from '../modules/pages/map/map.js'
import { Accessibility } from '../modules/pages/accessibility/accessibility.js';
import { Home } from '../modules/pages/home/home.js';
import { Frequency } from '../modules/pages/frequency/frequency.js';
import { Reliability } from '../modules/pages/reliability/reliability.js';
import { headerRender, Header } from '../modules/header/header.js'
import { Footer } from '../modules/footer/footer.js'



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
    document.querySelector('object').onload = e =>{ 
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
  // check for tool/documentation page
  // NOTE: this is set up in case the documentation page is content that can be plugged into a pre-built HTML template. If it's just a PDF, then this check can be ignored
  if (type == 'tool'){
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
  }
  else if (type == 'documentation'){
    main.insertAdjacentHTML('afterbegin', `<h1>This will be the ${target} documentation page</h1>`)
  }
  else{
    new Home()
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