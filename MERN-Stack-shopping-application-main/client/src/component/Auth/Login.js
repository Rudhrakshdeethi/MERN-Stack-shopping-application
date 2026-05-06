import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../action/auth';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    login({ email, password });
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <section className="page-shell fade-in-up">
        <div className="auth-shell">
          <div className="auth-side">
            <span className="auth-kicker">Welcome Back</span>
            <h1 className="auth-title">Sign in to continue your shopping journey.</h1>
            <p className="auth-copy mt-3">
              Access your saved cart, revisit product details, and place orders from a storefront that now feels much more polished and professional.
            </p>
            <ul className="auth-list mt-4">
              <li>Quick access to saved products</li>
              <li>Cleaner order placement flow</li>
              <li>Responsive layout for mobile and desktop</li>
            </ul>
          </div>

          <div className="auth-form-shell">
            <p className="eyebrow" style={{ background: 'rgba(196, 107, 44, 0.12)', color: '#8f4315' }}>
              Account Login
            </p>
            <h2 className="auth-title mt-3">Login</h2>
            <p className="page-subtitle">Enter your account details to continue.</p>

            <form onSubmit={onSubmit} autoComplete="off" className="mt-4">
              <div className="form-group text-left">
                <label htmlFor="inputEmail">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="form-control"
                  id="inputEmail"
                  placeholder="name@example.com"
                />
              </div>
              <div className="form-group text-left">
                <label htmlFor="inputPassword">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="form-control"
                  id="inputPassword"
                  placeholder="Enter your password"
                />
              </div>
              <div className="form-group text-left">
                <p className="mb-0">
                  New here? <Link to="/register" className="feature-link">Create an account</Link>
                </p>
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
