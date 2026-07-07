import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner container">
                <div className="footer-brand">
                    <span className="footer-logo">FORM</span>
                    <p>Considered clothing. Made to last.</p>
                </div>

                <div className="footer-col">
                    <h4 className="footer-heading">Shop</h4>
                    <Link to="/shop">All Products</Link>
                    <Link to="/shop?category=tops">Tops</Link>
                    <Link to="/shop?category=bottoms">Bottoms</Link>
                    <Link to="/shop?category=outerwear">Outerwear</Link>
                    <Link to="/shop?category=hats">Hats</Link>
                    <Link to="/shop?category=bags">Bags</Link>
                    <Link to="/shop?category=accessories">Accessories</Link>
                </div>

                <div className="footer-col">
                    <h4 className="footer-heading">Help</h4>
                    <Link to="/survey">Contact Us</Link>
                </div>

                <div className="footer-col footer-visit">
                    <h4 className="footer-heading">Visit</h4>
                    <p>142 Main Street</p>
                    <p>Ottawa, ON, Canada, K2S 4W2</p>
                    <p>hello@form.com</p>
                    <p>+1 (613) 555-6666</p>
                </div>
            </div>

            <div className="footer-bottom container">
                <p className="footer-copy">© 2026 FORM. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;