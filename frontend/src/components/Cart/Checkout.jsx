import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaypalButton from './PaypalButton'
import { useDispatch, useSelector } from 'react-redux'
import { createCheckout } from '../../redux/slice/checkoutSlice'
import axios from 'axios'

// const cart = {
//   products: [
//     {
//       name: "Stylish Jacket",
//       size: "M",
//       color: "Black",
//       price: 120,
//       image: "https://picsum.photos/150?random=1",
//     },
//     {
//       name: "Casual Sneakers",
//       size: "42",
//       color: "White",
//       price: 75,
//       image: "https://picsum.photos/150?random=2",
//     }
//   ],
//   totalPrice: 195,
// }

const Checkout = () => {
  const navigate = useNavigate()
  const [checkoutId, setCheckoutId] = useState(null)
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  })


  // after a backend 
  const dispatch = useDispatch()
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth)

  // Ensure cart is loaded before processsing 
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate('/')
    }
  }, [cart, navigate])




  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id)
        // Set checkout D if checkout was successFul
      }
    }
  }


  const handlePaymentSuccess = async (details) => {
    try {

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "Paid", paymentDetails: details }
        , {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        })
      await handleFinalizeCheckout(checkoutId);

    } catch (error) {
      console.error(error);
    }
  }

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      })
      navigate('/order-confirmation')
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) return <p>Loading cart .....</p>
  if (error) return <p>Error : {error}</p>
  if (!cart?.products?.length) {
    return <p>Your cart is empty</p>;
  }



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">

      {/* letf SEction */}
      <div className="bg-white rounded-lg p-6">
        <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className='text-lg- mb-4'>Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className='w-full p-2 bordre rounded'
              disabled
            />
          </div>

          <h3 className='text-lg mb-4'>Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                className='w-full p-2 border rounded '
                required
                value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
              />
            </div>
            <div className="">
              <label className="block text-gray-700">Second Nmae</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                className='w-full p-2 border rounded'
              />
            </div>

          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              Address
            </label>
            <input
              type="text"
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              value={shippingAddress.address}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4 "  >
            <div className="">
              <label className="block text-gray-700">
                City
              </label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className='w-full p-2 rounded border ]'
              />
            </div>
            <div className="">
              <label className="block text-gray-700"> PostalCode</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className='w-full p-2 border rounded'
              />
            </div>
          </div>

          <div className="mb-4">
            <label className='block text-gray-700'>
              Country
            </label>
            <input type="text"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className="mb-4">
            <label className='block text-gray-700'>
              Phone
            </label>
            <input type="text"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              className='w-full p-2 text-gray-700'
            />
          </div>

          <div className="mt-6 ">
            {!checkoutId ?
              (<button
                type="submit"
                className='w-full bg-black text-white  py-3 rounded'
              > Continue to Payment</button>)
              :
              (<div>
                <h3 className='text-lg mb-4'> Pay with Paypal </h3>
                {/*  Paypal Component*/}
                <PaypalButton
                  amount={(cart.totalPrice || 0).toFixed(2)}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => {
                    console.error("PayPal Payment Error:", err);
                    alert("Payment failed. Try Again");
                  }}
                />

              </div>)}
          </div>

        </form>
      </div>

      {/*  Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className='text-lg mb-4'>Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className='flex items-center justify-between py-2 border-b'>
              <div className="flex items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className='w-20 h-2/4 object-cover mr-4'
                />

                <div className="">
                  <h3 className='text-md'>{product.name}</h3>
                  <p className='text-gray-500'>Size :  {product.size}</p>
                  <p className='text-gray-500'>Color : {product.color}</p>
                </div>
              </div>
              <p className='text-xl'>$ {product.price?.toLocaleString()}</p>

            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>

        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p> Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>

    </div>
  )
}

export default Checkout