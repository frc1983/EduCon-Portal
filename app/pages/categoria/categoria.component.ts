import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {Categoria} from '../../models/categoria';
import {CategoriaService} from '../../services/categoria.service';

import {MDL} from '../../MaterialDesignLiteUpgradeElement';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {DataTable} from 'primeng/primeng';
import {Column} from 'primeng/primeng';

@Component({
  selector: 'categoria',
  templateUrl: 'app/pages/categoria/categoria.component.html',
  styleUrls: ['app/pages/categoria/categoria.component.css'],
  providers: [CategoriaService],
  directives: [MDL, DataTable, Column]
})

export class CategoriaComponent implements OnInit {
  categorias: Array<Categoria>;
  errorMessage: string;
  isLoading: boolean = false;

  constructor(private router: Router, private _categoriaService: CategoriaService) { }

  ngOnInit() {
    this.getCategorias();
  }

  getCategorias() {
    this.isLoading = true;
    this._categoriaService
      .getCategorias()
      .subscribe(
        categorias => {
          this.categorias = categorias;
          this.isLoading = false;
        },
        error => {
          this.errorMessage = <any>error;
          this.isLoading = false;
        }
      );
  }

  onNavigate(id) {
    debugger;
    this.router.navigate(['/Categoria-Detalhes', { id: id }])
  }
}