import React from 'react';
import { useAppContext } from '../../context/AppContext';
import ProgressBar from '../common/ProgressBar';
import CartItem from '../cart/CartItem';
import PersonalInfo from './PersonalInfo';
import Payment from './Payment';
import Confirmation from './Confirmation';
import './Checkout.css';

const steps = ['Review', 'Details', 'Payment', 'Confirmed'];

function Checkout() {
    const { state, dispatch } = useAppContext();
    const { checkoutStep, cart } = state;

    const goToNext = () => dispatch({ type: 'NEXT_CHECKOUT_STEP' });
    const goToPrev = () => dispatch({ type: 'PREV_CHECKOUT_STEP' });
    const goToStep = (step) => dispatch({ type: 'SET_CHECKOUT_STEP', payload: step });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="checkout-page container">
            <h1 className="checkout-title">Checkout</h1>
            <ProgressBar
                steps={steps}
                currentStep={checkoutStep}
                onStepClick={checkoutStep < 3 ? goToStep : undefined}
            />

            {checkoutStep === 0 && (
                <div className="checkout-review">
                    {cart.length === 0 ? (
                        <p className="review-count">Your bag is empty.</p>
                    ) : (
                        <>
                            <div className="checkout-review-items">
                                {cart.map(item => (
                                    <CartItem key={item.cartId} item={item} />
                                ))}
                            </div>
                            <div className="checkout-review-total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                    <button className="btn-primary" onClick={goToNext} disabled={cart.length === 0}>
                        Continue to Details
                    </button>
                </div>
            )}
            {checkoutStep === 1 && <PersonalInfo onNext={goToNext} />}
            {checkoutStep === 2 && <Payment onNext={goToNext} onBack={goToPrev} />}
            {checkoutStep === 3 && <Confirmation />}
        </div>
    );
}

export default Checkout;