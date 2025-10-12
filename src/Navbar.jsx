import { NavLink } from "react-router-dom";

import uniLogo from "./assets/images/upb_logo.jpg";

export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `block px-6 py-4 text-white font-semibold hover:bg-gray-700 transition-all duration-200 ${isActive ? "bg-gray-600" : "hover:bg-gray-600"
    }`;

  return (
    <div className="navbar fixed top-0 w-full bg-white text-white shadow-lg z-50 p-0 text-base">
      <div className="flex flex-row  flex-nowrap items-center space-x-4 px-4 py-2">
        <a
          href="https://www.uni-paderborn.de/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={uniLogo} alt="University Logo" width={150} height={50} />
        </a>
      </div>
      <div
        className="flex-1 justify-center text-center cursor-pointer"
        onClick={() => window.location.reload()}
      >
        <span className="text-sm sm:text-base md:text-md text-black lg:text-xl font-semibold tracking-wide">
          📘 EN ⇄ DE Glossary
        </span>
      </div>
      <div className="ml-auto flex items-center">
        <div className="hidden lg:flex space-x-1">
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
        </div>
      </div>

    </div>
  );
}