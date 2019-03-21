import './css/app.css'
import { SetNewURL } from './utils/routing';
import { LoadMain } from './utils/loadMain';


let app = document.createElement('main')
app.id = 'main'
document.querySelector('#app').appendChild(app)
SetNewURL()
// LoadMain()