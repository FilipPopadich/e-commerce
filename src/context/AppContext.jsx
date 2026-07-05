import React, { createContext, useReducer, useContext } from 'react';
import { products as initialProducts } from '../data/products';

const AppContext = createContext();

const initialState = {
    products: initialProducts,
    cart: [],
    checkoutStep: 0,
    userInfo: { name: '', email: '', address: '' },
    paymentInfo: { cardNumber: '', expiry: '', cvv: '' },
    lastOrderItemCount: 0,
};

function appReducer(state, action) {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const { quantity, ...item } = action.payload;
            const qtyToAdd = quantity || 1;
            const cartId = `${item.id}-${item.selectedColour || 'default'}-${item.selectedSize || 'default'}`;
            const existing = state.cart.find(c => c.cartId === cartId);
            if (existing) {
                return {
                    ...state,
                    cart: state.cart.map(c =>
                        c.cartId === cartId ? { ...c, quantity: c.quantity + qtyToAdd } : c
                    ),
                };
            }
            return {
                ...state,
                cart: [...state.cart, { ...item, cartId, quantity: qtyToAdd }],
            };
        }

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.cartId !== action.payload),
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.cartId === action.payload.cartId
                        ? { ...item, quantity: Math.max(1, action.payload.quantity) }
                        : item
                ),
            };

        case 'CLEAR_CART':
            return { ...state, cart: [] };

        case 'NEXT_CHECKOUT_STEP': {
            const nextStep = state.checkoutStep + 1;
            const enteringConfirmation = nextStep === 3;
            return {
                ...state,
                checkoutStep: nextStep,
                lastOrderItemCount: enteringConfirmation
                    ? state.cart.reduce((sum, item) => sum + item.quantity, 0)
                    : state.lastOrderItemCount,
                cart: enteringConfirmation ? [] : state.cart,
            };
        }

        case 'PREV_CHECKOUT_STEP':
            return { ...state, checkoutStep: Math.max(0, state.checkoutStep - 1) };

        case 'SET_CHECKOUT_STEP':
            return { ...state, checkoutStep: Math.max(0, Math.min(state.checkoutStep, action.payload)) };

        case 'SET_USER_INFO':
            return { ...state, userInfo: { ...state.userInfo, ...action.payload } };

        case 'SET_PAYMENT_INFO':
            return { ...state, paymentInfo: { ...state.paymentInfo, ...action.payload } };

        case 'RESET_CHECKOUT':
            return {
                ...state,
                checkoutStep: 0,
                userInfo: { name: '', email: '', address: '' },
                paymentInfo: { cardNumber: '', expiry: '', cvv: '' },
                cart: [],
            };

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}