import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {Importacao} from '../models/importacao';
import {BaseService} from './base.service';

@Injectable()
export class ImportacaoService {
    constructor(private http: Http, private _baseService: BaseService) { }

    private _importacaoUrl = "http://educon.apphb.com/api/v1/Importacao/";

    getImportacoes() {
        return this.http.get(this._importacaoUrl)
            .map(obj => Importacao.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getImportacaoPorId(id: string) {
        return this.http.get(this._importacaoUrl + id)
            .map(obj => Importacao.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    putReprocessarPorId(id: string) {
        return this.http.put(this._importacaoUrl + id)
            .map(obj => Importacao.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}