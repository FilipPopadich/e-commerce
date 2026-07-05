import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './CartItem.css';

function CartItem({ item }) {
    const { dispatch } = useAppContext();

    const handleQty = (e) => {
        const qty = parseInt(e.target.value, 10);
        if (qty >= 1) dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId: item.cartId, quantity: qty } });
    };

    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
                <div className="item-top">
                    <div>
                        <h4 className="item-name">{item.name}</h4>
                        <p className="item-colour">{item.selectedColour}{item.selectedSize ? ` / ${item.selectedSize}` : ''}</p>
                    </div>
                    <span className="item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="item-bottom">
                    <label className="qty-label">
                        Qty
                        <input type="number" min="1" value={item.quantity} onChange={handleQty} />
                    </label>
                    <button onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.cartId })} className="btn-remove">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;