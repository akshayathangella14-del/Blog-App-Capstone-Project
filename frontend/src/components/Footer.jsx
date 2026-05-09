import { NavLink } from "react-router";
import {
  linkClass,
  mutedText,
} from "../styles/common";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#e8e8ed] mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* BRAND */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-4">
              MyBlog
            </h3>
            <p className={`${mutedText} text-sm leading-relaxed`}>
              A modern blogging platform where authors share their insights and readers discover quality content.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-sm font-semibold text-[#1d1d1f] mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className={linkClass + " text-sm"}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={linkClass + " text-sm"}>
                  Join Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className={linkClass + " text-sm"}>
                  Login
                </NavLink>
              </li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h4 className="text-sm font-semibold text-[#1d1d1f] mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className={linkClass + " text-sm"}>
                  Technology
                </a>
              </li>
              <li>
                <a href="#" className={linkClass + " text-sm"}>
                  Programming
                </a>
              </li>
              <li>
                <a href="#" className={linkClass + " text-sm"}>
                  Web Development
                </a>
              </li>
              <li>
                <a href="#" className={linkClass + " text-sm"}>
                  AI & ML
                </a>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-sm font-semibold text-[#1d1d1f] mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className={linkClass + " text-sm"}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className={linkClass + " text-sm"}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className={linkClass + " text-sm"}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className={linkClass + " text-sm"}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-[#e8e8ed] py-8"></div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* LEFT */}
          <div className={mutedText}>
            <p className="text-xs text-center sm:text-left">
              © {currentYear} MyBlog. All rights reserved. Built with passion for writers and readers.
            </p>
          </div>

          {/* RIGHT - SOCIAL/LINKS */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className={linkClass + " text-xs"}
              title="Twitter"
            >
              Twitter
            </a>
            <a
              href="#"
              className={linkClass + " text-xs"}
              title="GitHub"
            >
              GitHub
            </a>
            <a
              href="#"
              className={linkClass + " text-xs"}
              title="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;