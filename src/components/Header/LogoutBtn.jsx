import React from 'react'
import {logout} from "../../store/authSlice"
import { useDispatch } from 'react-redux'
function LogoutBtn() {

  const dispatch = useDispatch()
    const logoutHandler = ()=>{
      authService.logout().then(()=>{
           dispatch(logout())
      })
    }
  return (
    <div className='inline-block px-6 py-2 duration-200 hover:bg-amber-700 rounded-full'>LogoutBtn</div>
  )
}

export default LogoutBtn