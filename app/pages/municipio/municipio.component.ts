import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Municipio } from '../../models/municipio';
import { MunicipioService } from '../../services/municipio.service';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'municipio',
  templateUrl: 'app/pages/municipio/municipio.component.html',
  styleUrls: ['app/pages/municipio/municipio.component.css'],
  providers: [MunicipioService]
})

export class MunicipioComponent implements OnInit {
    municipios: Array<Municipio>;
    errorMessage: string;
    isLoading: boolean = false;
    
    constructor(private _municipioService: MunicipioService) { }
      
      ngOnInit() {
        this.getMunicipios();
      }
      
      getMunicipios() {        
        this.isLoading = true;
        this._municipioService
        .getMunicipios()
        .subscribe(
          municipios => { 
            this.municipios = municipios;
            this.isLoading = false;
          },
          error => {
            this.errorMessage = <any>error;
            this.isLoading = false;
          });  
      }
      
      getMunicipio(nome: string) {   
        if (!nome) {return;}  
           
        this.isLoading = true;
        this._municipioService
        .getMunicipioPorNome(nome)
        .subscribe(
          municipios => { 
            this.municipios = municipios;
            this.isLoading = false;
          },
          error => {
            this.errorMessage = <any>error;
            this.isLoading = false;
          });  
      }
}