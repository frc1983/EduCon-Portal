import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Response, RequestOptions} from 'angular2/http';

@Injectable()
export class BaseService {

    public getUrl() {
        return "http://localhost:58436/api/";
    }

    public extractData(res: Response) {
        if (res.status < 200 || res.status >= 300)
            throw new Error('Bad response status: ' + res.status);

        let body = res.json();
        return body || [];
    }

    public handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.log(error);
        console.log("ERRO STATUS", error.status); // log to console instead
        let j = error._body;
        console.log(j); // log to console instead
        console.log("ERRO JSON BODY", JSON.parse(j));
        return Observable.throw(errMsg);
    }
}