import React from 'react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../../redux/slice/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {

  // const cartProducts = [
  //   {
  //     productId: 1,
  //     name: "T-shirt",
  //     size: "M",
  //     color: "Red",
  //     quantity: 1,
  //     price: 15,
  //     image: "https://picsum.photos/200?random=1"

  //   },
  //   {
  //     productId: 2,
  //     name: "Jeans",
  //     size: "L",
  //     color: "Blue",
  //     quantity: 1,
  //     price: 25,
  //     image: "https://picsum.photos/200?random=2"
  //   }
  // ]

  const dispatch = useDispatch();

  // Handle adding or substraction to cart 
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity, newQuantity,
          guestId, userId,
          size, color,
        })
      )
    }
  }

  // Remove cart 
  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  }

  return (
    <div>
      {
        cart.products.map((product, index) => (
          <div key={index}>
            <div className='flex items-start justify-between py-4 border-b'>
              <img src={product.image} alt={product.name} className='w-20 h-20 object-cover mr-4 rounded' />
              <div>
                <h3>{product.name}</h3>
                <p
                  className='text-sm text-gray-500'
                >size: {product.size} | color: {product.color}</p>
                <div className='flex items-center mt-2'>
                  <button
                    // add to hanleAddTocart
                    onClick={(() => {
                      handleAddToCart(
                        product.productId, -1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    })}

                    className='border px-2 py-1 text-xl font-medium'> - </button>
                  <span className='mx-4'>{product.quantity}</span>
                  <button
                    onClick={() => {
                      handleAddToCart(product.productId, 1,
                        product.quantity,
                        product.size,
                        product.color

                      )
                    }}
                    className='flex border items-center py-1 px-2 text-xl font-medium'> + </button>
                </div>
              </div>

              <div>
                <p> $ {product.price.toLocaleString()}</p>
                <button
                  onClick={() => {
                    handleRemoveFromCart(
                      product.productId,
                      product.size,
                      product.color
                    )
                  }}
                >
                  <RiDeleteBinLine className='h-6 w-6 mt-2 text-red-600' />
                </button>
              </div>


            </div>
          </div>
        ))
      }
    </div>
  )
}

export default CartContents