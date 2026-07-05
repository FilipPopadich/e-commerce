import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './Header.css';

function Header() {
    const { state } = useAppContext();
    const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const shopMenuRef = useRef(null);
    const shopDropdownRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [location.pathname, location.search]);

    useEffect(() => {
        const onClickOutside = (e) => {
            const clickedMenu = shopMenuRef.current && shopMenuRef.current.contains(e.target);
            const clickedDropdown = shopDropdownRef.current && shopDropdownRef.current.contains(e.target);
            if (!clickedMenu && !clickedDropdown) setOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    const showSolidHeader = scrolled || open;

    return (
        <header className={`header ${isHome ? 'header--home' : ''} ${showSolidHeader ? 'header--scrolled' : ''}`}>
            <div className="header-inner container">
                <Link to="/" className="logo">FORM</Link>
                <nav className="header-center">
                    <div className="shop-menu" ref={shopMenuRef}>
                        <button
                            type="button"
                            className={`nav-link shop-link ${open ? 'open' : ''} ${location.pathname === '/shop' ? 'active' : ''}`}
                            onClick={() => setOpen(o => !o)}
                            aria-expanded={open}
                        >
                            Shop
                            <svg className="shop-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </nav>
                <nav className="header-right">
                    <Link to="/cart" className="nav-link cart-link">
                        <svg className="bag-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                            <path d="M3 6h18" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Bag
                        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                    </Link>
                </nav>
            </div>
            <div className={`shop-dropdown ${open ? 'is-open' : ''}`} ref={shopDropdownRef}>
                <div className="shop-dropdown-inner container">
                    <div className="shop-dropdown-col">
                        <h4 className="shop-dropdown-heading">Clothing</h4>
                        <Link to="/shop?category=tops">Tops</Link>
                        <Link to="/shop?category=bottoms">Bottoms</Link>
                        <Link to="/shop?category=outerwear">Outerwear</Link>
                    </div>
                    <div className="shop-dropdown-col">
                        <h4 className="shop-dropdown-heading">Accessories</h4>
                        <Link to="/shop?category=hats">Hats</Link>
                        <Link to="/shop?category=bags">Bags</Link>
                        <Link to="/shop?category=accessories">Accessories</Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;