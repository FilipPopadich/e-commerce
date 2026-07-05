import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './PersonalInfo.css';

function PersonalInfo({ onNext }) {
    const { state, dispatch } = useAppContext();
    const [info, setInfo] = useState(state.userInfo);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!info.name.trim()) e.name = 'Name is required';
        if (!info.email.trim() || !/\S+@\S+\.\S+/.test(info.email)) e.email = 'Valid email required';
        if (!info.address.trim()) e.address = 'Shipping address required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            dispatch({ type: 'SET_USER_INFO', payload: info });
            onNext();
        }
    };

    return (
        <div className="personal-info">
            <h2 className="step-heading">Your Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={info.name}
                           onChange={e => setInfo({ ...info, name: e.target.value })} />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={info.email}
                           onChange={e => setInfo({ ...info, email: e.target.value })} />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Shipping Address</label>
                    <input type="text" name="address" value={info.address}
                           onChange={e => setInfo({ ...info, address: e.target.value })} />
                    {errors.address && <span className="error">{errors.address}</span>}
                </div>
                <button type="submit" className="btn-primary form-submit">Continue to Payment</button>
            </form>
        </div>
    );
}

export default PersonalInfo;