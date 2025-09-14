import { 
  calcularTotalOpciones, 
  calcularTotalAdicionales, 
  haversine, 
  calcularValorDomicilio 
} from "./utils/calculos.js";

// Datos seleccionados (ejemplo)
const opcionesSeleccionadas = [2, 5];
const adicionalesSeleccionados = [1, 4];

const coordenadasNegocio = { lat: 4.52491, lon: -75.69787 };
const coordenadasCliente = { lat: 4.58138, lon: -75.63532 };

// Variables globales
let totalOpciones = 0;
let totalAdicionales = 0;
let totalDomicilio = 0;

export function calcularTotalPedido() {
  Promise.all([
    fetch('json/opciones.json').then(res => res.ok ? res.json() : Promise.reject(res.status)),
    fetch('json/adicionales.json').then(res => res.ok ? res.json() : Promise.reject(res.status))
  ])
  .then(([opcionesData, adicionalesData]) => {
    const opciones = opcionesData.opciones;
    const adicionales = adicionalesData.adicionales;

    totalOpciones = calcularTotalOpciones(opciones, opcionesSeleccionadas);
    totalAdicionales = calcularTotalAdicionales(adicionales, adicionalesSeleccionados);

    const distancia = haversine(
      coordenadasNegocio.lat,
      coordenadasNegocio.lon,
      coordenadasCliente.lat,
      coordenadasCliente.lon
    );
    totalDomicilio = calcularValorDomicilio(distancia);

    // Mostrar resultados
    console.log("Total opciones: $" + totalOpciones);
    console.log("Total adicionales: $" + totalAdicionales);
    console.log("Distancia: " + distancia.toFixed(2) + " km");
    console.log("Valor domicilio: $" + totalDomicilio);

    const totalPedido = totalOpciones + totalAdicionales + totalDomicilio;
    console.log("🧾 Total del pedido: $" + totalPedido);
  })
  .catch(error => console.error("❌ Error al cargar los datos:", error));
}

// Llamar al cálculo al inicio
calcularTotalPedido();