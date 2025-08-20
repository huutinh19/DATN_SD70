// // import React, { useEffect, useState } from "react";
// // import Images from "../../../static";
// // import { useNavigate, useParams } from "react-router-dom";
// // import axios from "axios";
// // import API from "../../../api";
// // import { toast } from "react-toastify";
// // import { CustomError, IBill, IDetailOrder } from "../../../types/product.type";
// // import { convertToCurrencyString } from "../../../utils/format";
// // import DetailAddress from "../../information/address/detailAddress";
// // import { formartDate, formatCurrency } from "../../../utils/formatCurrency";
// // interface IData {
// //   createAt: string;
// //   createBy: string;
// //   id: number;
// //   index: number;
// //   note: string;
// //   status: number;
// // }
// // const TimeLineOrder = () => {
// //   const param = useParams();
// //   const navigate = useNavigate();
// //   const [data, setData] = useState<IData[]>();
// //   const [bill, setBill] = useState<IBill>();
// //   const [billDetail, setBillDetail] = useState<IDetailOrder[]>();
// //   const getBillHistory = async () => {
// //     try {
// //       const res = await axios({
// //         method: "get",
// //         url: API.getBillHistory(Number(param?.idBill)),
// //       });
// //       if (res.status) {
// //         setData(res?.data);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching bill history: ", error);
// //     }
// //   };
// //   const getBillDetail = async () => {
// //     try {
// //       const res = await axios({
// //         method: "get",
// //         url: API.getDetailBill(Number(param?.idBill)),
// //       });
// //       if (res.status) {
// //         setBillDetail(res?.data?.data);
// //       }
// //     } catch (error) {
// //       if (typeof error === "string") {
// //         toast.error(error);
// //       } else if (error instanceof Error) {
// //         const customError = error as CustomError;
// //         if (customError.response && customError.response.data) {
// //           toast.error(customError.response.data);
// //         } else {
// //           toast.error(customError.message);
// //         }
// //       } else {
// //         toast.error("Hãy thử lại.");
// //       }
// //     }
// //   };
// //   const getBill = async () => {
// //     try {
// //       const res = await axios({
// //         method: "get",
// //         url: API.getSearchBill(param?.code ? param?.code : ""),
// //       });
// //       if (res.status) {
// //         setBill(res?.data);
// //       }
// //     } catch (error) {}
// //   };
// //   useEffect(() => {
// //     if (param) {
// //       getBillHistory();
// //       getBill();
// //       getBillDetail();
// //     }
// //   }, [param]);
// //   return (
// //     <div className="w-[80%] mt-20 mx-auto min-h-screen ">
// //       <div className="  flex items-center  justify-between ">
// //         <div className="flex items-center gap-5">
// //           <button
// //             onClick={() => {
// //               navigate(-1);
// //             }}
// //           >
// //             <img
// //               src={Images.iconBack}
// //               alt=""
// //               className="w-10 h-10 object-contain "
// //             />
// //           </button>
// //           <span className="font-semibold ">Trạng thái đơn hàng của bạn</span>
// //         </div>
// //         <div>
// //           <span className="uppercase font-medium">
// //             Mã đơn hàng: {param?.code}
// //           </span>
// //         </div>
// //       </div>
// //       {!!data && (
// //         <ol className=" sm:flex justify-between  mt-20">
// //           <li className="relative mb-6 sm:mb-0 w-[25%]">
// //             <div className="flex items-center">
// //               <div className="z-1 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
// //                 <img
// //                   src={Images.iconWaitComfirm}
// //                   className="w-10 h-10 object-contain"
// //                 />
// //               </div>
// //               <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700" />
// //             </div>
// //             <div className="mt-3 sm:pe-8">
// //               <span className={`text-sm font-semibold text-red-700  `}>
// //                 Chờ xác nhận
// //               </span>
// //               <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
// //                 {formartDate(data[0]?.createAt)}

// //               </time>
// //               <span className="text-sm font-medium">
// //                 Ghi chú: {data[0]?.note}
// //               </span>
// //             </div>
// //           </li>
// //           <li className="relative mb-6 sm:mb-0 w-[25%]">
// //             <div className="flex items-center">
// //               <div className="z-1 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
// //                 {Number(param?.status) === 2 ? (
// //                   <img
// //                     src={Images.iconWaitDeliveryGray}
// //                     className="w-10 h-10 object-contain"
// //                   />
// //                 ) : (
// //                   <img
// //                     src={Images.iconWaitDelivery}
// //                     className="w-10 h-10 object-contain"
// //                   />
// //                 )}
// //               </div>
// //               <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700" />
// //             </div>
// //             <div className="mt-3 sm:pe-8">
// //               <span
// //                 className={`text-sm font-semibold  dark:text-white ${
// //                   Number(param?.status) === 2 ? "text-gray-500" : "text-red-600"
// //                 }`}
// //               >
// //                 Chờ giao hàng
// //               </span>
// //               <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
// //                 {data[1]?.createAt ? formartDate(data[1]?.createAt) : ""}

// //               </time>
// //               {data[1]?.note && (
// //                 <span className="text-sm font-medium">
// //                   Ghi chú: {data[1]?.note ? data[1]?.note : ""}
// //                 </span>
// //               )}
// //             </div>
// //           </li>
// //           <li className="relative mb-6 sm:mb-0 w-[25%]">
// //             <div className="flex items-center">
// //               <div className="z-1 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
// //                 {Number(param?.status) <= 4 ? (
// //                   <img
// //                     src={Images.iconDeliveryFash}
// //                     className="w-10 h-10 object-contain"
// //                   />
// //                 ) : (
// //                   <img
// //                     src={Images.iconDeliveryFashRed}
// //                     className="w-10 h-10 object-contain"
// //                   />
// //                 )}
// //               </div>
// //               <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700" />
// //             </div>
// //             <div className="mt-3 sm:pe-8">
// //               <span
// //                 className={`text-sm font-semibold  dark:text-white ${
// //                   Number(param?.status) <= 4 ? "text-gray-500" : "text-red-600"
// //                 }`}
// //               >
// //                 Đang giao
// //               </span>
// //               <span className="text-sm font-semibold text-gray-900 dark:text-white"></span>
// //               <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
// //                 {data[2]?.createAt ? formartDate(data[2]?.createAt) : ""}

// //               </time>
// //               {data[2]?.note && (
// //                 <span className="text-sm font-medium">
// //                   Ghi chú: {data[2]?.note}
// //                 </span>
// //               )}
// //             </div>
// //           </li>
// //           <li className="relative mb-6 sm:mb-0 w-[25%]">
// //             <div className="flex items-center">
// //               <div className="z-1 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
// //                 {Number(param?.status) <= 5 ? (
// //                   <img
// //                     src={Images.iconUnboxGray}
// //                     className="w-10 h-10 object-contain"
// //                   />
// //                 ) : (
// //                   <img
// //                     src={Images.iconUnbox}
// //                     className="w-10 h-10 object-contain"
// //                   />
// //                 )}
// //               </div>
// //             </div>
// //             <div className="mt-3 sm:pe-8">
// //               <span
// //                 className={`text-sm font-semibold  dark:text-white ${
// //                   Number(param?.status) <= 5 ? "text-gray-500" : "text-red-600"
// //                 }`}
// //               >
// //                 Hoàn thành
// //               </span>
// //               <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
// //                 {data[3]?.createAt ? formartDate(data[3]?.createAt) : ""}

// //               </time>
// //               {data[3]?.note && (
// //                 <span className="text-sm font-medium">
// //                   Ghi chú: {data[3]?.note ? data[3]?.note : ""}
// //                 </span>
// //               )}
// //             </div>
// //           </li>
// //         </ol>
// //       )}
// //       {!!bill && !!billDetail && (
// //         <div className="border-[1px] border-gray-300 mt-5 rounded">
// //           <p className="font-semibold text-base m-4 ">Danh sách sản phẩm </p>
// //           {billDetail?.map((item, index) => {
// //             return (
// //               <div
// //                 key={index}
// //                 className={`flex items-center gap-4 m-4 pb-4 ${
// //                   index === billDetail.length - 1
// //                     ? ""
// //                     : "border-b-[1px] border-gray-300"
// //                 }`}
// //               >
// //                 <img
// //                   src={item?.images.split(",")[0]}
// //                   alt=""
// //                   className="w-20 h-20 object-contain"
// //                 />
// //                 <div className=" flex flex-col justify-between  h-20">
// //                   <p className="text-xs font-semibold uppercase">
// //                     {item?.name}
// //                   </p>
// //                   <div className="flex items-center  gap-8">
// //                     <p className="text-xs font-normal">
// //                       Màu sắc:{" "}
// //                       <span className="font-medium">{item?.color}</span>
// //                     </p>
// //                     <p className="text-xs font-normal">
// //                       Số lượng:{" "}
// //                       <span className="font-medium">{item?.quantity}</span>
// //                     </p>
// //                     <p className="text-xs font-normal">
// //                       Kích thước:{" "}
// //                       <span className="font-medium">{item?.size}</span>
// //                     </p>
// //                     {/* <p className="text-xs font-normal">
// //                       Loại đế: <span className="font-medium">{item?.sole}</span>
// //                     </p> */}
// //                   </div>
// //                   <p className="text-xs font-normal">
// //                     Thành tiền :{" "}
// //                     <span className="font-medium">
// //                       {!!item?.discountValue
// //                         ? convertToCurrencyString(
// //                             item?.discountValue * item?.quantity
// //                           )
// //                         : convertToCurrencyString(item?.price * item?.quantity)}
// //                     </span>
// //                   </p>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}
// //       {!!bill && (
// //         <div className="w-full border rounded-md mt-5 p-4 flex flex-col gap-4 ">
// //           <h3 className="font-medium">Thông tin người nhận:</h3>
// //           <p className="font-medium">
// //             Tên khách hàng:{" "}
// //             <span className="font-normal"> {bill?.customerName}</span>
// //           </p>
// //           {bill?.phoneNumber && (
// //             <p className="font-medium">
// //               Số điện thoại:{" "}
// //               <span className="font-normal"> {bill?.phoneNumber}</span>
// //             </p>
// //           )}
// //           <div className="flex items-center gap-2">
// //             <span className="font-medium">Địa chỉ: </span>
// //             <DetailAddress
// //               spec={bill.address.split("##")[0]}
// //               war={bill.address.split("##")[1]}
// //               distr={bill.address.split("##")[2]}
// //               prov={bill.address.split("##")[3]}
// //             />
// //           </div>
// //           {bill?.note && (
// //             <p className="font-medium">
// //               Lưu ý: <span className="font-normal"> {bill?.note}</span>
// //             </p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TimeLineOrder;

// import React, { useEffect, useState } from "react";
// import Images from "../../../static";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import API from "../../../api";
// import { toast } from "react-toastify";
// import { CustomError, IBill, IDetailOrder } from "../../../types/product.type";
// import { convertToCurrencyString } from "../../../utils/format";
// import DetailAddress from "../../information/address/detailAddress";
// import { formartDate } from "../../../utils/formatCurrency";

// interface IData {
//   createAt: string;
//   createBy: string;
//   id: number;
//   index: number;
//   note: string;
//   status: number;
// }

// const TimeLineOrder = () => {
//   const param = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState<IData[]>();
//   const [bill, setBill] = useState<IBill>();
//   const [billDetail, setBillDetail] = useState<IDetailOrder[]>();
//   const [currentStatus, setCurrentStatus] = useState<number>(2); // Initialize with default status

//   // Fetch bill history
//   const getBillHistory = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getBillHistory(Number(param?.idBill)),
//       });
//       if (res.status) {
//         setData(res?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching bill history: ", error);
//     }
//   };

//   // Fetch bill details
//   const getBillDetail = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getDetailBill(Number(param?.idBill)),
//       });
//       if (res.status) {
//         setBillDetail(res?.data?.data);
//       }
//     } catch (error) {
//       if (typeof error === "string") {
//         toast.error(error);
//       } else if (error instanceof Error) {
//         const customError = error as CustomError;
//         if (customError.response && customError.response.data) {
//           toast.error(customError.response.data);
//         } else {
//           toast.error(customError.message);
//         }
//       } else {
//         toast.error("Hãy thử lại.");
//       }
//     }
//   };

//   // Fetch bill and update currentStatus
//   const getBill = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getSearchBill(param?.code ? param?.code : ""),
//       });
//       if (res.status) {
//         setBill(res?.data);
//         // Update currentStatus with the latest status from the bill
//         if (res?.data?.status) {
//           setCurrentStatus(Number(res.data.status));
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching bill: ", error);
//     }
//   };

//   useEffect(() => {
//     if (param) {
//       getBillHistory();
//       getBill();
//       getBillDetail();
//     }
//   }, [param]);

//   // Define timeline states
//   const timelineStates = [
//     {
//       status: 2,
//       label: "Chờ xác nhận",
//       icon: Images.iconWaitComfirm,
//       activeIcon: Images.iconWaitComfirm,
//     },
//     {
//       status: 4,
//       label: "Chờ giao hàng",
//       icon: Images.iconWaitDeliveryGray,
//       activeIcon: Images.iconWaitDelivery,
//     },
//     {
//       status: 5,
//       label: "Đang giao",
//       icon: Images.iconDeliveryFash,
//       activeIcon: Images.iconDeliveryFashRed,
//     },
//     {
//       status: 6,
//       label: "Hoàn thành",
//       icon: Images.iconUnboxGray,
//       activeIcon: Images.iconUnbox,
//     },
//     {
//       status: 7,
//       label: "Hủy",
//       // icon: Images.iconCancelGray, // Add your cancel icon
//       // activeIcon: Images.iconCancel, // Add your active cancel icon
//     },
//   ];

//   // Determine which states to display based on current status
//   let displayStates = [];

//   if (currentStatus === 7 && data?.some((item) => item.status === 4)) {
//     // If canceled at "Chờ giao hàng," show "Chờ xác nhận," "Chờ giao hàng," and "Hủy"
//     displayStates = timelineStates.filter((state) =>
//       [2, 4, 7].includes(state.status)
//     );
//   } else {
//     // Show all states up to and including the current status, excluding "Hủy" unless it's the current status
//     displayStates = timelineStates.filter(
//       (state) => state.status <= currentStatus && state.status !== 7
//     );
//   }

//   return (
//     <div className="w-[80%] mt-20 mx-auto min-h-screen">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-5">
//           <button onClick={() => navigate(-1)}>
//             <img
//               src={Images.iconBack}
//               alt=""
//               className="w-10 h-10 object-contain"
//             />
//           </button>
//           <span className="font-semibold">Trạng thái đơn hàng của bạn</span>
//         </div>
//         <div>
//           <span className="uppercase font-medium">
//             Mã đơn hàng: {param?.code}
//           </span>
//         </div>
//       </div>

//       {!!data && (
//         <ol className="sm:flex justify-between mt-20">
//           {displayStates.map((state, index) => {
//             const statusData = data.find((item) => item.status === state.status);
//             const isActive = state.status === currentStatus;

//             return (
//               <li
//                 key={state.status}
//                 className={`relative mb-6 sm:mb-0 ${
//                   displayStates.length === 1 ? "w-full" : "w-[25%]"
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <div className="z-1 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
//                     {state.icon && state.activeIcon ? (
//                       <img
//                         src={isActive ? state.activeIcon : state.icon}
//                         className="w-10 h-10 object-contain"
//                         alt={state.label}
//                       />
//                     ) : (
//                       <span
//                         className={`text-sm font-medium ${
//                           isActive ? "text-red-600" : "text-gray-500"
//                         }`}
//                       >
//                         {state.label}
//                       </span> // Fallback for "Hủy" until icons are added
//                     )}
//                   </div>
//                   {index < displayStates.length - 1 && (
//                     <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700" />
//                   )}
//                 </div>
//                 <div className="mt-3 sm:pe-8">
//                   <span
//                     className={`text-sm font-semibold ${
//                       isActive ? "text-red-600" : "text-gray-500"
//                     }`}
//                   >
//                     {state.label}
//                   </span>
//                   <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
//                     {statusData?.createAt
//                       ? formartDate(statusData.createAt)
//                       : ""}
//                   </time>
//                   {statusData?.note && (
//                     <span className="text-sm font-medium">
//                       Ghi chú: {statusData.note}
//                     </span>
//                   )}
//                 </div>
//               </li>
//             );
//           })}
//         </ol>
//       )}

//       {!!bill && !!billDetail && (
//         <div className="border-[1px] border-gray-300 mt-5 rounded">
//           <p className="font-semibold text-base m-4">Danh sách sản phẩm</p>
//           {billDetail.map((item, index) => (
//             <div
//               key={index}
//               className={`flex items-center gap-4 m-4 pb-4 ${
//                 index === billDetail.length - 1
//                   ? ""
//                   : "border-b-[1px] border-gray-300"
//               }`}
//             >
//               <img
//                 src={item?.images.split(",")[0]}
//                 alt=""
//                 className="w-20 h-20 object-contain"
//               />
//               <div className="flex flex-col justify-between h-20">
//                 <p className="text-xs font-semibold uppercase">{item?.name}</p>
//                 <div className="flex items-center gap-8">
//                   <p className="text-xs font-normal">
//                     Màu sắc: <span className="font-medium">{item?.color}</span>
//                   </p>
//                   <p className="text-xs font-normal">
//                     Số lượng: <span className="font-medium">{item?.quantity}</span>
//                   </p>
//                   <p className="text-xs font-normal">
//                     Kích thước: <span className="font-medium">{item?.size}</span>
//                   </p>
//                 </div>
//                 <p className="text-xs font-normal">
//                   Thành tiền :{" "}
//                   <span className="font-medium">
//                     {!!item?.discountValue
//                       ? convertToCurrencyString(
//                           item?.discountValue * item?.quantity
//                         )
//                       : convertToCurrencyString(item?.price * item?.quantity)}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!!bill && (
//         <div className="w-full border rounded-md mt-5 p-4 flex flex-col gap-4">
//           <h3 className="font-medium">Thông tin người nhận:</h3>
//           <p className="font-medium">
//             Tên khách hàng: <span className="font-normal">{bill?.customerName}</span>
//           </p>
//           {bill?.phoneNumber && (
//             <p className="font-medium">
//               Số điện thoại: <span className="font-normal">{bill?.phoneNumber}</span>
//             </p>
//           )}
//           <div className="flex items-center gap-2">
//             <span className="font-medium">Địa chỉ: </span>
//             <DetailAddress
//               spec={bill.address.split("##")[0]}
//               war={bill.address.split("##")[1]}
//               distr={bill.address.split("##")[2]}
//               prov={bill.address.split("##")[3]}
//             />
//           </div>
//           {bill?.note && (
//             <p className="font-medium">
//               Lưu ý: <span className="font-normal">{bill?.note}</span>
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimeLineOrder;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import API from "../../../api";
// import { toast } from "react-toastify";
// import { CustomError, IBill, IDetailOrder } from "../../../types/product.type";
// import { convertToCurrencyString } from "../../../utils/format";
// import DetailAddress from "../../information/address/detailAddress";
// import { formartDate } from "../../../utils/formatCurrency";
// import {
//   FaClock,
//   FaBox,
//   FaTruck,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";

// interface IData {
//   createAt: string;
//   createBy: string;
//   id: number;
//   index: number;
//   note: string;
//   status: number;
// }

// const TimeLineOrder = () => {
//   const param = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState<IData[]>();
//   const [bill, setBill] = useState<IBill>();
//   const [billDetail, setBillDetail] = useState<IDetailOrder[]>();
//   const [currentStatus, setCurrentStatus] = useState<number>(2);

//   // Fetch bill history
//   const getBillHistory = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getBillHistory(Number(param?.idBill)),
//       });
//       if (res.status) {
//         setData(res?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching bill history: ", error);
//     }
//   };

//   // Fetch bill details
//   const getBillDetail = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getDetailBill(Number(param?.idBill)),
//       });
//       if (res.status) {
//         setBillDetail(res?.data?.data);
//       }
//     } catch (error) {
//       if (typeof error === "string") {
//         toast.error(error);
//       } else if (error instanceof Error) {
//         const customError = error as CustomError;
//         if (customError.response && customError.response.data) {
//           toast.error(customError.response.data);
//         } else {
//           toast.error(customError.message);
//         }
//       } else {
//         toast.error("Hãy thử lại.");
//       }
//     }
//   };

//   // Fetch bill and update currentStatus
//   const getBill = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getSearchBill(param?.code ? param?.code : ""),
//       });
//       if (res.status) {
//         const billData = res?.data;
//         billData.address = billData.address || "";
//         setBill(billData);
//         if (billData?.status) {
//           setCurrentStatus(Number(billData.status));
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching bill: ", error);
//     }
//   };

//   useEffect(() => {
//     if (param) {
//       getBillHistory();
//       getBill();
//       getBillDetail();
//     }
//   }, [param]);

//   // Define timeline states
//   const timelineStates = [
//     {
//       status: 1,
//       label: "Tạo đơn hàng",
//       icon: <FaClock />,
//       color: "orange-500",
//     },
//     {
//       status: 2,
//       label: "Chờ xác nhận",
//       icon: <FaClock />,
//       color: "orange-500",
//     },
//     { status: 4, label: "Chờ giao hàng", icon: <FaBox />, color: "blue-500" },
//     { status: 5, label: "Đang giao", icon: <FaTruck />, color: "purple-500" },
//     {
//       status: 6,
//       label: "Hoàn thành",
//       icon: <FaCheckCircle />,
//       color: "green-500",
//     },
//     { status: 7, label: "Hủy", icon: <FaTimesCircle />, color: "red-500" },
//   ];

//   // Determine which states to display
//   let displayStates = [];
//   if (currentStatus === 7 && data?.some((item) => item.status === 4)) {
//     displayStates = timelineStates.filter((state) =>
//       [2, 4, 7].includes(state.status)
//     );
//   } else {
//     displayStates = timelineStates.filter(
//       (state) => state.status <= currentStatus && state.status !== 7
//     );
//   }

//   // Placeholder for getStatusText (replace with actual implementation)
//   const getStatusText = (status: number) => {
//     const state = timelineStates.find((s) => s.status === status);
//     return state ? state.label : "Không xác định";
//   };

//   // Placeholder for statusPayment (replace with actual logic)

//   // Assuming formatCurrency is similar to convertToCurrencyString
//   const formatCurrency = (value: number) => convertToCurrencyString(value);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 bg-indigo-50 border-b border-gray-200">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
//               aria-label="Go back"
//             >
//               <svg
//                 className="w-6 h-6 text-indigo-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <h1 className="text-2xl font-bold text-indigo-900">
//               Theo Dõi Đơn Hàng
//             </h1>
//           </div>
//           <div className="text-sm font-medium text-indigo-700">
//             Mã đơn hàng:{" "}
//             <span className="uppercase font-semibold">{param?.code}</span>
//           </div>
//         </div>

//         {/* Timeline */}
//         {!!data && (
//           <div className="p-6 relative">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">
//               Trạng Thái Đơn Hàng
//             </h2>
//             <div className="relative flex justify-between items-start overflow-hidden">
//               {displayStates.map((state, index) => {
//                 const statusData = data.find(
//                   (item) => item.status === state.status
//                 );
//                 const isActive = state.status === currentStatus;
//                 const isCompleted = state.status < currentStatus;
//                 const lineColor =
//                   isCompleted || isActive ? `bg-${state.color}` : "bg-gray-300";

//                 return (
//                   <div
//                     key={state.status}
//                     className="flex-1 flex flex-col items-center relative z-0"
//                   >
//                     {index < displayStates.length - 1 && (
//                       <div
//                         className={`absolute top-5 left-1/2 w-1/2 h-1 ${lineColor}`}
//                         style={{ left: "50%", width: "calc(100% - 2.5rem)" }}
//                       />
//                     )}
//                     <div
//                       className={`relative flex items-center justify-center w-10 h-10 rounded-full z-10 transition-all duration-300 ${
//                         isActive || isCompleted
//                           ? `bg-${state.color} text-white`
//                           : "bg-gray-200 text-gray-400"
//                       }`}
//                     >
//                       {state.icon}
//                     </div>
//                     <div className="mt-4 text-center min-h-[80px]">
//                       <span
//                         className={`block text-sm font-semibold ${
//                           isActive || isCompleted
//                             ? `text-${state.color}`
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {state.label}
//                       </span>
//                       <time className="block text-xs text-gray-500 mt-1">
//                         {statusData?.createAt
//                           ? formartDate(statusData.createAt)
//                           : ""}
//                       </time>
//                       {statusData?.note && (
//                         <span className="block text-xs text-gray-600 mt-1">
//                           Ghi chú: {statusData.note}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Bill Summary */}
//         {!!bill && (
//           <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-sm text-gray-600">Mã phiếu gửi</p>
//                 <p className="font-medium text-gray-900">{bill.code}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Ngày tạo đơn</p>
//                 <p className="font-medium text-gray-900">
//                   {formartDate(bill.createAt)}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600">Tổng tiền hàng</p>
//                 <p className="font-medium text-red-600">
//                   {formatCurrency(bill.totalMoney + bill.moneyReduce)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Phí vận chuyển</p>
//                 <p className="font-medium text-gray-900">
//                   {formatCurrency(bill.moneyShip)}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600">
//                   Tổng tiền phải thanh toán
//                 </p>
//                 <p className="font-medium text-red-600">
//                   {formatCurrency(bill.totalMoney + bill.moneyShip)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Giảm giá</p>
//                 <p className="font-medium text-red-600">
//                   {formatCurrency(bill.moneyReduce)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Recipient Info */}
//         {!!bill && (
//           <div className="p-6 border-t border-gray-200 relative z-10">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">
//               Thông Tin Người Nhận
//             </h2>
//             <div className="bg-gray-50 rounded-xl p-6 space-y-3">
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold text-gray-800">
//                   Tên khách hàng:
//                 </span>{" "}
//                 {bill?.customerName}
//               </p>
//               {bill?.phoneNumber && (
//                 <p className="text-sm text-gray-700">
//                   <span className="font-semibold text-gray-800">
//                     Số điện thoại:
//                   </span>{" "}
//                   {bill?.phoneNumber}
//                 </p>
//               )}
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold text-gray-800">Địa chỉ:</span>{" "}
//                 {bill?.address && bill.address !== "" ? (
//                   <DetailAddress
//                     spec={bill.address.split("##")[0]}
//                     war={bill.address.split("##")[1]}
//                     distr={bill.address.split("##")[2]}
//                     prov={bill.address.split("##")[3]}
//                   />
//                 ) : (
//                   "Tại cửa hàng"
//                 )}
//               </p>
//               {bill?.note && (
//                 <p className="text-sm text-gray-700">
//                   <span className="font-semibold text-gray-800">Lưu ý:</span>{" "}
//                   {bill?.note}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Product List */}
//         {!!bill && !!billDetail && (
//           <div className="p-6 border-t border-gray-200 relative z-15">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">
//               Sản Phẩm Đã Đặt
//             </h2>
//             <div className="space-y-4">
//               {billDetail.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 relative z-15"
//                 >
//                   <img
//                     src={item?.images.split(",")[0]}
//                     alt={item?.name}
//                     className="w-20 h-20 object-contain rounded-lg border border-gray-200"
//                   />
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold uppercase text-gray-800">
//                       {item?.name}
//                     </p>
//                     <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-1">
//                       <p>
//                         Màu sắc:{" "}
//                         <span className="font-medium">{item?.color}</span>
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
//                     <p className="text-sm text-gray-700 mt-2">
//                       Thành tiền:{" "}
//                       <span className="font-semibold text-indigo-600">
//                         {!!item?.discountValue
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

// export default TimeLineOrder;





// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import API from "../../../api";
// import { toast } from "react-toastify";
// import { CustomError, IBill, IDetailOrder } from "../../../types/product.type";
// import { convertToCurrencyString } from "../../../utils/format";
// import DetailAddress from "../../information/address/detailAddress";
// import { formartDate } from "../../../utils/formatCurrency";
// import {
//   FaClock,
//   FaBox,
//   FaTruck,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";

// interface IData {
//   createAt: string;
//   createBy: string;
//   id: number;
//   index: number;
//   note: string;
//   status: number;
// }

// const TimeLineOrder = () => {
//   const param = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState<IData[]>();
//   const [bill, setBill] = useState<IBill>();
//   const [billDetail, setBillDetail] = useState<IDetailOrder[]>();
//   const [currentStatus, setCurrentStatus] = useState<number>(2);

//   // Fetch bill history
//   const getBillHistory = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getBillHistory(Number(param?.idBill)),
//       });
//       if (res.status) {
//         setData(res?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching bill history: ", error);
//     }
//   };

//   // Fetch bill details
//   const getBillDetail = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getDetailBill(Number(param?.idBill)),
//       });
//       if (res.status) {
//         setBillDetail(res?.data?.data);
//       }
//     } catch (error) {
//       if (typeof error === "string") {
//         toast.error(error);
//       } else if (error instanceof Error) {
//         const customError = error as CustomError;
//         if (customError.response && customError.response.data) {
//           toast.error(customError.response.data);
//         } else {
//           toast.error(customError.message);
//         }
//       } else {
//         toast.error("Hãy thử lại.");
//       }
//     }
//   };

//   // Fetch bill and update currentStatus
//   const getBill = async () => {
//     try {
//       const res = await axios({
//         method: "get",
//         url: API.getSearchBill(param?.code ? param?.code : ""),
//       });
//       if (res.status) {
//         const billData = res?.data;
//         billData.address = billData.address || "";
//         setBill(billData);
//         if (billData?.status) {
//           setCurrentStatus(Number(billData.status));
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching bill: ", error);
//     }
//   };

//   useEffect(() => {
//     if (param) {
//       getBillHistory();
//       getBill();
//       getBillDetail();
//     }
//   }, [param]);

//   // Define timeline states
//   const timelineStates = [
//     {
//       status: 1,
//       label: "Tạo đơn hàng",
//       icon: <FaClock />,
//       color: "orange-500",
//     },
//     {
//       status: 2,
//       label: "Chờ xác nhận",
//       icon: <FaClock />,
//       color: "orange-500",
//     },
//     { status: 4, label: "Chờ giao hàng", icon: <FaBox />, color: "blue-500" },
//     { status: 5, label: "Đang giao", icon: <FaTruck />, color: "purple-500" },
//     {
//       status: 6,
//       label: "Hoàn thành",
//       icon: <FaCheckCircle />,
//       color: "green-500",
//     },
//     { status: 7, label: "Hủy", icon: <FaTimesCircle />, color: "red-500" },
//   ];

//   // Determine which states to display
//   let displayStates = [];
//   if (currentStatus === 7 && data?.some((item) => item.status === 4)) {
//     displayStates = timelineStates.filter((state) =>
//       [2, 4, 7].includes(state.status)
//     );
//   } else {
//     displayStates = timelineStates.filter(
//       (state) => state.status <= currentStatus && state.status !== 7
//     );
//   }

//   // Placeholder for getStatusText
//   const getStatusText = (status: number) => {
//     const state = timelineStates.find((s) => s.status === status);
//     return state ? state.label : "Không xác định";
//   };

//   // Assuming formatCurrency is similar to convertToCurrencyString
//   const formatCurrency = (value: number) => convertToCurrencyString(value);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 bg-indigo-50 border-b border-gray-200">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
//               aria-label="Go back"
//             >
//               <svg
//                 className="w-6 h-6 text-indigo-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <h1 className="text-2xl font-bold text-indigo-900">
//               Theo Dõi Đơn Hàng
//             </h1>
//           </div>
//           <div className="text-sm font-medium text-indigo-700">
//             Mã đơn hàng:{" "}
//             <span className="uppercase font-semibold">{param?.code}</span>
//           </div>
//         </div>

//         {/* Timeline */}
//         {!!data && (
//           <div className="p-6 relative">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">
//               Trạng Thái Đơn Hàng
//             </h2>
//             <div className="relative flex justify-between items-start overflow-hidden">
//               {displayStates.map((state, index) => {
//                 const statusData = data.find(
//                   (item) => item.status === state.status
//                 );
//                 // Ẩn trạng thái nếu không có note
//                 if (!statusData?.note) {
//                   return null;
//                 }
//                 const isActive = state.status === currentStatus;
//                 const isCompleted = state.status < currentStatus;
//                 const lineColor =
//                   isCompleted || isActive ? `bg-${state.color}` : "bg-gray-300";

//                 return (
//                   <div
//                     key={state.status}
//                     className="flex-1 flex flex-col items-center relative z-0"
//                   >
//                     {index < displayStates.length - 1 && (
//                       <div
//                         className={`absolute top-5 left-1/2 w-1/2 h-1 ${lineColor}`}
//                         style={{ left: "50%", width: "calc(100% - 2.5rem)" }}
//                       />
//                     )}
//                     <div
//                       className={`relative flex items-center justify-center w-10 h-10 rounded-full z-10 transition-all duration-300 ${
//                         isActive || isCompleted
//                           ? `bg-${state.color} text-white`
//                           : "bg-gray-200 text-gray-400"
//                       }`}
//                     >
//                       {state.icon}
//                     </div>
//                     <div className="mt-4 text-center min-h-[80px]">
//                       <span
//                         className={`block text-sm font-semibold ${
//                           isActive || isCompleted
//                             ? `text-${state.color}`
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {state.label}
//                       </span>
//                       <time className="block text-xs text-gray-500 mt-1">
//                         {statusData?.createAt
//                           ? formartDate(statusData.createAt)
//                           : ""}
//                       </time>
//                       {statusData?.note && (
//                         <span className="block text-xs text-gray-600 mt-1">
//                           Ghi chú: {statusData.note}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Bill Summary */}
//         {!!bill && (
//           <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-sm text-gray-600">Mã phiếu gửi</p>
//                 <p className="font-medium text-gray-900">{bill.code}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Ngày tạo đơn</p>
//                 <p className="font-medium text-gray-900">
//                   {formartDate(bill.createAt)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Tổng tiền hàng</p>
//                 <p className="font-medium text-red-600">
//                   {formatCurrency(bill.totalMoney + bill.moneyReduce)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Phí vận chuyển</p>
//                 <p className="font-medium text-gray-900">
//                   {formatCurrency(bill.moneyShip)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">
//                   Tổng tiền phải thanh toán
//                 </p>
//                 <p className="font-medium text-red-600">
//                   {formatCurrency(bill.totalMoney + bill.moneyShip)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Giảm giá</p>
//                 <p className="font-medium text-red-600">
//                   {formatCurrency(bill.moneyReduce)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Recipient Info */}
//         {!!bill && (
//           <div className="p-6 border-t border-gray-200 relative z-10">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">
//               Thông Tin Người Nhận
//             </h2>
//             <div className="bg-gray-50 rounded-xl p-6 space-y-3">
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold text-gray-800">
//                   Tên khách hàng:
//                 </span>{" "}
//                 {bill?.customerName}
//               </p>
//               {bill?.phoneNumber && (
//                 <p className="text-sm text-gray-700">
//                   <span className="font-semibold text-gray-800">
//                     Số điện thoại:
//                   </span>{" "}
//                   {bill?.phoneNumber}
//                 </p>
//               )}
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold text-gray-800">Địa chỉ:</span>{" "}
//                 {bill?.address && bill.address !== "" ? (
//                   <DetailAddress
//                     spec={bill.address.split("##")[0]}
//                     war={bill.address.split("##")[1]}
//                     distr={bill.address.split("##")[2]}
//                     prov={bill.address.split("##")[3]}
//                   />
//                 ) : (
//                   "Tại cửa hàng"
//                 )}
//               </p>
//               {bill?.note && (
//                 <p className="text-sm text-gray-700">
//                   <span className="font-semibold text-gray-800">Lưu ý:</span>{" "}
//                   {bill?.note}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Product List */}
//         {!!bill && !!billDetail && (
//           <div className="p-6 border-t border-gray-200 relative z-15">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">
//               Sản Phẩm Đã Đặt
//             </h2>
//             <div className="space-y-4">
//               {billDetail.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 relative z-15"
//                 >
//                   <img
//                     src={item?.images.split(",")[0]}
//                     alt={item?.name}
//                     className="w-20 h-20 object-contain rounded-lg border border-gray-200"
//                   />
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold uppercase text-gray-800">
//                       {item?.name}
//                     </p>
//                     <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-1">
//                       <p>
//                         Màu sắc:{" "}
//                         <span className="font-medium">{item?.color}</span>
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
//                     <p className="text-sm text-gray-700 mt-2">
//                       Thành tiền:{" "}
//                       <span className="font-semibold text-indigo-600">
//                         {!!item?.discountValue
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

// export default TimeLineOrder;




import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API from "../../../api";
import { toast } from "react-toastify";
import { CustomError, IBill, IDetailOrder } from "../../../types/product.type";
import { convertToCurrencyString } from "../../../utils/format";
import DetailAddress from "../../information/address/detailAddress";
import { formartDate } from "../../../utils/formatCurrency";
import {
  FaClock,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface IData {
  createAt: string;
  createBy: string;
  id: number;
  index: number;
  note: string;
  status: number;
}

const TimeLineOrder = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<IData[]>();
  const [bill, setBill] = useState<IBill>();
  const [billDetail, setBillDetail] = useState<IDetailOrder[]>();
  const [currentStatus, setCurrentStatus] = useState<number>(2);

  // Fetch bill history
  const getBillHistory = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getBillHistory(Number(param?.idBill)),
      });
      if (res.status) {
        setData(res?.data);
      }
    } catch (error) {
      console.error("Error fetching bill history: ", error);
    }
  };

  // Fetch bill details
  const getBillDetail = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getDetailBill(Number(param?.idBill)),
      });
      if (res.status) {
        setBillDetail(res?.data?.data);
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
    }
  };

  // Fetch bill and update currentStatus
  const getBill = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getSearchBill(param?.code ? param?.code : ""),
      });
      if (res.status) {
        const billData = res?.data;
        billData.address = billData.address || "";
        setBill(billData);
        if (billData?.status) {
          setCurrentStatus(Number(billData.status));
        }
      }
    } catch (error) {
      console.error("Error fetching bill: ", error);
    }
  };

  useEffect(() => {
    if (param) {
      getBillHistory();
      getBill();
      getBillDetail();
    }
  }, [param]);

  // Define timeline states
  const timelineStates = [
    {
      status: 1,
      label: "Tạo đơn hàng",
      icon: <FaClock />,
      color: "orange-500",
    },
    {
      status: 2,
      label: "Chờ xác nhận",
      icon: <FaClock />,
      color: "orange-500",
    },
    {
      status: 9,
      label: "Đã xác nhận",
      icon: <FaCheckCircle />,
      color: "green-400",
    },
    { status: 4, label: "Chờ giao hàng", icon: <FaBox />, color: "blue-500" },
    { status: 5, label: "Đang giao hàng", icon: <FaTruck />, color: "purple-500" },
    {
      status: 6,
      label: "Hoàn thành",
      icon: <FaCheckCircle />,
      color: "green-500",
    },
    { status: 7, label: "Hủy", icon: <FaTimesCircle />, color: "red-500" },
  ];

  // Determine which states to display
  const displayStates = () => {
    if (currentStatus === 7) {
      // For canceled orders, show only statuses present in data
      return timelineStates.filter(
        (state) =>
          [2, 4, 7, 9].includes(state.status) &&
          data?.some((item) => item.status === state.status)
      );
    }
    // For non-canceled orders, show steps up to current status or status 9 if in history
    return timelineStates.filter(
      (state) =>
        (state.status <= currentStatus && state.status !== 7) ||
        (state.status === 9 && data?.some((item) => item.status === 9))
    );
  };

  // Placeholder for getStatusText
  const getStatusText = (status: number) => {
    const state = timelineStates.find((s) => s.status === status);
    return state ? state.label : "Không xác định";
  };

  // Assuming formatCurrency is similar to convertToCurrencyString
  const formatCurrency = (value: number) => convertToCurrencyString(value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-indigo-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
              aria-label="Go back"
            >
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-indigo-900">
              Theo Dõi Đơn Hàng
            </h1>
          </div>
          <div className="text-sm font-medium text-indigo-700">
            Mã đơn hàng:{" "}
            <span className="uppercase font-semibold">{param?.code}</span>
          </div>
        </div>

        {/* Timeline */}
        {!!data && (
          <div className="p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Trạng Thái Đơn Hàng
            </h2>
            <div className="relative flex justify-between items-start overflow-hidden">
              {displayStates().map((state, index) => {
                const statusData = data.find(
                  (item) => item.status === state.status
                );
                // Ẩn trạng thái nếu không có note
                if (!statusData?.note) {
                  return null;
                }
                const isActive = state.status === currentStatus;
                const isCompleted =
                  state.status < currentStatus ||
                  (state.status === 9 &&
                    data.some((item) => item.status === 9));
                const lineColor =
                  isCompleted || isActive ? `bg-${state.color}` : "bg-gray-300";

                return (
                  <div
                    key={state.status}
                    className="flex-1 flex flex-col items-center relative z-0"
                  >
                    {index < displayStates().length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-1/2 h-1 ${lineColor}`}
                        style={{ left: "50%", width: "calc(100% - 2.5rem)" }}
                      />
                    )}
                    <div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full z-10 transition-all duration-300 ${
                        isActive || isCompleted
                          ? `bg-${state.color} text-white`
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {state.icon}
                    </div>
                    <div className="mt-4 text-center min-h-[80px]">
                      <span
                        className={`block text-sm font-semibold ${
                          isActive || isCompleted
                            ? `text-${state.color}`
                            : "text-gray-500"
                        }`}
                      >
                        {state.label}
                      </span>
                      <time className="block text-xs text-gray-500 mt-1">
                        {statusData?.createAt
                          ? formartDate(statusData.createAt)
                          : ""}
                      </time>
                      {statusData?.note && (
                        <span className="block text-xs text-gray-600 mt-1">
                          Ghi chú: {statusData.note}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bill Summary */}
        {!!bill && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Mã phiếu gửi</p>
                <p className="font-medium text-gray-900">{bill.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày tạo đơn</p>
                <p className="font-medium text-gray-900">
                  {formartDate(bill.createAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng tiền hàng</p>
                <p className="font-medium text-red-600">
                  {formatCurrency(bill.totalMoney + bill.moneyReduce)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phí vận chuyển</p>
                <p className="font-medium text-gray-900">
                  {formatCurrency(bill.moneyShip)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Tổng tiền phải thanh toán
                </p>
                <p className="font-medium text-red-600">
                  {formatCurrency(bill.totalMoney + bill.moneyShip)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Giảm giá</p>
                <p className="font-medium text-red-600">
                  {formatCurrency(bill.moneyReduce)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recipient Info */}
        {!!bill && (
          <div className="p-6 border-t border-gray-200 relative z-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Thông Tin Người Nhận
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-800">
                  Tên khách hàng:
                </span>{" "}
                {bill?.customerName}
              </p>
              {bill?.phoneNumber && (
                <p className="text-sm text-gray-700">
                  <span className ="font-semibold text-gray-800">
                    Số điện thoại:
                  </span>{" "}
                  {bill?.phoneNumber}
                </p>
              )}
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-800">Địa chỉ:</span>{" "}
                {bill?.address && bill.address !== "" ? (
                  <DetailAddress
                    spec={bill.address.split("##")[0]}
                    war={bill.address.split("##")[1]}
                    distr={bill.address.split("##")[2]}
                    prov={bill.address.split("##")[3]}
                  />
                ) : (
                  "Tại cửa hàng"
                )}
              </p>
              {bill?.note && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-800">Lưu ý:</span>{" "}
                  {bill?.note}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Product List */}
        {!!bill && !!billDetail && (
          <div className="p-6 border-t border-gray-200 relative z-15">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Sản Phẩm Đã Đặt
            </h2>
            <div className="space-y-4">
              {billDetail.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 relative z-15"
                >
                  <img
                    src={item?.images.split(",")[0]}
                    alt={item?.name}
                    className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold uppercase text-gray-800">
                      {item?.name}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-1">
                      <p>
                        Màu sắc:{" "}
                        <span className="font-medium">{item?.color}</span>
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
                    <p className="text-sm text-gray-700 mt-2">
                      Thành tiền:{" "}
                      <span className="font-semibold text-indigo-600">
                        {!!item?.discountValue
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

export default TimeLineOrder;