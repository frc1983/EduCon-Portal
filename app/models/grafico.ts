import {TipoEnsino} from './tipoEnsino';
import {Categoria} from './categoria';
import {Dado} from './dado';

export class Grafico {
  tipoEnsino: TipoEnsino;
  categoria: Categoria;
  dados: Dado[];
  selectedCategories: Array<Categoria>;  
  
  constructor() {
      this.dados = new Array();
      this.selectedCategories = new Array();
  }
}