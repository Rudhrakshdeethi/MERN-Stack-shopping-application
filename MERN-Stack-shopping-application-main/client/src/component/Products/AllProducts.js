import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from './productCatalog';

const renderRating = (rating) => {
  const rounded = Math.round(rating);
  return '\u2605'.repeat(rounded) + '\u2606'.repeat(5 - rounded);
};

const AllProducts = ({ products, searchQuery }) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h2>No results found</h2>
        <p>
          {searchQuery
            ? `We could not find products matching "${searchQuery}". Try a different keyword.`
            : 'No products are available right now.'}
        </p>
        <Link to="/products" className="btn btn-primary mt-3">
          View All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="catalog-grid">
      {products.map((product, index) => {
        const productId = product._id || product.id;
        return (
          <article className={`product-card fade-in-up stagger-${(index % 3) + 1}`} key={productId}>
            <div className="product-image-wrap">
              <span className="product-badge">{product.category}</span>
              <img src={product.imageSrc} alt={product.title} />
            </div>
            <div className="product-card-body">
              <h3 className="product-title-sm mb-2">
                <Link to={`/products/${productId}`}>{product.title}</Link>
              </h3>
              <div className="product-rating-row mb-2">
                <span className="product-stars">{renderRating(product.rating)}</span>
                <span className="product-review-count">{(product.reviews || 0).toLocaleString()}</span>
              </div>
              <div className="product-price mb-1">{formatPrice(product.price)}</div>
              <p className="product-delivery-note mb-3">{product.delivery}</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="detail-meta">{product.brand}</span>
                <Link to={`/products/${productId}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AllProducts;
