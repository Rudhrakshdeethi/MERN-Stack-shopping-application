import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const AddProduct = ({ auth }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    description: '',
    features: '',
    price: '',
    imageSrc: '',
    imagename: '',
    rating: '4.0',
    reviews: '0',
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    title,
    category,
    brand,
    description,
    features,
    price,
    imageSrc,
    imagename,
    rating,
    reviews,
    stock,
    delivery
  } = formData;

  const onChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const productData = {
      title,
      category,
      brand,
      description,
      features: features.split('\n').filter(f => f.trim()),
      price: parseFloat(price),
      imageSrc,
      imagename,
      rating: parseFloat(rating),
      reviews: parseInt(reviews, 10),
      stock,
      delivery
    };

    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth': localStorage.token
        }
      };

      const res = await axios.post('/api/products', productData, config);
      console.log('Product added:', res.data);
      setSuccess(true);
      setFormData({
        title: '',
        category: '',
        brand: '',
        description: '',
        features: '',
        price: '',
        imageSrc: '',
        imagename: '',
        rating: '4.0',
        reviews: '0',
        stock: 'In stock',
        delivery: 'FREE delivery by Tomorrow'
      });
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.msg || 'Failed to add product');
    }
  };

  if (!auth.isAuthenticated || !auth.user?.isAdmin) {
    return <Redirect to="/products" />;
  }

  if (success) {
    return (
      <section className="page-shell fade-in-up">
        <div className="content-panel">
          <div className="page-header">
            <h1 className="page-title">Product Added Successfully!</h1>
            <p className="page-subtitle">The product has been added to the catalog.</p>
            <button onClick={() => setSuccess(false)} className="btn btn-primary mt-3">
              Add Another Product
            </button>
            <br />
            <a href="/products" className="btn btn-outline-primary mt-3" style={{ marginLeft: '0.5rem' }}>
              View All Products
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell fade-in-up">
      <div className="content-panel">
        <div className="page-header">
          <p className="eyebrow" style={{ background: '#c46b2c', color: '#fff' }}>
            Admin Panel
          </p>
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">Fill in the details below to add a product to the catalog.</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            background: '#ffeef0',
            border: '1px solid #f5c6cb',
            color: '#721c24'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-4">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group text-left">
              <label htmlFor="title">Product Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                className="form-control"
                id="title"
                placeholder="e.g., Apple iPhone 15 (128GB)"
                required
              />
            </div>

            <div className="form-group text-left">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                name="category"
                value={category}
                onChange={onChange}
                className="form-control"
                id="category"
                placeholder="e.g., Smartphone"
                required
              />
            </div>

            <div className="form-group text-left">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                name="brand"
                value={brand}
                onChange={onChange}
                className="form-control"
                id="brand"
                placeholder="e.g., Apple"
                required
              />
            </div>

            <div className="form-group text-left">
              <label htmlFor="price">Price (INR)</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={onChange}
                className="form-control"
                id="price"
                placeholder="e.g., 79900"
                required
              />
            </div>

            <div className="form-group text-left">
              <label htmlFor="imageSrc">Image URL</label>
              <input
                type="text"
                name="imageSrc"
                value={imageSrc}
                onChange={onChange}
                className="form-control"
                id="imageSrc"
                placeholder="e.g., https://example.com/image.jpg"
                required
              />
            </div>

            <div className="form-group text-left">
              <label htmlFor="imagename">Image Filename</label>
              <input
                type="text"
                name="imagename"
                value={imagename}
                onChange={onChange}
                className="form-control"
                id="imagename"
                placeholder="e.g., iphone15.jpg"
                required
              />
            </div>

            <div className="form-group text-left">
              <label htmlFor="rating">Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={rating}
                onChange={onChange}
                className="form-control"
                id="rating"
                step="0.1"
                min="0"
                max="5"
                placeholder="4.0"
              />
            </div>

            <div className="form-group text-left">
              <label htmlFor="reviews">Review Count</label>
              <input
                type="number"
                name="reviews"
                value={reviews}
                onChange={onChange}
                className="form-control"
                id="reviews"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group text-left">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              className="form-control"
              id="description"
              rows="3"
              placeholder="Brief description of the product"
              required
            />
          </div>

          <div className="form-group text-left">
            <label htmlFor="features">Features (one per line)</label>
            <textarea
              name="features"
              value={features}
              onChange={onChange}
              className="form-control"
              id="features"
              rows="5"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group text-left">
              <label htmlFor="stock">Stock Status</label>
              <input
                type="text"
                name="stock"
                value={stock}
                onChange={onChange}
                className="form-control"
                id="stock"
                placeholder="In stock"
              />
            </div>

            <div className="form-group text-left">
              <label htmlFor="delivery">Delivery Info</label>
              <input
                type="text"
                name="delivery"
                value={delivery}
                onChange={onChange}
                className="form-control"
                id="delivery"
                placeholder="FREE delivery by Tomorrow"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Add Product
          </button>
        </form>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AddProduct);
