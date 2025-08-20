
import React, { useEffect, useMemo, useState } from "react";
import { IDetailProduct, IProduct, Product } from "../types/product.type";
import Slider from "react-slick";
import { convertToCurrencyString, findProductIdByName } from "../utils/format";
import { useNavigate } from "react-router-dom";
import API from "../api";
import axios from "axios";
import { useShoppingCart } from "../context/shoppingCart.context";
import { toast } from "react-toastify";
import Images from "../static";
import MyReactImageMagnify from "./ReactImageMagnify";

const QuickViewDetail = ({
  product,
  setShowQuickView,
}: {
  product: IProduct;
  setShowQuickView: any;
}) => {
  const navigate = useNavigate();
  const {
    getItemQuantity,
    openCart,
    addMultipleToCart,
    userPrf,
    addToCartUser,
    getItemQuantityUser,
  } = useShoppingCart();
  const [chooseSize, setChooseSize] = useState<any>();
  const [chooseColor, setChooseColor] = useState<any>();
  const [chooseSizeName, setChooseSizeName] = useState<string | number>();
  const [chooseColorName, setChooseColorName] = useState<string>();
  const [dataDetailProduct, setDataDetailProduct] = useState<IDetailProduct[]>();
  const [price, setPrice] = useState<number | undefined>(0);
  const [amountShoe, setAmountShoe] = useState<number>(0);
  const [idAddToCart, setIdAddToCart] = useState<number>(0);
  const [code, setCode] = useState<string>();
  const [sale, setSale] = useState<boolean>();
  const [priceSale, setPriceSale] = useState<boolean>();
  const [amount, setAmount] = useState(1);
  const [allSizeData, setAllSizeData] = useState<Product[]>([]);
  const [allColorData, setAllColorData] = useState<Product[]>([]);
  const [status, setStatus] = useState<boolean>(false); // Overall product status

  // Slider settings
  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  // Handle closing the modal
  const handleCloseClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setShowQuickView(false);
  };

  // Fetch product details
  const getInfoDetailProduct = async () => {
    try {
      if (product?.id) {
        const res = await axios.get(API.getShoeDetail(Number(product.id)));
        if (res.status) {
          setDataDetailProduct(res?.data?.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all sizes
  const getDataSize = async () => {
    try {
      const response = await axios.get(API.getSizeAll());
      if (response.status) {
        setAllSizeData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all colors
  const getDataColor = async () => {
    try {
      const response = await axios.get(API.getAllColors());
      if (response.status) {
        setAllColorData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch price and details based on size, color, and product
  const getPriceDetailShoe = async () => {
    try {
      const res = await axios.get(
        API.getPriceDetailShoe(product?.name, chooseSize, chooseColor, product?.id)
      );
      if (res.status) {
        if (res?.data?.totalPages === 0) {
          setPrice(0);
        }
        if (res?.data?.data[0]?.price) {
          setPrice(res?.data?.data[0].price);
          setAmountShoe(res?.data?.data[0].quantity);
          setIdAddToCart(res?.data?.data[0].id);
          setCode(res?.data.data[0].code);
          setSale(res?.data?.data[0].discountPercent);
          setPriceSale(res?.data?.data[0].discountValue);
          setStatus(res?.data?.data[0].status); // Overall product status
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Memoized image array
  const imgArr = useMemo(() => {
    if (dataDetailProduct && dataDetailProduct.length > 0) {
      const arr = [];
      for (let i = 0; i < dataDetailProduct.length; i++) {
        arr.push(dataDetailProduct[i].images ? dataDetailProduct[i].images.split(",") : []);
      }
      return arr.flat();
    }
    return product.images ? product.images.split(",") : [];
  }, [dataDetailProduct, product.images]);

  // Memoized available sizes with quantity and status, filtered by selected color
  const availableSizes = useMemo(() => {
    const sizes: { name: string; quantity: number; status: boolean }[] = [];
    if (dataDetailProduct && dataDetailProduct.length > 0) {
      const uniqueSizes = [...new Set(dataDetailProduct.map((p) => p.size))];

      for (const size of uniqueSizes) {
        const productsWithSize = dataDetailProduct.filter(
          (p) => p.size === size && (!chooseColorName || p.color === chooseColorName)
        );
        const totalQuantity = productsWithSize.reduce((sum, p) => sum + (p.quantity || 0), 0);
        const isSizeAvailable = productsWithSize.some(
          (p) => !p.status && (p.quantity || 0) > 0
        );

        sizes.push({
          name: String(size),
          quantity: totalQuantity,
          status: !isSizeAvailable,
        });
      }
    }
    return sizes;
  }, [dataDetailProduct, chooseColorName]);

  // Memoized available colors with quantity and status, filtered by selected size
  const availableColors = useMemo(() => {
    const colors: { name: string; quantity: number; status: boolean }[] = [];
    if (dataDetailProduct && dataDetailProduct.length > 0) {
      const uniqueColors = [...new Set(dataDetailProduct.map((p) => p.color))];

      for (const color of uniqueColors) {
        const productsWithColor = dataDetailProduct.filter(
          (p) => p.color === color && (!chooseSizeName || p.size === chooseSizeName)
        );
        const totalQuantity = productsWithColor.reduce((sum, p) => sum + (p.quantity || 0), 0);
        const isColorAvailable = productsWithColor.some(
          (p) => !p.status && (p.quantity || 0) > 0
        );

        if (productsWithColor.length > 0) {
          colors.push({
            name: color,
            quantity: totalQuantity,
            status: !isColorAvailable,
          });
        }
      }
    }
    return colors;
  }, [dataDetailProduct, chooseSizeName]);

  // Initial data fetching
  useEffect(() => {
    getInfoDetailProduct();
    getDataSize();
    getDataColor();
  }, [product.id]);

  // Set default size and color
  useEffect(() => {
    if (dataDetailProduct && dataDetailProduct.length > 0) {
      const firstAvailableProduct =
        dataDetailProduct.find((p) => p.quantity > 0 && !p.status) || dataDetailProduct[0];
      if (firstAvailableProduct) {
        setChooseSize(findProductIdByName(firstAvailableProduct.size, allSizeData));
        setChooseSizeName(firstAvailableProduct.size);
        setChooseColor(findProductIdByName(firstAvailableProduct.color, allColorData));
        setChooseColorName(firstAvailableProduct.color);
      }
    }
  }, [dataDetailProduct, allSizeData, allColorData]);

  // Reset invalid selections
  useEffect(() => {
    if (dataDetailProduct && dataDetailProduct.length > 0) {
      if (chooseSizeName) {
        const availableColorsForSize = dataDetailProduct.filter(
          (p) => p.size === chooseSizeName && !p.status && (p.quantity || 0) > 0
        );
        if (
          chooseColorName &&
          !availableColorsForSize.some((p) => p.color === chooseColorName)
        ) {
          const firstAvailableColor = availableColorsForSize[0];
          if (firstAvailableColor) {
            setChooseColor(findProductIdByName(firstAvailableColor.color, allColorData));
            setChooseColorName(firstAvailableColor.color);
          } else {
            setChooseColor(undefined);
            setChooseColorName(undefined);
          }
        }
      }
      if (chooseColorName) {
        const availableSizesForColor = dataDetailProduct.filter(
          (p) => p.color === chooseColorName && !p.status && (p.quantity || 0) > 0
        );
        if (
          chooseSizeName &&
          !availableSizesForColor.some((p) => p.size === chooseSizeName)
        ) {
          const firstAvailableSize = availableSizesForColor[0];
          if (firstAvailableSize) {
            setChooseSize(findProductIdByName(firstAvailableSize.size, allSizeData));
            setChooseSizeName(firstAvailableSize.size);
          } else {
            setChooseSize(undefined);
            setChooseSizeName(undefined);
          }
        }
      }
    }
  }, [dataDetailProduct, chooseSizeName, chooseColorName, allSizeData, allColorData]);

  // Fetch price when size or color changes
  useEffect(() => {
    if (chooseColor && chooseSize) {
      getPriceDetailShoe();
    }
  }, [product.name, chooseSize, chooseColor]);

  const amountItemInCart = userPrf ? getItemQuantityUser(idAddToCart) : getItemQuantity(idAddToCart);

  // Render for discontinued or out-of-stock product
  if (status || amountShoe <= 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        onClick={handleCloseClick}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold uppercase text-gray-800">Xem Nhanh</h2>
            <button onClick={handleCloseClick} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              <Slider {...settings}>
                {imgArr?.map((item, index) => (
                  <div key={index}>
                    <img
                      src={item || Images.imgNotFound}
                      alt={product.name}
                      className="w-full h-64 object-contain rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {product.brand} - {product.category}
              </p>
              <p className="text-xl text-red-600 font-semibold">
                {status ? "Sản phẩm này đã ngừng kinh doanh" : "Hết hàng"}
              </p>
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Mã:</span> {code || "-"}
                </p>
                <p>
                  <span className="font-semibold">Danh mục:</span> {product.category || "-"}
                </p>
                <p>
                  <span className="font-semibold">Thương hiệu:</span> {product.brand || "-"}
                </p>
              </div>
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal product display
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={handleCloseClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold uppercase text-gray-800">Xem Nhanh</h2>
          <button onClick={handleCloseClick} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <Slider {...settings}>
              {imgArr?.map((item, index) => (
                <div key={index}>
                  <img
                    src={item || Images.imgNotFound}
                    alt={product.name}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                {sale && amountShoe > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Giảm {sale}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {product.brand} - {product.category}
              </p>
              {price && amountShoe > 0 && (
                <span className="text-sm text-gray-600">Số lượng còn: {amountShoe}</span>
              )}
            </div>
            {price && priceSale ? (
              <div className="flex items-center space-x-2">
                <span className="text-red-500 font-semibold text-lg">
                  {convertToCurrencyString(Number(priceSale))}
                </span>
                <span className="text-gray-500 line-through">
                  {convertToCurrencyString(Number(price))}
                </span>
              </div>
            ) : (
              <span className="text-red-500 font-semibold text-lg">
                {convertToCurrencyString(Number(price))}
              </span>
            )}
            <div>
              <span className="text-sm font-semibold text-gray-700">Chọn kích thước</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSizes?.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAmount(1);
                      setChooseSize(findProductIdByName(size.name, allSizeData));
                      setChooseSizeName(size.name);
                    }}
                    disabled={size.status || size.quantity <= 0}
                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                      size.status || size.quantity <= 0
                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                        : chooseSizeName === size.name
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">Chọn màu sắc</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableColors?.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAmount(1);
                      setChooseColor(findProductIdByName(color.name, allColorData));
                      setChooseColorName(color.name);
                    }}
                    disabled={color.status || color.quantity <= 0}
                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                      color.status || color.quantity <= 0
                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                        : chooseColorName === color.name
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">Chọn số lượng</span>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => setAmount((prev) => (prev > 1 ? prev - 1 : 1))}
                  className="w-8 h-8 border border-gray-300 rounded-l-md flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 h-8 border-t border-b border-gray-300 flex items-center justify-center text-center">
                  {amount}
                </span>
                <button
                  onClick={() => {
                    if (amountShoe <= amountItemInCart + amount) {
                      toast.warning("Số lượng thêm đã đạt tối đa");
                    } else {
                      setAmount((prev) => prev + 1);
                    }
                  }}
                  className="w-8 h-8 border border-gray-300 rounded-r-md flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-[48%] py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Xem chi tiết
              </button>
              <button
                onClick={() => {
                  if (userPrf && amountShoe) {
                    if (idAddToCart) addToCartUser(idAddToCart, amount);
                    setShowQuickView(false);
                    openCart();
                    toast.success("Thêm thành công");
                  } else if (
                    idAddToCart &&
                    price &&
                    amountShoe >= amountItemInCart + amount
                  ) {
                    addMultipleToCart(idAddToCart, amount);
                    setShowQuickView(false);
                    openCart();
                    setAmount(1);
                    toast.success("Thêm thành công");
                  } else {
                    toast.warning("Số lượng thêm đã đạt tối đa hoặc sản phẩm không khả dụng");
                  }
                }}
                className={`w-[48%] py-2 rounded-md text-white font-medium transition-colors ${
                  price && amountShoe > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!price || amountShoe <= 0}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewDetail;
