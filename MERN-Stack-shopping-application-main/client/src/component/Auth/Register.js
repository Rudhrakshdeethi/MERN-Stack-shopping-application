import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import setAlert from '../../action/alert';
import { register } from '../../action/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    pincode: ''
  });

  const { name, email, password, password2, phone, address, state, city, pincode } = formData;

  const statesArr = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  const onChange = (event) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    event.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password, phone, address, state, city, pincode });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/products" />;
  }

  return (
    <Fragment>
      <section className="page-shell fade-in-up">
        <div className="auth-shell">
          <div className="auth-side">
            <span className="auth-kicker">Join LumaCart</span>
            <h1 className="auth-title">Create an account and keep your orders organized.</h1>
            <p className="auth-copy mt-3">
              Register once to save your delivery details, manage your cart more easily, and move through checkout with less friction.
            </p>
            <ul className="auth-list mt-4">
              <li>Save a default delivery address</li>
              <li>Track current and past orders</li>
              <li>Get a smoother repeat-shopping flow</li>
            </ul>
          </div>

          <div className="auth-form-shell">
            <p className="eyebrow" style={{ background: 'rgba(15, 118, 110, 0.12)', color: '#0f766e' }}>
              Create Account
            </p>
            <h2 className="auth-title mt-3">Register</h2>
            <p className="page-subtitle">Set up your account to unlock the full storefront experience.</p>

            <form onSubmit={onSubmit} autoComplete="off" className="mt-4">
              <div className="form-row">
                <div className="form-group col-md-6 text-left">
                  <label htmlFor="inputname4">Name</label>
                  <input type="text" name="name" value={name} onChange={onChange} className="form-control" id="inputname4" placeholder="Full name" />
                </div>
                <div className="form-group col-md-6 text-left">
                  <label htmlFor="inputphone4">Phone</label>
                  <input type="text" name="phone" value={phone} onChange={onChange} className="form-control" id="inputphone4" placeholder="Mobile number" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-12 text-left">
                  <label htmlFor="inputEmail4">Email</label>
                  <input type="email" className="form-control" name="email" value={email} onChange={onChange} id="inputEmail4" placeholder="name@example.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6 text-left">
                  <label htmlFor="inputPassword4">Password</label>
                  <input type="password" className="form-control" name="password" value={password} onChange={onChange} id="inputPassword4" placeholder="Create password" />
                </div>
                <div className="form-group col-md-6 text-left">
                  <label htmlFor="inputconfirmpassword4">Confirm Password</label>
                  <input type="password" className="form-control" name="password2" value={password2} onChange={onChange} id="inputconfirmpassword4" placeholder="Repeat password" />
                </div>
              </div>

              <div className="form-group text-left">
                <label htmlFor="inputAddress">Address</label>
                <input type="text" className="form-control" name="address" value={address} onChange={onChange} id="inputAddress" placeholder="Full address" />
              </div>

              <div className="form-row">
                <div className="form-group col-md-5 text-left">
                  <label htmlFor="inputState">State</label>
                  <select id="inputState" className="form-control" name="state" value={state} onChange={onChange}>
                    <option value="">Choose...</option>
                    {statesArr.map((stateName) => (
                      <option value={stateName} key={stateName}>
                        {stateName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-5 text-left">
                  <label htmlFor="inputCity">City</label>
                  <input type="text" className="form-control" id="inputCity" name="city" value={city} onChange={onChange} placeholder="City" />
                </div>
                <div className="form-group col-md-2 text-left">
                  <label htmlFor="inputZip">Zip</label>
                  <input type="text" className="form-control" id="inputZip" name="pincode" value={pincode} onChange={onChange} placeholder="Zip" />
                </div>
              </div>

              <div className="form-group text-left">
                <p className="mb-0">
                  Already registered? <Link to="/login" className="feature-link">Login here</Link>
                </p>
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
