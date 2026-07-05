import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import FilterSidebar from './FilterSidebar';
import ProductCard from './ProductCard';
import './ProductList.css';

const parseList = (searchParams, key) => {
    const raw = searchParams.get(key);
    return raw ? raw.split(',').filter(Boolean) : [];
};

function ProductList() {
    const { state } = useAppContext();
    const { products } = state;
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = {
        category: parseList(searchParams, 'category'),
        colour: parseList(searchParams, 'colour'),
        size: parseList(searchParams, 'size'),
        priceMax: Number(searchParams.get('priceMax')) || 1000,
    };
    const sort = searchParams.get('sort') || 'featured';
    const toggleFilter = (field, value) => {
        const current = filters[field];
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];

        const params = new URLSearchParams(searchParams);
        if (next.length === 0) {
            params.delete(field);
        } else {
            params.set(field, next.join(','));
        }
        setSearchParams(params);
    };

    const setPriceMax = (value) => {
        const params = new URLSearchParams(searchParams);
        if (Number(value) >= 1000) {
            params.delete('priceMax');
        } else {
            params.set('priceMax', value);
        }
        setSearchParams(params);
    };

    const clearFilters = () => setSearchParams({});

    const setSort = (value) => {
        const params = new URLSearchParams(searchParams);
        if (value === 'featured') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        setSearchParams(params);
    };

    const filteredProducts = useMemo(() => {
        const matched = products.filter(p => {
            const matchCategory = filters.category.length === 0 || filters.category.includes(p.category);
            const matchPrice = p.price <= filters.priceMax;
            const matchColour = filters.colour.length === 0 || p.colours.some(c => filters.colour.includes(c.name));
            const matchSize = filters.size.length === 0 || p.sizes?.some(s => filters.size.includes(s));
            return matchCategory && matchPrice && matchColour && matchSize;
        });

        const sorted = [...matched];
        switch (sort) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'alpha-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'alpha-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }
        return sorted;
    }, [products, filters.category.join(','), filters.colour.join(','), filters.size.join(','), filters.priceMax, sort]);

    return (
        <div className="product-list-page container">
            <div className="store-hero">
                <h1>New Collection</h1>
                <p>Considered clothing for everyday wear.</p>
            </div>
            <FilterSidebar
                products={products}
                filters={filters}
                sort={sort}
                onToggle={toggleFilter}
                onPriceChange={setPriceMax}
                onSortChange={setSort}
                onClear={clearFilters}
            />
            <p className="results-count">{filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''} found</p>
            <div className="product-grid pb-5">
                {filteredProducts.length === 0 ? (
                    <p className="no-products">No pieces match your current filters.</p>
                ) : (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}

export default ProductList;