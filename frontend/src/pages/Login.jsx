import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import login from '../assets/login.webp'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/slice/authSlice'
import { mergeCart } from '../redux/slice/cartSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  //Get redurect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || '/';

  const isCheckoutRedirect = redirect && redirect.includes("checkout");


  useEffect(() => {
    const mergeAndRedirect = async () => {
      if (user) {
        if (cart?.products.length > 0 && guestId) {
          await dispatch(mergeCart({ guestId, user }));
        }
        navigate(isCheckoutRedirect ? "/checkout" : '/');
      }
    };
    mergeAndRedirect();
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);




  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }));
  }

  return (
    <div className='flex'>
      <div className="w-full  md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12` ">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
          <div className="flex justify-center mb-6">
            <h2 className='text-xl font-medium'>Rabbit</h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-6'>Hey threr! </h2>
          <p className='text-center mb-6'>Enter your username and password to login.</p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border w-full p-2 rounded-lg'
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">
              Password
            </label>
            <input type="password"
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border w-full p-2 rounded-lg'
            />
          </div>

          <button
            type='submit'
            className='w-full p-2 bg-black text-white rounded-full mt-2 hover:bg-gray-800 transition-all'
          >
            {loading ? "Loading..." : " Sign In "}

          </button>

          <p className='mt-6 text-center text-sm'>Don't have an account? {""}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500 underline'>Register</Link>
          </p>
        </form>
      </div >

      {/* left side */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center mt-2">

          <img src={login} alt="login to " className='w-full h-[750px] object-cover  ' />
        </div>

      </div>

    </div >
  )
}

export default Login