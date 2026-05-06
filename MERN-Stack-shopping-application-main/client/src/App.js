import React, { useEffect } from 'react';
import Carousel from './component/Carousel/Carousel';
import Footer from './component/Footer/Footer';
import Header  from './component/Header/Header';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import Alert from './component/Layout/Alert';
import store from './store';
import {Provider} from 'react-redux';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './component/Dashboard/dashboard';
import {loadUser} from './action/auth';
import PrivateRoute from './component/routing/PrivateRoute';
import IndProduct from './component/Products/IndProduct';
import AddProduct from './component/Admin/AddProduct';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import CartProducts from './component/Products/CartProducts';
import OrderProducts from './component/Products/OrderProducts';
import PlaceOrder from './component/Products/PlaceOrder';


const App =() =>{
  useEffect(() => {
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: "LOGOUT" });
    });
  }, []);
  return (
    <Provider store={store}>
    <Router>
      <div className="app-shell">
        <Header />
        <Alert />
        <main className="app-main">
          <Switch>
                <Route exact path="/" component={Carousel}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/products" component={Dashboard}/>
                <Route exact path="/products/:productId" component={IndProduct}/>
                <Route exact path="/indproduct/:data" component={IndProduct}/>
                <Route exact path="/dashboard" component={Dashboard}/>
                <Route exact path="/admin/add-product" component={AddProduct}/>
                <PrivateRoute exact path="/cart" component={CartProducts}/>
                <PrivateRoute exact path="/order" component={OrderProducts}/>
                <PrivateRoute exact path="/placeorder/:productId" component={PlaceOrder}/>
                <PrivateRoute exact path="/placeorder-legacy/:data" component={PlaceOrder}/>
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
    </Provider>
  )
}

export default App;
