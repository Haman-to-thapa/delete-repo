import React, { useEffect, useState } from 'react'
import register from '../assets/register.webp'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/slice/authSlice'
import { mergeCart } from '../redux/slice/cartSlice'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setUserName] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Get redirect paramerter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';
  const isCheckoutRedirect = redirect.includes('checkout');

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/")
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/")
      }
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }))


  }

  return (
    <div className='flex'>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className=" w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
          <div className="flex justify-center mb-6">
            <h2 className='text-xl font-medium'>Rabbit</h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-6'>Hey there ! </h2>
          <p className='text-center mb-6'>Enter Your New username and email or password to register here</p>

          <div className="mb-4 ">
            <label className='text-sm font-semibold block mb-2'>
              Name</label>
            <input type="text"
              value={name}
              onChange={(e) => setUserName(e.target.value)}
              placeholder='Enter Your Name'
              className='w-full p-2 rounded-lg border'
            />
          </div>

          <div className="mb4">
            <label className='block text-sm font-semibold'> Email</label>
            <input type="email"
              value={email}
              placeholder='enter your email'
              onChange={(e) => setEmail(e.target.value)}

              className='w-full p-2 border rounded-lg' />
          </div>

          <div className="mb-4">
            <label htmlFor=""
              className='text-sm  font-semibold block'
            > Password</label>
            <input type='password' placeholder='enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded-lg'
            />

          </div>
          <button type="submit"
            className='w-full bg-black text-white p-2 rounded-full mt-2 hover:bg-gray-800'
          >Login In</button>

          <p
            className='text-center mt-3 text-sm'
          >You have an account?
            <Link to={`/login?redirect=${encodeURIComponent(redirect || "/")}`} className='text-blue-500 underline'>
              {
                loading ? "Loading..." : " Sign In "
              }
              Login here</Link></p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center mt-2">

          <img src={register} alt="login to " className='w-full h-[750px] object-cover  ' />
        </div>

      </div>
    </div>
  )
}

export default Register