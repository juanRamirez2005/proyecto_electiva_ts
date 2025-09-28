import type { Pedido } from "./Pedido";

export class DetallePedido {
    private pedido: Array<{ cliente: string, pedido: Array<Pedido> }> ;
    private root : HTMLDivElement = document.createElement("div");
    constructor() {
        this.pedido = [];
        this.root.className = "container-detalle-pedido";
        this.initStructure();
    }

    private initStructure() {
        this.root.innerHTML = `
        `;
    }

    agregarPedido(pedido: Pedido, cliente: string) {
    
    }
}