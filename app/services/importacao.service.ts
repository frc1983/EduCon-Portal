import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {Importacao} from '../models/importacao';
import {BaseService} from './base.service';

@Injectable()
export class ImportacaoService {
    constructor(private http: Http, private _baseService: BaseService) { }

    private _importacaoUrl = _baseService.getUrl() + "v1/importacoes/";

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

    putReprocessar(id: number) {
        console.log("Service")
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(this._importacaoUrl + "reprocessar", JSON.stringify(id), headers)
            .map(obj => Importacao.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    novaImportacao(ano: number) {
        console.log("Import", ano)
        var headers = new Headers();
        //headers.append('Content-Type', 'application/x-www-form-urlencoded');
        //headers.append('Access-Control-Request-Method', 'POST');
        //headers.append('Access-Control-Request-Headers', 'application/json');
        //let options = new RequestOptions({ headers: headers });
        return this.http.post(this._importacaoUrl + "nova", JSON.stringify(ano))
            .map(obj => Importacao.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}