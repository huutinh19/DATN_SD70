import React from "react";

function Footer() {
  return (
    <footer className="bg-light text-black text-center py-3">
      <p className="mb-2">© 2025 Công ty của bạn. Mọi quyền được bảo lưu.</p>
      <p>Theo dõi chúng tôi:</p>
      <div>
        <a href="https://facebook.com" className="text-primary mx-2" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook fa-lg"></i>
        </a>
        <a href="https://instagram.com" className="text-warning mx-2" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram fa-lg"></i>
        </a>
        <a href="https://twitter.com" className="text-primary mx-2" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter fa-lg"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
