import { Cliente } from "./Cliente";

export class Destinatario extends Cliente {

    private direccion: String ; 

    constructor(nombre:String, telefono:String, direccion:String){
        super(nombre,telefono);
        this.direccion = direccion;

    }

    public getDireccion(){
        return this.direccion;
    }
    

}