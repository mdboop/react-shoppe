import React, { PropTypes, Component } from 'react';
import EmptyCart from './Empty-Cart.jsx';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  addToCart,
  removeFromCart,
  deleteFromCart,
  cartSelector
} from '../../redux.js';

const mapStateToProps = createSelector(
  cartSelector,
  state => state.productsById,
  (cart, productsById) => {
    const finalCart = cart.map(cartItem => {
      const productItem = productsById[cartItem.id];
      return {
        ...productItem,
        ...cartItem
      };
    });
    const totalSum = finalCart.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);
    return {
      totalSum,
      cart: finalCart
    };
  }
);

const mapDispatchToProps = {
  addToCart,
  removeFromCart,
  deleteFromCart
};

const propTypes = {
  totalSum: PropTypes.number,
  cart: PropTypes.array,
  products: PropTypes.array,
  addToCart: PropTypes.func,
  removeFromCart: PropTypes.func,
  deleteFromCart: PropTypes.func
};

export class Cart extends Component {

  render() {
    const {
      totalSum,
      cart,
      addToCart,
      removeFromCart,
      deleteFromCart
    } = this.props;
    if (cart && cart.length === 0) {
      return (
        <EmptyCart />
      );
    }
    return (
      <div className='cart'>
        <div className='cart-title'>
          <h2>My Cart</h2>
        </div>
        <div className='cart-list'>
          <div className='cart-list-row'>
            <div className='cart-list-item'>
              Item
            </div>
            <div className='cart-list-item'>
              Qty
            </div>
            <div className='cart-list-item'>
              Price
            </div>
            <div className='cart-list-item' />
          </div>
          {
            cart.map(item => (
              <div
                className='cart-list-row'
                key={ item.id }
                >
                <div className='cart-list-item cart-list-product'>
                  <div className='cart-list-stock-photo'>
                    <img src={ `/images/products/${item.image}` } />
                  </div>
                  <div className='cart-list-info'>
                    <div className='cart-list-info-name'>
                      { item.name }
                    </div>
                    <div className='cart-list-info-name'>
                      $ { item.price.toFixed(2) }
                    </div>
                  </div>
                </div>
                <div className='cart-list-item cart-count-item'>
                  <div
                    className='cart-count-up'
                    onClick={ () => addToCart(item.id) }
                    >
                    <img src='/images/cart/AddOneItem.png' />
                  </div>
                  <div className='cart-count-count'>
                    { item.count }
                  </div>
                  <div
                    className='cart-count-down'
                    onClick={ () => removeFromCart(item.id) }
                    >
                    <img src='/images/cart/SubtractOneItem.png' />
                  </div>
                </div>
                <div className='cart-list-item'>
                  ${ (item.count * item.price).toFixed(2) }
                </div>
                <div
                  className='cart-list-item cart-delete-item'
                  onClick={ () => deleteFromCart(item.id) }
                  >
                  <img src='/images/cart/DeleteItem.png' />
                </div>
              </div>
            ))
          }
          <div className='cart-list-row'>
            <div className='cart-list-item' />
            <div className='cart-list-item' />
            <div className='cart-list-item'>
              Total
            </div>
            <div className='cart-list-item'>
              ${ totalSum.toFixed(2) }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


Cart.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
