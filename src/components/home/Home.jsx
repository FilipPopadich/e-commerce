import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import ProductCard from '../product/ProductCard';
import './Home.css';

const collections = [
    {
        name: 'Tops',
        category: 'tops',
        image: 'https://plus.unsplash.com/premium_photo-1718913931807-4da5b5dd27fa?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Outerwear',
        category: 'outerwear',
        image: 'https://images.unsplash.com/photo-1681006319055-ef42b2e21eb8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Bottoms',
        category: 'bottoms',
        image: 'https://images.unsplash.com/photo-1714729382668-7bc3bb261662?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Hats',
        category: 'hats',
        image: 'https://plus.unsplash.com/premium_photo-1695603437311-fec2f916a0f5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Bags',
        category: 'bags',
        image: 'https://plus.unsplash.com/premium_photo-1755618125255-82769eaf8c8e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Accessories',
        category: 'accessories',
        image: 'https://plus.unsplash.com/premium_photo-1693221161799-ade46b49a7ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHNpbHZlciUyMHJpbmd8ZW58MHx8MHx8fDA%3D',
    },
];

function Home() {
    const { state } = useAppContext();
    const popularProducts = state.products.filter(p => p.popular);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
    };

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-media" />
                <div className="hero-content container">
                    <p className="hero-eyebrow">FORM — New Season</p>
                    <h1 className="hero-title">Considered clothing<br />for everyday wear.</h1>
                    <p className="hero-sub">High quality clothing made to outlast trend cycles.</p>
                    <Link to="/shop" className="btn-primary hero-cta">Shop the Collection</Link>
                </div>
            </section>

            <section className="collections container">
                <div className="section-header">
                    <h2 className="section-title">Featured Collections</h2>
                </div>
                <div className="row row-cols-2 row-cols-md-3 g-4">
                    {collections.map(c => (
                        <div className="col" key={c.category}>
                            <Link to={`/shop?category=${c.category}`} className="collection-card">
                                <div className="collection-image-wrap">
                                    <img src={c.image} alt={c.name} />
                                </div>
                                <span className="collection-name">{c.name}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className="popular container">
                <div className="section-header">
                    <h2 className="section-title">Popular Right Now</h2>
                    <Link to="/shop" className="see-all">View All →</Link>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                    {popularProducts.map(product => (
                        <div className="col" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="promo-band">
                <div className="promo-inner container">
                    <h2>Free shipping on every order.</h2>
                    <p>No minimum. Returns accepted within 30 days.</p>
                </div>
            </section>

            <section className="subscribe">
                <div className="subscribe-inner container">
                    {subscribed ? (
                        <>
                            <h2 className="subscribe-title">You're on the list!</h2>
                            <p className="subscribe-sub">Watch your inbox — first access to new drops starts now.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="subscribe-title">Join the FORM list.</h2>
                            <p className="subscribe-sub">Be first to know about new arrivals, restocks, and the occasional deal.</p>
                            <form className="subscribe-form" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    className="subscribe-input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn-primary subscribe-btn">Subscribe</button>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home