
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const translations = {
    en: {
        search_placeholder: "Search for products, brands, or categories...",
        search_button: "Search",
        account_hello: "Hello, Sign in",
        account_my_account: "My Account",
        orders: "Orders & Bids",
        cart: "Cart",
        shop_by_category: "Shop by Category",
        featured_products: "Featured Products",
        new_arrivals: "New Arrivals",
        add_to_cart: "Add to Cart",
        join_us_title: "Powering the Automotive & Financial Ecosystem",
        for_suppliers_title: "For Suppliers",
        for_suppliers_desc: "Showcase your products to a network of verified distributors. Manage your catalog and sync inventory seamlessly with your ERP.",
        for_suppliers_cta: "Become a Supplier",
        for_distributors_title: "For Distributors",
        for_distributors_desc: "Access a vast catalog from top suppliers and sell directly to clinics, labs, and universities. Streamline your sales and inventory.",
        for_distributors_cta: "Register as Distributor",
        footer_get_to_know_us: "Get to Know Us",
        footer_about: "About Apex",
        footer_for_suppliers: "For Suppliers",
        footer_for_distributors: "For Distributors",
        footer_careers: "Careers",
        footer_make_money: "Make Money with Us",
        footer_sell_products: "Sell products on Apex",
        footer_become_affiliate: "Become an Affiliate",
        footer_advertise: "Advertise Your Products",
        footer_let_us_help: "Let Us Help You",
        footer_your_account: "Your Account",
        footer_your_orders: "Your Orders",
        footer_shipping: "Shipping Rates & Policies",
        footer_returns: "Returns & Replacements",
        footer_help: "Help Center",
        footer_payment: "Payment Methods",
        footer_leasing: "Equipment Leasing",
        footer_invoicing: "Invoicing (CFDI)",
        footer_contact: "Contact Us",
        copyright: `© ${new Date().getFullYear()} Apex. All Rights Reserved.`,
    },
    es: {
        search_placeholder: "Buscar productos, marcas o categorías...",
        search_button: "Buscar",
        account_hello: "Hola, Inicia sesión",
        account_my_account: "Mi Cuenta",
        orders: "Pedidos y Licitaciones",
        cart: "Carrito",
        shop_by_category: "Comprar por Categoría",
        featured_products: "Productos Destacados",
        new_arrivals: "Nuevos Productos",
        add_to_cart: "Agregar al Carrito",
        join_us_title: "Impulsando el Ecosistema Automotriz y Financiero",
        for_suppliers_title: "Para Proveedores",
        for_suppliers_desc: "Exponga sus productos a una red de distribuidores verificados. Gestione su catálogo y sincronice el inventario con su ERP.",
        for_suppliers_cta: "Ser Proveedor",
        for_distributors_title: "Para Distribuidores",
        for_distributors_desc: "Acceda a un amplio catálogo de proveedores y venda directamente a negocios, talleres y distribuidores. Optimice sus ventas e inventario.",
        for_distributors_cta: "Registrarse como Distribuidor",
        footer_get_to_know_us: "Conócenos",
        footer_about: "Acerca de Apex",
        footer_for_suppliers: "Para Proveedores",
        footer_for_distributors: "Para Distribuidores",
        footer_careers: "Trabaja con nosotros",
        footer_make_money: "Gana Dinero con Nosotros",
        footer_sell_products: "Vende en Apex",
        footer_become_affiliate: "Programa de Afiliados",
        footer_advertise: "Publicita tus productos",
        footer_let_us_help: "Podemos Ayudarte",
        footer_your_account: "Tu cuenta",
        footer_your_orders: "Tus pedidos",
        footer_shipping: "Tarifas y políticas de envío",
        footer_returns: "Devoluciones y reemplazos",
        footer_help: "Centro de Ayuda",
        footer_payment: "Métodos de Pago",
        footer_leasing: "Arrendamiento de Equipo",
        footer_invoicing: "Facturación (CFDI)",
        footer_contact: "Contacto",
        copyright: `© ${new Date().getFullYear()} Apex. Todos los derechos reservados.`,
    }
};

const mockData = {
    categories: [
        { id: 1, name: {en: "Engine & Transmission", es: "Motor y Transmisión"}, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /> },
        { id: 2, name: {en: "Suspension & Steering", es: "Suspensión y Dirección"}, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6" /> },
        { id: 3, name: {en: "Electrical System", es: "Sistema Eléctrico"}, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
        { id: 4, name: {en: "Investment Products", es: "Productos de Inversión"}, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /> },
        { id: 5, name: {en: "Insurance & Coverage", es: "Seguros y Coberturas"}, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /> },
        { id: 6, name: {en: "Savings Plans", es: "Planes de Ahorro"}, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />},
    ],
    featuredProducts: [
        { id: 1, brand: "Apex Investments", name: "Fondo Conservador Plus", price: 1000, currency: "MXN", image: null },
        { id: 2, brand: "Bosch", name: "Filtro de Aceite para Toyota Corolla", price: 250, currency: "MXN", image: null },
        { id: 3, brand: "Apex Financial", name: "Plan de Ahorro Programado", price: 5000, currency: "MXN", image: null },
        { id: 4, brand: "Denso", name: "Bujías de Encendido Set x4", price: 850, currency: "MXN", image: null },
    ],
    newArrivals: [
        { id: 5, brand: "Apex Insurance", name: "Seguro de Auto Integral", price: 2500, currency: "MXN", image: null },
        { id: 6, brand: "Monroe", name: "Amortiguadores Delanteros Set", price: 1800, currency: "MXN", image: null },
        { id: 7, brand: "Apex Capital", name: "Inversión en CETES Digital", price: 10000, currency: "MXN", image: null },
        { id: 8, brand: "Gates", name: "Kit de Distribución Completo", price: 3200, currency: "MXN", image: null },
    ],
};

const MolarCrownIcon = (props) => (
  <svg className={props.className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    {/* Crown */}
    <path
      d="M60 60 L80 40 L100 55 L120 40 L140 60 L60 60 Z"
      fill="#FFC700"
    />
    <circle cx="80" cy="42" r="5" fill="#F3B000" />
    <circle cx="100" cy="57" r="5" fill="#F3B000" />
    <circle cx="120" cy="42" r="5" fill="#F3B000" />
    
    {/* Simple solid molar based on the user-provided image */}
    <path
      d="M40,180 C20,130 30,70 80,70 C105,70 115,85 120,85 C125,85 135,70 160,70 C210,70 190,130 170,180 L140,175 C125,160 115,160 100,175 L90,175 C75,160 65,160 50,175 L40,180 Z"
      fill="#2563EB"
    />
  </svg>
);
const Icon = ({ children }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">{children}</svg>;

const Header = ({ t, language, setLanguage }) => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="header">
            <div className="container header-main">
                <a href="/" className="logo">
                    <MolarCrownIcon className="logo-icon" />
                    <span>Apex</span>
                </a>
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder={t.search_placeholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="search-button" aria-label={t.search_button}>
                        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>
                    </button>
                </div>
                <div className="header-actions">
                    <a href="#" className="action-item">
                        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></Icon>
                        <div>
                           <span className="action-item-text">{t.account_hello}</span>
                           <span style={{fontWeight: 600, display: 'block'}} className="action-item-text">{t.account_my_account}</span>
                        </div>
                    </a>
                    <a href="#" className="action-item">
                        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></Icon>
                        <span className="action-item-text">{t.orders}</span>
                    </a>
                    <a href="#" className="action-item">
                       <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l.383-1.437M7.5 14.25L5.106 5.165A1.125 1.125 0 003.991 4.5H3" /></Icon>
                        <span className="action-item-text">{t.cart}</span>
                    </a>
                    <div className="lang-switcher">
                        <button onClick={() => setLanguage('en')} className={language === 'en' ? 'active' : ''}>EN</button>
                        <button onClick={() => setLanguage('es')} className={language === 'es' ? 'active' : ''}>ES</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const ProductCard = ({ product, t }) => {
    const formatPrice = (price, currency) => {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(price);
    };

    return (
        <div className="product-card">
            <a href="#" className="product-image-container">
                {product.image ?
                    <img src={product.image} alt={product.name} className="product-image" /> :
                    <div className="product-image-placeholder">
                        <MolarCrownIcon />
                    </div>
                }
            </a>
            <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <a href="#" style={{textDecoration:'none', color:'inherit'}}><h3 className="product-name">{product.name}</h3></a>
                <p className="product-price">{formatPrice(product.price, product.currency)}</p>
                <button className="add-to-cart-btn">{t.add_to_cart}</button>
            </div>
        </div>
    );
};

const ProductGrid = ({ title, products, t }) => (
    <section className="section">
        <h2 className="section-title">{title}</h2>
        <div className="product-grid">
            {products.map(product => (
                <ProductCard key={product.id} product={product} t={t} />
            ))}
        </div>
    </section>
);

const CategoryShowcase = ({ t, language }) => (
     <section className="section">
        <h2 className="section-title">{t.shop_by_category}</h2>
        <div className="category-grid">
            {mockData.categories.map(category => (
                <a href="#" key={category.id} className="category-card">
                    <div className="category-card-icon">
                        <Icon>{category.icon}</Icon>
                    </div>
                    <span className="category-card-name">{category.name[language]}</span>
                </a>
            ))}
        </div>
    </section>
);

const JoinUsSection = ({ t }) => (
    <section className="section join-us-section">
        <h2 className="section-title">{t.join_us_title}</h2>
        <div className="join-us-grid">
            <div className="join-us-card">
                <div className="join-us-icon">
                    <Icon>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                    </Icon>
                </div>
                <h3 className="join-us-card-title">{t.for_suppliers_title}</h3>
                <p className="join-us-card-desc">{t.for_suppliers_desc}</p>
                <a href="#" className="join-us-cta">{t.for_suppliers_cta}</a>
            </div>
            <div className="join-us-card">
                <div className="join-us-icon">
                    <Icon>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5V21M3 3h12m0 0l3 3m-3-3v7.5m-12 6H3.375c-.621 0-1.125-.504-1.125-1.125V13.5A2.25 2.25 0 014.5 11.25h5.25m5.25 9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m-4.5-4.5H9" />
                    </Icon>
                </div>
                <h3 className="join-us-card-title">{t.for_distributors_title}</h3>
                <p className="join-us-card-desc">{t.for_distributors_desc}</p>
                <a href="#" className="join-us-cta">{t.for_distributors_cta}</a>
            </div>
        </div>
    </section>
);


const Footer = ({ t }) => {
    const footerLinks = {
        knowUs: [
            { title: t.footer_about, link: "#" },
            { title: t.footer_for_suppliers, link: "#" },
            { title: t.footer_for_distributors, link: "#" },
            { title: t.footer_careers, link: "#" },
        ],
        makeMoney: [
            { title: t.footer_sell_products, link: "#" },
            { title: t.footer_become_affiliate, link: "#" },
            { title: t.footer_advertise, link: "#" },
        ],
        help: [
            { title: t.footer_your_account, link: "#" },
            { title: t.footer_your_orders, link: "#" },
            { title: t.footer_shipping, link: "#" },
            { title: t.footer_returns, link: "#" },
            { title: t.footer_help, link: "#" },
        ],
        more: [
            { title: t.footer_payment, link: "#" },
            { title: t.footer_leasing, link: "#" },
            { title: t.footer_invoicing, link: "#" },
            { title: t.footer_contact, link: "#" },
        ],
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-column">
                        <h3 className="column-title">{t.footer_get_to_know_us}</h3>
                        <ul>{footerLinks.knowUs.map(l => <li key={l.title}><a href={l.link}>{l.title}</a></li>)}</ul>
                    </div>
                    <div className="footer-column">
                        <h3 className="column-title">{t.footer_make_money}</h3>
                        <ul>{footerLinks.makeMoney.map(l => <li key={l.title}><a href={l.link}>{l.title}</a></li>)}</ul>
                    </div>
                     <div className="footer-column">
                        <h3 className="column-title">{t.footer_let_us_help}</h3>
                        <ul>{footerLinks.help.map(l => <li key={l.title}><a href={l.link}>{l.title}</a></li>)}</ul>
                    </div>
                    <div className="footer-column">
                        <h3 className="column-title">{t.footer_payment} &amp; More</h3>
                        <ul>{footerLinks.more.map(l => <li key={l.title}><a href={l.link}>{l.title}</a></li>)}</ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>{t.copyright}</p>
                </div>
            </div>
        </footer>
    );
}

const App = () => {
    const [language, setLanguage] = useState('en');
    const t = translations[language];

    return (
        <div className="app-container">
            <Header t={t} language={language} setLanguage={setLanguage} />
            <main className="main-content">
                <div className="container">
                    <CategoryShowcase t={t} language={language} />
                    <JoinUsSection t={t} />
                    <ProductGrid title={t.featured_products} products={mockData.featuredProducts} t={t} />
                    <ProductGrid title={t.new_arrivals} products={mockData.newArrivals} t={t} />
                </div>
            </main>
            <Footer t={t} />
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
