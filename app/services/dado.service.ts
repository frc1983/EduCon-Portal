import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Rx';
import {Dado} from '../models/dado';
import { SharedService } from './shared.service';

@Injectable()
export class DadoService {
    private jsonOlap;
    
    constructor (private http: Http, private _baseService: BaseService, private _sharedService:SharedService) {
     }
    
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
    
    getDadosFromFile(){
        return this.http.get('app/dadosOlap.json')
            .map((res: Response) => this._baseService.extractData(res))
            .catch(this._baseService.handleError);
    }
    
    loadFile(){
            this.getDadosFromFile().subscribe(
				dados => {
                    this._sharedService.json = dados
				},
				error => {
					console.log("ERRO After")
				});
    }
}