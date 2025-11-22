// Script para marcar el enlace de navegación activo
(function() {
  // Obtener la página actual
  const currentPage = window.location.pathname.split('/').pop();
  
  // Mapeo de páginas
  const pageMap = {
    'recepcion.html': 'Recepción',
    'procesamiento.html': 'Procesamiento',
    'despacho.html': 'Despacho',
    'horarios.html': 'Horarios',
    'historial.html': 'Historial',
    'empleados.html': 'Empleados',
    'home.html': 'Home',
    'inventario.html': 'Inventario'
  };
  
  // Buscar todos los enlaces de navegación
  const navLinks = document.querySelectorAll('nav a, .navegation a, .navigation a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    const linkPage = linkHref ? linkHref.split('/').pop() : '';
    
    // Si el enlace corresponde a la página actual, marcarlo como activo
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
    
    // También marcar si el texto del enlace coincide con la página actual
    const linkText = link.textContent.trim();
    const currentPageName = pageMap[currentPage];
    
    if (linkText === currentPageName || linkText === currentPageName?.toLowerCase()) {
      link.classList.add('active');
    }
  });
})();
