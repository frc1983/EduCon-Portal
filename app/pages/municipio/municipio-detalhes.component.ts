import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';

import { Municipio } from '../../models/municipio';
import { MunicipioService } from '../../services/municipio.service';

import { MDL } from '../../MaterialDesignLiteUpgradeElement';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';

@Component({
    selector: 'municipio',
    templateUrl: 'app/pages/municipio/municipio-detalhes.component.html',
    styleUrls: ['app/pages/municipio/municipio-detalhes.component.css'],
    providers: [MunicipioService],
    directives: [ROUTER_DIRECTIVES, MDL, ANGULAR2_GOOGLE_MAPS_DIRECTIVES]
})

export class MunicipioDetalhesComponent implements OnInit {
    params: RouteParams;
    id: string;
    municipio: Municipio;
    errorMessage: string;
    isLoading: boolean = false;
    zoom: number = 14;

    markers: {
        lat: number;
        lng: number;
        label?: string;
    }[];

    constructor(params: RouteParams, private _municipioService: MunicipioService) {
        this.params = params;
        this.id = this.params.get('id');
        this.markers = new Array();
    }

    ngOnInit() {
        this.getMunicipio()
    }

    getMunicipio() {
        if (!this.id) { return; }

        this.isLoading = true;
        this._municipioService
            .getMunicipioPorId(this.id)
            .subscribe(
            municipio => {
                this.municipio = municipio;
                this.isLoading = false;
                this.markers.push({ lat: parseFloat(municipio.latitude), lng: parseFloat(municipio.longitude) })
            },
            error => {
                this.errorMessage = <any>error;
                this.isLoading = false;
            });
    }

    goBack() {
        window.history.back();
    }
}