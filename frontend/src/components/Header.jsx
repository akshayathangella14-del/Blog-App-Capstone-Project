import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import logo from "../assets/logo.jpg";

import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);

  // decide profile route based on role
  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>

        {/* LOGO */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
        >
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 rounded-lg object-cover"
          />

          <span className={`${navBrandClass} text-lg`}>
            MyBlog
          </span>
        </NavLink>

        {/* NAVIGATION */}
        <ul className={`${navLinksClass} gap-5`}>

          {/* HOME */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-[#0066cc] text-sm font-medium"
                  : "text-[#6e6e73] hover:text-[#1d1d1f] text-sm transition"
              }
            >
              Home
            </NavLink>
          </li>

          {/* NOT LOGGED IN */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#0066cc] text-sm font-medium"
                      : "text-[#6e6e73] hover:text-[#1d1d1f] text-sm transition"
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#0066cc] text-sm font-medium"
                      : "text-[#6e6e73] hover:text-[#1d1d1f] text-sm transition"
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* LOGGED IN */}
          {isAuthenticated && (
            <li>
              <NavLink
                to={getProfilePath()}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#0066cc] text-sm font-medium"
                    : "text-[#6e6e73] hover:text-[#1d1d1f] text-sm transition"
                }
              >
                Profile
              </NavLink>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Header;