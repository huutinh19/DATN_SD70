// // import React, { useEffect, useState } from "react";
// // import API from "../../api";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import { convertToCurrencyString } from "../../utils/format";
// // import { IVoucher } from "../../types/product.type";
// // const ShowVoucherWithMe = ({
// //   userId,
// //   isOpen2,
// //   onClose2,
// //   valueCheck,
// //   setPrecent2,
// // }: {
// //   userId: number;
// //   valueCheck: number;
// //   isOpen2: boolean;
// //   onClose2: any;
// //   setPrecent2: any;
// // }) => {
// //   const [selected, setSelected] = useState<number>();
// //   const [voucher, setVoucher] = useState<IVoucher[]>();
// //   const getVoucher = async () => {
// //     try {
// //       const res = await axios({
// //         method: "get",
// //         url: API.getVoucherWithUser(userId),
// //       });
// //       if (res.status) {
// //         setVoucher(res?.data?.data);
// //       }
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };
// //   useEffect(() => {
// //     getVoucher();
// //   }, []);

// //   useEffect(() => {
// //     if (isOpen2) {
// //       document.body.classList.add("overflow-hidden");
// //     } else {
// //       document.body.classList.remove("overflow-hidden");
// //     }
// //     return () => {
// //       document.body.classList.remove("overflow-hidden");
// //     };
// //   }, [isOpen2]);
// //   if (!isOpen2) return null;

// //   return (
// //     <div
// //       className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
// //       id="my-modal"
// //     >
// //       <div className="relative top-20 mx-auto p-5 border w-[30%] shadow-lg rounded-md bg-white">
// //         <button
// //           onClick={onClose2}
// //           className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-900"
// //         >
// //           <svg
// //             className="h-6 w-6"
// //             fill="none"
// //             viewBox="0 0 24 24"
// //             stroke="currentColor"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               strokeWidth="2"
// //               d="M6 18L18 6M6 6l12 12"
// //             />
// //           </svg>
// //         </button>
// //         <p className="text-lg leading-6 font-medium text-gray-900 text-center mb-3">
// //           Hãy chọn voucher
// //         </p>
// //         <div className="mt-2 py-3 overflow-y-scroll max-h-72">
// //           <div>Voucher của bạn</div>
// //           {!!voucher &&
// //             voucher.map((voucher, index) => (
// //               <div
// //                 key={index}
// //                 className={`w-full flex justify-around   hover:bg-[#f5f5f5] cursor-pointer mt-2  px-2 py-2 ${
// //                   selected === index ? "bg-[#f5f5f5]" : "null"
// //                 }`}
// //                 onClick={() => {
// //                   if (valueCheck >= voucher?.minBillValue) {
// //                     setPrecent2(voucher?.percentReduce);
// //                     toast.success("Áp dụng voucher thành công");
// //                     setSelected(index);
// //                     onClose2();
// //                   } else {
// //                     toast.warning("Voucher không được áp dụng");
// //                   }
// //                 }}
// //               >
// //                 <div className={`w-[50%] `}>
// //                   <div
// //                     key={voucher?.name}
// //                     className={`w-full  text-sm  text-[#BFAEE3] `}
// //                   >
// //                     {voucher?.name}
// //                   </div>

// //                   <p className="text-xs mt-2">
// //                     Phần trăm giảm: {voucher.percentReduce}%
// //                   </p>
// //                   <p className="text-xs mt-2">
// //                     Số lượng còn: {voucher.quantity}
// //                   </p>
// //                 </div>
// //                 <div className={`w-[50%] flex flex-col justify-start gap-2 `}>
// //                   <div key={voucher?.name} className={`w-full  text-[12px]   `}>
// //                     Mã voucher: {voucher?.code}
// //                   </div>

// //                   <p className="text-[12px]">
// //                     Đơn tối thiểu:{" "}
// //                     <span className="text-red-400">
// //                       {convertToCurrencyString(voucher.minBillValue)}
// //                     </span>
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ShowVoucherWithMe;
// import React, { useEffect, useState } from "react";
// import API from "../../api";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { convertToCurrencyString } from "../../utils/format";
// import { IVoucher } from "../../types/product.type";

// const ShowVoucherWithMe = ({
//   userId,
//   isOpen2,
//   onClose2,
//   valueCheck,
//   setPrecent2,
// }: {
//   userId: number;
//   valueCheck: number;
//   isOpen2: boolean;
//   onClose2: any;
//   setPrecent2: any;
// }) => {
//   const [selected, setSelected] = useState<number>();
//   const [vouchers, setVouchers] = useState<IVoucher[]>([]);

//   const getVouchers = async () => {
//     try {
//       const res = await axios.get(API.getVoucher());
//       if (res.status === 200) {
//         setVouchers(res.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching vouchers:", error);
//     }
//   };

//   useEffect(() => {
//     if (isOpen2) {
//       getVouchers();
//       document.body.classList.add("overflow-hidden");
//     } else {
//       document.body.classList.remove("overflow-hidden");
//     }
//     return () => {
//       document.body.classList.remove("overflow-hidden");
//     };
//   }, [isOpen2]);

//   if (!isOpen2) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-20 mx-auto p-5 border w-[30%] shadow-lg rounded-md bg-white">
//         <button
//           onClick={onClose2}
//           className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-900"
//         >
//           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//         <p className="text-lg font-medium text-gray-900 text-center mb-3">Hãy chọn voucher</p>
//         <div className="mt-2 py-3 overflow-y-scroll max-h-72">
//           <div>Danh sách voucher</div>
//           {vouchers.length > 0 ? (
//             vouchers.map((voucher, index) => (
//               <div
//                 key={voucher.id}
//                 className={`w-full flex justify-around hover:bg-[#f5f5f5] cursor-pointer mt-2 px-2 py-2 ${
//                   selected === index ? "bg-[#f5f5f5]" : ""
//                 }`}
//                 onClick={() => {
//                   if (valueCheck >= voucher.minBillValue) {
//                     setPrecent2(voucher.percentReduce);
//                     toast.success("Áp dụng voucher thành công");
//                     setSelected(index);
//                     onClose2();
//                   } else {
//                     toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
//                   }
//                 }}
//               >
//                 <div className="w-[50%]">
//                   <div className="text-sm text-[#BFAEE3]">{voucher.name}</div>
//                   <p className="text-xs mt-2">Phần trăm giảm: {voucher.percentReduce}%</p>
//                   <p className="text-xs mt-2">Số lượng còn: {voucher.quantity}</p>
//                 </div>
//                 <div className="w-[50%] flex flex-col justify-start gap-2">
//                   <div className="text-[12px]">Mã voucher: {voucher.code}</div>
//                   <p className="text-[12px]">
//                     Đơn tối thiểu: <span className="text-red-400">{convertToCurrencyString(voucher.minBillValue)}</span>
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-sm my-2">Không có voucher</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShowVoucherWithMe;

import React, { useEffect, useState } from "react";
import API from "../../api";
import axios from "axios";
import { toast } from "react-toastify";
import { convertToCurrencyString } from "../../utils/format";
import { IVoucher } from "../../types/product.type";

const ShowVoucherWithMe = ({
  userId,
  isOpen2,
  onClose2,
  valueCheck,
  setPrecent2,
}: {
  userId: number;
  valueCheck: number;
  isOpen2: boolean;
  onClose2: any;
  setPrecent2: any;
}) => {
  const [selected, setSelected] = useState<number>();
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);

  const getVouchers = async () => {
    try {
      const params = {
        
        deleted: false,
        status: 1
      };
  
      const res = await axios.get(API.getVoucher(), { params }); // Passing params as query params in the GET request
  
      if (res.status === 200) {
        setVouchers(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  useEffect(() => {
    if (isOpen2) {
      getVouchers();
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen2]);

  if (!isOpen2) return null;

  const calculateDiscount = (voucher: IVoucher, total: number) => {
    const discount = (total * voucher.percentReduce) / 100;
    return voucher.maxBillValue && discount > voucher.maxBillValue
      ? voucher.maxBillValue
      : discount;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[30%] shadow-lg rounded-md bg-white">
        <button
          onClick={onClose2}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-900"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-lg font-medium text-gray-900 text-center mb-3">Hãy chọn voucher</p>
        <div className="mt-2 py-3 overflow-y-scroll max-h-72">
          <div>Danh sách voucher</div>
          {vouchers.length > 0 ? (
            vouchers.map((voucher, index) => (
              <div
                key={voucher.id}
                className={`w-full flex justify-around hover:bg-[#f5f5f5] cursor-pointer mt-2 px-2 py-2 ${
                  selected === index ? "bg-[#f5f5f5]" : ""
                }`}
                onClick={() => {
                  if (valueCheck >= voucher.minBillValue) {
                    const discount = calculateDiscount(voucher, valueCheck);
                    setPrecent2(discount / valueCheck * 100); // Chuyển đổi thành phần trăm thực tế
                    toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
                    setSelected(index);
                    onClose2();
                  } else {
                    toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
                  }
                }}
              >
                <div className="w-[50%]">
                  <div className="text-sm text-[#BFAEE3]">{voucher.name}</div>
                  <p className="text-xs mt-2">Phần trăm giảm: {voucher.percentReduce}%</p>
                  <p className="text-xs mt-2">Số lượng còn: {voucher.quantity}</p>
                </div>
                <div className="w-[50%] flex flex-col justify-start gap-2">
                  <div className="text-[12px]">Mã voucher: {voucher.code}</div>
                  <p className="text-[12px]">
                    Đơn tối thiểu: <span className="text-red-400">{convertToCurrencyString(voucher.minBillValue)}</span>
                  </p>
                  {voucher.maxBillValue && (
                    <p className="text-[12px]">
                      Giảm tối đa: <span className="text-red-400">{convertToCurrencyString(voucher.maxBillValue)}</span>
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm my-2">Không có voucher</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowVoucherWithMe;