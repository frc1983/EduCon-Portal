export class Pesquisa {
  fontes: Array<Fonte>;
  municipios: Array<Municipio>;
  tiposEnsino: Array<TipoEnsino>;
  categorias: Array<Categoria>;
  
  constructor(obj: Object) {
    this.fontes = obj.fontes;
    this.municipios = obj.municipios;
    this.tiposEnsino = obj.tiposEnsino;
    this.categorias = obj.categorias;
  }
  
  static fromJSONArray(array: Array<Pesquisa>): Pesquisa[] {
    return array.map(obj => new Pesquisa(obj));
  }

  static fromJSON(item: Object): Pesquisa {
    return new Pesquisa(item);
  }
}