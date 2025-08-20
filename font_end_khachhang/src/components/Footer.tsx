
import React from "react";
import Images from "../static";

const Footer = () => {
  return (
    <footer className="bg-orange-500 text-gray-300 pt-10 pb-6">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">T&T Sports</h2>
          <p className="text-sm">
            Chuyên cung cấp áo chính hãng từ các thương hiệu hàng đầu thế giới.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Danh mục</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Áo phông</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Áo thể thao</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Áo len</a></li>
            
          </ul>
        </div>

        {/* Store Locations */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Cửa hàng</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Hà Nội: Ngõ 86 Phú Kiều</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">TP.HCM: </a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a3 3 0 110 6 3 3 0 010-6zm0 13a8 8 0 01-6-3 3 3 0 016 0h2a3 3 0 016 0 8 8 0 01-6 3z" /></svg>
              Hà Nội, Việt Nam
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-2 12H6V8l6 4 6-4v8z" /></svg>
              support@ttsports.com
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm6 16a4 4 0 100-8 4 4 0 000 8z" /></svg>
              033-586-7600
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media */}
      <div className="container mx-auto px-6 mt-8 flex justify-center space-x-6">
        <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-indigo-400 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
        </a>
        <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-indigo-400 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
        </a>
      </div>

      <div className="container mx-auto px-6 mt-6 text-center text-sm border-t border-gray-800 pt-4">
        <p>© 2025 T&T Sports. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;