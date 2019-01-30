import {headerRender} from './modules/header/header';
import {HeaderElements} from "./modules/header/HeaderElements";
import {Footer} from './modules/footer/footer';
import './css/app.css'
import {LoadMain} from './utils/loadMain';

headerRender(HeaderElements);
let app = document.createElement('main')
app.id = 'main'
document.querySelector('#app').appendChild(app)
LoadMain()
new Footer();
