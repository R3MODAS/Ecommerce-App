import logo from "../assets/logo.png"
import { IoSearch } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom"
import { MdCategory, MdContacts, MdHomeFilled, MdShop2 } from "react-icons/md"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 m-auto max_padd_container w-full bg-white ring-1 ring-slate-900/5 z-10">
      <div className="px-4 flexBetween py-3 max-xs:px-2">
        {/* Logo */}
        <div>
          <Link to={"/"}><img src={logo} alt="logo" /></Link>
        </div>

        {/* Navbar */}
        <nav className={``}>
          <NavLink to={"/"}><div className="flexCenter gap-x-1"><MdHomeFilled />Home</div></NavLink>
          <NavLink to={"/mens"}><div className="flexCenter gap-x-1"><MdCategory />Men's</div></NavLink>
          <NavLink to={"/womens"}><div className="flexCenter gap-x-1"><MdShop2 />Women's</div></NavLink>
          <NavLink to={"/kids"}><div className="flexCenter gap-x-1"><MdContacts />Kid's</div></NavLink>
        </nav>

        {/* Buttons */}
        <div>buttons</div>
      </div>
    </header>
  )
}

export default Header