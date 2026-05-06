import React, { Fragment, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../action/auth';

const Navbar = ({ auth: { isAuthenticated, user }, logout }) => {
  const history = useHistory();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('q') || '');
  }, [location.search]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();

    if (query) {
      history.push(`/products?q=${encodeURIComponent(query)}`);
      return;
    }

    history.push('/products');
  };

  const navLinks = isAuthenticated ? (
    <Fragment>
      <Link to="/" className="market-nav-link">
        Home
      </Link>
      <Link to="/products" className="market-nav-link">
        Products
      </Link>
      <Link to="/cart" className="market-nav-link">
        Cart
      </Link>
      <Link to="/order" className="market-nav-link">
        Orders
      </Link>
      {isAuthenticated && user?.isAdmin && (
        <Link to="/admin/add-product" className="market-nav-link" style={{ color: '#c46b2c', fontWeight: 'bold' }}>
          Add Product
        </Link>
      )}
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/" className="market-nav-link">
        Home
      </Link>
      <Link to="/products" className="market-nav-link">
        Products
      </Link>
      <Link to="/login" className="market-nav-link">
        Login
      </Link>
      <Link to="/register" className="market-nav-link">
        Register
      </Link>
    </Fragment>
  );

  return (
    <header className="site-header fade-in-up">
      <div className="market-header-top">
        <Link className="brand-lockup" to="/">
          <span className="brand-mark">L</span>
          <span className="brand-text">
            <span className="brand-name">LumaCart</span>
            <span className="brand-tagline">Electronics and everyday deals</span>
          </span>
        </Link>

        <Link to="/products" className="delivery-hint">
          <span className="delivery-label">Shop</span>
          <strong>Phones, laptops and more</strong>
        </Link>

        <form className="header-search-shell" onSubmit={submitSearch}>
          <span className="header-search-category">All</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="header-search-input"
            placeholder="Search phones, laptops and accessories"
            aria-label="Search products"
          />
          <button type="submit" className="header-search-button">
            Search
          </button>
        </form>

        <div className="header-quick-actions">
          {isAuthenticated ? (
            <Fragment>
              <Link to="/order" className="quick-action-card">
                <span>Hello</span>
                <strong>Your Orders</strong>
              </Link>
              <Link to="/cart" className="quick-action-card">
                <span>View</span>
                <strong>Cart</strong>
              </Link>
              <button onClick={logout} className="quick-action-card quick-action-button" type="button">
                <span>Securely</span>
                <strong>Logout</strong>
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <Link to="/login" className="quick-action-card">
                <span>Hello, sign in</span>
                <strong>Account</strong>
              </Link>
              <Link to="/register" className="quick-action-card">
                <span>New here?</span>
                <strong>Register</strong>
              </Link>
              <Link to="/products" className="quick-action-card">
                <span>Start with</span>
                <strong>Products</strong>
              </Link>
            </Fragment>
          )}
        </div>
      </div>

      <div className="market-header-nav">
        <nav className="market-nav-links">
          {navLinks}
        </nav>
        <div className="market-nav-promo">Daily deals on popular electronics</div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user
});

export default connect(mapStateToProps, { logout })(Navbar);
