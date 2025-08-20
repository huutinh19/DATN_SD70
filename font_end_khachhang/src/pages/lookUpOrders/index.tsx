

// import React, { useEffect, useState } from "react";
// import API from "../../api";
// import axios from "axios";
// import Images from "../../static";
// import { CustomError, IBill, IDetailOrder } from "../../types/product.type";
// import { formartDate, formatCurrency } from "../../utils/formatCurrency";
// import { toast } from "react-toastify";
// import { convertToCurrencyString } from "../../utils/format";
// import DetailAddress from "../information/address/detailAddress";
// import {
//   FaClock,
//   FaBox,
//   FaTruck,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";

// // Interface for bill history data (aligned with BillHistory)
// interface IBillHistory {
//   createAt: string;
//   createBy: string;
//   id: number;
//   index: number;
//   note: string;
//   status: number;
// }

// const LookUpOrders = () => {
//   const [inputHD, setInputHD] = useState<string>("");
//   const [listDataBill, setListDataBill] = useState<IBill>();
//   const [detailBill, setDetailBill] = useState<IDetailOrder[]>();
//   const [statusPayment, setStatusPayment] = useState<boolean>(false);
//   const [billHistory, setBillHistory] = useState<IBillHistory[]>([]);

//   // Fetch bill details
//   const getInfoDetailProduct = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getSearchBill(inputHD),
//       });
//       if (res.status) {
//         const billData = res?.data;
//         billData.address = billData.address || "";
//         setListDataBill(billData);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Fetch bill history
//   const getBillHistory = async (billId: number) => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getBillHistory(billId),
//       });
//       if (res.status) {
//         setBillHistory(res?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching bill history: ", error);
//     }
//   };

//   // Fetch bill detail
//   const getBillDetail = async () => {
//     if (!listDataBill?.id) return;
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getDetailBill(Number(listDataBill?.id)),
//       });
//       if (res.status) {
//         setDetailBill(res?.data?.data);
//       }
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Đã có lỗi xảy ra, thử lại sau."
//       );
//     }
//   };

//   // Fetch payment status
//   const getStatusPayMent = async (id: number) => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: `http://localhost:8080/client/api/payment-method/${id}`,
//       });
//       if (res.status) {
//         setStatusPayment(res?.data[0].type);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Fetch bill history and details when bill ID is available
//   useEffect(() => {
//     if (listDataBill?.id) {
//       getBillDetail();
//       getStatusPayMent(listDataBill.id);
//       getBillHistory(listDataBill.id);
//     }
//   }, [listDataBill]);

//   // Map status codes to text (only for relevant statuses)
//   const getStatusText = (status: number) => {
//     switch (status) {
//       case 1:
//         return "Tạo hoá đơn";
//       case 2:
//         return "Chờ xác nhận";
//       case 4:
//         return "Chờ giao hàng";
//       case 5:
//         return "Đang giao hàng";
//       case 6:
//         return "Hoàn thành";
//       case 7:
//         return "Đã hủy";
//       case 9:
//         return "Đã xác nhận";
//       default:
//         return "Không xác định";
//     }
//   };

//   // Timeline steps (restricted to specified statuses)
//   const timelineSteps = [
//     {
//       status: 1,
//       label: "Tạo hoá đơn",
//       icon: <FaClock />,
//       color: "bg-yellow-500",
//     },
//     {
//       status: 2,
//       label: "Chờ xác nhận",
//       icon: <FaClock />,
//       color: "bg-yellow-500",
//     },
//     {
//       status: 9,
//       label: "Đã xác nhận",
//       icon: <FaCheckCircle />,
//       color: "bg-green-400",
//     },
//     {
//       status: 4,
//       label: "Chờ giao hàng",
//       icon: <FaBox />,
//       color: "bg-blue-500",
//     },
//     {
//       status: 5,
//       label: "Đang giao hàng",
//       icon: <FaTruck />,
//       color: "bg-purple-500",
//     },
//     {
//       status: 6,
//       label: "Hoàn thành",
//       icon: <FaCheckCircle />,
//       color: "bg-green-500",
//     },
//     {
//       status: 7,
//       label: "Đã hủy",
//       icon: <FaTimesCircle />,
//       color: "bg-red-500",
//     },
//   ];

//   // Filter timeline steps based on current status and bill history
//   // Filter timeline steps based on current status and bill history
//   const filteredTimelineSteps = () => {
//     const currentStatus = listDataBill?.status ?? 0;

//     // If the order is canceled (status 7), show only statuses present in billHistory
//     if (currentStatus === 7) {
//       const relevantStatuses = timelineSteps.filter(
//         (step) =>
//           (step.status === 2 ||
//             step.status === 4 ||
//             step.status === 7 ||
//             step.status === 9) && // Include status 9
//           billHistory.some((history) => history.status === step.status)
//       );
//       return relevantStatuses;
//     }

//     // For non-canceled orders, show steps up to the current status, excluding cancel
//     return timelineSteps.filter(
//       (step) =>
//         (step.status <= currentStatus && step.status !== 7) ||
//         (step.status === 9 &&
//           billHistory.some((history) => history.status === 9))
//     );
//   };

//   // Map status to bill history index
//   const getHistoryIndexForStatus = (status: number) => {
//     return billHistory.findIndex((history) => history.status === status);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <div className="relative w-full h-64">
//         <img
//           src={Images.ghn}
//           alt="Banner"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="text-center text-white">
//             <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
//               Tra cứu hành trình đơn hàng
//             </h1>
//             <p className="mt-2 text-sm md:text-base">
//               "Mạng chuyển phát nhanh rộng khắp nơi"
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Search Section */}
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//           <div className="w-full md:w-1/2">
//             <label className="block text-lg font-semibold text-gray-700 mb-2">
//               Nhập mã phiếu gửi
//             </label>
//             <div className="flex gap-3">
//               <input
//                 type="text"
//                 placeholder="VD: Hoá đơn "
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={inputHD}
//                 onChange={(e) => setInputHD(e.target.value)}
//               />
//               <button
//                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 onClick={getInfoDetailProduct}
//               >
//                 Tra cứu
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Bill Details */}
//         {listDataBill && (
//           <div className="mt-8">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//               Thông tin đơn hàng
//             </h2>

//             {/* Horizontal Timeline */}
//             <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
//               <h3 className="text-xl font-medium text-gray-700 mb-6">
//                 Hành trình đơn hàng
//               </h3>
//               <div className="relative flex justify-between items-center">
//                 {/* Gradient Line */}
//                 <div
//                   className={`absolute top-1/2 left-0 h-1 transform -translate-y-1/2 ${
//                     listDataBill.status === 7
//                       ? "right-0 bg-red-500"
//                       : "bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500"
//                   }`}
//                   style={{
//                     width: `${((filteredTimelineSteps().length - 1) /
//                       (filteredTimelineSteps().length - 1)) *
//                       100}%`,
//                   }}
//                 ></div>

//                 {filteredTimelineSteps().map((step, index) => {
//                   const historyIndex = getHistoryIndexForStatus(step.status);
//                   const historyItem = billHistory[historyIndex];
//                   // Kiểm tra nếu trạng thái hiển thị "Đã hoàn thành" và không có createAt thì ẩn
//                   const isCompletedWithoutDate =
//                     !historyItem?.createAt &&
//                     listDataBill.status > step.status &&
//                     step.status !== 7;

//                   if (isCompletedWithoutDate) {
//                     return null; // Ẩn trạng thái không có createAt và hiển thị "Đã hoàn thành"
//                   }

//                   return (
//                     <div
//                       key={index}
//                       className={`relative flex-1 text-center transition-all duration-500 ${
//                         listDataBill.status === step.status ||
//                         billHistory.some(
//                           (history) => history.status === step.status
//                         ) ||
//                         (listDataBill.status > step.status && step.status !== 7)
//                           ? "opacity-100 scale-100"
//                           : "opacity-50 scale-90"
//                       }`}
//                     >
//                       {/* Icon */}
//                       <div
//                         className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-xl z-10 ${step.color} shadow-lg`}
//                       >
//                         {step.icon}
//                       </div>
//                       {/* Label */}
//                       <p className="mt-3 text-base font-semibold text-gray-800">
//                         {step.label}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {historyItem?.createAt
//                           ? formartDate(historyItem.createAt)
//                           : listDataBill.status === 7 && step.status === 7
//                           ? formartDate(
//                               billHistory[getHistoryIndexForStatus(7)]?.createAt
//                             )
//                           : "Chưa thực hiện"}
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Bill Summary */}
//             <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm text-gray-600">Mã phiếu gửi</p>
//                   <p className="font-medium text-gray-900">
//                     {listDataBill.code}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Ngày tạo đơn</p>
//                   <p className="font-medium text-gray-900">
//                     {formartDate(listDataBill.createAt)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Trạng thái</p>
//                   <p className="font-medium text-blue-600">
//                     {getStatusText(listDataBill.status)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Thanh toán</p>
//                   <p className="font-medium">
//                     {statusPayment ? (
//                       <span className="text-green-600">Đã thanh toán</span>
//                     ) : (
//                       <span className="text-red-600">Chưa thanh toán</span>
//                     )}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Tổng tiền hàng</p>
//                   <p className="font-medium text-red-600">
//                     {formatCurrency(
//                       listDataBill.totalMoney + listDataBill.moneyReduce
//                     )}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Phí vận chuyển</p>
//                   <p className="font-medium text-gray-900">
//                     {formatCurrency(listDataBill.moneyShip)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Tổng tiền phải thanh toán
//                   </p>
//                   <p className="font-medium text-red-600">
//                     {formatCurrency(
//                       listDataBill.totalMoney + listDataBill.moneyShip
//                     )}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Giảm giá</p>
//                   <p className="font-medium text-red-600">
//                     {formatCurrency(listDataBill.moneyReduce)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Customer Info */}
//             <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">
//                 Thông tin người nhận
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 <p>
//                   <span className="font-medium">Tên:</span>{" "}
//                   {listDataBill.customerName}
//                 </p>
//                 <p>
//                   <span className="font-medium">SĐT:</span>{" "}
//                   {listDataBill.phoneNumber}
//                 </p>
//                 <div>
//                   <span className="font-medium">Địa chỉ:</span>
//                   <DetailAddress
//                     spec={listDataBill.address.split("##")[0]}
//                     war={listDataBill.address.split("##")[1]}
//                     distr={listDataBill.address.split("##")[2]}
//                     prov={listDataBill.address.split("##")[3]}
//                   />
//                 </div>
//                 {listDataBill.note && (
//                   <p>
//                     <span className="font-medium">Ghi chú:</span>{" "}
//                     {listDataBill.note}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Product List */}
//         {detailBill && (
//           <div className="bg-white shadow-md rounded-lg p-6 mt-6">
//             <h3 className="text-lg font-medium text-gray-700 mb-4">
//               Danh sách sản phẩm
//             </h3>
//             <div className="space-y-6">
//               {detailBill.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-4 pb-6 border-b border-gray-200 last:border-b-0"
//                 >
//                   <img
//                     src={item?.images.split(",")[0]}
//                     alt={item?.name}
//                     className="w-20 h-20 object-contain rounded"
//                   />
//                   <div className="flex-1">
//                     <p className="font-semibold text-gray-900">{item?.name}</p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
//                       <p>
//                         Màu: <span className="font-medium">{item?.color}</span>
//                       </p>
//                       <p>
//                         Số lượng:{" "}
//                         <span className="font-medium">{item?.quantity}</span>
//                       </p>
//                       <p>
//                         Kích thước:{" "}
//                         <span className="font-medium">{item?.size}</span>
//                       </p>
//                     </div>
//                     <p className="mt-2 text-sm">
//                       Thành tiền:
//                       <span className="font-medium text-red-600">
//                         {item?.discountValue
//                           ? convertToCurrencyString(
//                               item?.discountValue * item?.quantity
//                             )
//                           : convertToCurrencyString(
//                               item?.price * item?.quantity
//                             )}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LookUpOrders;




import React, { useEffect, useState } from "react";
import API from "../../api";
import axios from "axios";
import Images from "../../static";
import { CustomError, IBill, IDetailOrder } from "../../types/product.type";
import { formartDate, formatCurrency } from "../../utils/formatCurrency";
import { toast } from "react-toastify";
import { convertToCurrencyString } from "../../utils/format";
import DetailAddress from "../information/address/detailAddress";
import {
  FaClock,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

// Interface for bill history data (aligned with BillHistory)
interface IBillHistory {
  createAt: string;
  createBy: string;
  id: number;
  index: number;
  note: string;
  status: number;
}

const LookUpOrders = () => {
  const [inputHD, setInputHD] = useState<string>("");
  const [listDataBill, setListDataBill] = useState<IBill>();
  const [detailBill, setDetailBill] = useState<IDetailOrder[]>();
  const [statusPayment, setStatusPayment] = useState<boolean>(false);
  const [billHistory, setBillHistory] = useState<IBillHistory[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Fetch bill details
  const getInfoDetailProduct = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getSearchBill(inputHD),
      });
      if (res.status) {
        const billData = res?.data;
        billData.address = billData.address || "";
        setListDataBill(billData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch bill history
  const getBillHistory = async (billId: number) => {
    try {
      const res = await axios({
        method: "get",
        url: API.getBillHistory(billId),
      });
      if (res.status) {
        setBillHistory(res?.data);
      }
    } catch (error) {
      console.error("Error fetching bill history: ", error);
    }
  };

  // Fetch bill detail
  const getBillDetail = async () => {
    if (!listDataBill?.id) return;
    try {
      const res = await axios({
        method: "get",
        url: API.getDetailBill(Number(listDataBill?.id)),
      });
      if (res.status) {
        setDetailBill(res?.data?.data);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Đã có lỗi xảy ra, thử lại sau."
      );
    }
  };

  // Fetch payment status
  const getStatusPayMent = async (id: number) => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:8080/client/api/payment-method/${id}`,
      });
      if (res.status) {
        setStatusPayment(res?.data[0].type);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle cancel order
  const changeStatusBill = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:8080/client/api/bill/change-status/${listDataBill?.id}`,
        params: {
          note: selectedOption,
          isCancel: true,
          isVnpay: statusPayment,
        },
      });
      if (res.status) {
        toast.success("Đã hủy đơn hàng thành công");
        setShowModal(false);
        getInfoDetailProduct(); // Refresh bill data
        getBillHistory(listDataBill?.id!); // Refresh bill history
      } else {
        toast.warning("Lỗi hủy đơn hàng");
      }
    } catch (error) {
      console.error("Error cancelling order: ", error);
      let errorMessage = "Lỗi hủy đơn hàng";
      if (typeof error === "object" && error !== null) {
        if ("response" in error && typeof (error as any).response?.data?.message === "string") {
          errorMessage += ": " + (error as any).response.data.message;
        } else if ("message" in error && typeof (error as any).message === "string") {
          errorMessage += ": " + (error as any).message;
        }
      }
      toast.error(errorMessage);
    }
  };

  // Handle radio button change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  // Fetch bill history and details when bill ID is available
  useEffect(() => {
    if (listDataBill?.id) {
      getBillDetail();
      getStatusPayMent(listDataBill.id);
      getBillHistory(listDataBill.id);
    }
  }, [listDataBill]);

  // Map status codes to text
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Tạo hoá đơn";
      case 2:
        return "Chờ xác nhận";
      case 4:
        return "Chờ giao hàng";
      case 5:
        return "Đang giao hàng";
      case 6:
        return "Hoàn thành";
      case 7:
        return "Đã hủy";
      case 9:
        return "Đã xác nhận";
      default:
        return "Không xác định";
    }
  };

  // Timeline steps
  const timelineSteps = [
    {
      status: 1,
      label: "Tạo hoá đơn",
      icon: <FaClock />,
      color: "bg-yellow-500",
    },
    {
      status: 2,
      label: "Chờ xác nhận",
      icon: <FaClock />,
      color: "bg-yellow-500",
    },
    {
      status: 9,
      label: "Đã xác nhận",
      icon: <FaCheckCircle />,
      color: "bg-green-400",
    },
    {
      status: 4,
      label: "Chờ giao hàng",
      icon: <FaBox />,
      color: "bg-blue-500",
    },
    {
      status: 5,
      label: "Đang giao hàng",
      icon: <FaTruck />,
      color: "bg-purple-500",
    },
    {
      status: 6,
      label: "Hoàn thành",
      icon: <FaCheckCircle />,
      color: "bg-green-500",
    },
    {
      status: 7,
      label: "Đã hủy",
      icon: <FaTimesCircle />,
      color: "bg-red-500",
    },
  ];

  // Filter timeline steps based on current status and bill history
  const filteredTimelineSteps = () => {
    const currentStatus = listDataBill?.status ?? 0;

    if (currentStatus === 7) {
      const relevantStatuses = timelineSteps.filter(
        (step) =>
          (step.status === 2 ||
            step.status === 4 ||
            step.status === 7 ||
            step.status === 9) &&
          billHistory.some((history) => history.status === step.status)
      );
      return relevantStatuses;
    }

    return timelineSteps.filter(
      (step) =>
        (step.status <= currentStatus && step.status !== 7) ||
        (step.status === 9 &&
          billHistory.some((history) => history.status === 9))
    );
  };

  // Map status to bill history index
  const getHistoryIndexForStatus = (status: number) => {
    return billHistory.findIndex((history) => history.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="relative w-full h-64">
        <img
          src={Images.ghn}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
              Tra cứu hành trình đơn hàng
            </h1>
            <p className="mt-2 text-sm md:text-base">
              "Mạng chuyển phát nhanh rộng khắp nơi"
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Nhập mã phiếu gửi
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="VD: Hoá đơn "
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputHD}
                onChange={(e) => setInputHD(e.target.value)}
              />
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={getInfoDetailProduct}
              >
                Tra cứu
              </button>
            </div>
          </div>
        </div>

        {/* Bill Details */}
        {listDataBill && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Thông tin đơn hàng
              </h2>
              {listDataBill.status === 2 && (
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-base font-semibold shadow-md"
                  onClick={() => setShowModal(true)}
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>

            {/* Horizontal Timeline */}
            <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-700 mb-6">
                Hành trình đơn hàng
              </h3>
              <div className="relative flex justify-between items-center">
                <div
                  className={`absolute top-1/2 left-0 h-1 transform -translate-y-1/2 ${
                    listDataBill.status === 7
                      ? "right-0 bg-red-500"
                      : "bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500"
                  }`}
                  style={{
                    width: `${((filteredTimelineSteps().length - 1) /
                      (filteredTimelineSteps().length - 1)) *
                      100}%`,
                  }}
                ></div>

                {filteredTimelineSteps().map((step, index) => {
                  const historyIndex = getHistoryIndexForStatus(step.status);
                  const historyItem = billHistory[historyIndex];
                  const isCompletedWithoutDate =
                    !historyItem?.createAt &&
                    listDataBill.status > step.status &&
                    step.status !== 7;

                  if (isCompletedWithoutDate) {
                    return null;
                  }

                  return (
                    <div
                      key={index}
                      className={`relative flex-1 text-center transition-all duration-500 ${
                        listDataBill.status === step.status ||
                        billHistory.some(
                          (history) => history.status === step.status
                        ) ||
                        (listDataBill.status > step.status && step.status !== 7)
                          ? "opacity-100 scale-100"
                          : "opacity-50 scale-90"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-xl z-10 ${step.color} shadow-lg`}
                      >
                        {step.icon}
                      </div>
                      <p className="mt-3 text-base font-semibold text-gray-800">
                        {step.label}
                      </p>
                      <p className="text-sm text-gray-500">
                        {historyItem?.createAt
                          ? formartDate(historyItem.createAt)
                          : listDataBill.status === 7 && step.status === 7
                          ? formartDate(
                              billHistory[getHistoryIndexForStatus(7)]?.createAt
                            )
                          : "Chưa thực hiện"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Mã phiếu gửi</p>
                  <p className="font-medium text-gray-900">
                    {listDataBill.code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tạo đơn</p>
                  <p className="font-medium text-gray-900">
                    {formartDate(listDataBill.createAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <p className="font-medium text-blue-600">
                    {getStatusText(listDataBill.status)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thanh toán</p>
                  <p className="font-medium">
                    {statusPayment ? (
                      <span className="text-green-600">Đã thanh toán</span>
                    ) : (
                      <span className="text-red-600">Chưa thanh toán</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng tiền hàng</p>
                  <p className="font-medium text-red-600">
                    {formatCurrency(
                      listDataBill.totalMoney + listDataBill.moneyReduce
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phí vận chuyển</p>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(listDataBill.moneyShip)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Tổng tiền phải thanh toán
                  </p>
                  <p className="font-medium text-red-600">
                    {formatCurrency(
                      listDataBill.totalMoney + listDataBill.moneyShip
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Giảm giá</p>
                  <p className="font-medium text-red-600">
                    {formatCurrency(listDataBill.moneyReduce)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Thông tin người nhận
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-medium">Tên:</span>{" "}
                  {listDataBill.customerName}
                </p>
                <p>
                  <span className="font-medium">SĐT:</span>{" "}
                  {listDataBill.phoneNumber}
                </p>
                <div>
                  <span className="font-medium">Địa chỉ:</span>
                  <DetailAddress
                    spec={listDataBill.address.split("##")[0]}
                    war={listDataBill.address.split("##")[1]}
                    distr={listDataBill.address.split("##")[2]}
                    prov={listDataBill.address.split("##")[3]}
                  />
                </div>
                {listDataBill.note && (
                  <p>
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {listDataBill.note}
                  </p>
                )}
              </div>
            </div>

            {/* Cancel Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Lý do hủy đơn hàng
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Tôi muốn thay đổi mã giảm giá",
                      "Tôi muốn thay đổi sản phẩm",
                      "Thủ tục thanh toán rắc rối",
                      "Tôi tìm thấy chỗ mua khác tốt hơn",
                      "Tôi không có nhu cầu mua nữa",
                      "Tôi không tìm thấy lý do hủy phù hợp",
                      "Tìm được chỗ khác rẻ hơn",
                      "Tôi muốn cập nhật địa chỉ/sđt nhận hàng",
                    ].map((reason) => (
                      <label
                        key={reason}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason}
                          checked={selectedOption === reason}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        {reason}
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      onClick={() => setShowModal(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        changeStatusBill();
                        setShowModal(false);
                      }}
                      disabled={!selectedOption}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product List */}
        {detailBill && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Danh sách sản phẩm
            </h3>
            <div className="space-y-6">
              {detailBill.map((item, index) => (
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
                      <p>
                        Màu: <span className="font-medium">{item?.color}</span>
                      </p>
                      <p>
                        Số lượng:{" "}
                        <span className="font-medium">{item?.quantity}</span>
                      </p>
                      <p>
                        Kích thước:{" "}
                        <span className="font-medium">{item?.size}</span>
                      </p>
                    </div>
                    <p className="mt-2 text-sm">
                      Thành tiền:
                      <span className="font-medium text-red-600">
                        {item?.discountValue
                          ? convertToCurrencyString(
                              item?.discountValue * item?.quantity
                            )
                          : convertToCurrencyString(
                              item?.price * item?.quantity
                            )}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LookUpOrders;