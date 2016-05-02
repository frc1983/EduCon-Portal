export class Municipio {
  id: number;
  nome: string;
  latitude: string;
  longitude: string;
  
  constructor(obj: Object) {
    this.id = obj.id;
    this.nome = obj.nome;
    this.latitude = obj.latitude;
	this.longitude = obj.longitude;
  }
  
  static fromJSONArray(array: Array<Municipio>): Municipio[] {
    return array.map(obj => new Municipio(obj);
  }
}