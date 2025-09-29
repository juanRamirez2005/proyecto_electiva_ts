import type { Pedido } from "./Pedido";

export class DetallePedido {
  private pedidos: Array<{ cliente: string; destinatario: string; pedido: Pedido }> = [];
  private root: HTMLDivElement = document.createElement("div");
  private section: HTMLElement | null;

  constructor() {
    this.section = document.querySelector(".recepcion-side-info--pedido");
    this.root.className = "container-detalle-pedido";
    this.initStructure();
  }

  private initStructure() {
    this.root.innerHTML = `
      <h3>📋 Detalle de pedidos</h3>
      <div class="detalle-list"></div>
    `;
    if (this.section) {
      this.section.appendChild(this.root);
    }
  }

  agregarPedido(pedido: Pedido, cliente: string, destinatario: string) {
    // guardar en la lista
    this.pedidos.push({ cliente, destinatario, pedido });

    // renderizar
    this.render();
  }

  private render() {
    debugger
    const detalleList = this.root.querySelector(".detalle-list") as HTMLDivElement;
    detalleList.innerHTML = "";

    this.pedidos.forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "detalle-card";
      card.innerHTML = `
        <div class="detalle-header">
          <strong>Pedido #${index + 1}</strong>
        </div>
        <div class="detalle-body">
          <p><b>Cliente:</b> ${p.cliente}</p>
          <p><b>Destinatario:</b> ${p.destinatario}</p>
          <p><b>Producto:</b> ${p.pedido.producto}</p>
          ${
            p.pedido.personalizacion
              ? `<p><b>Nota:</b> ${p.pedido.personalizacion}</p>`
              : ""
          }
          <p><b>Entrega:</b> ${p.pedido.fechaEntrega.toLocaleDateString()} ${p.pedido.horaEntrega.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          ${p.pedido.isSorpresa ? `<p>🎉 Incluye sorpresa</p>` : ""}
        </div>
      `;
      detalleList.appendChild(card);
    });
  }
}