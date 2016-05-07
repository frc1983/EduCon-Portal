import { Injectable } from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Response, RequestOptions} from 'angular2/http';

@Injectable()
export class BaseService {
    
    public extractData(res: Response) {
        if (res.status < 200 || res.status >= 300)
            throw new Error('Bad response status: ' + res.status);
            
        let body = res.json(); 
        return body || [];
    }
    
    public handleError (error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}