const sidebarData = [
  {
    key: "tongQuan",
    title: "Bán hàng tại quầy",
    icon: "fa-solid fa-cash-register",
    path: "/admin/order",
  },
  {
    key: "qlDonHang",
    title: "Quản lý hoá đơn",
    icon: "fa-solid fa-file-invoice",
    path: "/admin/bill",
  },
  {
      key: "thongKe",
      title: "Thống kê",
      icon: "fa-solid fa-chart-line", // biểu đồ
      path: "/",
    },
  {
    key: "qlsanpham",
    title: "Quản lý sản phẩm",
    icon: "fa-solid fa-boxes-stacked",
    path: "/services",
    children: [
      {
        key: "sanPham",
        title: "Sản phẩm",
        icon: "fa-solid fa-box",
        path: "/admin/product",
      },
      {
        key: "kichCo",
        title: "Kích cỡ",
        icon: "fa-solid fa-ruler-combined",
        path: "/admin/size",
      },
      {
        key: "mauSac",
        title: "Màu sắc",
        icon: "fa-solid fa-palette",
        path: "/admin/color",
      },
      {
        key: "thuongHieu",
        title: "Thương hiệu",
        icon: "fa-solid fa-award", // thay icon có tính chất thương hiệu
        path: "/admin/brand",
      },
      {
        key: "xuatXu",
        title: "Xuất xứ",
        icon: "fa-solid fa-globe", // biểu tượng địa lý
        path: "/admin/origin",
      },
      {
        key: "coAo",
        title: "Cổ áo",
        icon: "fa-solid fa-shirt", // phù hợp với áo
        path: "/admin/collar",
      },
      {
        key: "tayAo",
        title: "Tay áo",
        icon: "fa-solid fa-hand-paper", // biểu tượng tay
        path: "/admin/sleeve",
      },
      {
        key: "chatLieu",
        title: "Chất liệu",
        icon: "fa-solid fa-layer-group", // đại diện cho nhiều lớp chất liệu
        path: "/admin/material",
      },
    ],
  },
  {
    key: "qlTaiKhoan",
    title: "Quản lý tài khoản",
    icon: "fa-solid fa-users-cog",
    children: [
      {
        key: "qlNhanVien",
        title: "Quản lý nhân viên",
        icon: "fa-solid fa-user-tie",
        path: "/admin/staff",
      },
      {
        key: "qlKhachHang",
        title: "Quản lý khách hàng",
        icon: "fa-solid fa-user",
        path: "/admin/customer",
      },
    ],
  },
  {
    key: "qlVoucher",
    title: "Quản lý phiếu giảm giá",
    icon: "fa-solid fa-ticket-alt",
    path: "/admin/voucher",
  },
];

export default sidebarData;
