// Datos globales
let products = [
    {
        id: 1,
        code: 'PHONE001',
        name: 'iPhone 15 Pro',
        price: 899999,
        stock: 10,
        criticalStock: 5,
        category: 'smartphones',
        description: 'El iPhone más avanzado con chip A17 Pro y cámara de titanio',
        image: '📱'
    },
    {
        id: 2,
        code: 'LAPTOP001',
        name: 'MacBook Pro 14"',
        price: 1599999,
        stock: 8,
        criticalStock: 3,
        category: 'laptops',
        description: 'Potente laptop con chip M3 Pro para profesionales creativos',
        image: '💻'
    },
    {
        id: 3,
        code: 'TABLET001',
        name: 'iPad Pro 12.9"',
        price: 799999,
        stock: 15,
        criticalStock: 5,
        category: 'tablets',
        description: 'Tablet profesional con pantalla Liquid Retina XDR',
        image: '📱'
    },
    {
        id: 4,
        code: 'ACC001',
        name: 'AirPods Pro',
        price: 199999,
        stock: 25,
        criticalStock: 10,
        category: 'accesorios',
        description: 'Auriculares inalámbricos con cancelación de ruido activa',
        image: '🎧'
    }
];

let users = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let editingUserId = null;
let editingProductId = null;

// Datos de regiones y comunas de Chile
const regionsData = {
    'metropolitana': {
        name: 'Región Metropolitana',
        communes: ['Santiago', 'Las Condes', 'Providencia', 'Ñuñoa', 'La Florida', 'Maipú', 'Puente Alto', 'San Miguel']
    },
    'valparaiso': {
        name: 'Región de Valparaíso',
        communes: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Los Andes']
    },
    'biobio': {
        name: 'Región del Biobío',
        communes: ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Coronel', 'San Pedro de la Paz']
    },
    'araucania': {
        name: 'Región de La Araucanía',
        communes: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Nueva Imperial', 'Angol']
    },
    'antofagasta': {
        name: 'Región de Antofagasta',
        communes: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'San Pedro de Atacama']
    }
};

// Blogs data
const blogsData = {
    1: {
        title: 'Las últimas tendencias en smartphones 2024',
        image: '📱',
        content: `
            <p>El mundo de los smartphones continúa evolucionando a un ritmo acelerado, y 2024 no es la excepción. Este año hemos sido testigos de innovaciones que están redefiniendo completamente nuestra experiencia móvil.</p>
            
            <h3>Inteligencia Artificial Integrada</h3>
            <p>La IA ya no es solo una característica adicional, sino el corazón de los nuevos dispositivos. Los procesadores especializados en IA están permitiendo funciones como traducción en tiempo real, fotografía computacional avanzada y asistentes personalizados más inteligentes.</p>
            
            <h3>Cámaras Revolucionarias</h3>
            <p>Los sistemas de cámaras múltiples han alcanzado nuevos niveles de sofisticación. Sensores de mayor resolución, lentes periscópicas para zoom óptico extremo y algoritmos de procesamiento de imagen que rivalizan con cámaras profesionales.</p>
            
            <h3>Baterías y Carga Rápida</h3>
            <p>La autonomía sigue siendo crucial. Las nuevas tecnologías de batería prometen mayor duración, mientras que los sistemas de carga rápida inalámbrica e inversa se están convirtiendo en estándar.</p>
            
            <h3>Pantallas Plegables</h3>
            <p>Los dispositivos plegables ya no son experimentales. Con mejores materiales y bisagras más duraderas, están comenzando a ganar tracción en el mercado masivo.</p>
        `
    },
    2: {
        title: 'Cómo elegir la laptop perfecta para trabajo remoto',
        image: '💻',
        content: `
            <p>El trabajo remoto se ha consolidado como una modalidad laboral permanente, y elegir la laptop adecuada es fundamental para mantener la productividad y comodidad en el hogar.</p>
            
            <h3>Rendimiento y Procesador</h3>
            <p>Para trabajo remoto, busca procesadores de al menos 8 núcleos con tecnología de última generación. Los chips M3 de Apple o los Intel Core i7/i9 de 13va generación ofrecen un excelente balance entre rendimiento y eficiencia energética.</p>
            
            <h3>Memoria RAM y Almacenamiento</h3>
            <p>16GB de RAM es el mínimo recomendado para multitarea fluida. Para almacenamiento, los SSD de 512GB o 1TB proporcionan velocidad y espacio suficiente para la mayoría de profesionales.</p>
            
            <h3>Pantalla y Ergonomía</h3>
            <p>Una pantalla de al menos 14 pulgadas con resolución Full HD es ideal. Considera pantallas con alta fidelidad de color si trabajas con diseño gráfico o edición de video.</p>
            
            <h3>Conectividad</h3>
            <p>Asegúrate de tener múltiples puertos USB, HDMI para monitor externo, y conectividad WiFi 6 para internet estable. Los puertos Thunderbolt son un plus para conexiones de alta velocidad.</p>
            
            <h3>Batería y Portabilidad</h3>
            <p>Busca laptops con al menos 8-10 horas de autonomía. El peso también importa si necesitas movilidad ocasional.</p>
        `
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    updateCartCount();
    loadRegions();
    loadAdminData();
    
    // Event listeners para formularios
    setupFormEventListeners();
    
    // Cargar datos guardados
    if (currentUser) {
        updateUserInterface();
    }
}

function setupFormEventListeners() {
    // Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
        
        // Region change listener
        const regionSelect = document.getElementById('registerRegion');
        if (regionSelect) {
            regionSelect.addEventListener('change', function() {
                loadCommunes('registerCommune', this.value);
            });
        }
    }
    
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Admin forms
    const adminUserForm = document.getElementById('adminUserForm');
    if (adminUserForm) {
        adminUserForm.addEventListener('submit', handleAdminUserSubmit);
        
        const adminRegionSelect = document.getElementById('adminUserRegion');
        if (adminRegionSelect) {
            adminRegionSelect.addEventListener('change', function() {
                loadCommunes('adminUserCommune', this.value);
            });
        }
    }
    
    const adminProductForm = document.getElementById('adminProductForm');
    if (adminProductForm) {
        adminProductForm.addEventListener('submit', handleAdminProductSubmit);
    }
}

// Navegación entre páginas
function showPage(pageId) {
    // Ocultar todas las páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostrar página seleccionada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Cargar contenido específico según la página
        if (pageId === 'products') {
            loadProducts();
        } else if (pageId === 'admin') {
            loadAdminData();
        }
    }
}

// Productos
function loadProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    const allProductsContainer = document.getElementById('allProducts');
    
    if (featuredContainer) {
        featuredContainer.innerHTML = '';
        // Mostrar primeros 4 productos como destacados
        products.slice(0, 4).forEach(product => {
            featuredContainer.appendChild(createProductCard(product));
        });
    }
    
    if (allProductsContainer) {
        allProductsContainer.innerHTML = '';
        products.forEach(product => {
            allProductsContainer.appendChild(createProductCard(product));
        });
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetail(product.id);
    
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toLocaleString()}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                Añadir al Carrito
            </button>
        </div>
    `;
    
    return card;
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const container = document.getElementById('productDetailContent');
    container.innerHTML = `
        <div class="product-detail">
            <button class="back-btn" onclick="showPage('products')">← Volver a Productos</button>
            <div class="product-detail-content">
                <div class="product-detail-image">${product.image}</div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="product-detail-price">$${product.price.toLocaleString()}</p>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-stock">
                        <strong>Stock disponible: ${product.stock} unidades</strong>
                        ${product.stock <= product.criticalStock ? 
                            `<div class="stock-critical">⚠️ Stock crítico - Quedan pocas unidades</div>` : ''
                        }
                    </div>
                    <div class="quantity-selector">
                        <button onclick="changeQuantity(-1)">-</button>
                        <input type="number" id="productQuantity" value="1" min="1" max="${product.stock}">
                        <button onclick="changeQuantity(1)">+</button>
                    </div>
                    <button class="btn" onclick="addToCart(${product.id})" style="width: 100%;">
                        Añadir al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showPage('productDetail');
}

function changeQuantity(delta) {
    const input = document.getElementById('productQuantity');
    if (input) {
        const newValue = parseInt(input.value) + delta;
        const max = parseInt(input.max);
        const min = parseInt(input.min);
        
        if (newValue >= min && newValue <= max) {
            input.value = newValue;
        }
    }
}

// Carrito de compras
function addToCart(productId, quantity = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantityInput = document.getElementById('productQuantity');
    const qty = quantity || (quantityInput ? parseInt(quantityInput.value) : 1);
    
    if (qty > product.stock) {
        alert('No hay suficiente stock disponible');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + qty;
        if (newQuantity <= product.stock) {
            existingItem.quantity = newQuantity;
        } else {
            alert('No puedes añadir más cantidad. Stock insuficiente.');
            return;
        }
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: qty
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Mostrar mensaje de éxito
    showAlert('Producto añadido al carrito', 'success');
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function openCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!modal || !cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
                </div>
                <div style="font-weight: bold;">$${itemTotal.toLocaleString()}</div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    cartTotal.textContent = total.toLocaleString();
    modal.classList.add('active');
}
              