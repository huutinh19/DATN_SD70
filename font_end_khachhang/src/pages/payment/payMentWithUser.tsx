





import React, { useEffect, useState } from "react";
import ShippingProcess from "../../components/shippingProcess";
import Images from "../../static";
import { useShoppingCart } from "../../context/shoppingCart.context";
import {
  CustomError,
  District,
  IAddress,
  IDetailProductCart,
  Province,
  Ward,
} from "../../types/product.type";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API, { baseUrl } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import { calculateTotalDone } from "../../utils/format";
import { toast } from "react-toastify";
import path from "../../constants/path";
import ModalComponent from "../../components/Modal";
import { configApi } from "../../utils/config";
import ChangeAdr from "./changeAdr";
import ShowVoucher from "./showVoucher";
import AddAddressModal from "../information/address/modalAddAdr";
import DetailAddress from "../information/address/detailAddress";
import LoadingScreen from "../../components/Loading";

const PayMentWithUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userPrf, removeAllCart } = useShoppingCart();
  const [listProducts, setListProducts] = useState<IDetailProductCart[]>();
  const [dataAddress, setDataAddress] = useState<IAddress[]>();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number>();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string>();
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const [selectedPhoe, setSelectedPhone] = useState<string>("");
  const [wards, setWards] = useState<Ward[]>([]);
  const [specificAddress, setSpecificAddress] = useState<string>();
  const [selectedWard, setSelectedWard] = useState<number>();
  const [selectedDefault, setSelectedDefault] = useState<boolean>();
  const [method, setMethod] = useState<number>(0);
  const [feeShip, setFeeShip] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [indexArr, setIndexArr] = useState<number>(0);
  const [carts, setCarts] = useState({ quantity: null, id: null });
  const [isModalOpen, setModalOpen] = useState(false);
  const [showModalBill, setShowModalBill] = useState(false);
  const [isModalOpenVoucher, setModalOpenVoucher] = useState(false);
  const [chooseRadio, setChooseRadio] = useState<number>();
  const [selectedName, setSelectedName] = useState<string>("");
  const [percent, setPrecent] = useState<number>(0);
  const [idVoucher, setIdVoucher] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");

  const toggleModal = () => {
    setModalOpenVoucher(!isModalOpenVoucher);
  };

  const getListDetailCart = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getListDetailCart(Number(userPrf?.id)),
      });
      if (res.status) {
        const cartsData = res?.data.map((product: IDetailProductCart) => ({
          quantity: product.quantity,
          id: product.idProductDetail,
        }));
        setListProducts(res?.data);
        setCarts(cartsData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        configApi
      );
      if (response.status) {
        setProvinces(response?.data?.data);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const fetchDistrictsByProvince = async (provinceId: number) => {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
        configApi
      );
      if (response.status) {
        setDistricts(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWardsByDistrict = async (districtId: number) => {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        configApi
      );
      if (response.status) {
        setWards(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const getAvailableServices = async (
    fromDistrict: number,
    toDistrict: number
  ) => {
    try {
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
        {
          shop_id: 2483458,
          from_district: fromDistrict,
          to_district: toDistrict,
        },
        {
          headers: {
            Token: "650687b2-f5c1-11ef-9bc9-aecca9e2a07c",
            "Content-Type": "application/json",
          },
        }
      );
      const availableServices = response.data.data;
      if (availableServices && availableServices.length > 0) {
        return availableServices[0].service_id;
      } else {
        throw new Error("Không tìm thấy gói dịch vụ khả dụng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy gói dịch vụ:", error);
      toast.error("Không thể lấy thông tin gói dịch vụ!");
      return null;
    }
  };

  const calculateFee = async () => {
    if (!selectedDistrict || !selectedWard) return;

    const fromDistrict = 1542;
    const toDistrict = Number(selectedDistrict);

    const serviceId = await getAvailableServices(fromDistrict, toDistrict);

    if (!serviceId) {
      toast.error("Không thể tính phí vận chuyển do không tìm thấy dịch vụ!");
      return;
    }

    try {
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          service_id: serviceId,
          service_type_id: 3,
          to_district_id: toDistrict,
          to_ward_code: String(selectedWard),
          height: 11,
          length: 28,
          weight: 300,
          width: 16,
        },
        {
          headers: {
            Token: "650687b2-f5c1-11ef-9bc9-aecca9e2a07c",
            "Content-Type": "application/json",
            ShopId: 2483458,
          },
        }
      );
      setFeeShip(response.data.data.total);
    } catch (error) {
      console.error("Lỗi khi tính phí vận chuyển:", error);
      toast.error("Không thể tính phí vận chuyển!");
    }
  };

  function generateUUID() {
    var d = new Date().getTime();
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  const postBill = async () => {
    if (!dataAddress || dataAddress.length === 0 || !listProducts) {
      toast.warning("Bạn cần thêm địa chỉ hoặc giỏ hàng trống!");
      return;
    }

    const totalMoney = calculateTotalDone(listProducts);
    const totalToPay = totalMoney + feeShip - (percent / 100) * totalMoney;

    const newBill = {
      account: userPrf?.id,
      customerName: selectedName,
      email: userPrf?.email,
      district: selectedDistrict,
      province: selectedProvince,
      phoneNumber: selectedPhoneNumber,
      ward: selectedWard,
      specificAddress: specificAddress,
      moneyShip: feeShip,
      voucher: idVoucher,
      moneyReduce: (percent / 100) * totalMoney,
      totalMoney: totalMoney,
      note: note,
      paymentMethod: method,
      carts: carts,
    };

    try {
      if (method === 0) {
        const response = await axios.post(
          baseUrl + "api/bill/create-bill-client",
          newBill
        );
        if (response.status) {
          toast.success("Đặt hàng thành công");
          removeAllCart();
          navigate(
            `/showBillCheck/${response?.data?.data?.data?.id}/${response?.data?.data?.data?.code}`
          );
        }
      } else if (method === 1) {
        const tempNewBill = { ...newBill, id: generateUUID() };
        localStorage.setItem("checkout", JSON.stringify(tempNewBill));
        const response = await axios.get(
          baseUrl +
            `api/vn-pay/payment?id=${tempNewBill.id}&total=${Math.floor(
              totalToPay
            )}`
        );
        if (response.status) {
          window.location.href = response?.data?.data;
        }
      }
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        const customError = error as CustomError;
        if (customError.response && customError.response.data) {
          toast.error(customError.response.data);
        } else {
          toast.error(customError.message);
        }
      } else {
        toast.error("Hãy thử lại.");
      }
    } finally {
      removeAllCart();
    }
  };

  const loadAddress = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getAddress(Number(userPrf?.id)),
      });
      if (res.data) {
        setDataAddress(res?.data?.content);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedDistrict && selectedWard) {
      calculateFee();
    }
  }, [selectedDistrict, selectedWard]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (dataAddress && dataAddress.length > 0) {
      const defaultAddressIndex = dataAddress.findIndex(
        (address) => address.defaultAddress
      );
      if (defaultAddressIndex !== -1) {
        const defaultAddress = dataAddress[defaultAddressIndex];
        setSelectedProvince(Number(defaultAddress.province));
        setSelectedPhoneNumber(String(defaultAddress.phoneNumber));
        setSelectedDistrict(Number(defaultAddress.district));
        setSelectedWard(Number(defaultAddress.ward));
        setSpecificAddress(defaultAddress.specificAddress);
        setSelectedDefault(defaultAddress.defaultAddress);
        setSelectedName(defaultAddress?.name);
        setSelectedPhone(defaultAddress?.phoneNumber);
        setChooseRadio(defaultAddressIndex);
      }
    }
  }, [dataAddress]);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistrictsByProvince(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWardsByDistrict(selectedDistrict);
    }
  }, [selectedDistrict]);

  const [delayedExecution, setDelayedExecution] = useState(false);

  useEffect(() => {
    const delayDuration = 1000;
    const timerId = setTimeout(() => {
      if (userPrf?.id && !delayedExecution) {
        getListDetailCart();
        setDelayedExecution(true);
      }
    }, delayDuration);
    return () => clearTimeout(timerId);
  }, [userPrf?.id, delayedExecution]);

  useEffect(() => {
    if (userPrf?.id) {
      loadAddress();
    }
  }, [userPrf?.id, isModalOpen]);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShippingProcess type={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column: Address, Products, Voucher, Note */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={Images.iconAddressRed}
                    alt="Địa chỉ"
                    className="w-6 h-6"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Địa chỉ nhận hàng
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  <img src={Images.iconPlus} alt="Thêm" className="w-4 h-4" />
                  <span className="text-sm">Thêm địa chỉ mới</span>
                </button>
              </div>

              {!!dataAddress &&
              dataAddress.length > 0 &&
              selectedWard &&
              selectedDistrict &&
              selectedProvince ? (
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800 font-medium">
                      {selectedName}
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-500">{selectedPhoe}</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-3">
                    <DetailAddress
                      prov={String(selectedProvince)}
                      distr={String(selectedDistrict)}
                      war={String(selectedWard)}
                      spec={specificAddress || ""}
                    />
                    {selectedDefault && (
                      <span className="text-xs text-red-500 border border-red-500 px-2 py-1 rounded">
                        Mặc định
                      </span>
                    )}
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-gray-500">
                  Chưa có địa chỉ, vui lòng thêm địa chỉ mới.
                </p>
              )}
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sản phẩm
              </h2>
              {delayedExecution === false && <LoadingScreen />}
              {!!listProducts && listProducts.length > 0 ? (
                <div className="space-y-4">
                  {listProducts.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-4 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            item.image.split(",")[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded"
                        />
                        <div>
                          <p className="text-gray-800 font-medium">
                            {item.name}
                          </p>
                          <p className="text-gray-500 text-sm">{item.sole}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">x{item.quantity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">
                          {item.discountValue
                            ? formatCurrency(item.discountValue)
                            : formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-500 font-medium">
                          {item.discountValue
                            ? formatCurrency(item.quantity * item.discountValue)
                            : formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Giỏ hàng trống.</p>
              )}
            </div>

            

            {/* Note Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Ghi chú
              </h2>
              <input
                type="text"
                value={note}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNote(e.target.value)
                }
                placeholder="Thêm ghi chú cho cửa hàng (nếu có)"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Right Column: Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Tóm tắt đơn hàng
              </h2>
                {/* Voucher Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Mã giảm giá
              </h2>
              <div className="space-y-4">
                {/* Display selected voucher (if any) */}
                {!!listProducts && !!percent && percent > 0 && (
                  <div className="flex items-center justify-between bg-red-50 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <img
                        src={Images.iconVoucher}
                        alt="Voucher"
                        className="w-6 h-6"
                      />
                      <p className="text-red-600 font-medium">
                        (-
                        {formatCurrency(
                          (percent / 100) * calculateTotalDone(listProducts)
                        )}
                        )
                      </p>
                    </div>
                    <button
                      onClick={() => setPrecent(0)}
                      className="text-black hover:text-gray-700 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Button to choose or change voucher */}
                <button
                  onClick={toggleModal}
                  className="w-full flex items-center justify-center space-x-2 border border-red-500 text-red-500 px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition"
                >
                  <img
                    src={Images.iconVoucher}
                    alt="Chọn voucher"
                    className="w-5 h-5"
                  />
                  <span className="font-medium">
                    {!!percent && percent > 0
                      ? "Thay đổi mã giảm giá"
                      : "Chọn mã giảm giá"}
                  </span>
                </button>
              </div>
            </div>
              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Phương thức thanh toán
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setMethod(0)}
                    className={`w-full flex items-center space-x-3 p-3 border rounded-md ${
                      method === 0
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } hover:border-red-500 transition`}
                  >
                    <img
                      src={Images.iconReceive}
                      alt="COD"
                      className="w-6 h-6"
                    />
                    <span className="text-sm">Thanh toán khi nhận hàng</span>
                  </button>
                  <button
                    onClick={() => setMethod(1)}
                    className={`w-full flex items-center space-x-3 p-3 border rounded-md ${
                      method === 1
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } hover:border-red-500 transition`}
                  >
                    <img
                      src={Images.logVNPay}
                      alt="VNPay"
                      className="w-8 h-6"
                    />
                    <span className="text-sm">Thanh toán bằng VNPay</span>
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền hàng</span>
                  {!!listProducts && listProducts.length > 0 && (
                    <span className="text-gray-800 font-medium">
                      {formatCurrency(calculateTotalDone(listProducts))}
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="text-gray-800 font-medium">
                    {formatCurrency(feeShip)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="text-red-500 font-medium">
                    -
                    {!!listProducts && percent > 0
                      ? formatCurrency(
                          (percent / 100) * calculateTotalDone(listProducts)
                        )
                      : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-800 font-semibold">
                    Tổng thanh toán
                  </span>
                  {!!feeShip && !!listProducts && (
                    <span className="text-red-600 font-semibold">
                      {formatCurrency(
                        calculateTotalDone(listProducts) +
                          feeShip -
                          (percent / 100) * calculateTotalDone(listProducts)
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={() => {
                  if (listProducts && listProducts.length > 0) {
                    setShowModalBill(true);
                  } else {
                    toast.warning("Không có sản phẩm");
                  }
                }}
                className="w-full bg-red-500 text-white py-3 rounded-md mt-6 hover:bg-red-600 transition"
              >
                Đặt hàng
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý với các điều
                khoản của T&T Sport
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <ModalComponent
          check={false}
          isVisible={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Địa chỉ của tôi
            </h2>
            <div className="max-h-80 overflow-y-auto mt-4">
              {!!dataAddress &&
                dataAddress.length > 0 &&
                dataAddress.map((item, index) => (
                  <ChangeAdr
                    item={item}
                    key={index}
                    setIndexArr={setIndexArr}
                    indexArr={index}
                    chooseRadio={chooseRadio}
                    setChooseRadio={setChooseRadio}
                  />
                ))}
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
  onClick={() => {
    if (dataAddress) {
      setSelectedDistrict(Number(dataAddress[indexArr]?.district));
      setSelectedProvince(Number(dataAddress[indexArr]?.province));
      setSelectedWard(Number(dataAddress[indexArr]?.ward));
      setSpecificAddress(dataAddress[indexArr]?.specificAddress);
      setSelectedDefault(dataAddress[indexArr]?.defaultAddress);
      setSelectedName(dataAddress[indexArr]?.name);
      setSelectedPhone(String(dataAddress[indexArr]?.phoneNumber)); // Cập nhật selectedPhoe
      setSelectedPhoneNumber(String(dataAddress[indexArr]?.phoneNumber)); // Cập nhật selectedPhoneNumber nếu cần
      setChooseRadio(indexArr); // Đảm bảo radio được chọn đúng
    }
    setShowModal(false);
  }}
  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
>
  Xác nhận
</button>
            </div>
          </div>
        </ModalComponent>
      )}

      {!!dataAddress && (
        <AddAddressModal
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          selectedWard={selectedWard}
          setSelectedProvince={setSelectedProvince}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedWard={setSelectedWard}
          wards={wards}
          districts={districts}
          provinces={provinces}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      {!!listProducts && (
        <ShowVoucher
          setIdVoucher={setIdVoucher}
          isOpen={isModalOpenVoucher}
          onClose={toggleModal}
          valueCheck={calculateTotalDone(listProducts)}
          setPrecent={setPrecent}
          userId={Number(userPrf?.id)}
        />
      )}

      {showModalBill && (
        <ModalComponent
          check={true}
          isVisible={showModalBill}
          onClose={() => setShowModalBill(false)}
        >
          <div className="flex flex-col items-center p-6">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="text-lg text-gray-600 mb-6 text-center">
              Bạn có chắc chắn muốn đặt hàng?
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowModalBill(false)}
                className="border border-gray-300 text-gray-600 px-6 py-2 rounded-md hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  postBill();
                  setShowModalBill(false);
                }}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </ModalComponent>
      )}
    </div>
  );
};

export default PayMentWithUser;
