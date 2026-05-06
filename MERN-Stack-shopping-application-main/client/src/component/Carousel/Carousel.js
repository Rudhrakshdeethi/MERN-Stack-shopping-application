import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import banner1 from './hd1.jpg';
import banner2 from './hd3.jpg';
import banner3 from './hd2.jpg';
import Card from './Card';

const Carousel = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/products" />;
  }

  return (
    <Fragment>
      <section className="hero-panel fade-in-up">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Top Picks In Electronics</span>
            <h1 className="hero-title">Great prices on phones, laptops and must-have tech.</h1>
            <p className="hero-subtitle">
              Browse popular devices, compare the essentials quickly, and move from product page to cart without getting lost in the layout.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="hero-action hero-action-primary">
                Browse Products
              </Link>
              <Link to="/register" className="hero-action hero-action-secondary">
                Create Account
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>Deals</strong>
                <span>On hand-picked products</span>
              </div>
              <div className="hero-stat">
                <strong>Fast</strong>
                <span>Product-to-cart flow</span>
              </div>
              <div className="hero-stat">
                <strong>Clean</strong>
                <span>Pages that feel familiar</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <article className="hero-highlight fade-in-up stagger-1">
              <img src={banner1} alt="Featured premium electronics" />
              <div className="hero-highlight-copy">
                <strong>Today&apos;s spotlight</strong>
                <p>
                  Shop popular Apple and Android devices in a cleaner product-first layout.
                </p>
              </div>
            </article>

            <div className="hero-mini-grid">
              <article className="fade-in-up stagger-2">
                <strong>Simple to browse</strong>
                <p>Category-first navigation and familiar page sections make the store easier to scan.</p>
              </article>
              <article className="fade-in-up stagger-3">
                <strong>Ready to buy</strong>
                <p>Product pages, cart, and orders follow a practical retail flow without visual clutter.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell content-panel fade-in-up stagger-1">
        <div className="section-header">
          <div>
            <p className="eyebrow" style={{ background: 'rgba(15, 118, 110, 0.12)', color: '#0f766e' }}>
              Shop By Need
            </p>
            <h2 className="section-title">Popular categories customers actually look for</h2>
            <p className="section-lead">
              A stronger ecommerce homepage starts by surfacing the kinds of products people expect to find quickly.
            </p>
          </div>
        </div>

        <div className="hero-mini-grid">
          <article className="hero-highlight">
            <img src={banner2} alt="Laptop shopping visual" />
            <div className="hero-highlight-copy">
              <strong>Laptops for work and study</strong>
              <p>See practical machines for office work, development, classes, and daily use.</p>
            </div>
          </article>
          <article className="hero-highlight">
            <img src={banner3} alt="Mobile devices shopping visual" />
            <div className="hero-highlight-copy">
              <strong>Phones people compare most</strong>
              <p>Open the catalog and jump straight into familiar device choices from top brands.</p>
            </div>
          </article>
        </div>
      </section>

      <Card />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Carousel);
