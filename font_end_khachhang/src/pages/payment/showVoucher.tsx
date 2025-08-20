// import React, { useEffect, useState } from "react";
// import API from "../../api";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { convertToCurrencyString } from "../../utils/format";
// import { IVoucher } from "../../types/product.type";

// const ShowVoucher = ({
//   isOpen,
//   onClose,
//   valueCheck,
//   userId,
//   setPrecent,
//   setIdVoucher,
// }: {
//   valueCheck: number;
//   isOpen: boolean;
//   onClose: any;
//   setPrecent: any;
//   setIdVoucher: any;
//   userId: number;
// }) => {
//   const [selected, setSelected] = useState<string>();
//   const [inputVoucher, setInputVoucher] = useState<string>("");
//   const [vouchers, setVouchers] = useState<IVoucher[]>([]);

//   const getVouchers = async () => {
//     try {
//       const params = {
        
//         deleted: false,
//         status: 1
//       };
  
//       const res = await axios.get(API.getVoucher(), { params }); // Passing params as query params in the GET request
  
//       if (res.status === 200) {
//         setVouchers(res.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching vouchers:", error);
//     }
//   };

//   const calculateDiscount = (voucher: IVoucher, total: number) => {
//     const discount = (total * voucher.percentReduce) / 100;
//     return voucher.maxBillValue && discount > voucher.maxBillValue
//       ? voucher.maxBillValue
//       : discount;
//   };

//   const applyVoucherByCode = async () => {
//     try {
//       const res = await axios.get(API.getVoucherSearch(inputVoucher));
//       if (res.status === 200 && res.data.data.length === 1) {
//         const voucher = res.data.data[0];
//         if (valueCheck >= voucher.minBillValue) {
//           const discount = calculateDiscount(voucher, valueCheck);
//           setPrecent(discount / valueCheck * 100); // Chuyển đổi thành phần trăm thực tế
//           setIdVoucher(voucher.id);
//           toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
//           setInputVoucher("");
//           onClose();
//         } else {
//           toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
//         }
//       } else {
//         toast.warning("Không tìm thấy mã voucher");
//       }
//     } catch (error) {
//       console.error("Error applying voucher:", error);
//       toast.error("Lỗi khi áp dụng voucher");
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       getVouchers();
//       document.body.classList.add("overflow-hidden");
//     } else {
//       document.body.classList.remove("overflow-hidden");
//     }
//     return () => {
//       document.body.classList.remove("overflow-hidden");
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-20 mx-auto p-5 border w-[30%] shadow-lg rounded-md bg-white">
//         <button
//           onClick={onClose}
//           className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-900"
//         >
//           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//         <div>
//           <p className="text-lg font-medium text-gray-900 text-center mb-3">Chọn Voucher</p>
//           <div className="bg-[#f8f8f8] px-3 py-2 flex items-center justify-between">
//             <p className="text-[#0000008a] text-xs font-normal">Mã voucher</p>
//             <input
//               onChange={(e) => setInputVoucher(e.target.value)}
//               value={inputVoucher}
//               type="text"
//               className="flex-1 mx-2 border-[#00000024] border-[1px] rounded-[2px] text-sm"
//             />
//             <button
//               className="bg-white text-[#0000008a] px-3 py-[5px]"
//               onClick={applyVoucherByCode}
//             >
//               Áp dụng
//             </button>
//           </div>
//           <div className="mt-2 py-3 overflow-y-scroll max-h-72">
//             {vouchers.length > 0 ? (
//               vouchers.map((voucher) => (
//                 <div
//                   key={voucher.id}
//                   className={`w-full flex justify-around hover:bg-[#f5f5f5] cursor-pointer mt-2 px-2 py-2 ${
//                     selected === voucher.code ? "bg-[#f5f5f5]" : ""
//                   }`}
//                   onClick={() => {
//                     if (valueCheck >= voucher.minBillValue) {
//                       const discount = calculateDiscount(voucher, valueCheck);
//                       setPrecent(discount / valueCheck * 100); // Chuyển đổi thành phần trăm thực tế
//                       setIdVoucher(voucher.id);
//                       setSelected(voucher.code);
//                       toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
//                       onClose();
//                     } else {
//                       toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
//                     }
//                   }}
//                 >
//                   <div className="w-[50%]">
//                     <div className="text-sm text-[#BFAEE3]">{voucher.name}</div>
//                     <p className="text-xs mt-2">Phần trăm giảm: {voucher.percentReduce}%</p>
//                     <p className="text-xs mt-2">Số lượng còn: {voucher.quantity}</p>
//                   </div>
//                   <div className="w-[50%] flex flex-col justify-start gap-2">
//                     <div className="text-[12px]">Mã voucher: {voucher.code}</div>
//                     <p className="text-[12px]">
//                       Đơn tối thiểu:{" "}
//                       <span className="text-red-400">{convertToCurrencyString(voucher.minBillValue)}</span>
//                     </p>
//                     {voucher.maxBillValue && (
//                       <p className="text-[12px]">
//                         Giảm tối đa:{" "}
//                         <span className="text-red-400">{convertToCurrencyString(voucher.maxBillValue)}</span>
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-sm my-2">Không có voucher</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShowVoucher;


import React, { useEffect, useState } from "react";
import API from "../../api";
import axios from "axios";
import { toast } from "react-toastify";
import { convertToCurrencyString } from "../../utils/format";
import { IVoucher } from "../../types/product.type";

const ShowVoucher = ({
  isOpen,
  onClose,
  valueCheck,
  userId,
  setPrecent,
  setIdVoucher,
}: {
  valueCheck: number;
  isOpen: boolean;
  onClose: any;
  setPrecent: any;
  setIdVoucher: any;
  userId: number;
}) => {
  const [selected, setSelected] = useState<string>();
  const [inputVoucher, setInputVoucher] = useState<string>("");
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);

  const getVouchers = async () => {
    try {
      const params = {
        status: 1,
      };

      const res = await axios.get(API.getVoucher(), { params });

      if (res.status === 200) {
        const fetchedVouchers = res.data.data || [];
        // Sort vouchers: applicable ones first, then by highest discount
        const sortedVouchers = fetchedVouchers.sort((a: IVoucher, b: IVoucher) => {
          const aApplicable = valueCheck >= a.minBillValue;
          const bApplicable = valueCheck >= b.minBillValue;
          if (aApplicable && !bApplicable) return -1;
          if (!aApplicable && bApplicable) return 1;
          const aDiscount = calculateDiscount(a, valueCheck);
          const bDiscount = calculateDiscount(b, valueCheck);
          return bDiscount - aDiscount; // Higher discount first
        });
        setVouchers(sortedVouchers);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const calculateDiscount = (voucher: IVoucher, total: number) => {
    const discount = (total * voucher.percentReduce) / 100;
    return voucher.maxBillValue && discount > voucher.maxBillValue
      ? voucher.maxBillValue
      : discount;
  };

  const applyVoucherByCode = async () => {
    try {
      const res = await axios.get(API.getVoucherSearch(inputVoucher));
      if (res.status === 200 && res.data.data.length === 1) {
        const voucher = res.data.data[0];
        if (valueCheck >= voucher.minBillValue) {
          const discount = calculateDiscount(voucher, valueCheck);
          setPrecent(discount / valueCheck * 100);
          setIdVoucher(voucher.id);
          toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
          setInputVoucher("");
          onClose();
        } else {
          toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
        }
      } else {
        toast.warning("Không tìm thấy mã voucher");
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      toast.error("Lỗi khi áp dụng voucher");
    }
  };

  useEffect(() => {
    if (isOpen) {
      getVouchers();
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Find the best voucher (highest discount)
  const bestVoucher = vouchers.reduce(
    (best: IVoucher | null, voucher: IVoucher) => {
      if (valueCheck >= voucher.minBillValue) {
        const discount = calculateDiscount(voucher, valueCheck);
        if (!best || discount > calculateDiscount(best, valueCheck)) {
          return voucher;
        }
      }
      return best;
    },
    null
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Chọn Voucher</h2>

        {/* Voucher Code Input */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={inputVoucher}
            onChange={(e) => setInputVoucher(e.target.value)}
            placeholder="Nhập mã voucher"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={applyVoucherByCode}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Áp dụng
          </button>
        </div>

        {/* Voucher List */}
        <div className="max-h-80 overflow-y-auto">
          {vouchers.length > 0 ? (
            vouchers.map((voucher) => {
              const isApplicable = valueCheck >= voucher.minBillValue;
              const discount = isApplicable ? calculateDiscount(voucher, valueCheck) : 0;
              const isBest = bestVoucher && bestVoucher.id === voucher.id && isApplicable;

              return (
                <div
                  key={voucher.id}
                  className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all ${
                    isApplicable
                      ? "border-blue-200 bg-blue-50 hover:bg-blue-100"
                      : "border-gray-200 bg-gray-50 opacity-60"
                  } ${selected === voucher.code ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => {
                    if (isApplicable) {
                      setPrecent(discount / valueCheck * 100);
                      setIdVoucher(voucher.id);
                      setSelected(voucher.code);
                      toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
                      onClose();
                    } else {
                      toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-800">{voucher.name}</h3>
                        {isBest && (
                          <span className="bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Giảm giá tốt nhất
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Mã: {voucher.code}</p>
                      <p className="text-sm text-gray-600">Giảm: {voucher.percentReduce}%</p>
                      {isApplicable && (
                        <p className="text-sm font-semibold text-green-600">
                          Tiết kiệm: {convertToCurrencyString(discount)}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Đơn tối thiểu: <span className="text-red-500">{convertToCurrencyString(voucher.minBillValue)}</span>
                      </p>
                      {voucher.maxBillValue && (
                        <p className="text-sm text-gray-600">
                          Giảm tối đa: <span className="text-red-500">{convertToCurrencyString(voucher.maxBillValue)}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-600">Số lượng còn: {voucher.quantity}</p>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        isApplicable ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {isApplicable ? "Áp dụng" : "Không đủ điều kiện"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">Không có voucher nào khả dụng</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowVoucher;