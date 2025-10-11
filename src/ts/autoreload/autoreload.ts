/**
 * Clase para manejar la recarga automática de páginas
 * Migrada de JavaScript a TypeScript con tipado fuerte
 */
export class AutoReload {
    private isActive: boolean = false;
    private interval: number | null = null;
    private intervalTime: number = 30000; // 30 segundos por defecto
    private countdown: number = 0;
    private countdownInterval: number | null = null;
    
    // Elementos DOM
    private toggle: HTMLElement | null = null;
    private status: HTMLElement | null = null;
    private timer: HTMLElement | null = null;

    constructor() {
        this.init();
    }

    /**
     * Inicializa el componente de recarga automática
     */
    private init(): void {
        // Crear el componente HTML
        this.createComponent();
        
        // Cargar configuración guardada
        this.loadSettings();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Mostrar estado inicial
        this.updateUI();
    }

    /**
     * Crea el componente HTML del autoreload
     */
    private createComponent(): void {
        // Crear contenedor
        const container = document.createElement('div');
        container.className = 'autoreload-container';
        container.innerHTML = `
            <div class="autoreload-toggle" id="autoreloadToggle" title="Activar/Desactivar recarga automática">
                <span class="autoreload-icon">🔄</span>
            </div>
            <div class="autoreload-status" id="autoreloadStatus">Recarga automática activada</div>
            <div class="autoreload-timer" id="autoreloadTimer">30s</div>
        `;
        
        // Agregar al body
        document.body.appendChild(container);
        
        // Guardar referencias
        this.toggle = document.getElementById('autoreloadToggle');
        this.status = document.getElementById('autoreloadStatus');
        this.timer = document.getElementById('autoreloadTimer');
    }

    /**
     * Configura todos los event listeners
     */
    private setupEventListeners(): void {
        if (!this.toggle) {
            console.error('Elemento toggle no encontrado');
            return;
        }

        // Click en el toggle
        this.toggle.addEventListener('click', () => {
            this.toggleAutoReload();
        });

        // Click derecho para configurar intervalo
        this.toggle.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showIntervalMenu();
        });

        // Hover para mostrar estado
        this.toggle.addEventListener('mouseenter', () => {
            this.showStatus();
        });

        this.toggle.addEventListener('mouseleave', () => {
            this.hideStatus();
        });

        // Detener recarga cuando la página se va a recargar
        window.addEventListener('beforeunload', () => {
            this.stopAutoReload();
        });

        // Detener recarga cuando la página pierde el foco
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoReload();
            } else {
                this.resumeAutoReload();
            }
        });
    }

    /**
     * Alterna el estado de la recarga automática
     */
    public toggleAutoReload(): void {
        if (this.isActive) {
            this.stopAutoReload();
        } else {
            this.startAutoReload();
        }
    }

    /**
     * Inicia la recarga automática
     */
    public startAutoReload(): void {
        this.isActive = true;
        this.startCountdown();
        this.updateUI();
        this.saveSettings();
        
        // Mostrar notificación
        this.showNotification('Recarga automática activada', 'success');
    }

    /**
     * Detiene la recarga automática
     */
    public stopAutoReload(): void {
        this.isActive = false;
        this.clearIntervals();
        this.updateUI();
        this.saveSettings();
        
        // Mostrar notificación
        this.showNotification('Recarga automática desactivada', 'info');
    }

    /**
     * Pausa la recarga automática
     */
    public pauseAutoReload(): void {
        if (this.isActive) {
            this.clearIntervals();
            if (this.timer) {
                this.timer.textContent = 'Pausado';
                this.timer.className = 'autoreload-timer show warning';
            }
        }
    }

    /**
     * Reanuda la recarga automática
     */
    public resumeAutoReload(): void {
        if (this.isActive) {
            this.startCountdown();
        }
    }

    /**
     * Inicia el countdown para la recarga
     */
    private startCountdown(): void {
        this.countdown = this.intervalTime / 1000;
        this.updateTimer();
        
        this.countdownInterval = window.setInterval(() => {
            this.countdown--;
            this.updateTimer();
            
            if (this.countdown <= 0) {
                this.reloadPage();
            }
        }, 1000);
    }

    /**
     * Actualiza el display del timer
     */
    private updateTimer(): void {
        if (!this.timer) return;

        const minutes = Math.floor(this.countdown / 60);
        const seconds = this.countdown % 60;
        
        // Implementación manual de padStart para compatibilidad
        const secondsStr = seconds < 10 ? `0${seconds}` : seconds.toString();
        const timeString = minutes > 0 ? `${minutes}:${secondsStr}` : `${seconds}s`;
        
        this.timer.textContent = timeString;
        this.timer.className = 'autoreload-timer show';
        
        // Cambiar color según tiempo restante
        if (this.countdown <= 5) {
            this.timer.className = 'autoreload-timer show danger';
        } else if (this.countdown <= 10) {
            this.timer.className = 'autoreload-timer show warning';
        }
    }

    /**
     * Limpia todos los intervalos
     */
    private clearIntervals(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    /**
     * Recarga la página
     */
    private reloadPage(): void {
        // Mostrar notificación antes de recargar
        this.showNotification('Recargando página...', 'info');
        
        // Pequeño delay para que se vea la notificación
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    /**
     * Actualiza la interfaz de usuario
     */
    private updateUI(): void {
        if (!this.toggle || !this.timer) return;

        if (this.isActive) {
            this.toggle.classList.add('active');
            this.toggle.setAttribute('title', 'Desactivar recarga automática');
        } else {
            this.toggle.classList.remove('active');
            this.toggle.setAttribute('title', 'Activar recarga automática');
            this.timer.className = 'autoreload-timer';
        }
    }

    /**
     * Muestra el estado del autoreload
     */
    private showStatus(): void {
        if (!this.status) return;

        if (this.isActive) {
            this.status.textContent = `Recarga automática activada (${this.intervalTime / 1000}s)`;
        } else {
            this.status.textContent = 'Recarga automática desactivada';
        }
        this.status.classList.add('show');
    }

    /**
     * Oculta el estado del autoreload
     */
    private hideStatus(): void {
        if (this.status) {
            this.status.classList.remove('show');
        }
    }

    /**
     * Muestra el menú de configuración de intervalos
     */
    private showIntervalMenu(): void {
        const intervals: Array<{label: string, value: number}> = [
            { label: '10 segundos', value: 10000 },
            { label: '15 segundos', value: 15000 },
            { label: '30 segundos', value: 30000 },
            { label: '1 minuto', value: 60000 },
            { label: '2 minutos', value: 120000 },
            { label: '5 minutos', value: 300000 },
            { label: '10 minutos', value: 600000 },
            { label: '30 minutos', value: 1800000 },
            { label: '1 hora', value: 3600000 },
            { label: 'Tiempo personalizado...', value: -1 }
        ];

        const menu = document.createElement('div');
        menu.className = 'autoreload-menu';
        menu.style.cssText = `
            position: absolute;
            top: 60px;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 0.5rem 0;
            min-width: 150px;
            z-index: 1001;
        `;

        intervals.forEach(interval => {
            const item = document.createElement('div');
            item.className = 'autoreload-menu-item';
            item.style.cssText = `
                padding: 0.5rem 1rem;
                cursor: pointer;
                transition: background-color 0.2s;
                font-size: 0.9rem;
                color: #374151;
            `;
            item.textContent = interval.label;
            
            if (interval.value === this.intervalTime) {
                item.style.backgroundColor = '#e3f2fd';
                item.style.color = '#1e40af';
            }
            
            item.addEventListener('click', () => {
                if (interval.value === -1) {
                    this.setCustomInterval();
                } else {
                    this.setInterval(interval.value);
                }
                if (document.body.contains(menu)) {
                    document.body.removeChild(menu);
                }
            });
            
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f3f4f6';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = interval.value === this.intervalTime ? '#e3f2fd' : 'transparent';
            });
            
            menu.appendChild(item);
        });

        // Cerrar menú al hacer click fuera
        const closeMenu = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!menu.contains(target) && target !== this.toggle) {
                if (document.body.contains(menu)) {
                    document.body.removeChild(menu);
                }
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);

        document.body.appendChild(menu);
    }

    /**
     * Establece un nuevo intervalo de recarga
     * @param time - Tiempo en milisegundos
     */
    public setInterval(time: number): void {
        this.intervalTime = time;
        this.saveSettings();
        
        if (this.isActive) {
            this.clearIntervals();
            this.startCountdown();
        }
        
        this.showNotification(`Intervalo cambiado a ${time / 1000} segundos`, 'success');
    }

    /**
     * Establece el intervalo en segundos
     * @param seconds - Tiempo en segundos
     */
    public setIntervalSeconds(seconds: number): void {
        this.setInterval(seconds * 1000);
    }

    /**
     * Establece el intervalo en minutos
     * @param minutes - Tiempo en minutos
     */
    public setIntervalMinutes(minutes: number): void {
        this.setInterval(minutes * 60 * 1000);
    }

    /**
     * Permite al usuario establecer un tiempo personalizado
     */
    public setCustomInterval(): void {
        const timeString = prompt(
            'Ingresa el tiempo de recarga:\n\n' +
            'Ejemplos:\n' +
            '• 30 (30 segundos)\n' +
            '• 1m (1 minuto)\n' +
            '• 2m30s (2 minutos 30 segundos)\n' +
            '• 5m (5 minutos)\n\n' +
            'Tiempo actual: ' + (this.intervalTime / 1000) + ' segundos'
        );

        if (timeString) {
            const time = this.parseTimeString(timeString);
            if (time > 0) {
                this.setInterval(time);
            } else {
                this.showNotification('Formato de tiempo inválido', 'error');
            }
        }
    }

    /**
     * Parsea una cadena de tiempo en milisegundos
     * @param timeString - Cadena de tiempo (ej: "1m30s", "30", "2m")
     * @returns Tiempo en milisegundos
     */
    private parseTimeString(timeString: string): number {
        const cleanString = timeString.trim().toLowerCase();
        
        // Si es solo un número, asumir segundos
        if (/^\d+$/.test(cleanString)) {
            return parseInt(cleanString) * 1000;
        }
        
        let totalMs = 0;
        
        // Buscar minutos (m)
        const minutesMatch = cleanString.match(/(\d+)m/);
        if (minutesMatch && minutesMatch[1]) {
            totalMs += parseInt(minutesMatch[1]) * 60 * 1000;
        }
        
        // Buscar segundos (s)
        const secondsMatch = cleanString.match(/(\d+)s/);
        if (secondsMatch && secondsMatch[1]) {
            totalMs += parseInt(secondsMatch[1]) * 1000;
        }
        
        // Si no hay sufijos, asumir que son segundos
        if (!minutesMatch && !secondsMatch && /^\d+$/.test(cleanString)) {
            totalMs = parseInt(cleanString) * 1000;
        }
        
        return totalMs;
    }

    /**
     * Muestra una notificación temporal
     * @param message - Mensaje a mostrar
     * @param type - Tipo de notificación
     */
    private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'autoreload-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1002;
            font-size: 0.9rem;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Guarda la configuración en localStorage
     */
    private saveSettings(): void {
        const settings = {
            isActive: this.isActive,
            intervalTime: this.intervalTime
        };
        localStorage.setItem('autoreloadSettings', JSON.stringify(settings));
    }

    /**
     * Carga la configuración desde localStorage
     */
    private loadSettings(): void {
        const saved = localStorage.getItem('autoreloadSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.isActive = settings.isActive || false;
                this.intervalTime = settings.intervalTime || 30000;
            } catch (error) {
                console.error('Error al cargar configuración de autoreload:', error);
            }
        }
    }

    
    /**
     * Obtiene el estado actual del autoreload
     * @returns true si está activo, false si no
     */
    public getIsActive(): boolean {
        return this.isActive;
    }

    /**
     * Obtiene el tiempo de intervalo actual
     * @returns Tiempo en milisegundos
     */
    public getIntervalTime(): number {
        return this.intervalTime;
    }

    /**
     * Destruye la instancia y limpia recursos
     */
    public destroy(): void {
        this.clearIntervals();
        if (this.toggle && this.toggle.parentNode) {
            this.toggle.parentNode.removeChild(this.toggle.parentNode);
        }
    }
}

// Instancia global para acceso desde HTML
declare global {
    interface Window {
        autoReloadInstance: AutoReload;
        AutoReload: typeof AutoReload;
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si no existe ya
    if (!window.autoReloadInstance) {
        window.autoReloadInstance = new AutoReload();
    }
});

// Exportar para uso global
window.AutoReload = AutoReload;

// Exportar la clase para uso en módulos
export default AutoReload;