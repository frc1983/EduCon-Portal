import { Component, OnInit } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

import { MDL } from '../../MaterialDesignLiteUpgradeElement';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import { Municipio } from '../../models/municipio';
import { Categoria } from '../../models/categoria';
import { TipoEnsino } from '../../models/tipoEnsino';
import { Dado } from '../../models/dado';
import { Data } from '../../models/data';

import { MunicipioService } from '../../services/municipio.service';
import { CategoriaService } from '../../services/categoria.service';
import { TipoEnsinoService } from '../../services/tipoEnsino.service';
import { DadoService } from '../../services/dado.service';
import { DataService } from '../../services/data.service';

import {IgPivotDataSelectorComponent, IgPivotGridComponent} from "../../../IgniteUI/src/igniteui.angular2.ts";

@Component({
	selector: 'olap',
	templateUrl: 'app/pages/olap/olap.component.html',
	styleUrls: ['app/pages/olap/olap.component.css'],
	providers: [MunicipioService, CategoriaService, TipoEnsinoService, DadoService, DataService],
	directives: [ROUTER_DIRECTIVES, MDL, IgPivotDataSelectorComponent, IgPivotGridComponent]
})

export class OLAPComponent implements OnInit {
    errorMessage: string;

	private optsGrid: IgPivotGrid;
	private optsSelector: IgPivotDataSelector;
	private selectorId: string;
	private gridId: string;

	municipios: Array<Municipio>;
	categorias: Array<Categoria>;
    subcategorias: Array<Categoria>;
    tiposEnsino: Array<TipoEnsino>;
    anos: Array<Data>;
	dados: any;

	messageMunicipios: string;
	messageCategorias: string;
	messageSubCategorias: string;
	messageTipoEnsino: string;
	messageAnos: string;

    constructor(private router: Router,
		private _municipioService: MunicipioService,
        private _categoriaService: CategoriaService,
        private _tipoEnsinoService: TipoEnsinoService,
        private _dadosService: DadoService,
        private _dataService: DataService) {
		this.municipios = new Array();
		this.categorias = new Array();
		this.subcategorias = new Array();
		this.tiposEnsino = new Array();
		this.anos = new Array();
		this.dados = new Array();
	}

	ngOnInit() {
		this.getMunicipios();
		this.getCategorias();
		this.getSubCategorias();
		this.getTiposEnsino();
		this.getAnos();
		this.getDados();

		this.selectorId = "dataSelector";
		this.gridId = "pivotGrid";

		this.optsGrid = {
			dataSource: this.dados
		};

		this.optsSelector = {
			dataSource: this.dados
		};
	}

	getMunicipios() {
        this.messageMunicipios = "Carregando Municípios";
        this._municipioService
            .getMunicipios()
            .subscribe(
            municipios => {
                this.municipios = municipios;
				this.messageMunicipios = "Carregando Municípios - OK";
            },
            error => {
                this.errorMessage = <any>error;
				this.messageMunicipios = "Carregando Municípios - ERRO";
            });
    }

    getCategorias() {
        this.messageCategorias = "Carregando Categorias";
        this._categoriaService
            .getCategorias()
            .subscribe(
            categorias => {
                this.categorias = categorias;
                this.messageCategorias = "Carregando Categorias - OK";
            },
            error => {
                this.errorMessage = <any>error;
                this.messageCategorias = "Carregando Categorias - ERRO";
            });
    }

    getSubCategorias() {
        this.messageSubCategorias = "Carregando Categorias";
        this._categoriaService
            .getSubCategorias()
            .subscribe(
            subcategorias => {
                this.subcategorias = subcategorias;
                this.messageSubCategorias = "Carregando Categorias - OK";
            },
            error => {
                this.errorMessage = <any>error;
                this.messageSubCategorias = "Carregando Categorias - ERRO";
            });
    }

    getTiposEnsino() {
        this.messageTipoEnsino = "Carregando Tipos de Ensino";
        this._tipoEnsinoService
            .getTiposEnsino()
            .subscribe(
            tipos => {
                this.tiposEnsino = tipos;
                this.messageTipoEnsino = "Carregando Tipos de Ensino - OK";
            },
            error => {
                this.errorMessage = <any>error;
                this.messageTipoEnsino = "Carregando Tipos de Ensino - ERRO";
            });
    }

    getAnos() {
        this.messageAnos = "Carregando Datas";
        this._dataService
            .getAnos()
            .subscribe(
            anos => {
                this.anos = anos;
                this.messageAnos = "Carregando Datas - OK";
            },
            error => {
                this.errorMessage = <any>error;
                this.messageAnos = "Carregando Datas - ERRO";
            });
    }

	getDados() {
		this.dados = this.getOlapData();
	}

	getOlapData() {
		return new jQuery.ig.OlapFlatDataSource({
			dataSource: this.getDatasource(),
			metadata: {
				cube: {
					name: "Metricas",
					caption: "Metricas",
					measuresDimension: {
						caption: "Measures",
						measures: [ //for each measure, name and aggregator are required
							{
								caption: "Valor", name: "Valor",
								// returns a function that will be used as sum aggregator on the 'UnitsSold property' of the data objects
								aggregator: jQuery.ig.OlapUtilities.prototype.sumAggregator('valor')
							}]
					},
					dimensions: this.getDimensions()
				}
			},
			// Preload hierarchies for the rows, columns, filters and measures
			rows: "[Data].[Datas]",
			columns: "[Municipio].[Municipio]",
			measures: "[Measures].[Valor]"
		});
	}

	getDatasource() {
		return [

			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2010", "valor": 10.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2011", "valor": 12.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2012", "valor": 3.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2013", "valor": 6.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2014", "valor": 7.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2015", "valor": 11.0 },

			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2010", "valor": 10.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2011", "valor": 11.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2012", "valor": 12.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2013", "valor": 15.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2014", "valor": 20.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Função Docente", "Subcategoria": "Estadual", "Data": "2015", "valor": 23.0 },


			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2010", "valor": 10.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2011", "valor": 12.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2012", "valor": 3.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2013", "valor": 6.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2014", "valor": 7.0 },
			{ "Fonte": "FEE", "Municipio": "Porto Alegre", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2015", "valor": 11.0 },

			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2010", "valor": 3.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2011", "valor": 4.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2012", "valor": 5.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2013", "valor": 6.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2014", "valor": 7.0 },
			{ "Fonte": "FEE", "Municipio": "Bagé", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2015", "valor": 9.0 }

		];
	}

	getDimensions() {
		let dim = new Array();

		dim.push({
			caption: "Categoria", name: "Categoria", hierarchies: [{
				caption: "Categoria", name: "Categoria", levels: [
					{
						name: "AllCategoria", caption: "All Categorias",
						memberProvider: function (item) { return "All Categorias"; }
					},
					{
						name: "CategoriaName", caption: "Categoria",
						memberProvider: function (item) { return item.Categoria; }
					}]
			}]
		});

		dim.push({
			caption: "Municipio", name: "Municipio", hierarchies: [{
				caption: "Municipio", name: "Municipio", levels: [
					{
						name: "AllMunicipio", caption: "All Municipio",
						memberProvider: function (item) { return "All Municipio"; }
					},
					{
						name: "MunicipioName", caption: "Municipio",
						memberProvider: function (item) { return item.Municipio; }
					}]
			}]
		});

		dim.push({
			caption: "Data", name: "Data", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
				jQuery.ig.OlapUtilities.prototype.getDateHierarchy(
					"Data", // the source property name
					["year"], // the date parts for which levels will be generated (optional)
					"Datas", // The name for the hierarchy (optional)
					"Data", // The caption for the hierarchy (optional)
					["Year"], // the captions for the levels (optional)
					"Todos Anos") // the root level caption (optional)
			]
		});

		return dim;
	}

	findNome(lista, id) {
		lista.forEach(key => {
			if (key.id == id)
				return key.nome;
		});
	}

	findAno(lista, id) {
		this.anos.forEach(key => {
			if (key.id == id)
				return key.ano;
		});
	}

	goBack() {
        window.history.back();
    }
}