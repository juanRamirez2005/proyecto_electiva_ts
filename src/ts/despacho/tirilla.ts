export function verTirilla(){
    // capturar la información 
    const inicial:number = 123;
    const clienteNombreInput = (document.getElementById("clienteNombre") as HTMLInputElement | null)?.value || "";
    const clienteTelefonoInput = (document.getElementById("clienteTelefono") as HTMLInputElement | null)?.value || "";
    const productoInput = (document.getElementById("producto") as HTMLInputElement | null ) ?.value || "";
    const fechaEntregaInput  = (document.getElementById("fechaEntrega") as HTMLInputElement | null ) ?.value || "";
    const horaEntregaInput = (document.getElementById("horaEntrega") as HTMLInputElement | null ) ?.value || "" ;
    const destNombreInput = (document.getElementById("destNombre") as HTMLInputElement | null ) ?.value || "";
    const destDireccionInput = (document.getElementById("destDireccion") as HTMLInputElement | null ) ?.value || "";
    const destTelefonoInput = (document.getElementById("destTelefono") as HTMLInputElement | null ) ?.value || "" ;
    const observacionesInput = (document.getElementById("observaciones") as HTMLInputElement | null ) ?.value || "";

    const url = `./tirilla.html?
            
            inicial=${encodeURIComponent(clienteTelefonoInput)}
            &clienteTelefono=${encodeURIComponent(clienteTelefonoInput)}
            &clienteNombre=${encodeURIComponent(clienteNombreInput)}
            &producto=${encodeURIComponent(productoInput)}
            &fechaEntrega=${encodeURIComponent(fechaEntregaInput)}
            &horaEntrega=${encodeURIComponent(horaEntregaInput)}
            &destNombre=${encodeURIComponent(destNombreInput)}
            &destDireccion=${encodeURIComponent(destDireccionInput)} &destTelefono=${encodeURIComponent(destTelefonoInput)}
            &observaciones=${encodeURIComponent(observacionesInput)}`;
         window.open(url, "_blank", "width=400,height=600");


}

// esto es para que funcione el onclick del HTML
(window as any).verTirilla = verTirilla;

