import './css/app.css'
import { SetNewURL } from './utils/routing';
import Promise from 'promise-polyfill';

// fetch polyfil for IE introduces promises, so include them here
if(!window.Promise) window.Promise = Promise


let app = document.createElement('main')
app.id = 'main'
document.querySelector('#app').appendChild(app)
SetNewURL()
