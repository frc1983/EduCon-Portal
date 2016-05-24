import {Component} from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {bootstrap} from 'angular2/platform/browser';

import { HomeComponent } from './pages/home/home.component';
import { BuscaComponent } from './pages/busca/busca.component';
import { MunicipioComponent } from './pages/municipio/municipio.component';
import { OLAPComponent } from './pages/olap/olap.component';
import { MunicipioDetalhesComponent } from './pages/municipio/municipio-detalhes.component';
import { MDL } from './MaterialDesignLiteUpgradeElement';

@Component({
  selector: 'edu-con',
  templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES, MDL],
    providers: []
})
@RouteConfig([
  {
    path: '/home',
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
  },
  {
      path: '/municipio-detalhes/:id',
      name: 'Municipio-Detalhes',
      component: MunicipioDetalhesComponent
  },
  {
      path: '/olap',
      name: 'Olap',
      component: OLAPComponent
  }
])
export class AppComponent {
  title = 'EduCon - Educação Conectada';
}