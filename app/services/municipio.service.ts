import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {Municipio} from '../models/municipio';
import {BaseService} from './base.service';

@Injectable()
export class MunicipioService {
    constructor (private http: Http, private _baseService: BaseService) { }
    
    private _municipiosUrl = "http://educon.apphb.com/api/v1/municipios/";
    
    getMunicipios() {
        return this.http.get(this._municipiosUrl)
            .map(obj => Municipio.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
    
    getMunicipioPorId(id: string) {
        return this.http.get(this._municipiosUrl + id)
            .map(obj => Municipio.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getMunicipioPorNome(nome: string) {
        return this.http.get(this._municipiosUrl + "porNome/" + nome)
            .map(obj => Municipio.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}