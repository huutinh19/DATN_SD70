// src/components/AccessDenied.js
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
        extra={
          <Button type="primary" onClick={() => navigate("/admin/login")}>
            Vui lòng đăng nhập tài khoản khác
          </Button>
        }
      />
    </div>
  );
};

export default AccessDenied;