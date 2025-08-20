



import React, { useEffect, useState } from "react";
import path from "../../constants/path";
import Images from "../../static";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API from "../../api";
import { toast } from "react-toastify";
import { CustomError, IBill, IDetailOrder } from "../../types/product.type";
import { formartDate } from "../../utils/formatCurrency";
import { convertToCurrencyString } from "../../utils/format";
import DetailAddress from "../information/address/detailAddress";

const ShowBillCheck = () => {
  const params = useParams();
  const [bill, setBill] = useState<IBill>();
  const [billDetail, setBillDetail] = useState<IDetailOrder[]>();
  const navigate = useNavigate();

  const getBillDetail = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getDetailBill(Number(params?.idBill)),
      });
      if (res.status) {
        setBillDetail(res?.data?.data);
      }
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        const customError = error as CustomError;
        toast.error(customError.response?.data || customError.message);
      } else {
        toast.error("Hãy thử lại.");
      }
    }
  };

  const getBill = async () => {
  try {
    const res = await axios({
      method: "get",
      url: API.getSearchBill(params?.code || ""),
    });
    if (res.status) {
      console.log("Bill data:", res?.data);
      setBill(res?.data);
    }
  } catch (error) {}
};

  useEffect(() => {
    getBillDetail();
    getBill();
  }, [params]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <img 
            src={Images.iconSuccesss} 
            alt="Success" 
            className="w-16 h-16 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng đã nhận</h1>
          <p className="mt-2 text-gray-600">
            Cảm ơn bạn. Đơn hàng của bạn đã được nhận thành công.
          </p>
        </div>

        {/* Bill Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <p className="text-sm text-gray-500">Mã đơn hàng</p>
              <p className="font-medium text-gray-900">{params?.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày đặt</p>
              <p className="font-medium text-gray-900">
                {bill ? formartDate(bill?.createAt) : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng tiền hàng</p>
              <p className="font-medium text-gray-900">
                {bill ? convertToCurrencyString(Number(bill?.totalMoney) + (bill?.moneyReduce)) : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phí vận chuyển</p>
              <p className="font-medium text-gray-900">
                {bill ? convertToCurrencyString(Number(bill?.moneyShip)) : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Giảm giá</p>
              <p className="font-medium text-green-600">
                {bill ? convertToCurrencyString(Number(bill?.moneyReduce)) : ""}
              </p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-500">Phí ship</p>
              <p className="font-medium text-gray-900">
                {bill ? convertToCurrencyString(Number(bill?.moneyShip)) : ""}
              </p>
            </div> */}
            
            <div>
              <p className="text-sm text-gray-500">Tổng thanh toán</p>
              <p className="font-semibold text-blue-600">
                {bill
                  ? convertToCurrencyString(
                      Number(bill?.totalMoney) +
                        Number(bill?.moneyShip)
                    )
                  : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Product List */}
        {bill && billDetail && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h2>
            <div className="space-y-6">
              {billDetail?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-6 border-b border-gray-200 last:border-b-0"
                >
                  <img
                    src={item?.images.split(",")[0]}
                    alt={item?.name}
                    className="w-20 h-20 object-contain rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item?.name}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                      <p>Màu: <span className="font-medium">{item?.color}</span></p>
                      <p>Số lượng: <span className="font-medium">{item?.quantity}</span></p>
                      <p>Kích cỡ: <span className="font-medium">{item?.size}</span></p>
                      {/* <p>Loại đế: <span className="font-medium">{item?.sole}</span></p> */}
                    </div>
                    <p className="mt-2 text-sm">
                      Thành tiền: {" "} 
                      <span className="font-medium text-red-600">
                        {item?.discountValue
                          ? convertToCurrencyString(item?.discountValue * item?.quantity)
                          : convertToCurrencyString(item?.price * item?.quantity)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Info */}
        {bill && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin người nhận</h2>
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Tên khách hàng:</span> {bill?.customerName}
              </p>
              {bill?.phoneNumber && (
                <p>
                  <span className="font-medium">Số điện thoại:</span> {bill?.phoneNumber}
                </p>
              )}
              <div>
                <span className="font-medium">Địa chỉ:</span>
                <DetailAddress
                  spec={bill.address.split("##")[0]}
                  war={bill.address.split("##")[1]}
                  distr={bill.address.split("##")[2]}
                  prov={bill.address.split("##")[3]}
                />
              </div>
              {bill?.note && (
                <p>
                  <span className="font-medium">Ghi chú:</span> {bill?.note}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => navigate(path.lookUpOrders)}
          >
            Tra cứu đơn hàng
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate(path.home)}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowBillCheck;