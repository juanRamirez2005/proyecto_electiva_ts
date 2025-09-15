function cambiarEstadoBoton() {
    const botones = document.querySelectorAll(".btn-cambiar-estado");

    botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        const tarjeta = boton.closest(".pedido");
        const estado = tarjeta.querySelector(".status");

        if (estado.classList.contains("pending")) {
          estado.classList.remove("pending");
          estado.classList.add("delivered");
          estado.textContent = "Entregado";
        }
      });
    });
}

function eliminarTarjeta() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const tarjeta = boton.closest(".pedido");
            tarjeta.remove();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cambiarEstadoBoton();
    eliminarTarjeta();
});


function calcularDomicilio() {
    /*
    TODO: tener en cuenta el ID del pedido
    TODO: tener en cuenta el tiempo de entrega
    TODO: tener en cuenta el nombre del cliente

    para poder agrupar los pedidos y calcular en función
    de esas tres variables



    */
}