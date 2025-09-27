// Función para distancia (Haversine)
  export function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const toRad = angle => angle * Math.PI / 180;
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  // Calcular valor del domicilio
  export function calcularValorDomicilio(distancia: number) : number {
    if (distancia <= 2.0) return 0;
    if (distancia <= 5.0) return 5000;
    return 8000;
  }
  
  // Calcular total de opciones
  export function calcularTotalOpciones(opciones, seleccionadas) {
    return opciones.reduce((total, opcion) => {
      return seleccionadas.includes(opcion.opcion) ? total + opcion.precio : total;
    }, 0);
  }
  
  // Calcular total de adicionales
  export function calcularTotalAdicionales(adicionales, seleccionadas) {
    return adicionales.reduce((total, adicional) => {
      return seleccionadas.includes(adicional.id) ? total + adicional.precio : total;
    }, 0);
  }