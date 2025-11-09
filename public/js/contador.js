export class Contador {
    constructor() {
        // Cargar el valor existente de sessionStorage o inicializar en 0
        const valorGuardado = sessionStorage.getItem('contador');
        this.valor = valorGuardado ? parseInt(valorGuardado, 10) : 0;
        // Solo guardar si no existía previamente
        if (!valorGuardado) {
            sessionStorage.setItem('contador', this.valor.toString());
        }
    }
    incrementar() {
        this.valor++;
        sessionStorage.setItem('contador', this.valor.toString());
    }
    getValor() {
        return this.valor;
    }
}
