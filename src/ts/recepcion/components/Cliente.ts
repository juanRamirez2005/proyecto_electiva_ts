export class Cliente{
    private nombre: String;
    private telefono: String;

    constructor (nombre:String , telefono:String){
        this.nombre = nombre;
        this.telefono = telefono;
    }

    public getNombre() : String{
        return this.nombre;
    }

    public getTelefono(): String{
        return this.telefono;
    }


}