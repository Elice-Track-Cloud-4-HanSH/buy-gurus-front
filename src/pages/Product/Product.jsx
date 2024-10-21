import React from 'react';
import ProductSearch from './Component/ProductSearch';
import ProductList from './Component/ProductList';
import ProductManagement from './Component/ProductManagement';
import { ProductProvider } from '../../context/ProductContext';

const Product = () => {
    return (
        <ProductProvider>
            <div className="container">
                <ProductManagement />
                <ProductSearch />
                <ProductList />
            </div>
        </ProductProvider>
    );
};

export default Product;