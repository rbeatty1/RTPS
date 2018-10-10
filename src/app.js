import {headerRender} from './modules/header/header';
import {HeaderElements} from "./modules/header/HeaderElements";
import {Footer} from './modules/footer/footer';
import './css/app.css'

headerRender(HeaderElements);
let app = document.createElement('div')
app.id = 'main'
document.querySelector('#app').appendChild(app)
new Footer();
