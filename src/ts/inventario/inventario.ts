interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  fechaCreacion: string;
  movimientos: Movimiento[];
}

interface Movimiento {
  fecha: string;
  tipo: string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string;
  productoNombre: string;
}

type TipoMensaje = 'success' | 'error';
type TipoMovimiento = 'entrada' | 'salida' | 'ajuste';

class InventarioManager {
  private productos: Producto[];
  private productoSeleccionado: Producto | null;

  constructor() {
    this.productos = this.cargarInventario();
    this.productoSeleccionado = null;
    this.initializeEventListeners();
    this.cargarProductosEnSelect();
    this.mostrarInventario();
    this.actualizarResumenSidebar();
  }

  // Cargar inventario desde localStorage
  private cargarInventario(): Producto[] {
    const inventario = localStorage.getItem('inventario');
    return inventario ? JSON.parse(inventario) : [];
  }

  // Guardar inventario en localStorage
  private guardarInventario(): void {
    localStorage.setItem('inventario', JSON.stringify(this.productos));
  }

  private initializeEventListeners(): void {
    document.getElementById('menu-toggle')?.addEventListener('click', this.toggleSidebar.bind(this));

    document.getElementById('btnAgregarProducto')?.addEventListener('click', this.agregarProducto.bind(this));

    document.getElementById('btnActualizarStock')?.addEventListener('click', this.actualizarStock.bind(this));
    document.getElementById('btnConsultarStock')?.addEventListener('click', this.consultarStock.bind(this));

    document.getElementById('btnBuscar')?.addEventListener('click', this.buscarProductos.bind(this));
    document.getElementById('btnLimpiarFiltros')?.addEventListener('click', this.limpiarFiltros.bind(this));
    document.getElementById('btnExportarInventario')?.addEventListener('click', this.exportarInventario.bind(this));

    document.querySelector('.close')?.addEventListener('click', this.cerrarModal.bind(this));
    window.addEventListener('click', (e: MouseEvent) => {
      const modal = document.getElementById('productoModal');
      if (e.target === modal) {
        this.cerrarModal();
      }
    });

  }

  private toggleSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('active');
  }

  private cargarProductosEnSelect(): void {
    const select = document.getElementById('productoSeleccionado') as HTMLSelectElement;
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Selecciona producto --</option>';
    
    this.productos.forEach(producto => {
      const option = document.createElement('option');
      option.value = producto.id;
      option.textContent = `${producto.nombre} (Stock: ${producto.stock})`;
      select.appendChild(option);
    });
  }

  private validarFormulario(formId: string): boolean {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required]');
    let esValido = true;

    inputs.forEach(input => {
      const inputElement = input as HTMLInputElement | HTMLSelectElement;
      const errorElement = document.getElementById(`err-${inputElement.name}`);
      if (!inputElement.value.trim()) {
        if (errorElement) {
          errorElement.textContent = 'Este campo es obligatorio';
        }
        esValido = false;
      } else {
        if (errorElement) {
          errorElement.textContent = '';
        }
      }
    });

    return esValido;
  }

  private validarFormularioAgregarProducto(): boolean {
    const nombre = document.getElementById('productoNombre') as HTMLInputElement;
    const categoria = document.getElementById('productoCategoria') as HTMLSelectElement;
    const precio = document.getElementById('productoPrecio') as HTMLInputElement;
    const stockInicial = document.getElementById('productoStockInicial') as HTMLInputElement;
    
    let esValido = true;

    if (!nombre?.value.trim()) {
      const errorElement = document.getElementById('err-productoNombre');
      if (errorElement) {
        errorElement.textContent = 'El nombre del producto es obligatorio';
      }
      esValido = false;
    } else {
      const errorElement = document.getElementById('err-productoNombre');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    if (!categoria?.value) {
      const errorElement = document.getElementById('err-productoCategoria');
      if (errorElement) {
        errorElement.textContent = 'La categoría es obligatoria';
      }
      esValido = false;
    } else {
      const errorElement = document.getElementById('err-productoCategoria');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    if (!precio?.value || parseFloat(precio.value) <= 0) {
      const errorElement = document.getElementById('err-productoPrecio');
      if (errorElement) {
        errorElement.textContent = 'El precio debe ser mayor a 0';
      }
      esValido = false;
    } else {
      const errorElement = document.getElementById('err-productoPrecio');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    if (!stockInicial?.value || parseInt(stockInicial.value) < 0) {
      const errorElement = document.getElementById('err-productoStockInicial');
      if (errorElement) {
        errorElement.textContent = 'El stock inicial debe ser mayor o igual a 0';
      }
      esValido = false;
    } else {
      const errorElement = document.getElementById('err-productoStockInicial');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    return esValido;
  }

  private agregarProducto(): void {
    if (!this.validarFormularioAgregarProducto()) {
      return;
    }

    const nombreInput = document.getElementById('productoNombre') as HTMLInputElement;
    const descripcionInput = document.getElementById('productoDescripcion') as HTMLTextAreaElement;
    const categoriaInput = document.getElementById('productoCategoria') as HTMLSelectElement;
    const precioInput = document.getElementById('productoPrecio') as HTMLInputElement;
    const stockInicialInput = document.getElementById('productoStockInicial') as HTMLInputElement;
    const stockMinimoInput = document.getElementById('productoStockMinimo') as HTMLInputElement;

    const producto: Producto = {
      id: Date.now().toString(),
      nombre: nombreInput.value.trim(),
      descripcion: descripcionInput.value.trim(),
      categoria: categoriaInput.value,
      precio: parseFloat(precioInput.value),
      stock: parseInt(stockInicialInput.value),
      stockMinimo: parseInt(stockMinimoInput.value) || 0,
      fechaCreacion: new Date().toISOString(),
      movimientos: []
    };

    this.productos.push(producto);
    this.guardarInventario();
    this.cargarProductosEnSelect();
    this.mostrarInventario();
    this.actualizarResumenSidebar();
    this.limpiarFormulario('inventoryForm');
    
    this.mostrarMensaje('Producto agregado exitosamente', 'success');
  }

  private validarFormularioStock(): boolean {
    const productoSeleccionado = document.getElementById('productoSeleccionado') as HTMLSelectElement;
    const tipoMovimiento = document.getElementById('tipoMovimiento') as HTMLSelectElement;
    const cantidadMovimiento = document.getElementById('cantidadMovimiento') as HTMLInputElement;
    
    let esValido = true;

    if (!productoSeleccionado?.value) {
      const errorElement = document.getElementById('err-productoSeleccionado');
      if (errorElement) {
        errorElement.textContent = 'Debes seleccionar un producto';
      }
      esValido = false;
    } else {
      const errorElement = document.getElementById('err-productoSeleccionado');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    if (!tipoMovimiento?.value) {
      const errorElement = document.getElementById('err-tipoMovimiento');
      if (errorElement) {
        errorElement.textContent = 'Debes seleccionar un tipo de movimiento';
      }
      esValido = false;
    } else {
      const errorElement = document.getElementById('err-tipoMovimiento');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    if (!cantidadMovimiento?.value || parseInt(cantidadMovimiento.value) <= 0) {
      const errorElement = document.getElementById('err-cantidadMovimiento');
      if (errorElement) {
        errorElement.textContent = 'La cantidad debe ser mayor a 0';
      }
      esValido = false;
    } else {
      const errorElement = document.getElementById('err-cantidadMovimiento');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    return esValido;
  }

  private actualizarStock(): void {
    if (!this.validarFormularioStock()) {
      return;
    }

    const productoSeleccionado = document.getElementById('productoSeleccionado') as HTMLSelectElement;
    const tipoMovimiento = document.getElementById('tipoMovimiento') as HTMLSelectElement;
    const cantidadMovimiento = document.getElementById('cantidadMovimiento') as HTMLInputElement;
    const motivoMovimiento = document.getElementById('motivoMovimiento') as HTMLTextAreaElement;

    const productoId = productoSeleccionado.value;
    const tipoMovimientoValue = tipoMovimiento.value as TipoMovimiento;
    const cantidad = parseInt(cantidadMovimiento.value);
    const motivo = motivoMovimiento.value.trim();

    const producto = this.productos.find(p => p.id === productoId);
    if (!producto) {
      this.mostrarMensaje('Producto no encontrado', 'error');
      return;
    }

    let nuevoStock = producto.stock;
    let tipoOperacion = '';

    switch (tipoMovimientoValue) {
      case 'entrada':
        nuevoStock += cantidad;
        tipoOperacion = 'Entrada';
        break;
      case 'salida':
        if (cantidad > producto.stock) {
          this.mostrarMensaje('No hay suficiente stock disponible', 'error');
          return;
        }
        nuevoStock -= cantidad;
        tipoOperacion = 'Salida';
        break;
      case 'ajuste':
        nuevoStock = cantidad;
        tipoOperacion = 'Ajuste';
        break;
    }

    // Registrar movimiento
    const movimiento: Movimiento = {
      fecha: new Date().toISOString(),
      tipo: tipoOperacion,
      cantidad: cantidad,
      stockAnterior: producto.stock,
      stockNuevo: nuevoStock,
      motivo: motivo || 'Sin motivo especificado',
      productoNombre: producto.nombre
    };

    producto.movimientos.push(movimiento);
    producto.stock = nuevoStock;

    this.guardarInventario();
    this.cargarProductosEnSelect();
    this.mostrarInventario();
    this.actualizarResumenSidebar();
    this.limpiarFormulario('inventoryForm');
    
    this.mostrarMensaje(`Stock actualizado: ${tipoOperacion} de ${cantidad} unidades`, 'success');
  }

  // Consultar stock
  private consultarStock(): void {
    const productoSeleccionado = document.getElementById('productoSeleccionado') as HTMLSelectElement;
    const productoId = productoSeleccionado.value;
    if (!productoId) {
      this.mostrarMensaje('Selecciona un producto', 'error');
      return;
    }

    const producto = this.productos.find(p => p.id === productoId);
    if (!producto) {
      this.mostrarMensaje('Producto no encontrado', 'error');
      return;
    }

    this.mostrarDetallesProducto(producto);
  }

  private mostrarDetallesProducto(producto: Producto): void {
    const modal = document.getElementById('productoModal');
    const titulo = document.getElementById('modalTitulo');
    const contenido = document.getElementById('modalContenido');

    if (!modal || !titulo || !contenido) return;

    titulo.textContent = producto.nombre;
    contenido.innerHTML = `
      <div class="detalle-card">
        <div class="detalle-header">Información General</div>
        <div class="detalle-body">
          <p><b>Nombre:</b> ${producto.nombre}</p>
          <p><b>Categoría:</b> ${producto.categoria}</p>
          <p><b>Precio:</b> $${producto.precio.toFixed(2)}</p>
          <p><b>Stock actual:</b> <span class="${this.getStockClass(producto.stock, producto.stockMinimo)}">${producto.stock}</span></p>
          <p><b>Stock mínimo:</b> ${producto.stockMinimo}</p>
          <p><b>Estado:</b> ${this.getEstadoStock(producto.stock, producto.stockMinimo)}</p>
        </div>
      </div>
      ${producto.descripcion ? `<div class="detalle-card">
        <div class="detalle-header">Descripción</div>
        <div class="detalle-body">
          <p>${producto.descripcion}</p>
        </div>
      </div>` : ''}
      ${producto.movimientos.length > 0 ? `<div class="detalle-card">
        <div class="detalle-header">Últimos Movimientos</div>
        <div class="detalle-body">
          ${producto.movimientos.slice(-5).reverse().map(mov => `
            <p><b>${mov.tipo}:</b> ${mov.cantidad} unidades (${new Date(mov.fecha).toLocaleDateString()})</p>
            <p><small>Motivo: ${mov.motivo}</small></p>
          `).join('')}
        </div>
      </div>` : ''}
    `;

    modal.style.display = 'block';
  }

  // Obtener clase CSS para el stock
  private getStockClass(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'stock-agotado';
    if (stock <= stockMinimo) return 'stock-bajo';
    return 'stock-disponible';
  }

  // Obtener estado del stock
  private getEstadoStock(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'Agotado';
    if (stock <= stockMinimo) return 'Stock bajo';
    return 'Disponible';
  }

  // Cerrar modal
  private cerrarModal(): void {
    const modal = document.getElementById('productoModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Buscar productos
  private buscarProductos(): void {
    console.log('Iniciando búsqueda de productos...');
    
    const buscarProducto = document.getElementById('buscarProducto') as HTMLInputElement;
    const filtroCategoria = document.getElementById('filtroCategoria') as HTMLSelectElement;
    const filtroStock = document.getElementById('filtroStock') as HTMLSelectElement;

    if (!buscarProducto || !filtroCategoria || !filtroStock) {
      console.error('No se encontraron los elementos de búsqueda');
      return;
    }

    const busqueda = buscarProducto.value?.toLowerCase().trim() || '';
    const categoria = filtroCategoria.value || '';
    const stock = filtroStock.value || '';

    console.log('Filtros aplicados:', { busqueda, categoria, stock });

    let productosFiltrados = [...this.productos]; // Crear copia para no modificar el original

    // Filtro por nombre
    if (busqueda) {
      productosFiltrados = productosFiltrados.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) ||
        p.descripcion.toLowerCase().includes(busqueda)
      );
      console.log(`Filtro por nombre: ${productosFiltrados.length} productos encontrados`);
    }

    // Filtro por categoría
    if (categoria) {
      productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
      console.log(`Filtro por categoría: ${productosFiltrados.length} productos encontrados`);
    }

    // Filtro por stock
    if (stock) {
      productosFiltrados = productosFiltrados.filter(p => {
        switch (stock) {
          case 'bajo':
            return p.stock <= p.stockMinimo && p.stock > 0;
          case 'agotado':
            return p.stock === 0;
          case 'disponible':
            return p.stock > p.stockMinimo;
          default:
            return true;
        }
      });
      console.log(`Filtro por stock: ${productosFiltrados.length} productos encontrados`);
    }

    console.log(`Búsqueda completada: ${productosFiltrados.length} productos mostrados`);
    this.mostrarInventario(productosFiltrados);
  }

  // Limpiar filtros
  private limpiarFiltros(): void {
    console.log('🧹 Limpiando filtros...');
    
    const buscarProducto = document.getElementById('buscarProducto') as HTMLInputElement;
    const filtroCategoria = document.getElementById('filtroCategoria') as HTMLSelectElement;
    const filtroStock = document.getElementById('filtroStock') as HTMLSelectElement;

    if (buscarProducto) {
      buscarProducto.value = '';
      console.log('Campo de búsqueda limpiado');
    }
    if (filtroCategoria) {
      filtroCategoria.value = '';
      console.log('Filtro de categoría limpiado');
    }
    if (filtroStock) {
      filtroStock.value = '';
      console.log('Filtro de stock limpiado');
    }
    
    console.log('Mostrando inventario completo');
    this.mostrarInventario();
  }

  // Mostrar inventario en tabla
  private mostrarInventario(productos: Producto[] = this.productos): void {
    const tablaContainer = document.getElementById('tablaInventario');
    const tbody = document.getElementById('tablaProductosBody');

    if (!tablaContainer || !tbody) return;

    if (productos.length === 0) {
      tablaContainer.style.display = 'none';
      return;
    }

    tablaContainer.style.display = 'block';
    tbody.innerHTML = '';

    productos.forEach(producto => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td><span class="${this.getStockClass(producto.stock, producto.stockMinimo)}">${producto.stock}</span></td>
        <td>$${producto.precio.toFixed(2)}</td>
        <td>${this.getEstadoStock(producto.stock, producto.stockMinimo)}</td>
        <td>
          <button class="accion-btn ver" data-producto='${JSON.stringify(producto)}'>Ver</button>
          <button class="accion-btn editar" data-id='${producto.id}'>Editar</button>
          <button class="accion-btn eliminar" data-id='${producto.id}'>Eliminar</button>
        </td>
      `;
      
      // Agregar event listeners a los botones
      const verBtn = row.querySelector('.ver') as HTMLButtonElement;
      const editarBtn = row.querySelector('.editar') as HTMLButtonElement;
      const eliminarBtn = row.querySelector('.eliminar') as HTMLButtonElement;
      
      verBtn?.addEventListener('click', () => {
        this.mostrarDetallesProducto(producto);
      });
      
      editarBtn?.addEventListener('click', () => {
        this.editarProducto(producto.id);
      });
      
      eliminarBtn?.addEventListener('click', () => {
        this.eliminarProducto(producto.id);
      });
      
      tbody.appendChild(row);
    });
  }

  // Editar producto
  private editarProducto(id: string): void {
    console.log('✏️ Editando producto con ID:', id);
    
    const producto = this.productos.find(p => p.id === id);
    if (!producto) {
      console.error('Producto no encontrado');
      return;
    }

    console.log('Producto encontrado:', producto.nombre);

    const nombreInput = document.getElementById('productoNombre') as HTMLInputElement;
    const descripcionInput = document.getElementById('productoDescripcion') as HTMLTextAreaElement;
    const categoriaInput = document.getElementById('productoCategoria') as HTMLSelectElement;
    const precioInput = document.getElementById('productoPrecio') as HTMLInputElement;
    const stockInicialInput = document.getElementById('productoStockInicial') as HTMLInputElement;
    const stockMinimoInput = document.getElementById('productoStockMinimo') as HTMLInputElement;

    // Llenar formulario con datos del producto
    if (nombreInput) nombreInput.value = producto.nombre;
    if (descripcionInput) descripcionInput.value = producto.descripcion;
    if (categoriaInput) categoriaInput.value = producto.categoria;
    if (precioInput) precioInput.value = producto.precio.toString();
    if (stockInicialInput) stockInicialInput.value = producto.stock.toString();
    if (stockMinimoInput) stockMinimoInput.value = producto.stockMinimo.toString();

    // Cambiar botón a "Actualizar" y remover listeners anteriores
    const btn = document.getElementById('btnAgregarProducto') as HTMLButtonElement;
    if (btn) {
      // Remover todos los event listeners anteriores
      const newBtn = btn.cloneNode(true) as HTMLButtonElement;
      btn.parentNode?.replaceChild(newBtn, btn);
      
      newBtn.textContent = 'Actualizar Producto';
      newBtn.onclick = () => {
        console.log('Actualizando producto con ID:', id);
        this.actualizarProducto(id);
      };
    }

    console.log('Formulario llenado y botón configurado para actualizar');
    
    // Scroll al formulario
    const section = document.querySelector('.section') as HTMLElement;
    section?.scrollIntoView({ behavior: 'smooth' });
  }

  // Actualizar producto
  private actualizarProducto(id: string): void {
    console.log('Iniciando actualización del producto con ID:', id);
    
    if (!this.validarFormularioAgregarProducto()) {
      console.log('Validación fallida');
      return;
    }

    const productoIndex = this.productos.findIndex(p => p.id === id);
    if (productoIndex === -1) {
      console.error('Producto no encontrado en el array');
      return;
    }

    console.log('Producto encontrado en índice:', productoIndex);

    const nombreInput = document.getElementById('productoNombre') as HTMLInputElement;
    const descripcionInput = document.getElementById('productoDescripcion') as HTMLTextAreaElement;
    const categoriaInput = document.getElementById('productoCategoria') as HTMLSelectElement;
    const precioInput = document.getElementById('productoPrecio') as HTMLInputElement;
    const stockInicialInput = document.getElementById('productoStockInicial') as HTMLInputElement;
    const stockMinimoInput = document.getElementById('productoStockMinimo') as HTMLInputElement;

    // Actualizar el producto existente en lugar de crear uno nuevo
    const productoExistente = this.productos[productoIndex];
    if (!productoExistente) {
      console.error('Producto no encontrado en el índice');
      return;
    }
    
    this.productos[productoIndex] = {
      id: productoExistente.id,
      nombre: nombreInput.value.trim(),
      descripcion: descripcionInput.value.trim(),
      categoria: categoriaInput.value,
      precio: parseFloat(precioInput.value),
      stock: parseInt(stockInicialInput.value),
      stockMinimo: parseInt(stockMinimoInput.value) || 0,
      fechaCreacion: productoExistente.fechaCreacion,
      movimientos: productoExistente.movimientos
    };

    console.log('Producto actualizado:', this.productos[productoIndex]?.nombre);

    this.guardarInventario();
    this.cargarProductosEnSelect();
    this.mostrarInventario();
    this.actualizarResumenSidebar();
    this.limpiarFormulario('inventoryForm');

    // Restaurar botón correctamente
    const btn = document.getElementById('btnAgregarProducto') as HTMLButtonElement;
    if (btn) {
      // Remover listeners anteriores y crear uno nuevo
      const newBtn = btn.cloneNode(true) as HTMLButtonElement;
      btn.parentNode?.replaceChild(newBtn, btn);
      
      newBtn.textContent = 'Agregar Producto';
      newBtn.onclick = () => this.agregarProducto();
    }

    console.log('🎉 Producto actualizado exitosamente');
    this.mostrarMensaje('Producto actualizado exitosamente', 'success');
  }

  // Eliminar producto
  private eliminarProducto(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productos = this.productos.filter(p => p.id !== id);
      this.guardarInventario();
      this.cargarProductosEnSelect();
      this.mostrarInventario();
      this.actualizarResumenSidebar();
      this.mostrarMensaje('Producto eliminado exitosamente', 'success');
    }
  }

  // Actualizar resumen del sidebar
  private actualizarResumenSidebar(): void {
    this.actualizarEstadisticas();
    this.actualizarStockBajo();
    this.actualizarStockAgotado();
    this.actualizarCategorias();
    this.actualizarMovimientosRecientes();
  }

  // Actualizar estadísticas generales
  private actualizarEstadisticas(): void {
    const totalProductos = this.productos.length;
    const totalStock = this.productos.reduce((sum, p) => sum + p.stock, 0);
    const valorInventario = this.productos.reduce((sum, p) => sum + (p.stock * p.precio), 0);

    const totalProductosElement = document.getElementById('totalProductos');
    const totalStockElement = document.getElementById('totalStock');
    const valorInventarioElement = document.getElementById('valorInventario');

    if (totalProductosElement) totalProductosElement.textContent = totalProductos.toString();
    if (totalStockElement) totalStockElement.textContent = totalStock.toString();
    if (valorInventarioElement) valorInventarioElement.textContent = `$${valorInventario.toFixed(2)}`;
  }

  // Actualizar lista de stock bajo
  private actualizarStockBajo(): void {
    const productosStockBajo = this.productos.filter(p => p.stock <= p.stockMinimo && p.stock > 0);
    const container = document.getElementById('listaStockBajo');

    if (!container) return;

    if (productosStockBajo.length === 0) {
      container.innerHTML = '<p class="sin-productos">No hay productos con stock bajo</p>';
      return;
    }

    container.innerHTML = productosStockBajo.map(producto => `
      <div class="producto-item stock-bajo-item">
        <div class="producto-nombre">${producto.nombre}</div>
        <div class="producto-stock">Stock: ${producto.stock} (Mín: ${producto.stockMinimo})</div>
      </div>
    `).join('');
  }

  // Actualizar lista de stock agotado
  private actualizarStockAgotado(): void {
    const productosAgotados = this.productos.filter(p => p.stock === 0);
    const container = document.getElementById('listaStockAgotado');

    if (!container) return;

    if (productosAgotados.length === 0) {
      container.innerHTML = '<p class="sin-productos">No hay productos agotados</p>';
      return;
    }

    container.innerHTML = productosAgotados.map(producto => `
      <div class="producto-item stock-agotado-item">
        <div class="producto-nombre">${producto.nombre}</div>
        <div class="producto-stock">Stock: ${producto.stock}</div>
      </div>
    `).join('');
  }

  // Actualizar categorías
  private actualizarCategorias(): void {
    const categorias: { [key: string]: number } = {};
    this.productos.forEach(producto => {
      categorias[producto.categoria] = (categorias[producto.categoria] || 0) + 1;
    });

    const container = document.getElementById('listaCategorias');
    if (!container) return;
    
    if (Object.keys(categorias).length === 0) {
      container.innerHTML = '<p class="sin-productos">No hay productos</p>';
      return;
    }

    const categoriasArray = Object.keys(categorias).map(key => [key, categorias[key]] as [string, number]);
    container.innerHTML = categoriasArray
      .sort(([,a], [,b]) => b - a)
      .map(([categoria, cantidad]) => `
        <div class="categoria-item">
          <span class="categoria-nombre">${categoria}</span>
          <span class="categoria-cantidad">${cantidad}</span>
        </div>
      `).join('');
  }

  // Actualizar movimientos recientes
  private actualizarMovimientosRecientes(): void {
    const todosLosMovimientos: (Movimiento & { productoNombre: string })[] = [];
    
    this.productos.forEach(producto => {
      producto.movimientos.forEach(movimiento => {
        todosLosMovimientos.push({
          ...movimiento,
          productoNombre: producto.nombre
        });
      });
    });

    // Ordenar por fecha (más recientes primero)
    todosLosMovimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    const movimientosRecientes = todosLosMovimientos.slice(0, 5);
    const container = document.getElementById('listaMovimientos');

    if (!container) return;

    if (movimientosRecientes.length === 0) {
      container.innerHTML = '<p class="sin-productos">No hay movimientos recientes</p>';
      return;
    }

    container.innerHTML = movimientosRecientes.map(movimiento => `
      <div class="movimiento-item">
        <div class="movimiento-tipo">${movimiento.tipo}</div>
        <div class="movimiento-producto">${movimiento.productoNombre} (${movimiento.cantidad} unidades)</div>
        <div class="movimiento-fecha">${new Date(movimiento.fecha).toLocaleDateString()}</div>
      </div>
    `).join('');
  }

  // Limpiar formulario
  private limpiarFormulario(formId: string): void {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const inputElement = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      inputElement.value = '';
      const errorElement = document.getElementById(`err-${inputElement.name}`);
      if (errorElement) errorElement.textContent = '';
    });
  }

  // Exportar inventario
  private exportarInventario(): void {
    const csvContent = this.generarCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Generar CSV
  private generarCSV(): string {
    const headers = ['Nombre', 'Categoría', 'Precio', 'Stock', 'Stock Mínimo', 'Estado'];
    const rows = this.productos.map(p => [
      p.nombre,
      p.categoria,
      p.precio.toString(),
      p.stock.toString(),
      p.stockMinimo.toString(),
      this.getEstadoStock(p.stock, p.stockMinimo)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private mostrarMensaje(mensaje: string, tipo: TipoMensaje): void {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 500;
      z-index: 3000;
      background-color: ${tipo === 'success' ? '#10b981' : '#ef4444'};
    `;

    document.body.appendChild(mensajeDiv);

    setTimeout(() => {
      mensajeDiv.remove();
    }, 3000);
  }
}

let inventarioManager: InventarioManager;
document.addEventListener('DOMContentLoaded', () => {
  inventarioManager = new InventarioManager();
});