import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {Dado} from '../models/dado';
import {BaseService} from './base.service';

@Injectable()
export class DadoService {
    constructor (private http: Http, private _baseService: BaseService) { }
    
    private _dadosUrl = this._baseService.getUrl() + "v1/dados/";
    
    getDados() {
        return this.http.get(this._dadosUrl)
            .map(obj => Dado.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
    
    getDadoPorId(id: string) {
        return this.http.get(this._dadosUrl + id)
            .map(obj => Dado.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getDadoPorMunicipioTipoCategoria(municipioId: string, tipoEnsinoId: string, categoriaId: string) {
        return this.http.get(this._dadosUrl + "?dto.idMunicipio=" + municipioId + "&dto.idTipoEnsino=" + tipoEnsinoId + "&dto.idCategoria=" + categoriaId)
            .map(obj => Dado.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getDadoPorMunicipio(municipioId: string) {
        return this.http.get(this._dadosUrl + "?dto.idMunicipio=" + municipioId)
            .map(obj => Dado.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}