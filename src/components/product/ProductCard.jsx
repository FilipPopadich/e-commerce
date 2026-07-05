import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './ProductCard.css';

function ProductCard({ product }) {
    const { dispatch } = useAppContext();
    const [pickerOpen, setPickerOpen] = useState(false);
    const [selectedColour, setSelectedColour] = useState(product.colours[0]?.name || '');
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
    const isOneSize = product.sizes.length === 1 && product.sizes[0] === 'One Size';

    const addToCart = (colour, size) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                ...product,
                selectedColour: colour,
                selectedSize: size,
            },
        });
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOneSize) {
            addToCart(product.colours[0]?.name, product.sizes[0]);
        } else {
            setSelectedColour(product.colours[0]?.name || '');
            setSelectedSize(product.sizes[0] || '');
            setPickerOpen(true);
        }
    };

    const confirmAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(selectedColour, selectedSize);
        setPickerOpen(false);
    };

    const closePicker = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setPickerOpen(false);
    };

    useEffect(() => {
        if (!pickerOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setPickerOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [pickerOpen]);

    return (
        <>
            <Link to={`/product/${product.id}`} className="product-card">
                <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} />
                    <div className="product-overlay">
                        <span className="overlay-hint">View Details</span>
                    </div>
                </div>
                <div className="product-info">
                    <div className="product-meta">
                        <h4 className="product-name">{product.name}</h4>
                    </div>
                    <div className="product-footer">
                        <span className="price">${product.price.toFixed(2)}</span>
                        <button className="btn-add" onClick={handleAddToCart}>Add to Bag</button>
                    </div>
                </div>
            </Link>

            {pickerOpen && (
                <div className="quick-add-overlay" onMouseDown={closePicker}>
                    <div className="quick-add-panel" onMouseDown={(e) => e.stopPropagation()}>
                        <div className="quick-add-header">
                            <h4>{product.name}</h4>
                            <button type="button" className="quick-add-close" onClick={closePicker} aria-label="Close">
                                ×
                            </button>
                        </div>

                        <div className="quick-add-body">
                            <div className="quick-add-group">
                                <span className="quick-add-label">
                                    Colour — {selectedColour}
                                </span>
                                <div className="colour-grid">
                                    {product.colours.map(c => (
                                        <button
                                            key={c.name}
                                            type="button"
                                            className={`colour-swatch-wrap ${selectedColour === c.name ? 'selected' : ''}`}
                                            data-tooltip={c.name}
                                            aria-label={c.name}
                                            aria-pressed={selectedColour === c.name}
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColour(c.name); }}
                                        >
                                            <span className="colour-swatch" style={{ background: c.hex }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="quick-add-group">
                                <span className="quick-add-label">Size</span>
                                <div className="size-grid">
                                    {product.sizes.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            className={`size-option ${selectedSize === s ? 'selected' : ''}`}
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(s); }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="button" className="btn-primary quick-add-confirm" onClick={confirmAdd}>
                                Add to Bag
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductCard;