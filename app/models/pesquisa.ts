export class Pesquisa {
  itensPesquisados: Array<any>; 
  
  constructor(obj: Object) {
    this.itensPesquisados = [];
    obj.fontes.forEach(element => {
      this.itensPesquisados.push({ "nome": element.nome, "tipo": "Fonte", "id": element.id });
    });;
    obj.municipios.forEach(element => {
      this.itensPesquisados.push({ "nome": element.nome, "tipo": "Municipio", "id": element.id });
    })
    obj.tiposEnsino.forEach(element => {
      this.itensPesquisados.push({ "nome": element.nome, "tipo": "TipoEnsino", "id": element.id });
    })
    obj.categorias.forEach(element => {
      this.itensPesquisados.push({ "nome": element.nome, "tipo": "Categoria", "id": element.id });
    })
  }
  
  static fromJSONArray(array: Array<Pesquisa>): Pesquisa[] {
    return array.map(obj => new Pesquisa(obj));
  }

  static fromJSON(item: Object): Pesquisa {
    return new Pesquisa(item);
  }
}