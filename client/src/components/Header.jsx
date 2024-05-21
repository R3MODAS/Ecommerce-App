import logo from "../assets/logo.png"
import { IoSearch } from "react-icons/io5";

const Header = () => {
  return (
    <header className="h-20 shadow-md">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <div>
          <img src={logo} alt="logo" />
        </div>

        {/* Search */}
        <div className="flex items-center">
          <input type="text" placeholder="Search for Products..." className="" />
          <div className="min-w-12 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-r-full">
            <IoSearch />
          </div>
        </div>

        {/* User Icons */}
        <div>
          user icons
        </div>
      </div>
    </header>
  )
}

export default Header