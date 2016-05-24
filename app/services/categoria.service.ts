import { Injectable } from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import { Categoria } from '../models/categoria';
import { BaseService } from './base.service';

@Injectable()
export class CategoriaService {
    constructor (private http: Http, private _baseService: BaseService) { }
    
    private _categoriasUrl = "http://educon.apphb.com/api/categoria";
    
    getCategorias() {
            return this.http.get(this._categoriasUrl + "/Lista")
                .map(obj => Categoria.fromJSONArray(this._baseService.extractData(obj)))
                .catch(this._baseService.handleError);
    }
    
    getCategoriaPorNome(nome: string) {
        return this.http.get(this._categoriasUrl + "/ListaPorNome?nome=" + nome)
            .map(obj => Categoria.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getCategoriaPorId(id: string) {
        return this.http.get(this._categoriasUrl + "/ConsultaPorId?id=" + id)
            .map(obj => Categoria.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}