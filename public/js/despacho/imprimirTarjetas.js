document.addEventListener("DOMContentLoaded", () => {
    const btnImprimir = document.getElementById("btnImprimirTarjetas");
    const contenedor = document.getElementById("contenedorTarjetas");
    btnImprimir.addEventListener("click", () => {
        const tarjetasGuardadas = JSON.parse(localStorage.getItem("tarjetas") || "[]");
        if (tarjetasGuardadas.length === 0) {
            alert("no hay tarjetas guardadas para imprimir.");
            return;
        }
        // limpiar el contenedor antes de agregar otra tarjetas
        contenedor.innerHTML = "";
        tarjetasGuardadas.forEach((t, i) => {
            const tarjetaHTML = `
        <div class="tarjeta">
          <div class="decoracion">🎀</div>
          <h2>Con cariño para:</h2>
          <p class="para">${t.para}</p>

          <h3>De:</h3>
          <p class="de">${t.de}</p>

          <div class="mensaje">
            <p>${t.mensaje}</p> 
          </div>
        </div>
        <hr style="margin:40px 0; border:1px dashed #d97fa3;">
      `;
            contenedor.innerHTML += tarjetaHTML;
        });
        // Muestra el contenedor de tarjetas y abre el diálogo de impresión
        contenedor.style.display = "block";
        window.print();
    });
});
export {};
