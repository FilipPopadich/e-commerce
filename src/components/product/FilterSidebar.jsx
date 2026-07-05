import React, { useState, useEffect, useRef } from 'react';
import './FilterSidebar.css';

const CATEGORIES = ['tops', 'bottoms', 'outerwear', 'hats', 'bags', 'accessories'];
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'alpha-asc', label: 'Alphabetical: A–Z' },
    { value: 'alpha-desc', label: 'Alphabetical: Z–A' },
];

function FilterSidebar({ products, filters, sort, onToggle, onPriceChange, onSortChange, onClear }) {
    const [mounted, setMounted] = useState(false);
    const [entered, setEntered] = useState(false);
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    const closeTimerRef = useRef(null);
    const ANIMATION_MS = 400;

    const openPanel = () => {
        clearTimeout(closeTimerRef.current);
        setMounted(true);
        setEntered(false);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setEntered(true));
        });
    };

    const closePanel = () => {
        setEntered(false);
        closeTimerRef.current = setTimeout(() => setMounted(false), ANIMATION_MS);
    };

    useEffect(() => () => clearTimeout(closeTimerRef.current), []);

    const availableSizes = SIZE_ORDER.filter(s => products.some(p => p.sizes?.includes(s)));

    const colourMap = {};
    products.forEach(p => p.colours.forEach(c => {
        if (!colourMap[c.name]) colourMap[c.name] = c.hex;
    }));
    const availableColours = Object.keys(colourMap).sort();

    const activeFacetCount =
        filters.category.length +
        filters.colour.length +
        filters.size.length +
        (filters.priceMax < 1000 ? 1 : 0);

    useEffect(() => {
        const onClickOutside = (e) => {
            const clickedButton = buttonRef.current && buttonRef.current.contains(e.target);
            const clickedPanel = panelRef.current && panelRef.current.contains(e.target);
            if (!clickedButton && !clickedPanel) closePanel();
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closePanel();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className="filter-bar">
            <button
                type="button"
                ref={buttonRef}
                className={`filter-toggle ${mounted ? 'open' : ''}`}
                onClick={() => (mounted ? closePanel() : openPanel())}
                aria-expanded={mounted}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                </svg>
                Filters
                {activeFacetCount > 0 && <span className="filter-count">{activeFacetCount}</span>}
            </button>

            {mounted && (
                <div
                    className={`filter-panel ${entered ? 'aos-animate' : ''}`}
                    ref={panelRef}
                    data-aos="fade-right"
                    data-aos-duration={ANIMATION_MS}
                >
                    <div className="filter-panel-header">
                        <h4>Filters</h4>
                        <button type="button" className="filter-panel-close" onClick={closePanel} aria-label="Close filters">×</button>
                    </div>

                    <div className="filter-group">
                        <span className="filter-heading">Sort By</span>
                        <div className="sort-list">
                            {SORT_OPTIONS.map(opt => (
                                <label key={opt.value} className="sort-option">
                                    <input
                                        type="radio"
                                        name="sort"
                                        checked={sort === opt.value}
                                        onChange={() => onSortChange(opt.value)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <span className="filter-heading">Product Type</span>
                        <div className="checkbox-list">
                            {CATEGORIES.map(cat => (
                                <label key={cat} className="checkbox-option">
                                    <input
                                        type="checkbox"
                                        checked={filters.category.includes(cat)}
                                        onChange={() => onToggle('category', cat)}
                                    />
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <span className="filter-heading">Size</span>
                        <div className="checkbox-list">
                            {availableSizes.map(size => (
                                <label key={size} className="checkbox-option">
                                    <input
                                        type="checkbox"
                                        checked={filters.size.includes(size)}
                                        onChange={() => onToggle('size', size)}
                                    />
                                    {size}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <span className="filter-heading">Colour</span>
                        <div className="colour-swatches">
                            {availableColours.map(colour => {
                                const hex = colourMap[colour];
                                const selected = filters.colour.includes(colour);
                                return (
                                    <button
                                        type="button"
                                        key={colour}
                                        className={`colour-swatch-wrap ${selected ? 'selected' : ''}`}
                                        title={colour}
                                        aria-label={colour}
                                        aria-pressed={selected}
                                        onClick={() => onToggle('colour', colour)}
                                    >
                                        <span className="colour-swatch" style={{ background: hex }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-heading" htmlFor="price-max">
                            Max Price — ${filters.priceMax}
                        </label>
                        <input
                            id="price-max"
                            type="range"
                            name="priceMax"
                            min="50"
                            max="500"
                            step="5"
                            value={filters.priceMax}
                            onChange={(e) => onPriceChange(Number(e.target.value))}
                            className="price-range"
                        />
                        <div className="range-labels">
                            <span>$50</span>
                            <span>$500</span>
                        </div>
                    </div>

                    {activeFacetCount > 0 && (
                        <button className="clear-facets" onClick={onClear}>
                            Clear all filters ({activeFacetCount})
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default FilterSidebar;