import { Injectable } from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import { Municipio } from '../models/municipio';
import { BaseService } from './base.service';

@Injectable()
export class MunicipioService {
    
    constructor (private http: Http, private _baseService: BaseService) { }
    
    private _municipiosUrl = 'http://private-bd331-educon.apiary-mock.com/municipios';  // URL to web api
    
    getMunicipios() {
            return this.http.get(this._municipiosUrl)
                .map(obj => Municipio.fromJSONArray(this._baseService.extractData(obj)))
                .catch(this._baseService.handleError);
    }
    
    getMunicipioPorNome(nome: string) {
        let body = JSON.stringify({ nome });
        let options = this._baseService.getHeaders();
        
        return this.http.post(this._municipiosUrl, body, options)
            .map(obj => Municipio.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}