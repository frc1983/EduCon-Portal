import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import { HTTP_PROVIDERS } from 'angular2/http';
import { BaseService } from './services/base.service';
import {ANGULAR2_GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';

bootstrap(AppComponent, [HTTP_PROVIDERS, BaseService, ANGULAR2_GOOGLE_MAPS_PROVIDERS]);