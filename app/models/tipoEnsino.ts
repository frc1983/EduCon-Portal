export class TipoEnsino {
  id: number;
  nome: string;
  
  constructor(obj: Object) {
    this.id = obj.id;
    this.nome = obj.nome;
  }
  
  static fromJSONArray(array: Array<TipoEnsino>): TipoEnsino[] {
    return array.map(obj => new TipoEnsino(obj);
  }

  static fromJSON(item: Object): TipoEnsino {
      return new TipoEnsino(item);
  }
}