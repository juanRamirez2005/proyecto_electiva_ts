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
      <div class="detalle-actions">
        <button type="button" class="btn-enviar-pedidos" id="btnEnviarPedidos">
          📦 Enviar a Procesamiento
        </button>
      </div>
    `;
    if (this.section) {
      this.section.appendChild(this.root);
    }
    
    // Configurar evento del botón
    this.setupEnviarButton();
  }

  private setupEnviarButton() {
    const btnEnviar = document.getElementById('btnEnviarPedidos');
    if (btnEnviar) {
      btnEnviar.addEventListener('click', () => {
        this.enviarAProcesamiento();
      });
    }
  }

  private enviarAProcesamiento() {
    if (this.pedidos.length === 0) {
      alert('No hay pedidos para enviar');
      return;
    }
    
    // Redirigir a procesamiento
    window.location.href = './procesamiento.html';
  }

  agregarPedido(pedido: Pedido, cliente: string, destinatario: string) {
    // guardar en la lista
    this.pedidos.push({ cliente, destinatario, pedido });

    // renderizar
    this.render();
  }

  private render() {
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
          <p><b>Entrega:</b> ${this.formatearFecha(p.pedido.fechaEntrega)} ${this.formatearHora(p.pedido.horaEntrega)}</p>
          ${p.pedido.isSorpresa ? `<p>🎉 Incluye sorpresa</p>` : ""}
        </div>
      `;
      detalleList.appendChild(card);
    });
  }

  private formatearFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      // Si es string en formato YYYY-MM-DD, convertir a formato legible
      const [year, month, day] = fecha.split('-');
      return `${day}/${month}/${year}`;
    }
    // Si es Date, usar toLocaleDateString
    return fecha.toLocaleDateString();
  }

  private formatearHora(hora: Date | string): string {
    if (typeof hora === 'string') {
      // Si es string en formato HH:MM, retornarlo directamente
      return hora;
    }
    // Si es Date, usar toLocaleTimeString
    return hora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
}