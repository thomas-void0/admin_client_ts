import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom';
import ProductAdd from './product-children/ProductAdd';
import ProductDetail from "./product-children/ProductDetail";
import ProductHome from "./product-children/ProductHome";

const Product=()=>{
    return (
        <Switch>
            <Route path="/products/product" exact component={ProductHome}/>
            <Route path="/products/product/detail" component={ProductDetail}/>
            <Route path="/products/product/add" component={ProductAdd}/>
            <Redirect to="/products/product" />
        </Switch>
    )
}
export default Product