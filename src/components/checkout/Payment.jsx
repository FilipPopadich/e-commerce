import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Payment.css';

const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

function Payment({ onNext, onBack }) {
    const { state, dispatch } = useAppContext();
    const [info, setInfo] = useState(state.paymentInfo);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!info.cardNumber.trim() || info.cardNumber.replace(/\s/g,'').length < 16)
            e.cardNumber = 'Enter a valid 16-digit card number';
        if (!info.expiry.trim() || !/^\d{2}\/\d{2}$/.test(info.expiry))
            e.expiry = 'Use MM/YY format';
        if (!info.cvv.trim() || info.cvv.length < 3)
            e.cvv = 'Enter 3-digit CVV';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            dispatch({ type: 'SET_PAYMENT_INFO', payload: info });
            onNext();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cardNumber') {
            setInfo(prev => ({ ...prev, cardNumber: formatCardNumber(value) }));
        } else if (name === 'expiry') {
            setInfo(prev => ({ ...prev, expiry: formatExpiry(value) }));
        } else if (name === 'cvv') {
            setInfo(prev => ({ ...prev, cvv: value.replace(/\D/g, '').slice(0, 4) }));
        } else {
            setInfo(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="payment">
            <h2 className="step-heading">Payment</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" inputMode="numeric" name="cardNumber" value={info.cardNumber}
                           onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength="19" />
                    {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Expiry</label>
                        <input type="text" inputMode="numeric" name="expiry" value={info.expiry}
                               onChange={handleChange} placeholder="MM/YY" maxLength="5" />
                        {errors.expiry && <span className="error">{errors.expiry}</span>}
                    </div>
                    <div className="form-group">
                        <label>CVV</label>
                        <input type="text" inputMode="numeric" name="cvv" value={info.cvv}
                               onChange={handleChange} placeholder="123" maxLength="4" />
                        {errors.cvv && <span className="error">{errors.cvv}</span>}
                    </div>
                </div>
                <div className="payment-actions">
                    <button type="button" className="btn-secondary" onClick={onBack}>Back</button>
                    <button type="submit" className="btn-primary">Place Order</button>
                </div>
            </form>
        </div>
    );
}

export default Payment;