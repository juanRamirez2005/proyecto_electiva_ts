// Configuración de recarga automática
class AutoReload {
  constructor() {
    this.isActive = false;
    this.interval = null;
    this.intervalTime = 30000; // 30 segundos por defecto
    this.countdown = 0;
    this.countdownInterval = null;
    
    this.init();
  }

  init() {
    // Crear el componente HTML
    this.createComponent();
    
    // Cargar configuración guardada
    this.loadSettings();
    
    // Configurar event listeners
    this.setupEventListeners();
    
    // Mostrar estado inicial
    this.updateUI();
  }

  createComponent() {
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

  setupEventListeners() {
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

  toggleAutoReload() {
    if (this.isActive) {
      this.stopAutoReload();
    } else {
      this.startAutoReload();
    }
  }

  startAutoReload() {
    this.isActive = true;
    this.startCountdown();
    this.updateUI();
    this.saveSettings();
    
    // Mostrar notificación
    this.showNotification('Recarga automática activada', 'success');
  }

  stopAutoReload() {
    this.isActive = false;
    this.clearIntervals();
    this.updateUI();
    this.saveSettings();
    
    // Mostrar notificación
    this.showNotification('Recarga automática desactivada', 'info');
  }

  pauseAutoReload() {
    if (this.isActive) {
      this.clearIntervals();
      this.timer.textContent = 'Pausado';
      this.timer.className = 'autoreload-timer show warning';
    }
  }

  resumeAutoReload() {
    if (this.isActive) {
      this.startCountdown();
    }
  }

  startCountdown() {
    this.countdown = this.intervalTime / 1000;
    this.updateTimer();
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      this.updateTimer();
      
      if (this.countdown <= 0) {
        this.reloadPage();
      }
    }, 1000);
  }

  updateTimer() {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    const timeString = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
    
    this.timer.textContent = timeString;
    this.timer.className = 'autoreload-timer show';
    
    // Cambiar color según tiempo restante
    if (this.countdown <= 5) {
      this.timer.className = 'autoreload-timer show danger';
    } else if (this.countdown <= 10) {
      this.timer.className = 'autoreload-timer show warning';
    }
  }

  clearIntervals() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  reloadPage() {
    // Mostrar notificación antes de recargar
    this.showNotification('Recargando página...', 'info');
    
    // Pequeño delay para que se vea la notificación
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  updateUI() {
    if (this.isActive) {
      this.toggle.classList.add('active');
      this.toggle.title = 'Desactivar recarga automática';
    } else {
      this.toggle.classList.remove('active');
      this.toggle.title = 'Activar recarga automática';
      this.timer.className = 'autoreload-timer';
    }
  }

  showStatus() {
    if (this.isActive) {
      this.status.textContent = `Recarga automática activada (${this.intervalTime / 1000}s)`;
    } else {
      this.status.textContent = 'Recarga automática desactivada';
    }
    this.status.classList.add('show');
  }

  hideStatus() {
    this.status.classList.remove('show');
  }

  showIntervalMenu() {
    const intervals = [
      { label: '15 segundos', value: 15000 },
      { label: '30 segundos', value: 30000 },
      { label: '1 minuto', value: 60000 },
      { label: '2 minutos', value: 120000 },
      { label: '5 minutos', value: 300000 },
      { label: '10 minutos', value: 600000 }
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
        this.setInterval(interval.value);
        document.body.removeChild(menu);
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
    const closeMenu = (e) => {
      if (!menu.contains(e.target) && e.target !== this.toggle) {
        document.body.removeChild(menu);
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 100);

    document.body.appendChild(menu);
  }

  setInterval(time) {
    this.intervalTime = time;
    this.saveSettings();
    
    if (this.isActive) {
      this.clearIntervals();
      this.startCountdown();
    }
    
    this.showNotification(`Intervalo cambiado a ${time / 1000} segundos`, 'success');
  }

  showNotification(message, type = 'info') {
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

  saveSettings() {
    const settings = {
      isActive: this.isActive,
      intervalTime: this.intervalTime
    };
    localStorage.setItem('autoreloadSettings', JSON.stringify(settings));
  }

  loadSettings() {
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
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Solo inicializar si no existe ya
  if (!window.autoReloadInstance) {
    window.autoReloadInstance = new AutoReload();
  }
});

// Exportar para uso global
window.AutoReload = AutoReload;
