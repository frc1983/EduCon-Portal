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
  
    constructor(params: RouteParams, private _municipioService: MunicipioService){
      this.markers = new Array();
      this.markers2 = new Array();
    }
        
    getMunicipio1(nome: string){      
      this.getMunicipio(nome).then((result: Municipio) => {
        this.municipio1 = result;
        this.markers.push({ lat: parseFloat(result.latitude), lng: parseFloat(result.longitude)});
      });
    }
    
    getMunicipio2(nome: string){      
      this.getMunicipio(nome).then((result: Municipio) => {
          this.municipio2 = result;
          this.markers2.push({ lat: parseFloat(result.latitude), lng: parseFloat(result.longitude)})
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
        .getMunicipioPorId(nome)
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
}