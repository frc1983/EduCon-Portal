import {Fonte} from './fonte';
import {Municipio} from './municipio';
import {TipoEnsino} from './tipoEnsino';
import {Categoria} from './categoria';
import {Data} from './data';

export class Dado { 
    id: number;
    idFonte: number;
    idMunicipio: number;
    idTipoEnsino: number;
    idCategoria: number;
    idSubcategoria: number;
    idData: number;
    valor: string;
    fonte: Fonte;
    municipio: Municipio;
    tipoEnsino: TipoEnsino;
    categoria: Categoria;
    subcategoria: Categoria;
    data: Data;
  
  constructor(obj: Object) {
    this.id				= obj.id;
    this.idFonte		= obj.idFonte;
    this.idMunicipio	= obj.idMunicipio;
    this.idTipoEnsino	= obj.idTipoEnsino;
    this.idCategoria	= obj.idCategoria;
    this.idSubcategoria	= obj.idSubcategoria;
    this.idData			= obj.idData;
    this.valor			= obj.valor;
    /*this.fonte			= Fonte.fromJSON(obj.fonte);
    this.municipio		= Municipio.fromJSON(obj.municipio);
    this.tipoEnsino		= TipoEnsino.fromJSON(bj.tipoEnsino);
    this.categoria		= Categoria.fromJSON(obj.categoria);
    this.subcategoria	= Categoria.fromJSON(obj.subcategoria);
    this.data			= Data.fromJSON(obj.data);*/
  }
  
  static fromJSONArray(array: Array<Dado>): Dado[] {
    return array.map(obj => new Dado(obj));
  }

  static fromJSON(item: Object): Dado {
      return new Dado(item);
  }
}