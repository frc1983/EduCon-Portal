import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {Pesquisa} from '../models/pesquisa';
import {BaseService} from './base.service';

@Injectable()
export class PesquisaService {
    constructor (private http: Http, private _baseService: BaseService) { }
    
    private _pesquisaUrl = this._baseService.getUrl() + "v1/pesquisa/";
        
    pesquisaGeral(termo) {
        return this.http.get(this._pesquisaUrl + "?texto=" + termo)
            .map(obj => Pesquisa.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}