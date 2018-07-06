import {headerRender} from './modules/header/header';
import {HeaderElements} from "./modules/header/HeaderElements";
import {mapRender} from './modules/map/map'
import {footerRender} from './modules/footer/footer';
import './css/app.css'


headerRender(HeaderElements);
mapRender();
footerRender();
