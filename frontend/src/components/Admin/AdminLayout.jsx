import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import AdminSideBar from './AdminSideBar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidbarOpen] = useState(false)

  const toggleSideBar = () => {
    setIsSidbarOpen(!isSidebarOpen)
  };

  return (
    <div className='min-h-screen bg-white flex flex-col md:flex-row relative'>
      {/* Mobile Toggle Button */}
      <div className="flex md:hidden p-4 bg-gray-800 text-white z-50">
        <button onClick={toggleSideBar}>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      {/* Overlay for Mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSideBar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-800 w-64 min-h-screen text-white fixed md:relative transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
      >
        <AdminSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto bg-white">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
