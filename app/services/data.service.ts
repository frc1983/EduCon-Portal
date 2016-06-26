import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {Data} from '../models/data';
import {BaseService} from './base.service';

@Injectable()
export class DataService {
    constructor (private http: Http, private _baseService: BaseService) { }
    
    private _dataUrl = this._baseService.getUrl() + "v1/anos/";
    
    getAnos() {
        return this.http.get(this._dataUrl)
            .map(obj => Data.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
    
    getAnoPorId(id: string) {
        return this.http.get(this._dataUrl + id)
            .map(obj => Data.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}