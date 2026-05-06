import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { addToCart, deleteCart } from '../../action/cart';
import { formatPrice } from './productCatalog';

const renderRating = (rating) => {
  const rounded = Math.round(rating);
  return '\u2605'.repeat(rounded) + '\u2606'.repeat(5 - rounded);
};

const IndProduct = ({
  match,
  cart,
  userId,
  isAuthenticated,
  address,
  addToCart,
  deleteCart
}) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${match.params.productId}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [match.params.productId]);

  if (loading) {
    return (
      <section className="page-shell fade-in-up">
        <div className="content-panel">
          <h1>Loading product...</h1>
        </div>
      </section>
    );
  }

  if (!product) {
    return <Redirect to="/products" />;
  }

  const cartItem = cart.find(
    (item) =>
      item.productId === product._id ||
      (item.title === product.title && item.imagename === product.imagename)
  );

  const handleAddToCart = () => {
    if (!userId) {
      return;
    }

    addToCart({
      user: userId,
      productId: product._id,
      title: product.title,
      price: product.price,
      imagename: product.imagename
    });
  };

  return (
    <section className="page-shell fade-in-up">
      <div className="content-panel product-detail-shell">
        <div className="product-detail-grid">
          <div className="product-gallery-column">
            <div className="detail-image-card product-gallery-card">
              <img src={product.imageSrc} alt={product.title} />
            </div>
          </div>

          <div className="product-info-column">
            <h1 className="product-detail-title">{product.title}</h1>
            <div className="product-rating-row product-rating-row-lg">
              <span className="product-stars">{renderRating(product.rating)}</span>
              <span className="product-review-count">{(product.reviews || 0).toLocaleString()} ratings</span>
            </div>
            <p className="product-brand-line">
              Brand: <span>{product.brand}</span>
            </p>
            <hr />
            <div className="product-price-block">
              <div className="product-price">{formatPrice(product.price)}</div>
              <div className="product-delivery-note">{product.delivery}</div>
              <div className="product-stock-note">{product.stock}</div>
            </div>
            <hr />
            <h3 className="product-section-heading">About this item</h3>
            <ul className="product-feature-list">
              {(product.features || []).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <aside className="product-buy-box">
            <div className="summary-card buy-box-card">
              <div className="product-price mb-2">{formatPrice(product.price)}</div>
              <p className="product-delivery-note mb-2">{product.delivery}</p>
              <p className="product-stock-note mb-3">{product.stock}</p>
              <p className="buy-box-note mb-3">
                {address
                  ? `Deliver to: ${address}`
                  : 'Add a delivery address during sign up or checkout.'}
              </p>

              {cartItem ? (
                <button
                  className="btn btn-outline-danger buy-box-button"
                  onClick={() => deleteCart(cartItem._id)}
                >
                  Remove from Cart
                </button>
              ) : isAuthenticated ? (
                <button className="btn btn-cart buy-box-button" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              ) : (
                <Link to="/login" className="btn btn-cart buy-box-button">
                  Login to Add Cart
                </Link>
              )}

              {isAuthenticated ? (
                <Link to={`/placeorder/${product._id}`} className="btn btn-buy buy-box-button">
                  Buy Now
                </Link>
              ) : (
                <Link to="/login" className="btn btn-buy buy-box-button">
                  Login to Buy
                </Link>
              )}

              <div className="buy-box-meta">
                <div><strong>Ships from</strong><span>LumaCart</span></div>
                <div><strong>Sold by</strong><span>LumaCart Electronics</span></div>
                <div><strong>Returns</strong><span>7-day replacement</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  userId: state.auth.user ? state.auth.user._id : null,
  address: state.auth.user ? state.auth.user.address : '',
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { addToCart, deleteCart })(IndProduct);
