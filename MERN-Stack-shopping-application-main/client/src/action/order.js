import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';
import setAlert from './alert';


//add to order
export const addToOrder = formData => async dispatch =>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    const {user,productId,title,imagename,price,address} = formData;
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({user,productId,title,imagename,price,address});
    try{
        const res = await axios.post('/api/order',body,config);
        dispatch({
            type : "ORDER_ADDING_SUCCESS",
            payload:res.data
        });
        dispatch(setAlert('Order Placed Successfully !!', 'success'));
        return true;
    }
    catch(err){
        const errors = err.response && err.response.data && err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:"ORDER_ADDING_FAIL"
        })
        return false;
    }
    
}


//get order
export const getOrder = () => async dispatch =>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try{
        const res = await axios.get('/api/order');
        dispatch({
            type : "ORDER_GETTING_SUCCESS",
            payload:res.data
        });
    }
    catch(err){
        const errors = err.response && err.response.data && err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:"ORDER_GETTING_FAIL"
        })
    }
    
}


// checkout all cart items
export const checkoutCart = () => async (dispatch, getState) =>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    const state = getState();
    const cartItems = state.cart || [];
    const user = state.auth.user;
    const address = user && user.address ? user.address.trim() : '';

    if(!cartItems.length){
        dispatch(setAlert('Your cart is empty', 'danger'));
        return false;
    }

    if(!address){
        dispatch(setAlert('Please add a delivery address before checkout', 'danger'));
        return false;
    }

    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    };

    try{
        let latestOrders = state.order || [];

        for (const item of cartItems) {
            const body = JSON.stringify({
                user: user ? user._id : null,
                productId: item.productId,
                title: item.title,
                imagename: item.imagename,
                price: item.price,
                address
            });

            const res = await axios.post('/api/order', body, config);
            latestOrders = res.data;
        }

        for (const item of cartItems) {
            await axios.delete(`/api/cart/${item._id}`);
        }

        dispatch({
            type : "ORDER_GETTING_SUCCESS",
            payload:latestOrders
        });
        dispatch({
            type:"CART_CLEAR"
        });
        dispatch(setAlert(`Order placed for ${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`, 'success'));
        return true;
    }
    catch(err){
        const errors = err.response && err.response.data && err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')))
        }
        else{
            dispatch(setAlert('Unable to place your cart order right now', 'danger'));
        }
        return false;
    }
    
}



// remove from cart
export const deleteOrder = (id) => async dispatch =>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try{
        await axios.delete(`/api/order/${id}`);
        dispatch({
            type:"ORDER_REMOVE_SUCCESS",
            payload:id
        })
        dispatch(setAlert('Order Cancelled', 'success'));
    }
    catch(err){
        dispatch({
            type: "ORDER_REMOVE_FAIL",
          });
    }
}

export const deleteOrders = () =>{
}
