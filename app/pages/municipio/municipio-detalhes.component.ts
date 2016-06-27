import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';

import { Municipio } from '../../models/municipio';
import { Categoria } from '../../models/categoria';
import { TipoEnsino } from '../../models/tipoEnsino';
import { Dado } from '../../models/dado';
import { Data } from '../../models/data';
import { Grafico } from '../../models/grafico';
import { MunicipioService } from '../../services/municipio.service';
import { CategoriaService } from '../../services/categoria.service';
import { TipoEnsinoService } from '../../services/tipoEnsino.service';
import { DadoService } from '../../services/dado.service';
import { DataService } from '../../services/data.service';

import { MDL } from '../../MaterialDesignLiteUpgradeElement';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';

import {LineChart, Checkbox} from 'primeng/primeng';

@Component({
    selector: 'municipio',
    templateUrl: 'app/pages/municipio/municipio-detalhes.component.html',
    styleUrls: ['app/pages/municipio/municipio-detalhes.component.css'],
    providers: [MunicipioService, CategoriaService, TipoEnsinoService, DadoService, DataService],
    directives: [ROUTER_DIRECTIVES, MDL, ANGULAR2_GOOGLE_MAPS_DIRECTIVES, LineChart, Checkbox]
})

export class MunicipioDetalhesComponent implements OnInit {
    params: RouteParams;
    id: string;
    municipio: Municipio;
    errorMessage: string;
    isLoading: boolean = false;
    zoom: number = 14;
    selectedGraphs: Array<Grafico>;    
    categorias: Array<Categoria>;
    subcategorias: Array<Categoria>;
    tiposEnsino: Array<TipoEnsino>;
    anos: Array<Data>;

    markers: {
        lat: number;
        lng: number;
        label?: string;
    }[];

    constructor(params: RouteParams,
        private _municipioService: MunicipioService,
        private _categoriaService: CategoriaService,
        private _tipoEnsinoService: TipoEnsinoService,
        private _dadosService: DadoService,
        private _dataService: DataService) {
        this.params = params;
        this.id = this.params.get('id');
        this.markers = new Array();
        this.selectedGraphs = new Array();
        this.anos = new Array();        
    }

    ngOnInit() {
        this.getMunicipio();
        this.getCategorias();
        this.getTiposEnsino();
        this.getAnos();
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

    getSubCategorias(dados) {
        this.isLoading = true;
        this._categoriaService
            .getSubCategorias()
            .subscribe(
            subcategorias => {
                this.AtualizaSubcategorias(dados, subcategorias)
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

    getAnos() {
        this.isLoading = true;
        this._dataService
            .getAnos()
            .subscribe(
            anos => {
                this.anos = anos;
                this.isLoading = false;
            },
            error => {
                this.errorMessage = <any>error;
                this.isLoading = false;
            });
    }

    getGraph(grafico, categoria, event) {
        
        this.setSelectedCategories(grafico, categoria, event);
        if(event.target.checked){
            this.isLoading = true;
            this._dadosService
                .getDadoPorMunicipioTipoCategoria(this.municipio.id.toString(), grafico.tipoEnsino.id, categoria)
                .subscribe(
                dado => {
                    if(dado.length > 0) {
                        grafico.dados.push(dado);                        
                    }
                    this.isLoading = false;
                    this.setGraphData(grafico, categoria, null, event, false);
                    this.getSubCategorias(grafico.dados);
                    
                    
                },
                error => {
                    this.errorMessage = <any>error;
                    this.isLoading = false;
                });
        } else {
            grafico.dados = [];
        }

        console.log(this.selectedGraphs)
    }

    AtualizaSubcategorias(dados, subcategorias){
        let subsLocal = [];
        dados.forEach(x => x.forEach(y => {
            subcategorias.forEach(z => {
                if(y.idSubcategoria == z.id && subsLocal.indexOf(z) == -1) {
                    subsLocal.push(z);
                    return;
                }
            });
        }));
        this.subcategorias = subsLocal;
    }

    setGraphData(grafico: Grafico, categoria: Categoria, subcategoria, event, firstTime){

        if(subcategoria != null){
            this.setSelectedSubCategories(grafico, categoria, subcategoria, event);
        }

        if(firstTime){
            let anosArray = new Array();
            this.anos.forEach(x => {
                //if(anosArray.indexOf(x.ano) == -1)
                    anosArray.push(x.ano)
            });

            grafico.selectedCategories.forEach(x => {
                if(x.id == categoria.id){
                    x.data = {
                        labels: anosArray,
                        datasets: []
                    }
                }
            })
        }
        
        grafico.selectedCategories.forEach(x => {
            if(x.id == categoria.id){
                x.selectedSubCategories.forEach((sub, i) => {
                    let dadosArray = new Array();
                    grafico.dados.forEach(x => x.forEach(y => {
                        if(subcategoria != null){
                            if(y.idSubcategoria == sub.id && y.idCategoria == categoria.id){
                                dadosArray.push(y);
                            }
                        }
                    }));

                    let valoresArray = [];
                    dadosArray.forEach((x, i) => {
                        let val = x.valor.replace(',','').replace('.','')
                        valoresArray.push(val)
                    });

                    x.data.datasets.push({
                        label: sub.nome,
                        fill: false,
                        fillColor: this.getColor()[i].fillColor,
                        strokeColor: this.getColor()[i].strokeColor,
                        pointColor: this.getColor()[i].pointColor,
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: this.getColor()[i].fillColor,
                        data: valoresArray
                    });
                })
            }
        });        
    }

    setSelectedGraph(obj, event) {        
        if(event.target.checked){
            let graf = new Grafico();
            graf.tipoEnsino = obj;
            this.selectedGraphs.push(graf);
        }
        else if (!event.target.checked){            
            let indexx = this.selectedGraphs.indexOf(obj);
            this.selectedGraphs.splice(indexx,1);
        }
    }

    setSelectedCategories(grafico, obj, event) {        
        if(event.target.checked){
            grafico.selectedCategories.push(obj);
        }
        else if (!event.target.checked){            
            let indexx = grafico.selectedCategories.indexOf(obj);
            grafico.selectedCategories.splice(indexx,1);
        }
    }

    setSelectedSubCategories(grafico, categoria, obj, event) {        
        if(event.target.checked){
            grafico.selectedCategories.forEach(x => {
                if(x.id == categoria.id){
                    x.selectedSubCategories.push(obj);
                }
            })
        }
        else if (!event.target.checked){
            grafico.selectedCategories.forEach(x => {
                if(x.id == categoria.id){
                    let indexx = x.selectedSubCategories.indexOf(obj);
                    x.selectedSubCategories.splice(indexx,1);
                }
            })            
        }
    }

    setDado(grafico, dado, event) {
        if(event.target.checked){
            grafico.dados.push(dado);
        }
        else if (!event.target.checked){  
            grafico.dados = [];
        }
    }

    getColor(){
        let arrayColor = [
            {
                fillColor: 'rgba(220,220,220,0)',
                strokeColor: 'rgba(215, 40, 40, 0.9)',
                pointColor: 'rgba(215, 40, 40, 0.9)'
            },
            {
                fillColor: 'rgba(20,220,220,0)',
                strokeColor: 'rgba(215, 44, 131, 0.9)',
                pointColor: 'rgba(215, 44, 131, 0.9)'
            },
            {
                fillColor: 'rgba(220,220,20,0)',
                strokeColor: 'rgba(255, 175, 0, 0.9)',
                pointColor: 'rgba(255, 175, 0, 0.9)'
            },
            {
                fillColor: 'rgba(2,220,220,0)',
                strokeColor: 'rgba(0, 165, 0, 0.9)',
                pointColor: 'rgba(0, 165, 0, 0.9)'
            },
            {
                fillColor: 'rgba(20,2,220,0)',
                strokeColor: 'rgba(0, 0, 0, 0.9)',
                pointColor: 'rgba(0, 0, 0, 0.9)'
            },
            {
                fillColor: 'rgba(220,0,20,0)',
                strokeColor: 'rgba(220,0,220,1)',
                pointColor: 'rgba(220,0,220,1)'
            },
            {
                fillColor: 'rgba(20,2,220,0)',
                strokeColor: 'rgba(96, 230, 255, 0.9)',
                pointColor: 'rgba(96, 230, 255, 0.9)'
            },
            {
                fillColor: 'rgba(220,0,20,0)',
                strokeColor: 'rgba(196, 117, 97, 0.9)',
                pointColor: 'rgba(196, 117, 97, 0.9)'
            }
        ]

        return arrayColor;
    }
    
    goBack() {
        window.history.back();
    }
}