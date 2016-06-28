import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {TipoEnsino} from '../../models/tipoEnsino';
import {TipoEnsinoService} from '../../services/tipoEnsino.service';

import {MDL} from '../../MaterialDesignLiteUpgradeElement';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {DataTable} from 'primeng/primeng';
import {Column} from 'primeng/primeng';

@Component({
  selector: 'tipoEnsino',
  templateUrl: 'app/pages/tipoEnsino/tipoEnsino.component.html',
  styleUrls: ['app/pages/tipoEnsino/tipoEnsino.component.css'],
  providers: [TipoEnsinoService],
  directives: [MDL, DataTable, Column]
})

export class TipoEnsinoComponent implements OnInit {
  tiposEnsino: Array<TipoEnsino>;
  errorMessage: string;
  isLoading: boolean = false;

  constructor(private router: Router, private _tipoEnsinoService: TipoEnsinoService) { }

  ngOnInit() {
    this.getTiposEnsino();
  }

  getTiposEnsino() {
    this.isLoading = true;
    this._tipoEnsinoService
      .getTiposEnsino()
      .subscribe(
        tiposEnsino => {
          this.tiposEnsino = tiposEnsino;
          this.isLoading = false;
        },
        error => {
          this.errorMessage = <any>error;
          this.isLoading = false;
        }
      );
  }

  onNavigate(id) {
    this.router.navigate(['/TipoEnsino-Detalhes', { id: id }])
  }
}