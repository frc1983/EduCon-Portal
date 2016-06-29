///<reference path="../../../node_modules/angular2/typings/browser.d.ts"/>

import { Component, OnInit } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {TimerWrapper} from 'angular2/src/facade/async';
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
import { SharedService } from '../../services/shared.service';

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
	executando: boolean;
	dadosBaixados: any;

	messageMunicipios: string;
	messageCategorias: string;
	messageSubCategorias: string;
	messageTipoEnsino: string;
	messageAnos: string;
	messageDados: string;

    constructor(private router: Router,
		private _municipioService: MunicipioService,
        private _categoriaService: CategoriaService,
        private _tipoEnsinoService: TipoEnsinoService,
        private _dadosService: DadoService,
        private _dataService: DataService,
		private _sharedService:SharedService) {
		this.municipios = new Array();
		this.categorias = new Array();
		this.subcategorias = new Array();
		this.tiposEnsino = new Array();
		this.anos = new Array();

		this.executando = false;
	}
	
	ngAfterContentInit(){
		console.log("AfterInit")
		this.olapInit(this._sharedService.json);
	}

	ngOnInit() {
		console.log("Init")		
		//this.loadDadosGerais();
		console.log("Init fim")
	}

	olapInit(data) {
		this.dados = new jQuery.ig.OlapFlatDataSource({
			dataSource: data,//this.getPlainDataSource(),//this.downloadedData, 
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
								aggregator: jQuery.ig.OlapUtilities.prototype.sumAggregator('Valor')
							}]
					},
					dimensions: this.getDimensions()
				}
			},
			// Preload hierarchies for the rows, columns, filters and measures
			rows: "[Data].[Datas]",
			columns: "[Categoria].[Categoria]",
			measures: "[Measures].[Valor]"
		});

		this.selectorId = "dataSelector";
		this.gridId = "pivotGrid";

		this.optsGrid = {
			dataSource: this.dados
		};

		this.optsSelector = {
			dataSource: this.dados
		};
	}

	loadDadosGerais() {
		Observable.forkJoin(
			this.getMunicipios(),
			this.getCategorias(),
			this.getSubCategorias(),
			this.getTiposEnsino(),
			this.getAnos(),
			this.getDados()
		).subscribe(
			data => {
				console.log(data),
					this.messageMunicipios = data[0],
					this.messageCategorias = data[1],
					this.messageSubCategorias = data[2],
					this.messageTipoEnsino = data[3],
					this.messageAnos = data[4]
			},
			err => {
				console.log(err)
			});
	}

	getMunicipios(): Promise<any> {
		console.log("GET MUNICIPIOS")
		return new Promise<any>((resolve, reject) => {
			this.messageMunicipios = "Carregando Municípios";
			this._municipioService
				.getMunicipios()
				.subscribe(
				municipios => {
					this.municipios = municipios;
					resolve("Carregando Municípios - OK")
				},
				error => {
					this.errorMessage = <any>error;
					this.messageMunicipios = "Carregando Municípios - ERRO";
					reject(null)
				});
		});
    }

    getCategorias(): Promise<any> {
		console.log("GET CATEGORIAS")
		return new Promise<any>((resolve, reject) => {
			this.messageCategorias = "Carregando Categorias";
			this._categoriaService
				.getCategorias()
				.subscribe(
				categorias => {
					this.categorias = categorias;
					resolve("Carregando Categorias - OK")
				},
				error => {
					this.errorMessage = <any>error;
					this.messageCategorias = "Carregando Categorias - ERRO";
					reject(null)
				});
		});
    }

    getSubCategorias(): Promise<any> {
		console.log("GET SUBCATEGORIAS")
		return new Promise<any>((resolve, reject) => {
			this.messageSubCategorias = "Carregando SubCategorias";
			this._categoriaService
				.getSubCategorias()
				.subscribe(
				subcategorias => {
					this.subcategorias = subcategorias;
					resolve("Carregando SubCategorias - OK")
				},
				error => {
					this.errorMessage = <any>error;
					this.messageSubCategorias = "Carregando SubCategorias - ERRO";
					reject(null)
				});
		});
    }

    getTiposEnsino(): Promise<any> {
		console.log("GET TIPO ENSINO")
		return new Promise<any>((resolve, reject) => {
			this.messageTipoEnsino = "Carregando Tipos de Ensino";
			this._tipoEnsinoService
				.getTiposEnsino()
				.subscribe(
				tipos => {
					this.tiposEnsino = tipos;
					resolve("Carregando Tipos de Ensino - OK")
				},
				error => {
					this.errorMessage = <any>error;
					this.messageTipoEnsino = "Carregando Tipos de Ensino - ERRO";
					reject(null)
				});
		});
    }

    getAnos(): Promise<any> {
		console.log("GET ANOS")
		return new Promise<any>((resolve, reject) => {
			this.messageAnos = "Carregando Datas";
			this._dataService
				.getAnos()
				.subscribe(
				anos => {
					this.anos = anos;
					resolve("Carregando Datas - OK")
				},
				error => {
					this.errorMessage = <any>error;
					this.messageAnos = "Carregando Datas - ERRO";
					reject(null)
				});
		});
    }

	getDados(): Promise<any> {
		console.log("GET DADOS")
		let data = [];
		let h;

		return new Promise<any>((resolve, reject) => {
			//for (let i = 0; i < this.tiposEnsino.length; h++) {
			TimerWrapper.setTimeout(() => { }, 100);
			//this.getDatasource(mun.id.toString()).then((datasource: any) => {
			//console.log(this.executando)
			//if (!this.executando) {
			this.getDatasource("1").then((datasource: any) => {
				data.push(datasource);
				this.executando = false;
				console.log("DADOS OBTIDOS", data)
				//this.dados.dataSource().sourceOptions()._itemsSource = this.getPlainDataSource();
				//i++;
			});
			//}
			//};

			resolve(data);
		});
	}

	getDatasource(idMun): Promise<any> {
		this.messageDados = "Carregando Dados";
		this.executando = true;
		return new Promise<any>((resolve, reject) => {
			this._dadosService
				.getDadoPorMunicipioTipoCategoria("1", idMun, "1")
				.subscribe(
				dados => {
					let dado = this.parseDados(dados);
					resolve(dado);
					this.messageDados = "Carregando Dados - OK";
				},
				error => {
					this.errorMessage = <any>error;
					this.messageDados = "Carregando Dados - ERRO";
				});
		});
	}	

	getPlainDataSource() {
		return [{ "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2000", "valor": 18 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2000", "valor": 18 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 82 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 82 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 82 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 82 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 145 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 145 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 145 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 145 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2003", "valor": 212 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2003", "valor": 212 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 212 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 212 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2004", "valor": 160 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2004", "valor": 160 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2006", "valor": 134 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2006", "valor": 134 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2007", "valor": 144 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2007", "valor": 144 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 144 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 144 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2008", "valor": 198 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Jovem Adulto", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2008", "valor": 198 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2000", "valor": 1.117 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2000", "valor": 1.575 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2000", "valor": 164 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2000", "valor": 2.856 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 970 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 970 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2001", "valor": 1.672 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2001", "valor": 1.672 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2001", "valor": 107 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 2.749 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 2.749 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 814 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 814 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2002", "valor": 1.719 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2002", "valor": 96 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2002", "valor": 1.719 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 2.629 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 2.629 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2003", "valor": 739 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2003", "valor": 739 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2003", "valor": 1.696 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2003", "valor": 98 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 2.533 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 2.533 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2004", "valor": 792 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2004", "valor": 792 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2004", "valor": 1.658 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2004", "valor": 104 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2004", "valor": 2.554 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2004", "valor": 2.554 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2006", "valor": 709 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2006", "valor": 1.732 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2006", "valor": 134 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2006", "valor": 2.575 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2006", "valor": 2.575 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2007", "valor": 698 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2007", "valor": 698 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2007", "valor": 1.739 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2007", "valor": 133 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2007", "valor": 1.739 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 2.57 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 2.57 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2008", "valor": 683 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2008", "valor": 1.691 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2008", "valor": 138 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Fundamental", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2008", "valor": 2.512 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2000", "valor": 7 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2000", "valor": 7 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 4 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 4 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 4 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 4 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 3 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 3 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 3 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2003", "valor": 3 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 3 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 3 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2005", "valor": 100 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2006", "valor": 3 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2006", "valor": 112 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2006", "valor": 112 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2006", "valor": 115 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2007", "valor": 116 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2007", "valor": 116 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 116 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 116 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2008", "valor": 3 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2008", "valor": 52 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Especial", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2008", "valor": 55 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2000", "valor": 127 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2000", "valor": 243 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2000", "valor": 24 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2000", "valor": 394 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 101 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 101 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2001", "valor": 256 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2001", "valor": 256 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2001", "valor": 39 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 396 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 396 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 89 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 89 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2002", "valor": 232 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2002", "valor": 232 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2002", "valor": 50 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 371 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 371 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2003", "valor": 83 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2003", "valor": 260 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2003", "valor": 51 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2003", "valor": 260 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 394 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 394 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2004", "valor": 77 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2004", "valor": 243 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2004", "valor": 62 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2004", "valor": 382 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2006", "valor": 95 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2006", "valor": 246 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2006", "valor": 65 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2006", "valor": 246 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2006", "valor": 406 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2006", "valor": 406 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2007", "valor": 75 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2007", "valor": 200 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2007", "valor": 60 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 335 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 335 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2008", "valor": 37 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Municipal", "Data": "2008", "valor": 209 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2008", "valor": 77 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Educação Infantil", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2008", "valor": 323 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2000", "valor": 487 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2000", "valor": 487 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 477 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2001", "valor": 477 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 477 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2001", "valor": 477 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 463 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2002", "valor": 463 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 463 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2002", "valor": 463 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2003", "valor": 478 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2003", "valor": 478 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2003", "valor": 12 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 490 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2003", "valor": 490 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2006", "valor": 467 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2006", "valor": 37 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2006", "valor": 467 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2006", "valor": 504 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2006", "valor": 504 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2007", "valor": 477 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2007", "valor": 477 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Particular", "Data": "2007", "valor": 32 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 509 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Total", "Data": "2007", "valor": 509 }, { "Fonte": "FEE", "Municipio": "Agudo", "TipoEnsino": "Ensino Médio", "Categoria": "Matrícula Inicial", "Subcategoria": "Estadual", "Data": "2008", "valor": 431 }];
	}

	parseDados(dados: Array<Dado>) {
		let parsed = [];
		dados.forEach(dado => {
			parsed.push({
				"Fonte": "FEE",
				"Municipio": this.findNome(this.municipios, dado.idMunicipio),
				"TipoEnsino": this.findNome(this.tiposEnsino, dado.idTipoEnsino),
				"Categoria": this.findNome(this.categorias, dado.idCategoria),
				"Subcategoria": this.findNome(this.subcategorias, dado.idSubcategoria),
				"Data": this.findAno(this.anos, dado.idData),
				"valor": parseFloat(dado.valor.replace(',', '.'))
			});
		});

		return parsed;
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
			caption: "TipoEnsino", name: "Tipo de Ensino", hierarchies: [{
				caption: "TipoEnsino", name: "Tipo de Ensino", levels: [
					{
						name: "AllTipoEnsino", caption: "All Tipo de Ensino",
						memberProvider: function (item) { return "All Tipo de Ensino"; }
					},
					{
						name: "TipoEnsinoName", caption: "Tipo de Ensino",
						memberProvider: function (item) { return item.TipoEnsino; }
					}]
			}]
		});

		dim.push({
			caption: "Subcategoria", name: "Subcategoria", hierarchies: [{
				caption: "Subcategoria", name: "Subcategoria", levels: [
					{
						name: "AllSubcategoria", caption: "All Subcategoria",
						memberProvider: function (item) { return "All Subcategoria"; }
					},
					{
						name: "SubcategoriaName", caption: "Subcategoria",
						memberProvider: function (item) { return item.Subcategoria; }
					}]
			}]
		});

		dim.push({
			caption: "Data", name: "Data", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
				jQuery.ig.OlapUtilities.prototype.getDateHierarchy(
					"Ano", // the source property name
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
		let nome = "";
		for (let i = 0; i < lista.length; i++) {
			if (lista[i].id == id) {
				nome = lista[i].nome;
				break;
			}
		};

		return nome;
	}

	findAno(lista, id) {
		let data = "";
		for (let i = 0; i < lista.length; i++) {
			if (lista[i].id == id) {
				data = lista[i].ano.toString();
				break;
			}
		};

		return data;
	}

	goBack() {
        window.history.back();
    }
}