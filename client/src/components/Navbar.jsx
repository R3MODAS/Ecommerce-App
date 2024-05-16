import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full bg-grey-0 py-6 px-[6%] items-center">
        <p className="text-3xl font-bold text-primary-500 leading-6">Sociopedia</p>
    </header>
  )
}

export default Navbar