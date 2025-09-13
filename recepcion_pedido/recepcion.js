// Opciones seleccionadas por el usuario (puedes cambiarlas dinámicamente)
const opcionesSeleccionadas = [2, 5];
const adicionalesSeleccionados = [1, 4];

// Coordenadas del negocio y del cliente
const coordenadasNegocio = { lat: 4.52491, lon: -75.69787 };
const coordenadasCliente = { lat: 4.58138, lon: -75.63532 };

// Variables globales para almacenar los totales parciales
let totalOpciones = 0;
let totalAdicionales = 0;
let totalDomicilio = 0;

function calcularTotalPedido() {
  Promise.all([
    fetch('json/opciones.json').then(res => res.ok ? res.json() : Promise.reject(res.status)),
    fetch('json/adicionales.json').then(res => res.ok ? res.json() : Promise.reject(res.status))
  ])
  .then(([opcionesData, adicionalesData]) => {
    // Obtener arrays desde los archivos JSON
    const opciones = opcionesData.opciones;
    const adicionales = adicionalesData.adicionales;

    // Calcular subtotales
    totalOpciones = calcularTotalOpciones(opciones, opcionesSeleccionadas);
    totalAdicionales = calcularTotalAdicionales(adicionales, adicionalesSeleccionados);

    // Calcular distancia y valor de domicilio
    const distancia = haversine(
      coordenadasNegocio.lat,
      coordenadasNegocio.lon,
      coordenadasCliente.lat,
      coordenadasCliente.lon
    );
    totalDomicilio = calcularValorDomicilio(distancia);

    // Mostrar totales
    console.log("Total opciones: $" + totalOpciones);
    console.log("Total adicionales: $" + totalAdicionales);
    console.log("Distancia: " + distancia.toFixed(2) + " km");
    console.log("Valor domicilio: $" + totalDomicilio);

    // Total general
    const totalPedido = totalOpciones + totalAdicionales + totalDomicilio;
    console.log("🧾 Total del pedido: $" + totalPedido);
  })
  .catch(error => {
    console.error("❌ Error al cargar los datos:", error);
  });
}


function calcularTotalOpciones(opciones, seleccionadas) {
  return opciones.reduce((total, opcion) => {
    return seleccionadas.includes(opcion.opcion) ? total + opcion.precio : total;
  }, 0);
}

function calcularTotalAdicionales(adicionales, seleccionadas) {
  return adicionales.reduce((total, adicional) => {
    return seleccionadas.includes(adicional.id) ? total + adicional.precio : total;
  }, 0);
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const toRad = angle => angle * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Devuelve la distancia en km
}

function calcularValorDomicilio(distancia) {
  if (distancia <= 2.0) {
    return 0; // Envío gratuito o incluido
  } else if (distancia > 2.0 && distancia <= 5.0) {
    return 5000;
  } else {
    return 8000;
  }
}

calcularTotalPedido();