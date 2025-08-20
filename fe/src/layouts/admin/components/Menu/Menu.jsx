



// import { Menu } from "antd";
// import sidebarData from "../sidebarData";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "./Sidebar.module.css";
// import { useState, useEffect } from "react";
// import { deleteToken, deleteUserToken, getTokenEmpoloyee } from "~/helper/useCookies";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// const Sidebar = () => {
//   const [theme, setTheme] = useState(true);
//   const [openKeys, setOpenKeys] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get the token and decode it to extract the role
//   const token = getTokenEmpoloyee();
//   let userRole = null;
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userRole = decodedToken.role;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//     }
//   }

//   // Hàm xác định các key của SubMenu cần mở dựa trên đường dẫn hiện tại
//   useEffect(() => {
//     const findOpenKeys = (data, path) => {
//       const keys = [];
//       data.forEach((item) => {
//         if (item.children) {
//           const hasChildWithPath = item.children.some(
//             (child) => child.path === path || (child.children && child.children.some((subChild) => subChild.path === path))
//           );
//           if (hasChildWithPath) {
//             keys.push(item.key);
//           }
//         }
//       });
//       return keys;
//     };

//     const initialOpenKeys = findOpenKeys(sidebarData, location.pathname);
//     setOpenKeys(initialOpenKeys);
//   }, [location.pathname]);

//   const changeTheme = () => {
//     setTheme(!theme);
//     sessionStorage.setItem("theme", !theme);
//   };

//   const handleLogout = () => {
//     deleteUserToken();
//     deleteToken();
//     navigate("/admin/login");
//     window.location.reload(true);
//     toast.success("Đăng xuất thành công");
//   };

//   const onOpenChange = (keys) => {
//     setOpenKeys(keys);
//   };

//   return (
//     <Menu
//       mode="inline"
//       className="h-100"
//       theme={sessionStorage.getItem("theme") === "true" ? "light" : "light"}
//       openKeys={openKeys}
//       onOpenChange={onOpenChange}
//       selectedKeys={[location.pathname]}
//     >
//       <Link className="d-flex align-items-center justify-content-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom">
//         <img
//           src={sessionStorage.getItem("theme") === "true" ? `/logo.jpg` : `/logo.jpg`}
//           alt=""
//           width="60%"
//         />
//       </Link>

//       {sidebarData
//         .filter((item) => {
//           // Ẩn các mục cấp cao không phù hợp với ROLE_EMLOYEE
//           if (userRole === "ROLE_EMLOYEE") {
//             return !["thongKe", "qlVoucher", "qlkhuyenmai"].includes(item.key);
//           }
//           return true;
//         })
//         .map((item) => {
//           if (item.children) {
//             // Lọc các mục con nếu là ROLE_EMLOYEE
//             const filteredChildren = item.children.filter((childItem) => {
//               if (userRole === "ROLE_EMLOYEE" && item.key === "qlTaiKhoan") {
//                 return childItem.key !== "qlNhanVien"; // Ẩn mục Quản lý nhân viên
//               }
//               return true;
//             });

//             // Chỉ render SubMenu nếu còn mục con
//             if (filteredChildren.length > 0) {
//               return (
//                 <Menu.SubMenu
//                   key={item.key}
//                   title={item.title}
//                   icon={<i className={`fas ${item.icon}`}></i>}
//                 >
//                   {filteredChildren.map((childItem) => {
//                     if (childItem.children) {
//                       return (
//                         <Menu.SubMenu
//                           key={childItem.key}
//                           title={childItem.title}
//                           icon={<i className={`fas ${childItem.icon}`}></i>}
//                         >
//                           {childItem.children.map((subChildItem) => (
//                             <Menu.Item
//                               key={subChildItem.path}
//                               icon={<i className={`fas ${subChildItem.icon}`}></i>}
//                             >
//                               <Link to={subChildItem.path}>
//                                 {subChildItem.title}
//                               </Link>
//                             </Menu.Item>
//                           ))}
//                         </Menu.SubMenu>
//                       );
//                     } else {
//                       return (
//                         <Menu.Item
//                           key={childItem.path}
//                           icon={<i className={`fas ${childItem.icon}`}></i>}
//                         >
//                           <Link to={childItem.path}>{childItem.title}</Link>
//                         </Menu.Item>
//                       );
//                     }
//                   })}
//                 </Menu.SubMenu>
//               );
//             }
//             return null; // Không render SubMenu nếu không còn mục con
//           }
//           return (
//             <Menu.Item
//               key={item.path}
//               icon={<i className={`fas ${item.icon}`}></i>}
//             >
//               <Link to={item.path}>{item.title}</Link>
//             </Menu.Item>
//           );
//         })}

//       <Menu.Item
//         key={"logout"}
//         icon={<i className={`fas fa-right-from-bracket`}></i>}
//         onClick={handleLogout}
//       >
//         <Link to={"/admin/login"}>Đăng xuất</Link>
//       </Menu.Item>
//     </Menu>
//   );
// };

// export default Sidebar;


import { Menu } from "antd";
import sidebarData from "../sidebarData";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState, useEffect } from "react";
import { deleteToken, deleteUserToken, getTokenEmpoloyee } from "~/helper/useCookies";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [theme, setTheme] = useState(true);
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const token = getTokenEmpoloyee();
  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    const findOpenKeys = (data, path) => {
      const keys = [];
      data.forEach((item) => {
        if (item.children) {
          const hasChildWithPath = item.children.some(
            (child) => child.path === path || (child.children && child.children.some((subChild) => subChild.path === path))
          );
          if (hasChildWithPath) {
            keys.push(item.key);
          }
        }
      });
      return keys;
    };

    const initialOpenKeys = findOpenKeys(sidebarData, location.pathname);
    setOpenKeys(initialOpenKeys);
  }, [location.pathname]);

  const changeTheme = () => {
    setTheme(!theme);
    sessionStorage.setItem("theme", !theme);
  };

  const handleLogout = () => {
    deleteUserToken();
    deleteToken();
    navigate("/admin/login");
    window.location.reload(true);
    toast.success("Đăng xuất thành công");
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Menu
      mode="inline"
      className="h-100"
      theme="light"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      selectedKeys={[location.pathname]}
    >
      <Link className="d-flex align-items-center justify-content-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom">
        <img
          src={sessionStorage.getItem("theme") === "true" ? `/logo.jpg` : `/logo.jpg`}
          alt="Logo"
          width="60%"
        />
      </Link>

      {sidebarData
        .filter((item) => {
          if (userRole === "ROLE_EMLOYEE") {
            return !["thongKe", "qlVoucher", "qlkhuyenmai"].includes(item.key);
          }
          return true;
        })
        .map((item) => {
          if (item.children) {
            const filteredChildren = item.children.filter((childItem) => {
              if (userRole === "ROLE_EMLOYEE" && item.key === "qlTaiKhoan") {
                return childItem.key !== "qlNhanVien";
              }
              return true;
            });

            if (filteredChildren.length > 0) {
              return (
                <Menu.SubMenu
                  key={item.key}
                  title={item.title}
                  icon={<i className={`fas ${item.icon}`}></i>}
                >
                  {filteredChildren.map((childItem) => {
                    if (childItem.children) {
                      return (
                        <Menu.SubMenu
                          key={childItem.key}
                          title={childItem.title}
                          icon={<i className={`fas ${childItem.icon}`}></i>}
                        >
                          {childItem.children.map((subChildItem) => (
                            <Menu.Item
                              key={subChildItem.path}
                              icon={<i className={`fas ${subChildItem.icon}`}></i>}
                              className={
                                location.pathname === subChildItem.path
                                  ? styles["menu-item-selected"]
                                  : ""
                              }
                            >
                              <Link to={subChildItem.path}>
                                {subChildItem.title}
                              </Link>
                            </Menu.Item>
                          ))}
                        </Menu.SubMenu>
                      );
                    } else {
                      return (
                        <Menu.Item
                          key={childItem.path}
                          icon={<i className={`fas ${childItem.icon}`}></i>}
                          className={
                            location.pathname === childItem.path
                              ? styles["menu-item-selected"]
                              : ""
                          }
                        >
                          <Link to={childItem.path}>{childItem.title}</Link>
                        </Menu.Item>
                      );
                    }
                  })}
                </Menu.SubMenu>
              );
            }
            return null;
          }
          return (
            <Menu.Item
              key={item.path}
              icon={<i className={`fas ${item.icon}`}></i>}
              className={
                location.pathname === item.path ? styles["menu-item-selected"] : ""
              }
            >
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
          );
        })}

      <Menu.Item
        key={"logout"}
        icon={<i className={`fas fa-right-from-bracket`}></i>}
        onClick={handleLogout}
      >
        <Link to={"/admin/login"}>Đăng xuất</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;
