import React from 'react'
import {connect} from 'react-redux';
import {Route,Redirect} from 'react-router-dom';

const PrivateRoute = ({component:Component,auth:{isAuthenticated,loading},...rest}) => (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return (
            <section className="page-shell fade-in-up">
              <div className="content-panel text-center py-5">
                <h2 className="page-title">Loading your space...</h2>
                <p className="page-subtitle">We are preparing your account, cart, and order details.</p>
              </div>
            </section>
          );
        }

        return isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    />
)

const mapStateToProps = state =>({
    auth : state.auth,
})
export default connect(mapStateToProps)(PrivateRoute);
