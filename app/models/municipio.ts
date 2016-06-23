export class Municipio {
  id: number;
  nome: string;
  codIBGE: number;
  latitude: string;
  longitude: string;
  
  constructor(obj: Object) {
    this.id = obj.id;
    this.nome = obj.nome;
    this.codIBGE = obj.codIBGE;
    this.latitude = obj.latitude;
	this.longitude = obj.longitude;
  }
  
  static fromJSONArray(array: Array<Municipio>): Municipio[] {
    return array.map(obj => new Municipio(obj));
  }

  static fromJSON(item: Object): Municipio {
      return new Municipio(item);
  }
}