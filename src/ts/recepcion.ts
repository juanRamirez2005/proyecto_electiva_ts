import {
  calcularTotalOpciones,
  calcularTotalAdicionales,
  haversine,
  calcularValorDomicilio
} from "./calculos.js";

const form = document.getElementById("orderForm");
const coordenadasNegocio = { lat: 4.52491, lon: -75.69787 };

// Cuando el usuario envíe el formulario
form?.addEventListener("submit", async (e) => {
  e.preventDefault(); // evitar recargar página

  // 📌 1. Datos del cliente
  const cliente : {nombre: string, telefono: string} = {
    nombre: (document.getElementById("clienteNombre") as HTMLInputElement).value,
    telefono: (document.getElementById("clienteTelefono") as HTMLInputElement).value
  };;

  // 📌 2. Datos del pedido
  const pedido : { producto : string, personalizacion: string, extras: Array<string>, fechaEntrega: string, horaEntrega: string, sorpresa: boolean} = {
    producto: (document.getElementById("producto") as HTMLInputElement).value,
    personalizacion: (document.getElementById("personalizacion") as HTMLInputElement).value,
    extras: Array.from(document.querySelectorAll("#extrasList li")).map(li => li.textContent),
    fechaEntrega: (document.getElementById("fechaEntrega") as HTMLInputElement ).value,
    horaEntrega: (document.getElementById("horaEntrega") as HTMLInputElement).value,
    sorpresa: (document.querySelector("input[name='sorpresa']:checked") as HTMLInputElement)?.checked
  };

  // 📌 3. Datos del destinatario
  const destinatario = {
    nombre: (document.getElementById("destNombre") as HTMLInputElement).value,
    direccion: (document.getElementById("destDireccion") as HTMLInputElement).value,
    telefono: (document.getElementById("destTelefono") as HTMLInputElement).value,
  };

  console.log("Cliente:", cliente);
  console.log("Pedido:", pedido);
  console.log("Destinatario:", destinatario);

  // 📌 4. Llamar función que calcule totales
  await calcularTotales(cliente, pedido, destinatario);
});


async function calcularTotales(cliente, pedido, destinatario) {
  try {
    const [opcionesRes, adicionalesRes] = await Promise.all([
      fetch("json/opciones.json"),
      fetch("json/adicionales.json")
    ]);

    const opciones = (await opcionesRes.json() as {
      opciones: Array<{
        opcion: number;
        fruta: Record<string, number>;
        flores: Record<string, number>;
        color_cinta: string;
        color_papel: string;
        color_caja: string;
        precio: number;
        tamano_grande: boolean;
      }>;
    }).opciones;
    const adicionales = (await adicionalesRes.json() as {
      adicionales: Array<{
        id: number;
        nombre: string;
        precio: number;
      }>;
    }
    ).adicionales;

    // Buscar el producto elegido
    const producto = opciones.find(o => o.opcion === Number(pedido.producto));
    const totalOpciones = producto ? producto.precio : 0;

    // Extras seleccionados (si usas IDs en lugar de texto en el <ul>, mejor)
    const extrasSeleccionados = adicionales.filter(a =>
      pedido.extras.includes(a.nombre)
    );
    const totalAdicionales = extrasSeleccionados.reduce((sum, e) => sum + e.precio, 0);

    // Distancia ficticia (aquí podrías obtener coords reales con API de geocoding)
    const coordenadasCliente = { lat: 4.58138, lon: -75.63532 };
    const distancia = haversine(
      coordenadasNegocio.lat, coordenadasNegocio.lon,
      coordenadasCliente.lat, coordenadasCliente.lon
    );
    const totalDomicilio = calcularValorDomicilio(distancia);

    // Total general
    const totalPedido = totalOpciones + totalAdicionales + totalDomicilio;

    console.log("📦 Producto:", producto?.nombre, "→ $" + totalOpciones);
    console.log("➕ Extras:", extrasSeleccionados.map(e => e.nombre), "→ $" + totalAdicionales);
    console.log("🚚 Domicilio:", distancia.toFixed(2) + " km → $" + totalDomicilio);
    console.log("🧾 TOTAL PEDIDO: $" + totalPedido);
  } catch (err) {
    console.error("❌ Error al calcular totales:", err);
  }
}