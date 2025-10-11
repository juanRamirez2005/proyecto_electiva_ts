// paso por parámetros el id que capturo en el la página de despacho ajustando a cada atributo del pedido . 
export function verTirilla(orderId: string){
    // Capturar la información usando el ID del pedido
    const inicial:number = 123;
    const clienteNombre = document.querySelector(`#cliente-${orderId} strong`)?.textContent || ""; // Se usa querySelector porque permite seleccionar elementos anidados con CSS selectors más específicos (ej: '#id strong'), mientras getElementById solo acepta IDs simples
    const clienteTelefono = document.querySelector(`#cliente-${orderId} small`)?.textContent || "";
    const producto = document.querySelector(`#producto-${orderId} strong`)?.textContent || "";
    const destNombre = document.querySelector(`#destinatario-${orderId} strong`)?.textContent || "";
    const destTelefono = document.querySelector(`#destinatario-${orderId} small`)?.textContent || "";
    const destDireccion = document.querySelector(`#direccion-${orderId} strong`)?.textContent || "";
    const fechaHoraCompleta = document.querySelector(`#fecha-${orderId} strong`)?.textContent?.toString() || "";
    const observaciones = (document.querySelector(`#nota-${orderId}`) as HTMLTextAreaElement)?.value || "";

    // Separar fecha y hora
    const [fechaEntrega = '', horaEntrega = ''] = fechaHoraCompleta.split(' - ');

    // Construir URL con los parámetros
    const url = `./tirilla.html?` +
        `clienteNombre=${encodeURIComponent(clienteNombre)}` +
        `&clienteTelefono=${encodeURIComponent(clienteTelefono)}` +
        `&producto=${encodeURIComponent(producto)}` +
        `&fechaEntrega=${encodeURIComponent(fechaEntrega)}` +
        `&horaEntrega=${encodeURIComponent(horaEntrega)}` +
        `&destNombre=${encodeURIComponent(destNombre)}` +
        `&destDireccion=${encodeURIComponent(destDireccion)}` +
        `&destTelefono=${encodeURIComponent(destTelefono)}` +
        `&observaciones=${encodeURIComponent(observaciones)}`;

    // Abrir la ventana de la tirilla
    window.open(url, "_blank", "width=400,height=600");

}

// esto es para que funcione el onclick del HTML, lo que hace es --> Exponer la función al ámbito global para el HTML
(window as any).verTirilla = verTirilla;

