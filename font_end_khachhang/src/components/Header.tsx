



import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Images from "../static";
import path from "../constants/path";
import axios from "axios";
import { IDataNoti, IProduct, Product } from "../types/product.type";
import FormLogin from "../pages/loginAndRegister";
import { toSlug } from "../utils/format";
import { useShoppingCart } from "../context/shoppingCart.context";
import API from "../api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getCookie } from "../helper/CookiesRequest";
import Fade from "react-reveal/Fade";
import { Bell, PackageSearch } from "lucide-react";
import Contact from "./Contact";
import About from "./About";

const Header = () => {
  const navigate = useNavigate();
  const {
    cartQuantity,
    cartItems,
    userPrf,
    listProducts,
    infoUser,
  } = useShoppingCart();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>();
  const [results, setResults] = useState<IProduct[]>([]);
  const [listBrandHeader, setListBrandHeader] = useState<Product[]>([]);
  const [listCategory, setListCategory] = useState<Product[]>([]);
  const [showModalNoti, setShowModalNoti] = useState(false);
  const [dataNoti, setDataNoti] = useState<IDataNoti[]>([]);
  const [type, setType] = useState<boolean>(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const token = getCookie("customerToken");
  const notiRef = useRef<HTMLDivElement>(null); // Ref for the notification dropdown
  const [currentPage, setCurrentPage] = useState("home");

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      const key = event.target.value;
      navigate(`/search/${toSlug(event.target.value)}`, { state: { key } });
      setResults([]);
    }
  };

  const getDataBrand = async () => {
    const res = await axios({ method: "get", url: API.getBrand() });
    if (res.status) {
      setListBrandHeader(res.data?.data);
    }
  };

  const getDataNoti = async () => {
    if (userPrf) {
      const res = await axios({
        method: "get",
        url: API.getNoti(Number(userPrf?.id)),
      });
      if (res.status) {
        const allNotifications = res.data?.data || [];
        const unreadCount = allNotifications.filter(
          (notification: any) => notification.type === 0
        ).length;
        setUnreadNotificationsCount(unreadCount);
        setDataNoti(res.data?.data);
      }
    }
  };

  const deleteNotiOne = async (id: number) => {
    if (userPrf) {
      const res = await axios({
        method: "delete",
        url: API.getNoti(Number(id)),
      });
      if (res.status) {
        getDataNoti();
      }
    }
  };

  const getCategory = async () => {
    try {
      const res = await axios({ method: "get", url: API.getCategory() });
      if (res.status) {
        setListCategory(res.data?.data);
      }
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchDataSearch = (value: string) => {
    fetch(API.getAllShoe(1, 1000000))
      .then((response) => response.json())
      .then((json) => {
        const results = json?.data.filter(
          (search: IProduct) =>
            value &&
            search &&
            search.name &&
            search.name.toLowerCase().includes(value)
        );
        setResults(results);
      });
  };

  const handleChange = (value: string) => {
    setSearchValue(value);
    fetchDataSearch(value);
  };

  // Toggle notification dropdown on click
  const toggleNotiDropdown = () => {
    setShowModalNoti((prev) => !prev);
    if (!showModalNoti) {
      getDataNoti();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setShowModalNoti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getDataBrand();
    getCategory();
  }, []);

  useEffect(() => {
    getDataNoti();
  }, [userPrf?.id, type]);

  return (
    <Fragment>
      {/* Top Black Bar */}
      <div className="bg-orange-500 text-white py-2">
        
        <div className="max-w-screen-xl mx-auto px-4 flex justify-end items-center space-x-6">
        <div className="hidden md:block flex-1 overflow-hidden">
          <div
            style={{
              animation: "marquee 15s linear infinite",
              whiteSpace: "nowrap",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "white",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
          >
            Liên hệ mua hàng: 0385507617 (8:30-21:30, Tất cả các ngày trong tuần)
          </div>
          {/* Keyframes inline */}
          <style>{`
            @keyframes marquee {
              0% {
                transform: translateX(100%);
              }
              100% {
                transform: translateX(-100%);
              }
            }
          `}</style>
        </div>
          <div
            className="flex items-center cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate(path.lookUpOrders)}
          >
            <PackageSearch className="w-5 h-5 mr-2 text-white" />
            <p className="text-sm font-medium">Tra cứu đơn hàng</p>
          </div>
          <div className="relative" ref={notiRef}>
            <div
              className="flex items-center cursor-pointer hover:text-gray-300 transition-colors ml-4"
              onClick={toggleNotiDropdown}
            >
              {unreadNotificationsCount > 0 && (
                <div className="absolute left-3 -top-1">
                  <p className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadNotificationsCount}
                  </p>
                </div>
              )}
              <Bell className="w-5 h-5 text-white" />
              <p className="text-sm font-medium ml-2">Thông báo</p>
            </div>
            {userPrf && showModalNoti && (
              <div className="absolute top-10 right-0 w-80 rounded-lg shadow-xl z-50 bg-white text-black">
                <Fade top distance="20%" duration={300}>
                  <div className="w-6 inline-block ml-[80%]">
                    <div className="h-3 w-3 bg-white rotate-45 transform origin-bottom-left z-10 shadow-lg"></div>
                  </div>
                  <div className="w-full bg-white -mt-2 rounded-lg max-h-64 overflow-y-auto">
                    {dataNoti?.length > 0 ? (
                      dataNoti.map((e, i) => {
                        if (type === false && i >= 4) return null;
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              getDataNoti();
                              setShowModalNoti(false);
                              navigate(`/notification/${e.id}`);
                            }}
                            className={`group relative px-3 py-2 hover:bg-gray-100 ${
                              e.type === 1 ? "bg-gray-50" : ""
                            }`}
                          >
                            <p
                              className={`text-sm ${
                                e.type === 1 ? "font-normal" : "font-semibold"
                              } line-clamp-1`}
                            >
                              {e.title}
                            </p>
                            <p
                              className={`text-xs ${
                                e.type === 1 ? "font-normal" : "font-medium"
                              } line-clamp-2`}
                            >
                              {e.content}
                            </p>
                            <button
                              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                deleteNotiOne(e.id);
                              }}
                            >
                              <img src={Images.iconClose} className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center">
                        <img
                          src={Images.iconNoti}
                          alt=""
                          className="w-16 mx-auto"
                        />
                        <p className="text-sm font-light mt-2">
                          Thông báo trống
                        </p>
                      </div>
                    )}
                    {type === false && dataNoti?.length > 4 && (
                      <p
                        className="text-sm font-semibold text-center py-2 bg-gray-100 cursor-pointer"
                        onClick={() => setType(true)}
                      >
                        Xem tất cả
                      </p>
                    )}
                  </div>
                </Fade>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="relative z-20">
        <header className="bg-white py-4">
          <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <div className="w-[10%]">
              <Link to="/" className="flex items-center">
                <LazyLoadImage
                  className="h-[60px] w-auto object-contain"
                  // src={Images.logo}
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-[2] mx-6 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full p-3 pl-10 text-sm text-gray-900 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Tìm kiếm sản phẩm..."
                />
                {results?.length > 0 && (
  <div className="absolute w-full bg-white mt-2 rounded-lg shadow-xl max-h-64 overflow-y-auto z-10">
    {results.map((result, index) => {
      const firstImage = result.images ? result.images.split(",")[0] : Images.imgNotFound;
      return (
        <div
          key={index}
          className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setSearchValue(result.name);
            setResults([]);
            navigate(`/product/${result.id}`);
          }}
        >
          <img
            src={firstImage}
            alt={result.name}
            className="w-10 h-10 object-cover rounded mr-3"
          />
          <p className="text-sm font-medium">{result.name}</p>
        </div>
      );
    })}
  </div>
)}
              </div>
            </div>

            {/* Right Section: Cart and User */}
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu for Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden focus:outline-none"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Cart */}
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate(path.cart)}
                >
                  <div className="relative">
                    {(cartQuantity > 0 || listProducts?.length > 0) && (
                      <div className="absolute -top-1 -right-1">
                        <p className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {userPrf ? listProducts.length : cartItems.length}
                        </p>
                      </div>
                    )}
                    <img src={Images.iconCart2} className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium ml-2"></p>
                </div>

                {/* User Account */}
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() =>
                    navigate(token ? path.information : path.loginScreen)
                  }
                >
                  <img
                    src={
                      userPrf && infoUser?.avatar
                        ? infoUser.avatar
                        : Images.iconAccount3
                    }
                    className="w-6 h-6 rounded-full object-cover mr-2"
                  />
                  <p className="text-sm font-medium">
                    {userPrf && infoUser?.username
                      ? infoUser.username
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white shadow-md py-4 ">
              <div className="max-w-screen-xl mx-auto px-4">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full p-3 pl-10 text-sm text-gray-900 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Tìm kiếm sản phẩm..."
                  />
                </div>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to={`/${toSlug("Tất cả sản phẩm")}`}
                      className="text-gray-800 hover:text-blue-600 text-sm font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sản phẩm
                    </Link>
                  </li>
                  <li>
                    <div className="text-gray-800 text-sm font-semibold">
                      Thương hiệu
                    </div>
                    <ul className="pl-4 mt-2 space-y-2">
                      {listBrandHeader.slice(0, 3).map((item, index) => (
                        <li key={index}>
                          <Link
                            to={`/brand/${item.id}/${toSlug(item.name)}`}
                            className="text-gray-600 hover:text-blue-600 text-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="/brands"
                          className="text-blue-600 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Xem tất cả thương hiệu
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="text-gray-800 text-sm font-semibold">
                      Danh mục
                    </div>
                    <ul className="pl-4 mt-2 space-y-2">
                      {listCategory.slice(0, 3).map((item, index) => (
                        <li key={index}>
                          <Link
                            to={`/category/${item.id}/${toSlug(item.name)}`}
                            className="text-gray-600 hover:text-blue-600 text-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="/categories"
                          className="text-blue-600 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Xem tất cả danh mục
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-800 hover:text-blue-600 text-sm font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-800 hover:text-blue-600 text-sm font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Liên hệ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </header>

        {/* Desktop Navigation */}
        {listBrandHeader && listCategory && (
          <nav className="bg-orange-500 py-3 hidden md:block h-[60px]">
            <div className="max-w-screen-xl mx-auto px-4">
              <ul className="flex items-center space-x-8 text-sm font-medium text-white">
                <li className="relative group">
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    TRANG CHỦ
                  </Link>
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </li>
                <li className="relative group">
                  <Link
                    to={`/${toSlug("Tất cả sản phẩm")}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    SẢN PHẨM
                  </Link>
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </li>
                <li className="relative group">
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    GIỚI THIỆU
                  </Link>
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </li>
                <li className="relative group">
                  <Link
                    to="/contact"
                    className="hover:text-blue-400 transition-colors"
                  >
                    LIÊN HỆ
                  </Link>
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </li>
              </ul>
            </div>
          </nav>
        )}
      </div>

      <FormLogin
        showModal={showModal}
        setShowModal={setShowModal}
        typeModal={typeModal}
        setTypeModal={setTypeModal}
      />
    </Fragment>
  );
};

export default Header;