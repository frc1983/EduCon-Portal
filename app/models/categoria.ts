export class Categoria {
  id: number;
  nome: string;
  
  constructor(obj: Object) {
    this.id = obj.id;
    this.nome = obj.nome;
  }
  
  static fromJSONArray(array: Array<Categoria>): Categoria[] {
    return array.map(obj => new Categoria(obj);
  }

  static fromJSON(item: Object): Categoria {
      return new Categoria(item);
  }
}