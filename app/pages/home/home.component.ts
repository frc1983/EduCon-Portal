import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Pesquisa } from '../../models/pesquisa';
import { PesquisaService } from '../../services/pesquisa.service';

import { Fonte } from '../../models/fonte';
import { Municipio } from '../../models/municipio';
import { TipoEnsino } from '../../models/tipoEnsino';
import { Categoria } from '../../models/categoria';

import {MDL} from '../../MaterialDesignLiteUpgradeElement';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {DataTable} from 'primeng/primeng';
import {Column} from 'primeng/primeng';

@Component({
  selector: 'home',
  templateUrl: 'app/pages/home/home.component.html',
  styleUrls: ['app/pages/home/home.component.css'],
  providers: [PesquisaService],
  directives: [MDL, DataTable, Column]
})

export class HomeComponent implements OnInit {
  resultadoPesquisa: Pesquisa;
  errorMessage: string;
  isLoading: boolean = false;

  constructor(private router: Router, private _pesquisaService: PesquisaService) { }

  ngOnInit() { }

  pesquisa(nome: string) {
    if (!nome) {
      return;
    }

    this.isLoading = true;
    this._pesquisaService
      .pesquisaGeral(nome)
      .subscribe(
        resultado => {
          this.resultadoPesquisa = resultado;
          this.isLoading = false;
        },
        error => {
          this.errorMessage = <any>error;
          this.isLoading = false;
        }
      );
  }

  onNavigate(tipo, id) {
    switch (tipo) {
      case "Fonte":
        this.router.navigate(['/Fonte-Detalhes', { id: id }])
        break;
        case "Municipio":
        this.router.navigate(['/Municipio-Detalhes', { id: id }])
        break;
        case "Categoria":
        this.router.navigate(['/Categoria-Detalhes', { id: id }])
        break;
        case "TipoEnsino":
        this.router.navigate(['/TipoEnsino-Detalhes', { id: id }])
        break;
    
      default:
        break;
    }
  }
}