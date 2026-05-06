import React, { Fragment, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import setAlert from '../../action/alert';
import { addToOrder } from '../../action/order';
import { formatPrice } from './productCatalog';

const PlaceOrder = ({ match, userId, defaultAddress, addToOrder, setAlert }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [alternateAddress, setAlternateAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
          <h1>Loading...</h1>
        </div>
      </section>
    );
  }

  if (!product) {
    return <Redirect to="/products" />;
  }

  const currentAddress = useDifferentAddress
    ? alternateAddress.trim()
    : (defaultAddress || '').trim();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!currentAddress) {
      setAlert('Please provide a delivery address', 'danger');
      return;
    }

    const wasSaved = await addToOrder({
      user: userId,
      productId: product._id,
      title: product.title,
      imagename: product.imagename,
      price: product.price,
      address: currentAddress
    });

    if (wasSaved) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <Redirect to="/order" />;
  }

  return (
    <Fragment>
      <section className="page-shell fade-in-up">
        <div className="order-layout">
          <div className="order-panel">
            <div className="order-summary-card h-100">
              <img
                src={product.imageSrc}
                alt={product.title}
                style={{ borderRadius: '18px', width: '100%', height: '280px', objectFit: 'cover', marginBottom: '1.2rem' }}
              />
              <span className="detail-meta">{product.category}</span>
              <h3 className="mt-3">{product.title}</h3>
              <p className="product-price mb-3">{formatPrice(product.price)}</p>
              <p className="text-muted mb-0">{product.description}</p>
            </div>
          </div>

          <div className="order-panel">
            <div className="summary-card h-100">
              <p className="eyebrow" style={{ background: 'rgba(15, 118, 110, 0.12)', color: '#0f766e' }}>
                Secure Checkout
              </p>
              <h2 className="auth-title mt-3">Confirm your order</h2>
              <p className="page-subtitle">
                Choose your delivery destination and complete the purchase in a cleaner, more guided checkout flow.
              </p>

              <form onSubmit={onSubmit} className="mt-4">
                {!useDifferentAddress && (
                  <div className="form-group text-left">
                    <label htmlFor="registeredAddress">Registered delivery address</label>
                    <input
                      id="registeredAddress"
                      className="form-control"
                      value={defaultAddress || 'No saved address on your profile yet'}
                      readOnly
                    />
                  </div>
                )}

                <div className="form-group text-left">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      checked={useDifferentAddress}
                      onChange={() => setUseDifferentAddress(!useDifferentAddress)}
                      className="form-check-input"
                      id="changeAddress"
                    />
                    <label className="form-check-label" htmlFor="changeAddress">
                      Use a different delivery address
                    </label>
                  </div>
                </div>

                {useDifferentAddress && (
                  <div className="form-group text-left">
                    <label htmlFor="alternateAddress">New Delivery Address</label>
                    <input
                      type="text"
                      name="alternateAddress"
                      value={alternateAddress}
                      onChange={(event) => setAlternateAddress(event.target.value)}
                      className="form-control"
                      id="alternateAddress"
                      placeholder="Enter full delivery address"
                    />
                    <small className="form-text text-muted">
                      Please provide a complete address for delivery.
                    </small>
                  </div>
                )}

                <button type="submit" className="btn btn-primary">
                  Confirm Order
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  userId: state.auth.user ? state.auth.user._id : null,
  defaultAddress: state.auth.user ? state.auth.user.address : ''
});

export default connect(mapStateToProps, { addToOrder, setAlert })(PlaceOrder);
