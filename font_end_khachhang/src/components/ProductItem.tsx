



import React, { useEffect, useState, useMemo } from "react";
import { IDetailProduct, IInforShoe, Product } from "../types/product.type";
import { useNavigate } from "react-router-dom";
import path from "../constants/path";
import axios from "axios";
import API from "../api";
import { convertToCurrencyString, findProductIdByName } from "../utils/format";
import { useShoppingCart } from "../context/shoppingCart.context";
import ModalComponent from "./Modal";
import Images from "../static";
import MyReactImageMagnify from "./ReactImageMagnify";
import { toast } from "react-toastify";

const ProductItem = ({
  product,
  shoeId,
  inforShoe,
}: {
  inforShoe: IInforShoe;
  product: IDetailProduct[];
  shoeId: number;
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
  const [amount, setAmount] = useState(1);
  const [allSizeData, setAllSizeData] = useState<Product[]>([]);
  const [allColorData, setAllColorData] = useState<Product[]>([]);
  const [price, setPrice] = useState<number | undefined>(0);
  const [amountShoe, setAmountShoe] = useState<number>(0);
  const [priceSale, setPriceSale] = useState<boolean>();
  const [sale, setSale] = useState<boolean>();
  const [idAddToCart, setIdAddToCart] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [code, setCode] = useState<string>();
  const [status, setStatus] = useState<boolean>(false); // Overall product status

  // Fetch sizes and colors
  const getDataSize = async () => {
    try {
      const response = await axios.get(API.getSizeAll());
      if (response.status) {
        setAllSizeData(response.data.data);
        setChooseSize(findProductIdByName(product[0]?.size, allSizeData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDataColor = async () => {
    try {
      const response = await axios.get(API.getAllColors());
      if (response.status) {
        setAllColorData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setChooseColor(findProductIdByName(product[0]?.color, allColorData));
  };

  const getPriceDetailShoe = async () => {
    const res = await axios({
      method: "get",
      url: API.getPriceDetailShoe(
        inforShoe?.name,
        chooseSize,
        chooseColor,
        inforShoe?.id
      ),
    });
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
  };

  const imgArr = useMemo(() => {
    const arr = [];
    for (let i = 0; i < product.length; i++) {
      arr.push(product[i].images ? product[i].images.split(",") : []);
    }
    return arr;
  }, [product]);

  // Modified: Get available sizes with quantity and status check
  const availableSizes = useMemo(() => {
  const sizes: { name: string; quantity: number; status: boolean }[] = [];
  const uniqueSizes = [...new Set(product.map((p) => p.size))];

  for (const size of uniqueSizes) {
    const productsWithSize = product.filter(
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

  return sizes;
}, [product, chooseColorName]);

  // Modified: Get available colors with quantity and status check, filtered by selected size
 const availableColors = useMemo(() => {
  const colors: { name: string; quantity: number; status: boolean }[] = [];
  const uniqueColors = [...new Set(product.map((p) => p.color))];

  for (const color of uniqueColors) {
    const productsWithColor = product.filter(
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

  return colors;
}, [product, chooseSizeName]);

  useEffect(() => {
    getDataSize();
    getDataColor();
  }, []);

  useEffect(() => {
  if (product.length > 0) {
    const firstAvailableProduct = product.find(
      (p) => !p.status && (p.quantity || 0) > 0
    ) || product[0];

    if (firstAvailableProduct) {
      setChooseSize(findProductIdByName(firstAvailableProduct.size, allSizeData));
      setChooseSizeName(firstAvailableProduct.size);
      setChooseColor(findProductIdByName(firstAvailableProduct.color, allColorData));
      setChooseColorName(firstAvailableProduct.color);
    }
  }
}, [product, allSizeData, allColorData]);

  useEffect(() => {
    if (chooseColor && chooseSize) {
      getPriceDetailShoe();
    }
  }, [inforShoe.name, chooseSize, chooseColor]);



  useEffect(() => {
  if (chooseSizeName) {
    const availableColorsForSize = product.filter(
      (p) => p.size === chooseSizeName && !p.status && (p.quantity || 0) > 0
    );
    if (
      chooseColorName &&
      !availableColorsForSize.some((p) => p.color === chooseColorName)
    ) {
      setChooseColorName(undefined);
      setChooseColor(undefined);
    }
  }
}, [chooseSizeName, product]);

  const amountItemInCart = getItemQuantity(idAddToCart);

  // If the entire product is discontinued (status: true) or out of stock (amountShoe <= 0), show simplified view
  if (status || amountShoe <= 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="w-full">
            <MyReactImageMagnify img={imgArr} />
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {inforShoe?.name}
            </h1>
            <p className="text-xl text-red-600 font-semibold">
              {status ? "Sản phẩm này đã ngừng kinh doanh" : "Hết hàng"}
            </p>
            <div className="border-t pt-4 text-sm text-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold">Mã</p>
                  <p>{code || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">Thương hiệu</p>
                  <p>{inforShoe?.thuongHieu?.name || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">Xuất xứ</p>
                  <p>{inforShoe?.xuatXu?.name || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">Tay áo</p>
                  <p>{inforShoe?.tayAo?.name || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">Cổ áo</p>
                  <p>{inforShoe?.coAo?.name || "-"}</p>
                </div>
                <div>
                  <p className="font-semibold">Chất liệu</p>
                  <p>{inforShoe?.chatLieu?.name || "-"}</p>
                </div>
              </div>
            </div>
            {/* Indicate that size and color selection is unavailable */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-semibold text-gray-800">
                Kích thước
              </span>
              <p className="text-gray-500">Không khả dụng</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base font-semibold text-gray-800">
                Màu sắc
              </span>
              <p className="text-gray-500">Không khả dụng</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal product display (status: false and amountShoe > 0)
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="w-full">
          <MyReactImageMagnify img={imgArr} />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {inforShoe?.name}
          </h1>

          <div className="flex items-center gap-4">
            {price && priceSale ? (
              <>
                <span className="text-xl md:text-2xl text-red-600 font-bold">
                  {convertToCurrencyString(Number(priceSale))}
                </span>
                <span className="text-base md:text-lg text-gray-500 line-through">
                  {convertToCurrencyString(Number(price))}
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Giảm {sale}%
                </span>
              </>
            ) : (
              <span className="text-xl md:text-2xl text-red-600 font-bold">
                {convertToCurrencyString(Number(price))}
              </span>
            )}
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-800">
                Chọn kích thước
              </span>
              {/* <button
                className="text-sm text-blue-600 underline flex items-center gap-1"
                onClick={() => setShowModal(true)}
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABVklEQVR4nO2Uy0rDUBCGTxfudCcFBcUZQUFw5QuIC8G9guuCM6EvYEEUQUF3PoRvIF7eQRdeXqLYzARb3Gpk0qSm2JpEGgRx4CyS+fm/MxeOc38y0GtWkfQYWe6R5bz3nzW0k/d7YADpFrB2EjGy3o4MACybSPLWFcrFPPurKxSO5TX4Nh+1heUlElHQKGzgMvLAepTcPK8BFmkRkjxY0tpSDoD11ZJL9edxV0ZAvDmLNX+iFACSPBpgjmQ9WxssA0sLOKjnB7CcxEO+zNICyVWsPcgNmKn500Da7q6p7DsXVr6qwkrqIrpAncncgKgKT7eR5d0MgOUGd3TDhm4HPX8NWK6TTQGWvULmaUivEh50RK3CT5AeFobMUmsqfuyekCSwFQbWu8jYa1aji6SgP4JkVkq62w+R03/I0LAZ9C3CkNd4ZBAgbbsyAilomDmwnpUC+JX4AHXtSTRt48bdAAAAAElFTkSuQmCC"
                  alt="size guide"
                  className="w-4 h-4"
                />
                Hướng dẫn chọn size
              </button> */}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes?.map((size, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAmount(1);
                    setChooseSize(findProductIdByName(size.name, allSizeData));
                    setChooseSizeName(size.name);
                  }}
                  disabled={size.status || size.quantity <= 0} // Disable if size is discontinued or out of stock
                  className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${size.status || size.quantity <= 0
                      ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                      : chooseSizeName === size.name
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold text-gray-800">
              Chọn màu sắc
            </span>
            <div className="flex flex-wrap gap-2">
              {availableColors?.map((color, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAmount(1);
                    setChooseColor(findProductIdByName(color.name, allColorData));
                    setChooseColorName(color.name);
                  }}
                  disabled={color.status || color.quantity <= 0} // Vô hiệu hóa nếu màu không khả dụng
                  className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${color.status || color.quantity <= 0
                      ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                      : chooseColorName === color.name
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-base font-semibold text-gray-800">
                Số lượng
              </span>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => setAmount((prev) => (prev > 1 ? prev - 1 : 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const currentQuantity = userPrf
                      ? getItemQuantityUser(idAddToCart)
                      : amountItemInCart;
                    const maxQuantity = amountShoe - currentQuantity;

                    if (value < 1) {
                      setAmount(1);
                      toast.warning("Số lượng phải lớn hơn hoặc bằng 1");
                    } else if (value > maxQuantity) {
                      setAmount(maxQuantity);
                      toast.warning("Số lượng thêm đã đạt tối đa");
                    } else {
                      setAmount(value);
                    }
                  }}
                  className="px-4 py-2 text-center min-w-[40px] border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  max={amountShoe - (userPrf ? getItemQuantityUser(idAddToCart) : amountItemInCart)}
                />
                <button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    const currentQuantity = userPrf
                      ? getItemQuantityUser(idAddToCart)
                      : amountItemInCart;
                    const maxQuantity = amountShoe - currentQuantity;
                    if (amount >= maxQuantity) {
                      toast.warning("Số lượng thêm đã đạt tối đa");
                    } else {
                      setAmount((prev) => prev + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
            {price && (
              <p className="mt-2">
                <span className="font-semibold">Số lượng có sẵn:</span>{" "}
                {amountShoe}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                className={`py-3 text-white font-semibold rounded-md transition-colors ${amountShoe > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                  }`}
                onClick={() => {
                  if (userPrf && amountShoe) {
                    if (idAddToCart) addToCartUser(idAddToCart, amount);
                    setAmount(1);
                  } else if (
                    idAddToCart &&
                    price &&
                    amountShoe >= amountItemInCart + amount &&
                    amountItemInCart + amount <= amountShoe
                  ) {
                    addMultipleToCart(idAddToCart, amount);
                    setAmount(1);
                    toast.success("Thêm thành công");
                  } else {
                    toast.warning("Số lượng thêm đã đạt tối đa");
                  }
                }}
                disabled={!amountShoe}
              >
                Thêm vào giỏ hàng
              </button>
              <button
                className={`py-3 text-white font-semibold rounded-md transition-colors ${price && amountShoe > 0
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-orange-300 cursor-not-allowed"
                  }`}
                onClick={() => {
                  const currentQuantity = userPrf
                    ? getItemQuantityUser(idAddToCart)
                    : getItemQuantity(idAddToCart);
                  const totalQuantity = currentQuantity + amount;

                  if (totalQuantity > amountShoe) {
                    toast.warning("Số lượng sản phẩm không đủ trong kho!");
                    return;
                  }

                  if (userPrf && amountShoe) {
                    if (idAddToCart) addToCartUser(idAddToCart, amount);
                    setAmount(1);
                    navigate(path.payMentWithUser);
                    toast.success("Thêm thành công");
                  } else if (
                    idAddToCart &&
                    price &&
                    amountShoe >= totalQuantity
                  ) {
                    addMultipleToCart(idAddToCart, amount);
                    setAmount(1);
                    navigate(path.payment);
                    toast.success("Thêm thành công");
                  }
                }}
                disabled={!price || amountShoe <= 0}
              >
                Mua ngay
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t pt-4 text-sm text-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">Mã</p>
                <p>{price ? code : "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Thương hiệu</p>
                <p>{price ? inforShoe?.thuongHieu?.name : "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Xuất xứ</p>
                <p>{price ? inforShoe?.xuatXu?.name : "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Tay áo</p>
                <p>{price ? inforShoe?.tayAo?.name : "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Cổ áo</p>
                <p>{price ? inforShoe?.coAo?.name : "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Chất liệu</p>
                <p>{price ? inforShoe?.chatLieu?.name : "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ModalComponent
          check={false}
          isVisible={showModal}
          onClose={() => setShowModal(false)}
        >
          <section className="bg-gray-50 p-4">
            <img
              src={Images.tableSize}
              alt="Size Guide"
              className="w-full h-auto object-contain"
            />
          </section>
        </ModalComponent>
      )}
    </div>
  );
};

export default ProductItem;