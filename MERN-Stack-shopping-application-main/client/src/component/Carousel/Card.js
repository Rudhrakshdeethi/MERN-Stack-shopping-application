import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '01',
    title: 'Popular Phones',
    text: 'Find the devices customers usually compare first, from premium iPhones to everyday Android picks.'
  },
  {
    icon: '02',
    title: 'Laptop Deals',
    text: 'Browse work-ready laptops with clear pricing and straightforward product pages.'
  },
  {
    icon: '03',
    title: 'Easy Checkout',
    text: 'Move from browsing to cart to order in a cleaner, more familiar retail flow.'
  }
];

const Card = () => (
  <section className="section-shell content-panel fade-in-up stagger-2">
    <div className="section-header">
      <div>
        <p className="eyebrow" style={{ background: 'rgba(196, 107, 44, 0.12)', color: '#8f4315' }}>
          Customer Favorites
        </p>
        <h2 className="section-title">Everything important stays easy to find</h2>
        <p className="section-lead">
          The layout is now closer to a real online marketplace: stronger navigation, practical sections, and product cards that put the basics first.
        </p>
      </div>
      <Link to="/products" className="hero-action hero-action-primary">
        Explore Catalog
      </Link>
    </div>

    <div className="feature-grid">
      {features.map((feature, index) => (
        <article className={`feature-card fade-in-up stagger-${index + 1}`} key={feature.title}>
          <span className="feature-icon">{feature.icon}</span>
          <h3>{feature.title}</h3>
          <p>{feature.text}</p>
          <Link to="/products" className="feature-link">
            View products
          </Link>
        </article>
      ))}
    </div>
  </section>
);

export default Card;
