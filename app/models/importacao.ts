export class Importacao {
  id: number;
  texto: string;
  anoInicial: number;
  anoFinal: number;
  data: string;
  codSituacao: number;
  situacao: string;
  qtdRegistros: number;
  
  constructor(obj: Object) {
      this.id = obj.id;
      this.texto = obj.texto;
      this.anoInicial = obj.anoInicial;
      this.anoFinal = obj.anoFinal;
      this.data = obj.data;
      this.codSituacao = obj.codSituacao;
      this.situacao = obj.situacao;
      this.qtdRegistros = obj.qtdRegistros;
  }
  
  static fromJSONArray(array: Array<Importacao>): Importacao[] {
      return array.map(obj => new Importacao(obj));
  }

  static fromJSON(item: Object): Importacao {
      return new Importacao(item);
  }
}