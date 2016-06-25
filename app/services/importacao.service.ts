import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {Importacao} from '../models/importacao';
import {BaseService} from './base.service';

@Injectable()
export class ImportacaoService {
    constructor(private http: Http, private _baseService: BaseService) { }

    private _importacaoUrl = this._baseService.getUrl() + "v1/importacoes/";

    getImportacoes() {
        
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://localhost:58436');
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._importacaoUrl, options)
            .map(obj => Importacao.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getImportacaoPorId(id: string) {
        return this.http.get(this._importacaoUrl + id)
            .map(obj => Importacao.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    putReprocessar(id: string) {
        return this.http.put(this._importacaoUrl + "reprocessar/" + id, id)
            .map(obj => Importacao.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    novaImportacao(ano: string) {
        return this.http.post(this._importacaoUrl + "nova/" + ano, ano)
            .map(obj => Importacao.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}