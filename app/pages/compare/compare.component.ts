import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams, Router } from 'angular2/router';

import { Municipio } from '../../models/municipio';
import { MunicipioService } from '../../services/municipio.service';

import { Categoria } from '../../models/categoria';
import { TipoEnsino } from '../../models/tipoEnsino';
import { Dado } from '../../models/dado';
import { Data } from '../../models/data';

import { CategoriaService } from '../../services/categoria.service';
import { TipoEnsinoService } from '../../services/tipoEnsino.service';
import { DadoService } from '../../services/dado.service';
import { DataService } from '../../services/data.service';

import { MDL } from '../../MaterialDesignLiteUpgradeElement';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {LineChart, Checkbox} from 'primeng/primeng';

@Component({
  selector: 'compare',
  templateUrl: 'app/pages/compare/compare.component.html',
  styleUrls: ['app/pages/compare/compare.component.css'],
  providers: [MunicipioService, CategoriaService, TipoEnsinoService, DadoService, DataService],
  directives: [ROUTER_DIRECTIVES, MDL, ANGULAR2_GOOGLE_MAPS_DIRECTIVES, LineChart, Checkbox]
})

export class CompareComponent implements OnInit {
  zoom: number = 14;
  isLoading: boolean = false;
  errorMessage: string;
  municipio1: Municipio;
  municipio2: Municipio;
  markers: {
    lat: number;
    lng: number;
    label?: string;
  }[];
  markers2: {
    lat: number;
    lng: number;
    label?: string;
  }[];

  public tabelaDados1: any;
  public tabelaDados2: any;

  public listMunicipios = [];
  public query = '';
  public filteredList = [];
  public query1 = '';
  public filteredList1 = [];
  public queryAno = '';
  public queryTipoEnsino = '';
  public queryCategoria = '';

  listAno: Array<Data>;
  listTipoEnsino: Array<TipoEnsino>;
  listCategoria: Array<Categoria>;
  listSubCategoria: Array<Categoria>;
  listDados: Array<Dado>;

  filteredListAno: Array<Data>;
  filteredListTipoEnsino: Array<TipoEnsino>;
  filteredListCategoria: Array<Categoria>;
  filteredListDados: Array<Dado>;

  dadosMunicipio1: Array<Dado>;
  dadosMunicipio2: Array<Dado>;

  constructor(params: RouteParams,
    private _municipioService: MunicipioService,
    private _categoriaService: CategoriaService,
    private _tipoEnsinoService: TipoEnsinoService,
    private _dadosService: DadoService,
    private _dataService: DataService) {
    this.markers = new Array();
    this.markers2 = new Array();
    this.listAno = new Array();
    this.listTipoEnsino = new Array();
    this.listCategoria = new Array();
    this.listSubCategoria = new Array();
    this.listDados = new Array();

    this.filteredListAno = new Array();
    this.filteredListTipoEnsino = new Array();
    this.filteredListCategoria = new Array();
    this.filteredListDados = new Array();
  }

  ngOnInit() {
    this.getListaMunicipios();
    this.getListaAnos();
    this.getListaTiposEnsino();
    this.getListaCategorias();
    this.getListaSubCategorias();
  }

  getListaMunicipios() {
    this._municipioService
      .getMunicipios()
      .subscribe(
      municipios => {
        this.listMunicipios = municipios;
      },
      error => {
        this.errorMessage = <any>error;
      }
      );
  }

  getListaAnos() {
    this._dataService
      .getAnos()
      .subscribe(
      anos => {
        this.listAno = anos;
      },
      error => {
        this.errorMessage = <any>error;
      }
      );
  }

  getListaTiposEnsino() {
    this._tipoEnsinoService
      .getTiposEnsino()
      .subscribe(
      tipos => {
        this.listTipoEnsino = tipos;
      },
      error => {
        this.errorMessage = <any>error;
      }
      );
  }

  getListaCategorias() {
    this._categoriaService
      .getCategorias()
      .subscribe(
      categorias => {
        this.listCategoria = categorias;
      },
      error => {
        this.errorMessage = <any>error;
      }
      );
  }

  getListaSubCategorias() {
    this._categoriaService
      .getSubCategorias()
      .subscribe(
      categorias => {
        this.listSubCategoria = categorias;
      },
      error => {
        this.errorMessage = <any>error;
      }
      );
  }

  getMunicipio1(nome: string) {
    this.errorMessage = "";
    this.markers = [];
    this.getMunicipio(nome).then((result: Municipio) => {
      this.municipio1 = result;
      this.markers.push({ lat: parseFloat(this.municipio1.latitude), lng: parseFloat(this.municipio1.longitude) });
    });
  }

  getMunicipio2(nome: string) {
    this.errorMessage = "";
    this.markers2 = [];
    this.getMunicipio(nome).then((result: Municipio) => {
      this.municipio2 = result;
      this.markers2.push({ lat: parseFloat(this.municipio2.latitude), lng: parseFloat(this.municipio2.longitude) })
    });
  }

  getMunicipio(nome: string): Promise<Municipio> {
    var retorno: Municipio;
    if (!nome) {
      return;
    }

    this.isLoading = true;
    return new Promise<Municipio>((resolve, reject) => {
      /*this._municipioService
        .getMunicipioPorNome(nome)
        .subscribe(
        municipios => {
          this.isLoading = false;
          resolve(municipios);
        },
        error => {
          this.errorMessage = <any>error;
          this.isLoading = false;
          reject(null);
        }
        );*/
        this.listMunicipios.forEach(mun =>{
          if(mun.nome.toLowerCase() == nome.toLowerCase()){
            resolve(mun);
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        });
    });
  }

  filter() {
    if (this.query !== "") {
      this.filteredList = this.listMunicipios.filter(function (el) {
        return el.nome.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
    } else {
      this.filteredList = [];
    }
  }

  select(item) {
    this.query = item;
    this.filteredList = [];
  }

  filter1() {
    if (this.query1 !== "") {
      this.filteredList1 = this.listMunicipios.filter(function (el) {
        return el.nome.toLowerCase().indexOf(this.query1.toLowerCase()) > -1;
      }.bind(this));
    } else {
      this.filteredList1 = [];
    }
  }

  select1(item) {
    this.query1 = item;
    this.filteredList1 = [];
  }

  filterAno() {
    if (this.queryAno !== "") {
      this.filteredListAno = this.listAno.filter(function (el) {
        return el.ano.toString().indexOf(this.queryAno) > -1;
      }.bind(this));
    } else {
      this.filteredListAno = [];
    }
  }

  selectAno(item) {
    this.queryAno = item;
    this.filteredListAno = [];
  }

  filterTipoEnsino() {
    if (this.queryTipoEnsino !== "") {
      this.filteredListTipoEnsino = this.listTipoEnsino.filter(function (el) {
        return el.nome.toLowerCase().indexOf(this.queryTipoEnsino.toLowerCase()) > -1;
      }.bind(this));
    } else {
      this.filteredListTipoEnsino = [];
    }
  }

  selectTipoEnsino(item) {
    this.queryTipoEnsino = item;
    this.filteredListTipoEnsino = [];
  }

  filterCategoria() {
    if (this.queryCategoria !== "") {
      this.filteredListCategoria = this.listCategoria.filter(function (el) {
        return el.nome.toLowerCase().indexOf(this.queryCategoria.toLowerCase()) > -1;
      }.bind(this));
    } else {
      this.filteredListCategoria = [];
    }
  }

  selectCategoria(item) {
    this.queryCategoria = item;
    this.filteredListCategoria = [];
  }

  buscarDados(ano, tipoEnsino, categoria) {
    this.errorMessage = "";
    if (ano == "" || tipoEnsino == "" || categoria == "") {
      this.errorMessage = "Todos os campos de filtros devem ser preenchidos.";
      return;
    }

    let idAno, idTipoEnsino, idCategoria;
    idCategoria = this.listCategoria.filter(function (el) {
      let index = el.nome.toLowerCase().indexOf(categoria.toLowerCase());
      if (index > -1) {
        return el.id;
      } else {
        return "";
      }
    });

    idTipoEnsino = this.listTipoEnsino.filter(function (el) {
      let index = el.nome.toLowerCase().indexOf(tipoEnsino.toLowerCase());
      if (index > -1) {
        return el.id;
      } else {
        return "";
      }
    });

    idAno = this.listAno.filter(function (el) {
      let index = el.ano.toString().indexOf(ano);
      if (index > -1) {
        return el.id;
      } else {
        return "";
      }
    });

    if (idAno.length == 0 || idTipoEnsino.length == 0 || idCategoria.length == 0) {
      this.errorMessage = "Campos de filtros são inválidos.";
      return;
    }

    if (this.municipio1 == undefined || this.municipio2 == undefined) {
      this.errorMessage = "Municípios devem ser selecionados.";
      return;
    }

    this.obterDados(idCategoria[0].id.toString(), idTipoEnsino[0].id.toString(), idAno[0].id.toString());
  }

  obterDados(idCategoria, idTipoEnsino, idAno) {
    this.isLoading = true;
    Observable.forkJoin(
      this.obterDadosMunicipio(this.municipio1.id.toString(), idCategoria, idTipoEnsino, idAno),
      this.obterDadosMunicipio(this.municipio2.id.toString(), idCategoria, idTipoEnsino, idAno)
    ).subscribe(
      data => {
        this.isLoading = false;
        console.log(data),
          this.dadosMunicipio1 = data[0],          
          this.dadosMunicipio2 = data[1],
          this.tabelaDados1 = this.parseTabelaDados(this.dadosMunicipio1)[0],
          this.tabelaDados2 = this.parseTabelaDados(this.dadosMunicipio2)[0]
        
      },
      err => {
        console.log(err)
        this.isLoading = false;
      });
  }

  obterDadosMunicipio(idMunicipio, idCategoria, idTipoEnsino, idAno): Promise<Dado> {
    return new Promise<Dado>((resolve, reject) => {
      this._dadosService
        .getDadoPorMunicipioTipoCategoriaAno(idMunicipio.toString(), idTipoEnsino, idCategoria, idAno)
        .subscribe(
        dado => {
          resolve(dado)
        },
        error => {
          this.errorMessage = <any>error;
          reject(null)
        });
    })
  }

  parseTabelaDados(dadosMunicipio) {
    let dadosTabela = [];
    let valor = [];

    let categoria = this.findNome(this.listCategoria, dadosMunicipio[0].idCategoria);
    let ano = this.findData(this.listAno, dadosMunicipio[0].idData);
    let municipio = this.findNome(this.listMunicipios, dadosMunicipio[0].idMunicipio);
    let tipo = this.findNome(this.listTipoEnsino, dadosMunicipio[0].idTipoEnsino);

    dadosMunicipio.forEach(element => {
      let sub = this.findNome(this.listSubCategoria, element.idSubcategoria);
      valor.push({
        "Subcategoria": sub,
        "Valor": element.valor
      })
    });

    dadosTabela.push({
      "Categoria": categoria,
      "Data": ano,
      "Municipio": municipio,
      "TipoEnsino": tipo,
      "Subcategoria": valor
    })

    return dadosTabela;
  }

  findNome(array, id) {
    let finded;
    array.forEach(element => {
      if (element.id == id) {
        finded = element.nome;
      }
    });

    return finded;
  }

  findData(array, id) {
    let finded;
    array.forEach(element => {
      if (element.id == id) {
        finded = element.ano.toString();
      }
    });

    return finded;
  }
}