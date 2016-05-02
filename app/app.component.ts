import {Component} from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {bootstrap} from 'angular2/platform/browser';

import { HomeComponent } from './pages/home/home.component';
import { BuscaComponent } from './pages/busca/busca.component';
import { MunicipioComponent } from './pages/municipio/municipio.component';

@Component({
  selector: 'edu-con',
  templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
@RouteConfig([
  {
    path: '/',
    name: 'Home',
    component: HomeComponent,
    useAsDefault: true
  },{
    path: '/busca',
    name: 'Busca',
    component: BuscaComponent
  },
  {
    path: '/municipio',
    name: 'Municipio',
    component: MunicipioComponent
  }
])
export class AppComponent {
  title = 'EduCon - Educação Conectada';
}