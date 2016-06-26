export class Data {
  id: number;
  ano: string;
  
  constructor(obj: Object) {
    this.id = obj.id;
    this.ano = obj.ano;
  }
  
  static fromJSONArray(array: Array<Data>): Data[] {
    return array.map(obj => new Data(obj));
  }

  static fromJSON(item: Object): Data {
      return new Data(item);
  }
}