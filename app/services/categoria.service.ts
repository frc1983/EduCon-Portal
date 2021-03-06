import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {Categoria} from '../models/categoria';
import {BaseService} from './base.service';

@Injectable()
export class CategoriaService {
    constructor (private http: Http, private _baseService: BaseService) { }
    
    private _categoriasUrl = this._baseService.getUrl() + "v1/categorias/";
    
    getCategorias() {
        return this.http.get(this._categoriasUrl + "/categorias")
            .map(obj => Categoria.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getCategoriaPorId(id: string) {
        return this.http.get(this._categoriasUrl + id)
            .map(obj => Categoria.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getSubCategorias() {
        return this.http.get(this._categoriasUrl + "/subcategorias")
            .map(obj => Categoria.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}