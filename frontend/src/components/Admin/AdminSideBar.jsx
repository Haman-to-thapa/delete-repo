import React from 'react'
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slice/authSlice'
import { clearCart } from '../../redux/slice/cartSlice'

const AdminSideBar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className='text-2xl font-medium'>
          Rabbit
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>

      <nav className="flex flex-col space-y-2">
        <NavLink to='/admin/users'
          className={({ isActive }) => isActive ?
            "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 flex items-center space-x-2 hover:bg-gray-700 hover:text-white py-3 px-4 rounded"}
        >
          <FaUser />
          <span>Users</span>
        </NavLink>

        <NavLink to='/admin/products'
          className={({ isActive }) => isActive ?
            "flex items-center space-x-2 text-white py-3 px-4 rounded bg-gray-700" :
            "text-gray-300 flex items-center rounded py-3 px-4 hover:text-white hover:bg-gray-700 space-x-2"}>
          <FaBoxOpen />
          <span>Product</span>
        </NavLink>

        <NavLink to='/admin/orders'
          className={({ isActive }) => isActive ?
            "flex items-center space-x-2 text-white py-3 px-4 rounded bg-gray-700" :
            "flex items-center space-x-2 hover:bg-gray-700 hover:text-white text-gray-300 py-3 px-4  "}
        >
          <FaClipboardList />
          <span>Order</span>
        </NavLink>


        <NavLink to='/admin/shops'
          className={({ isActive }) => isActive ?
            "flex items-center space-x-2 text-white py-3 px-4 rounded bg-gray-700" :
            "flex items-center space-x-2 hover:bg-gray-700 hover:text-white text-gray-300 py-3 px-4  "}
        >
          <FaStore />
          <span>Shop</span>
        </NavLink>

      </nav>
      <div className="mt-6">
        <button onClick={handleLogout}
          className='w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2'
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

    </div>
  )
}

export default AdminSideBar
