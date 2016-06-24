import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import {Importacao} from '../../models/importacao';
import {ImportacaoService} from '../../services/importacao.service';

import {MDL} from '../../MaterialDesignLiteUpgradeElement';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {DataTable} from 'primeng/primeng';
import {Column} from 'primeng/primeng';

@Component({
  selector: 'importacao',
  templateUrl: 'app/pages/importacao/importacao.component.html',
  styleUrls: ['app/pages/importacao/importacao.component.css'],
  providers: [ImportacaoService],
  directives: [MDL, DataTable, Column]
})

export class ImportacaoComponent implements OnInit {
    title = 'EduCon - Importação de Dados';

    importacoes: Array<Importacao>;
    errorMessage: string;
    isLoading: boolean = false;

    constructor(private router: Router, private _importacaoService: ImportacaoService) { }

    ngOnInit() {
        this.getImportacoes();
    }

    getImportacoes() {
        this.isLoading = true;
        this._importacaoService
            .getImportacoes()
            .subscribe(
            importacoes => {
                this.importacoes = importacoes;
                this.isLoading = false;
            },
            error => {
                this.errorMessage = <any>error;
                this.isLoading = false;
            }
            );
    }

    reprocessar(id :number) {
        console.log("ID", id);
    }
}