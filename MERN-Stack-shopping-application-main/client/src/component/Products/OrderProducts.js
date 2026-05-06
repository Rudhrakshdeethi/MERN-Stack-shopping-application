import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteOrder } from '../../action/order';
import { formatPrice, getProductBySnapshot } from './productCatalog';

const OrderProducts = ({ order, deleteOrder }) => (
  <section className="page-shell fade-in-up">
    <div className="content-panel">
      <div className="page-header">
        <p className="eyebrow" style={{ background: 'rgba(196, 107, 44, 0.12)', color: '#8f4315' }}>
          Purchases
        </p>
        <h1 className="page-title">Your orders</h1>
        <p className="page-subtitle">
          Track the items you have already placed and revisit their product pages whenever needed.
        </p>
      </div>

      {order.length > 0 ? (
        <div className="catalog-grid">
          {order.map((item, index) => {
            const product = getProductBySnapshot(item);
            const productLink = product ? `/products/${product.id}` : '/products';

            return (
              <article className={`product-card fade-in-up stagger-${(index % 3) + 1}`} key={item._id}>
                <div className="product-image-wrap">
                  {product && <img src={product.imageSrc} alt={item.title} />}
                </div>
                <div className="product-card-body d-flex flex-column">
                  <h3 className="h5">
                    <Link to={productLink}>{item.title}</Link>
                  </h3>
                  <p className="product-meta mb-3">
                    <strong>Delivery address:</strong> {item.address}
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="product-price">{formatPrice(item.price)}</span>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => deleteOrder(item._id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Your order list is empty.</h2>
          <p>Place an order and it will show up here with its delivery details.</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Shop Now
          </Link>
        </div>
      )}
    </div>
  </section>
);

OrderProducts.propTypes = {
  order: PropTypes.array.isRequired,
  deleteOrder: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  order: state.order
});

export default connect(mapStateToProps, { deleteOrder })(OrderProducts);
