export class Tarjeta {

  private nombrePara : string;
  private nombreDe : string;
  private mensaje : string;

  constructor(nombrePara : string, nombreDe : string, mensaje : string) {
    this.nombrePara = nombrePara;
    this.nombreDe = nombreDe;
    this.mensaje = mensaje;
    
  }
  
    
  public getNombrePara(): string {
    return this.nombrePara;
  }

  public getNombreDe(): string {
    return this.nombreDe;
  }

  public getMensaje(): string {
    return this.mensaje;
  }

  public setMensaje(mensaje: string): void {
    this.mensaje = mensaje;
  }

  public setNombrePara(nombrePara : string): void {
    this.nombrePara = nombrePara;
  }
    public setNombreDe(nombreDe : string): void {
    this.nombreDe = nombreDe;
  }

}