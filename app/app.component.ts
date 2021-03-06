import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {bootstrap} from 'angular2/platform/browser';

import {HomeComponent} from './pages/home/home.component';
import {CompareComponent} from './pages/compare/compare.component';
import {ImportacaoComponent} from './pages/importacao/importacao.component';
import {OLAPComponent} from './pages/olap/olap.component';
import {SobreComponent} from './pages/sobre/sobre.component';

import {MunicipioComponent} from './pages/municipio/municipio.component';
import {MunicipioDetalhesComponent} from './pages/municipio/municipio-detalhes.component';

import {TipoEnsinoComponent} from './pages/tipoEnsino/tipoEnsino.component';
import {TipoEnsinoDetalhesComponent} from './pages/tipoEnsino/tipoEnsino-detalhes.component';

import {CategoriaComponent} from './pages/categoria/categoria.component';
import {CategoriaDetalhesComponent} from './pages/categoria/categoria-detalhes.component';

import { SharedService } from './services/shared.service';
import { DadoService } from './services/dado.service';

import {MDL} from './MaterialDesignLiteUpgradeElement';

@Component({
  selector: 'edu-con',
  templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES, MDL],
    providers: [SharedService, DadoService]
})
@RouteConfig([
  {
    path: '/home',
    name: 'Home',
    component: HomeComponent,
    useAsDefault: true
  },
  {
    path: '/compare',
    name: 'Compare',
    component: CompareComponent
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
    path: '/tipoEnsino',
    name: 'TipoEnsino',
    component: TipoEnsinoComponent
  },
  {
    path: '/tipoEnsino-detalhes/:id',
    name: 'TipoEnsino-Detalhes',
    component: TipoEnsinoDetalhesComponent
  },
  {
    path: '/categoria',
    name: 'Categoria',
    component: CategoriaComponent
  },
  {
    path: '/categoria-detalhes/:id',
    name: 'Categoria-Detalhes',
    component: CategoriaDetalhesComponent
  },
  {
    path: '/olap',
    name: 'Olap',
    component: OLAPComponent
  },
  {
    path: '/importacao',
    name: 'Importacao',
    component: ImportacaoComponent
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: SobreComponent
  }
])

export class AppComponent {
  title = 'EduCon - Educação Conectada';
  
  constructor(private _sharedService :SharedService,
              private _dadosService: DadoService){
      this._dadosService.loadFile()
  }  
}