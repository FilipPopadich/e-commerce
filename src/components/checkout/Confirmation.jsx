import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './Confirmation.css';

function Confirmation() {
    const { state, dispatch } = useAppContext();
    const { userInfo, lastOrderItemCount } = state;

    return (
        <div className="confirmation">
            <h2>Order Confirmed</h2>
            <p>Thank you, {userInfo.name}. Your order is on its way.</p>
            <p className="conf-address">Shipping to: {userInfo.address}</p>
            <p className="conf-items">{lastOrderItemCount} item(s) ordered</p>
            <Link to="/" className="btn-primary" onClick={() => dispatch({ type: 'RESET_CHECKOUT' })}>
                Continue Shopping
            </Link>
        </div>
    );
}

export default Confirmation;