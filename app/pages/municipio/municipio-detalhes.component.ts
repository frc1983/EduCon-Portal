import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';

import { Municipio } from '../../models/municipio';
import { Categoria } from '../../models/categoria';
import { TipoEnsino } from '../../models/tipoEnsino';
import { MunicipioService } from '../../services/municipio.service';
import { CategoriaService } from '../../services/categoria.service';
import { TipoEnsinoService } from '../../services/tipoEnsino.service';

import { MDL } from '../../MaterialDesignLiteUpgradeElement';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';

import {LineChart, Checkbox} from 'primeng/primeng';

@Component({
    selector: 'municipio',
    templateUrl: 'app/pages/municipio/municipio-detalhes.component.html',
    styleUrls: ['app/pages/municipio/municipio-detalhes.component.css'],
    providers: [MunicipioService, CategoriaService, TipoEnsinoService],
    directives: [ROUTER_DIRECTIVES, MDL, ANGULAR2_GOOGLE_MAPS_DIRECTIVES, LineChart, Checkbox]
})

export class MunicipioDetalhesComponent implements OnInit {
    params: RouteParams;
    id: string;
    municipio: Municipio;
    errorMessage: string;
    isLoading: boolean = false;
    zoom: number = 14;
    data: any;
    selectedGraphs: string[];
    selectedCategories: string[];
    categorias: Array<Categoria>;
    tiposEnsino: Array<TipoEnsino>;

    markers: {
        lat: number;
        lng: number;
        label?: string;
    }[];

    constructor(params: RouteParams,
        private _municipioService: MunicipioService,
        private _categoriaService: CategoriaService,
        private _tipoEnsinoService: TipoEnsinoService) {
        this.params = params;
        this.id = this.params.get('id');
        this.markers = new Array();
        this.selectedGraphs = new Array();
        this.selectedCategories = new Array();

        this.getCategorias();
        this.getTiposEnsino();

        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    fillColor: 'rgba(220,220,220,0.2)',
                    strokeColor: 'rgba(220,220,220,1)',
                    pointColor: 'rgba(220,220,220,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    fillColor: 'rgba(151,187,205,0.2)',
                    strokeColor: 'rgba(151,187,205,1)',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        }
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

    getCategorias() {
        this.isLoading = true;
        this._categoriaService
            .getCategorias()
            .subscribe(
            categorias => {
                this.categorias = categorias;
                this.isLoading = false;
            },
            error => {
                this.errorMessage = <any>error;
                this.isLoading = false;
            });
    }

    getTiposEnsino() {
        this.isLoading = true;
        this._tipoEnsinoService
            .getTiposEnsino()
            .subscribe(
            tipos => {
                this.tiposEnsino = tipos;
                this.isLoading = false;
            },
            error => {
                this.errorMessage = <any>error;
                this.isLoading = false;
            });
    }

    getGraph() {
        console.log("Abrir grafico1: " + this.selectedGraphs + " " + this.selectedCategories)
    }
}