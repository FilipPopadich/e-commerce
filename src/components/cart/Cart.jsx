import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import CartItem from './CartItem';
import './Cart.css';

function Cart() {
    const { state, dispatch } = useAppContext();
    const { cart } = state;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="cart-empty container">
                <p>Your bag is empty.</p>
                <Link to="/shop" className="btn-primary">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <h1 className="cart-title">Your Bag</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {cart.map(item => (
                        <CartItem key={item.cartId} item={item} />
                    ))}
                </div>

                <aside className="cart-sidebar">
                    <h2 className="sidebar-title">Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <Link to="/checkout" className="btn-primary checkout-btn">Proceed to Checkout</Link>
                    <button onClick={() => dispatch({ type: 'CLEAR_CART' })} className="btn-secondary clear-btn">
                        Clear Bag
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default Cart;