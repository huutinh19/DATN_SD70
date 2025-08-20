



import BaseUI from './layouts/admin/BaseUI';
import Shoe from './pages/admin/product/shoe/Shoe';
import Color from './pages/admin/product/attribute/Color';
import Size from './pages/admin/product/attribute/Size';
import Brand from './pages/admin/product/attribute/Brand';
import Origin from './pages/admin/product/attribute/Origin';
import Material from './pages/admin/product/attribute/Material';
import Sleeve from './pages/admin/product/attribute/Sleeve';
import Collar from './pages/admin/product/attribute/Collar';
import ShoeInfo from './pages/admin/product/shoe/ShoeInfo';
import AddProduct from './pages/admin/product/shoe-detail/AddShoe';
import AddStaff from './pages/admin/account/staff/AddStaff';
import Staff from './pages/admin/account/staff/Staff';
import StaffDetail from './pages/admin/account/staff/StaffDetail';
import Customer from './pages/admin/account/customer/Customer';
import AddCustomer from './pages/admin/account/customer/AddCustomer';
import CustomerDetail from './pages/admin/account/customer/CustomerDetail';
import Voucher from './pages/admin/voucher/Voucher';
import AddVoucher from './pages/admin/voucher/AddVoucher';
import VoucherDetail from './pages/admin/voucher/VoucherDetail';
import VoucherDetail1 from './pages/admin/voucher/VoucherDetail1';
import Bill from "./pages/admin/bill/Bill";
import BillDetail from "./pages/admin/bill/BillDetail";

import ImageGallery from "./pages/admin/ImageGallery";

import Order from './pages/admin/order/Order';
import Payment from "./pages/admin/payment/Payment";
import Statistic from "./pages/admin/statistic/Statistic";
import UserProfile from "./pages/admin/settings/UserProfile";
import withAuth from "./auth";

const publicRouters = [
 { path: "/", element: withAuth(Statistic, "ROLE_ADMIN") },
  { path: "/admin/product", element: withAuth(Shoe) }, // Không yêu cầu role cụ thể
  { path: "/admin/color", element: withAuth(Color,"ROLE_ADMIN") },
  { path: "/admin/size", element: withAuth(Size,"ROLE_ADMIN") },
  { path: "/admin/brand", element: withAuth(Brand,"ROLE_ADMIN") },
  { path: "/admin/origin", element: withAuth(Origin,"ROLE_ADMIN") },
  { path: "/admin/collar", element: withAuth(Collar,"ROLE_ADMIN") },  
  { path: "/admin/product/add", element: withAuth(AddProduct,"ROLE_ADMIN") },
  { path: "/admin/Material", element: withAuth(Material,"ROLE_ADMIN")},
  { path: "/admin/Sleeve", element: withAuth(Sleeve,"ROLE_ADMIN")},
  { path: "/admin/product/:id", element: withAuth(ShoeInfo,"ROLE_ADMIN") },
  // { path: "/admin/product  { path: "/admin/product/:id", element: withAuth(ShoeInfo) },

  { path: "/admin/staff", element: withAuth(Staff, "ROLE_ADMIN") }, // Chỉ admin
  { path: "/admin/staff/add", element: withAuth(AddStaff, "ROLE_ADMIN") },
  { path: "/admin/staff/:id", element: withAuth(StaffDetail, "ROLE_ADMIN") },

  { path: "/admin/customer", element: withAuth(Customer) },
  { path: "/admin/customer/add", element: withAuth(AddCustomer) },
  { path: "/admin/customer/:id", element: withAuth(CustomerDetail) },

  { path: "/admin/voucher", element: withAuth(Voucher, "ROLE_ADMIN") }, // Chỉ admin
  { path: "/admin/voucher/add", element: withAuth(AddVoucher, "ROLE_ADMIN") },
  { path: "/admin/voucher/:id", element: withAuth(VoucherDetail, "ROLE_ADMIN") },
  { path: "/admin/voucher-detail/:id", element: withAuth(VoucherDetail1) },
  { path: "/admin/order", element: withAuth(Order) },
  { path: "/admin/image-gallery", element: withAuth(ImageGallery) },

 { path: "/admin/bill", element: withAuth(Bill) },
  { path: "/admin/bill/:id", element: withAuth(BillDetail) },
{ path: "/admin/vnpay-payment", element: withAuth(Payment) },



  { path: "/admin/profile", element: withAuth(UserProfile) },
];

const privateRouters = [];

export { publicRouters, privateRouters };