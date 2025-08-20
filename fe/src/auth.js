



import React from "react";
import { Navigate } from "react-router-dom";
import { getTokenEmpoloyee } from "./helper/useCookies";
import { jwtDecode } from "jwt-decode";
import AccessDenied from "./layouts/admin/components/AccessDenied";

const withAuth = (Component, requiredRole = null) => {
  const AuthRoute = () => {
    const token = getTokenEmpoloyee();

    // Nếu không có token, chuyển hướng đến trang đăng nhập
    if (!token) {
      return <Navigate to="/admin/login" />;
    }

    // Giải mã token để lấy vai trò
    let userRole = null;
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error("Error decoding token:", error);
      return <Navigate to="/admin/login" />;
    }

    // Nếu có requiredRole và userRole không khớp, hiển thị AccessDenied
    if (requiredRole && userRole !== requiredRole) {
      return <AccessDenied />;
    }

    // Nếu hợp lệ, hiển thị component
    return <Component />;
  };

  return AuthRoute;
};

export default withAuth;