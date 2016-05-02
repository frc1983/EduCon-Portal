import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import { HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/add/operator/map';
import { BaseService } from './services/base.service';

bootstrap(AppComponent, [HTTP_PROVIDERS, BaseService]);