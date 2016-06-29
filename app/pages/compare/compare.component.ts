import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams, Router } from 'angular2/router';

import { Municipio } from '../../models/municipio';
import { MunicipioService } from '../../services/municipio.service';

import { MDL } from '../../MaterialDesignLiteUpgradeElement';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {LineChart, Checkbox} from 'primeng/primeng';

@Component({
  selector: 'compare',
  templateUrl: 'app/pages/compare/compare.component.html',
  styleUrls: ['app/pages/compare/compare.component.css'],
  providers: [MunicipioService],
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

  public listMunicipios = [];
  public query = '';
  public filteredList = [];
  public query1 = '';
  public filteredList1 = [];

  constructor(params: RouteParams, private _municipioService: MunicipioService) {
    this.markers = new Array();
    this.markers2 = new Array();

  }

  ngOnInit() {
    this._municipioService
        .getMunicipios()
        .subscribe(
        municipios => {
          this.isLoading = false;
          this.listMunicipios = municipios;
        },
        error => {
          this.errorMessage = <any>error;
          this.isLoading = false;
        }
        );
  }

  getMunicipio1(nome: string) {
    this.markers = [];
    this.getMunicipio(nome).then((result: Municipio) => {
      this.municipio1 = result[0];
      this.markers.push({ lat: parseFloat(this.municipio1.latitude), lng: parseFloat(this.municipio1.longitude) });
    });
  }

  getMunicipio2(nome: string) {
    this.markers2 = [];
    this.getMunicipio(nome).then((result: Municipio) => {
      this.municipio2 = result[0];
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
      this._municipioService
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
        );
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
}