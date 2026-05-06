import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteCart } from '../../action/cart';
import { checkoutCart } from '../../action/order';
import { formatPrice, getProductBySnapshot } from './productCatalog';

const CartProducts = ({ cart, address, deleteCart, checkoutCart }) => {
  const [submitting, setSubmitting] = useState(false);
  const [redirectToOrders, setRedirectToOrders] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handleCheckout = async () => {
    setSubmitting(true);
    const wasSuccessful = await checkoutCart();
    setSubmitting(false);

    if (wasSuccessful) {
      setRedirectToOrders(true);
    }
  };

  if (redirectToOrders) {
    return <Redirect to="/order" />;
  }

  return (
    <section className="page-shell fade-in-up">
      <div className="content-panel">
        <div className="page-header">
          <p className="eyebrow" style={{ background: '#eef6f7', color: '#0f766e' }}>
            Saved For Checkout
          </p>
          <h1 className="page-title">Your cart</h1>
          <p className="page-subtitle">
            Review the products you have saved and proceed to buy them together when you are ready.
          </p>
        </div>

        {cart.length > 0 ? (
          <div className="cart-page-grid">
            <div className="catalog-grid">
              {cart.map((item, index) => {
                const product = getProductBySnapshot(item);
                const productLink = product ? `/products/${product.id}` : '/products';

                return (
                  <article className={`product-card fade-in-up stagger-${(index % 3) + 1}`} key={item._id}>
                    <div className="product-image-wrap">
                      {product && <img src={product.imageSrc} alt={item.title} />}
                    </div>
                    <div className="product-card-body d-flex flex-column">
                      <h3 className="product-title-sm">
                        <Link to={productLink}>{item.title}</Link>
                      </h3>
                      <p className="product-meta">Saved in your cart and ready to be ordered.</p>
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="product-price">{formatPrice(item.price)}</span>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => deleteCart(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="cart-summary-column">
              <div className="summary-card cart-summary-card">
                <h3>Order Summary</h3>
                <p className="cart-summary-line">
                  <span>Items</span>
                  <strong>{cart.length}</strong>
                </p>
                <p className="cart-summary-line">
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </p>
                <p className="cart-summary-address">
                  {address
                    ? `Deliver to: ${address}`
                    : 'No delivery address saved yet. Add one in your account before checkout.'}
                </p>
                <button
                  type="button"
                  className="btn btn-buy buy-box-button"
                  onClick={handleCheckout}
                  disabled={submitting}
                >
                  {submitting ? 'Placing Order...' : `Proceed to Buy (${cart.length} item${cart.length > 1 ? 's' : ''})`}
                </button>
                <Link to="/products" className="btn btn-outline-primary buy-box-button">
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <h2>Your cart is empty.</h2>
            <p>Add a product from the catalog to start building your next order.</p>
            <Link to="/products" className="btn btn-primary mt-3">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

CartProducts.propTypes = {
  cart: PropTypes.array.isRequired,
  address: PropTypes.string,
  deleteCart: PropTypes.func.isRequired,
  checkoutCart: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  address: state.auth.user ? state.auth.user.address : ''
});

export default connect(mapStateToProps, { deleteCart, checkoutCart })(CartProducts);
