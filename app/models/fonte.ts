export class Fonte {
  id: number;
  nome: string;
  
  constructor(obj: Object) {
    this.id = obj.id;
    this.nome = obj.nome;
  }
  
  static fromJSONArray(array: Array<Fonte>): Fonte[] {
    return array.map(obj => new Fonte(obj));
  }

  static fromJSON(item: Object): Fonte {
      return new Fonte(item);
  }
}