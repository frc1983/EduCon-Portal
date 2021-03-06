import {provide} from 'angular2/core'
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {BaseService} from './services/base.service';
import {ANGULAR2_GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';

import {SharedService} from './services/shared.service';

import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';

bootstrap(AppComponent, [
	    HTTP_PROVIDERS, 
	    BaseService, 
		SharedService,
	    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
	    ROUTER_PROVIDERS,
	    provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]
);