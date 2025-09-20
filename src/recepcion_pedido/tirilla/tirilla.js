function verTirilla() {
    // Capturar datos
    debugger
    const clienteNombre = document.getElementById("clienteNombre").value;
    const clienteTelefono = document.getElementById("clienteTelefono").value;
    const producto = document.getElementById("producto").value;
    const fechaEntrega = document.getElementById("fechaEntrega").value;
    const horaEntrega = document.getElementById("horaEntrega").value;
    const destNombre = document.getElementById("destNombre").value;
    const destDireccion = document.getElementById("destDireccion").value;
    const destTelefono = document.getElementById("destTelefono").value;
    const observaciones = document.getElementById("observaciones").value;

    const extra = document.querySelector("#extrasList li")?.textContent || "";

    const url = `tirilla/tirilla.html?
                
                
                clienteTelefono=${encodeURIComponent(clienteTelefono)}
                &clienteNombre=${encodeURIComponent(clienteNombre)}
                &producto=${encodeURIComponent(producto)}
                &extra=${encodeURIComponent(extra)}
                &fechaEntrega=${encodeURIComponent(fechaEntrega)}
                &horaEntrega=${encodeURIComponent(horaEntrega)}
                &destNombre=${encodeURIComponent(destNombre)}
                &destDireccion=${encodeURIComponent(destDireccion)}
                &destTelefono=${encodeURIComponent(destTelefono)}
                &observaciones=${encodeURIComponent(observaciones)}`;


    window.open(url, "_blank", "width=400,height=600");
}

// esto es para que uncione el onclick del HTML
window.verTirilla = verTirilla;
