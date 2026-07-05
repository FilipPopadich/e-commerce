import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import ProductCard from './ProductCard';
import './ProductDetail.css';

const SIZE_CHART = [
    { size: 'XS', chest: 86, waist: 70, length: 66 },
    { size: 'S', chest: 91, waist: 75, length: 68 },
    { size: 'M', chest: 97, waist: 80, length: 70 },
    { size: 'L', chest: 104, waist: 87, length: 72 },
    { size: 'XL', chest: 111, waist: 94, length: 74 },
];

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useAppContext();
    const product = state.products.find(p => p.id === parseInt(id));

    const [activeImage, setActiveImage] = useState(0);
    const [selectedColour, setSelectedColour] = useState(product?.colours[0]?.name || '');
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
    const [quantity, setQuantity] = useState(1);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (product) {
            setActiveImage(0);
            setSelectedColour(product.colours[0]?.name || '');
            setSelectedSize(product.sizes[0] || '');
            setQuantity(1);
        }
    }, [id]);

    if (!product) {
        return (
            <div className="detail-not-found container">
                <p>Product not found.</p>
                <Link to="/" className="btn-primary">Back to Shop</Link>
            </div>
        );
    }

    const selectedColourHex = product.colours.find(c => c.name === selectedColour)?.hex;
    const hasSizeChart = (product.id !== 23) && (product.sizes.length > 1 || (product.sizes.length === 1 && product.sizes[0] !== 'One Size'));
    const images = product.images?.length ? product.images : [product.image];

    const recommended = state.products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAdd = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, selectedColour, selectedSize, quantity },
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));
    const increaseQty = () => setQuantity(q => Math.min(10, q + 1));
    const prevImage = () => setActiveImage(i => (i === 0 ? images.length - 1 : i - 1));
    const nextImage = () => setActiveImage(i => (i === images.length - 1 ? 0 : i + 1));

    return (
        <>
            <div className="product-detail container">
                <button className="back-link" onClick={() => navigate(-1)}>← Back</button>

                <div className="detail-layout">
                    {/* Left: image slideshow */}
                    <div className="detail-media">
                        <div className="detail-photo">
                            <img src={images[activeImage]} alt={`${product.name} — view ${activeImage + 1}`} />

                            {images.length > 1 && (
                                <>
                                    <button className="slide-arrow slide-arrow--prev" onClick={prevImage} aria-label="Previous image">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 1 L3 6 L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <button className="slide-arrow slide-arrow--next" onClick={nextImage} aria-label="Next image">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 1 L9 6 L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="slide-dots">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`slide-dot ${i === activeImage ? 'active' : ''}`}
                                        onClick={() => setActiveImage(i)}
                                        aria-label={`Show image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: purchase panel */}
                    <div className="detail-info">
                        <p className="detail-category">{product.category}</p>
                        <h1 className="detail-name">{product.name}</h1>
                        <p className="detail-price">${product.price.toFixed(2)}</p>

                        <div className="option-group">
                            <label className="option-label" htmlFor="colour-select">
                                Colour — <span className="option-value">{selectedColour}</span>
                            </label>
                            <div className="select-with-swatch">
                                <span className="swatch-preview" style={{ background: selectedColourHex }} />
                                <select
                                    id="colour-select"
                                    className="option-select"
                                    value={selectedColour}
                                    onChange={(e) => setSelectedColour(e.target.value)}
                                >
                                    {product.colours.map(c => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="option-group">
                            <div className="option-label-row">
                                <label className="option-label" htmlFor="size-select">Size</label>
                                {hasSizeChart && (
                                    <button type="button" className="size-chart-link" onClick={() => setShowSizeChart(s => !s)}>
                                        Size Chart
                                    </button>
                                )}
                            </div>
                            <select
                                id="size-select"
                                className="option-select"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                            >
                                {product.sizes.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            {showSizeChart && hasSizeChart && (
                                <table className="size-chart-table">
                                    <thead>
                                    <tr>
                                        <th>Size</th>
                                        <th>Chest (cm)</th>
                                        <th>Waist (cm)</th>
                                        <th>Length (cm)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {SIZE_CHART.filter(row => product.sizes.includes(row.size)).map(row => (
                                        <tr key={row.size} className={row.size === selectedSize ? 'active-row' : ''}>
                                            <td>{row.size}</td>
                                            <td>{row.chest}</td>
                                            <td>{row.waist}</td>
                                            <td>{row.length}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="option-group">
                            <label className="option-label">Quantity</label>
                            <div className="qty-stepper">
                                <button type="button" onClick={decreaseQty} aria-label="Decrease quantity">−</button>
                                <span className="qty-value">{quantity}</span>
                                <button type="button" onClick={increaseQty} aria-label="Increase quantity">+</button>
                            </div>
                        </div>

                        <button className="btn-primary detail-cta" onClick={handleAdd}>
                            {added ? 'Added to Bag ✓' : 'Add to Bag'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Description — full-bleed dark section */}
            <section className="detail-description-section">
                <div className="container description-inner">
                    <div className="description-col">
                        <h2 className="description-heading">Description</h2>
                        <p className="description-text">{product.name}: {product.description}</p>
                    </div>
                    <div className="details-col">
                        <h2 className="description-heading">Product Details</h2>
                        <div className="meta-row">
                            <span>Fabricated in</span>
                            <span>{product.fabricatedIn}</span>
                        </div>
                        <div className="meta-row">
                            <span>Fit</span>
                            <span>{product.fit}</span>
                        </div>
                        <div className="meta-row">
                            <span>Material</span>
                            <span>{product.material}</span>
                        </div>
                        <div className="meta-row">
                            <span>Material Weight</span>
                            <span>{product.materialWeight}</span>
                        </div>
                        <div className="meta-row">
                            <span>Delivery</span>
                            <span>3–5 business days</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommended — same dark background */}
            <section className="recommended-section">
                <div className="container">
                    <h2 className="recommended-heading">You Might Also Like</h2>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                        {recommended.map(p => (
                            <div className="col" key={p.id}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default ProductDetail;