export class Categoria {
  id: number;
  nome: string;
  selectedSubCategories: Array<Categoria>;
  data: any;
  
  constructor(obj: Object) {
    this.id = obj.id;
    this.nome = obj.nome;
    this.selectedSubCategories = new Array();
  }
  
  static fromJSONArray(array: Array<Categoria>): Categoria[] {
    return array.map(obj => new Categoria(obj));
  }

  static fromJSON(item: Object): Categoria {
    return new Categoria(item);
  }
}