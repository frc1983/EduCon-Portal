import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {TipoEnsino} from '../models/tipoEnsino';
import {BaseService} from './base.service';

@Injectable()
export class TipoEnsinoService {
    constructor (private http: Http, private _baseService: BaseService) { }
    
    private _tipoEnsinoUrl = this._baseService.getUrl() + "v1/tiposEnsino/";
        
    getTiposEnsino() {
        return this.http.get(this._tipoEnsinoUrl)
            .map(obj => TipoEnsino.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getTipoEnsinoPorId(id: string) {
        return this.http.get(this._tipoEnsinoUrl + id)
            .map(obj => TipoEnsino.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}