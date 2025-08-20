// import React, { useState, useEffect } from "react";
// import ShippingProcess from "../../components/shippingProcess";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   CustomError,
//   IDetailProductCart2,
//   IVoucher,
// } from "../../types/product.type";
// import {
//   convertToCurrencyString,
//   regexPhoneNumber,
//   validateEmail,
// } from "../../utils/format";
// import { useShoppingCart } from "../../context/shoppingCart.context";
// import { formatCurrency } from "../../utils/formatCurrency";
// import API, { baseUrl } from "../../api";
// import ModalComponent from "../../components/Modal";
// import { configApi } from "../../utils/config";
// import { toast } from "react-toastify";
// import Images from "../../static";
// import ShowVoucherList from "./showVoucherList";
// interface Province {
//   ProvinceID: number;
//   ProvinceName: string;
// }
// interface District {
//   DistrictID: number;
//   DistrictName: string;
// }
// interface Ward {
//   WardCode: number;
//   WardName: string;
// }

// const ItemPayMent = ({ item }: { item: any }) => {
//   const [inforShoe, setInforShoe] = useState<IDetailProductCart2>();
//   const getDetailShoeWithId = async () => {
//     const res = await axios({
//       method: "get",
//       url: API.getShoeDetailWithId(item?.id),
//     });
//     if (res.status) {
//       setInforShoe(res?.data?.data);
//     }
//   };
//   useEffect(() => {
//     getDetailShoeWithId();
//   }, [item?.id]);
//   return (
//     <div
//       className={`flex px-6 py-2 w-full border-b-[1px] border-gray-500 border-dashed `}
//     >
//       {
//         <img
//           className="h-[90px] w-[80px] object-contain "
//           src={inforShoe?.images.split(",")[0]}
//         />
//       }
//       <div className="flex-1">
//         <div className="flex flex-col justify-between ml-4 flex-grow w-full h-full ">
//           <span className="font-bold text-sm  ">{inforShoe?.name}</span>
//           <span className="text-red-500 text-xs font-medium">
//             <span className="text-xs font-medium  text-[#333333]">
//               Loại đế:
//             </span>{" "}
//             {inforShoe?.sole}
//           </span>
//           <p className="  text-xs font-medium  text-[#333333]  ">
//             Số lượng: {item?.quantity}
//           </p>
//           <div className="flex justify-between  ">
//             <div className="flex  ">
//               <span className="text-xs font-medium  text-[#333333]  ">
//                 Giá:
//               </span>
//               {inforShoe?.discountValue ? (
//                 <div className="flex items-center gap-1 ml-1 ">
//                   <span className="text-xs font-medium line-through text-gray-400">
//                     {convertToCurrencyString(inforShoe?.price)}
//                   </span>
//                   <span className="text-xs font-medium text-red-500">
//                     {" "}
//                     {convertToCurrencyString(inforShoe?.discountValue)}
//                   </span>
//                 </div>
//               ) : (
//                 inforShoe?.price && (
//                   <span className="text-xs font-medium text-red-500 ml-1 ">
//                     {convertToCurrencyString(inforShoe?.price)}
//                   </span>
//                 )
//               )}
//             </div>
//             <span className="text-center  font-medium text-xs w-[45%] text-red-700">
//               <span className="text-[#666666]">Thành tiền: </span>
//               {!!inforShoe?.discountValue
//                 ? formatCurrency(item.quantity * inforShoe?.discountValue)
//                 : inforShoe?.price &&
//                   formatCurrency(inforShoe?.price * item.quantity)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// const PaymentPage = () => {
//   const navigate = useNavigate();
//   const { cartItems, clearCart } = useShoppingCart();
//   const [showModal, setShowMoal] = useState<boolean>(false);
//   const [percent, setPrecent] = useState<number>(0);
//   const [radioChoose, setRadioChoose] = React.useState<number>(0);
//   const [voucher, setVoucher] = useState<number | null>(null);
//   const [provinces, setProvinces] = useState<Province[]>([]);
//   const [selectedProvince, setSelectedProvince] = useState<number>();
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [selectedDistrict, setSelectedDistrict] = useState<number>();
//   const [wards, setWards] = useState<Ward[]>([]);
//   const [selectedWard, setSelectedWard] = useState<number>();
//   const [specificAddress, setSpecificAddress] = useState<string>(" ");
//   const [codeVoucher, setCodeVoucher] = useState<string>();
//   const [feeShip, setFeeShip] = useState(0);
//   const [listDetailShoe, setListDetailShoe] = useState<IDetailProductCart2[]>();
//   const [textHVT, setTextHVT] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [note, setNote] = useState<string>("");
//   const [paymentMethod, setPaymentMethod] = useState<number>(0);
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const getDetailShoe = async () => {
//     const res = await axios({
//       method: "get",
//       url: API.getAllShoeDetail(),
//     });
//     if (res.status) {
//       setListDetailShoe(res?.data?.data);
//     }
//   };
//   const postBill = async () => {
//     if (textHVT === "" || textHVT === null || textHVT === undefined) {
//       toast.warning("Không được để trống họ và tên");
//     } else if (email === "" || email === null || email === undefined) {
//       toast.warning("Không được để email");
//     } else if (!regexPhoneNumber.test(phoneNumber)) {
//       toast.warning("Số điện không hợp lệ");
//     } else if (!validateEmail(email)) {
//       toast.warning("Email không hợp lệ");
//     } else if (
//       selectedDistrict === null ||
//       selectedDistrict === undefined ||
//       selectedProvince === null ||
//       selectedProvince === undefined ||
//       selectedWard === null ||
//       selectedWard === undefined ||
//       specificAddress === null ||
//       specificAddress === undefined ||
//       specificAddress === " "
//     ) {
//       toast.warning("Không được để trống địa chỉ");
//     } else if (paymentMethod === null || paymentMethod === undefined) {
//       toast.warning("Hãy chọn phương thức thanh toán");
//     } else {
//       if (listDetailShoe) {
//         try {
//           const newBill = {
//             customerName: textHVT,
//             email: email,
//             phoneNumber: phoneNumber,
//             voucher: voucher ? voucher : null,
//             district: selectedDistrict,
//             province: selectedProvince,
//             ward: selectedWard,
//             specificAddress: specificAddress,
//             moneyShip: Number(feeShip),
//             moneyReduce:
//               (percent / 100) *
//               cartItems.reduce((total, cartItem) => {
//                 const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                 return (
//                   total +
//                   (item?.discountValue
//                     ? item?.discountValue
//                     : item?.price || 0) *
//                     cartItem.quantity
//                 );
//               }, 0),
//             totalMoney:
//               cartItems.reduce((total, cartItem) => {
//                 const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                 return (
//                   total +
//                   (item?.discountValue
//                     ? item?.discountValue
//                     : item?.price || 0) *
//                     cartItem.quantity
//                 );
//               }, 0) -
//               (percent / 100) *
//                 cartItems.reduce((total, cartItem) => {
//                   const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                   return (
//                     total +
//                     (item?.discountValue
//                       ? item?.discountValue
//                       : item?.price || 0) *
//                       cartItem.quantity
//                   );
//                 }, 0),
//             note: note,
//             paymentMethod: paymentMethod,
//             carts: cartItems,
//           };

//           if (radioChoose === 0) {
//             const response = await axios.post(
//               baseUrl + "api/bill/create-bill-client",
//               newBill
//             );
//             if (response.status) {
//               toast.success("Đặt hàng thành công");
//               navigate(
//                 `/showBillCheck/${response?.data?.data?.data?.id}/${response?.data?.data?.data?.code}`
//               );
//               clearCart();
//             }
//           }
//           if (radioChoose === 1) {
//             const tempNewBill = { ...newBill, id: generateUUID() };
//             console.log("tempNewBill", tempNewBill);
//             localStorage.setItem("checkout", JSON.stringify(tempNewBill));
//             try {
//               const response = await axios.get(
//                 baseUrl +
//                   `api/vn-pay/payment?id=${tempNewBill.id}&total=${
//                     cartItems.reduce((total, cartItem) => {
//                       const item = listDetailShoe.find(
//                         (i) => i.id === cartItem.id
//                       );
//                       return (
//                         total +
//                         (item?.discountValue
//                           ? item?.discountValue
//                           : item?.price || 0) *
//                           cartItem.quantity
//                       );
//                     }, 0) +
//                     feeShip -
//                     (percent / 100) *
//                       cartItems.reduce((total, cartItem) => {
//                         const item = listDetailShoe.find(
//                           (i) => i.id === cartItem.id
//                         );
//                         return (
//                           total +
//                           (item?.discountValue
//                             ? item?.discountValue
//                             : item?.price || 0) *
//                             cartItem.quantity
//                         );
//                       }, 0)
//                   }`
//               );
//               if (response.status) {
//                 window.location.href = response.data.data;
//               }
//             } catch (error) {
//               if (typeof error === "string") {
//                 toast.error(error);
//               } else if (error instanceof Error) {
//                 const customError = error as CustomError;
//                 if (customError.response && customError.response.data) {
//                   toast.error(customError.response.data);
//                 } else {
//                   toast.error(customError.message);
//                 }
//               } else {
//                 toast.error("Hãy thử lại.");
//               }
//             }
//           }
//         } catch (error) {
//           if (typeof error === "string") {
//             toast.error(error);
//           } else if (error instanceof Error) {
//             const customError = error as CustomError;
//             if (customError.response && customError.response.data) {
//               toast.error(customError.response.data);
//             } else {
//               toast.error(customError.message);
//             }
//           } else {
//             toast.error("Hãy thử lại.");
//           }
//         }
//       }
//     }
//   };
//   function generateUUID() {
//     var d = new Date().getTime();
//     var d2 =
//       (typeof performance !== "undefined" &&
//         performance.now &&
//         performance.now() * 1000) ||
//       0;
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
//       /[xy]/g,
//       function (c) {
//         var r = Math.random() * 16;
//         if (d > 0) {
//           r = (d + r) % 16 | 0;
//           d = Math.floor(d / 16);
//         } else {
//           r = (d2 + r) % 16 | 0;
//           d2 = Math.floor(d2 / 16);
//         }
//         return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
//       }
//     );
//   }
//   const caculateFee = async () => {
//     try {
//       const response = await axios.post(
//         "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
//         {
//           service_id: 53321,
//           service_type_id: 2,
//           to_district_id: Number(selectedDistrict),
//           to_ward_code: selectedWard,
//           height: 50,
//           length: 20,
//           weight: 200,
//           width: 20,
//           cod_failed_amount: 2000,
//           insurance_value: 10000,
//           coupon: null,
//         },
//         {
//           headers: {
//             Token: "650687b2-f5c1-11ef-9bc9-aecca9e2a07c",
//             "Content-Type": "application/json",
//             ShopId: 2483458,
//           },
          
//         }
//       );
//       setFeeShip(response?.data?.data?.total);
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };
//   const fetchProvinces = async () => {
//     try {
//       const response = await axios.get(
//         "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
//         configApi
//       );
//       setProvinces(response?.data?.data);
//       setSelectedProvince(response?.data?.data[0]?.ProvinceID);
//     } catch (error) {
//       console.error("Lỗi:", error);
//     }
//   };
//   const fetchDistrictsByProvince = async (provinceId: number) => {
//     try {
//       const response = await axios.get(
//         `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
//         configApi
//       );
//       setDistricts(response?.data?.data);
//       setSelectedDistrict(response?.data?.data[0]?.DistrictID);
//     } catch (error) {
//       console.error("Error fetching districts:", error);
//     }
//   };

//   const fetchWardsByDistrict = async (districtId: number) => {
//     try {
//       const response = await axios.get(
//         `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
//         configApi
//       );
//       setWards(response.data.data);
//       setSelectedWard(response?.data?.data[0]?.WardCode);
//     } catch (error) {
//       console.error("Error fetching wards:", error);
//     }
//   };
//   useEffect(() => {
//     getDetailShoe();
//     fetchProvinces();
//   }, []);
//   useEffect(() => {
//     if (selectedProvince) {
//       fetchDistrictsByProvince(selectedProvince);
//     }
//   }, [selectedProvince]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       fetchWardsByDistrict(selectedDistrict);
//     }
//   }, [selectedDistrict]);

//   useEffect(() => {
//     if (selectedWard !== undefined) {
//       caculateFee();
//     } else {
//       return;
//     }
//   }, [selectedWard]);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPaymentMethod(parseInt(event.target.value, 10));
//     setRadioChoose(parseInt(event.target.value, 10));
//   };
//   return (
//     <div className="w-full h-full">
//       <ShippingProcess type={2} />
//       <div className="grid sm:px-5 lg:grid-cols-2 lg:px-10 xl:px-10 shadow-md my-10 bg-[#f9fafb] py-4">
//         <div className="px-4 ">
//           <p className="text-base font-medium text-black mt-3">
//             Trang Thanh Toán
//           </p>
//           <p className="text-gray-400 text-sm">
//             Kiểm tra các mặt hàng của bạn. Và chọn một phương thức vận chuyển
//             phù hợp.
//           </p>

//           {!!cartItems && cartItems.length ? (
//             <div className="mt-4 space-y-3  bg-white overflow-y-scroll h-[360px] ">
//               {cartItems.map((item, index) => {
//                 return <ItemPayMent item={item} key={index} />;
//               })}
//             </div>
//           ) : (
//             <img src={Images.isEmtyCart} className="h-72  mx-auto" />
//           )}

//           <div className=" w-full   mt-2">
//             <div className="flex gap-5 items-center mb-1">
//               <span className=" text-sm font-medium"> ÁP DỤNG MÃ GIẢM GIÁ</span>
//               {!!codeVoucher && (
//                 <div className="relative">
//                   <p className="font-semibold bg-blue-600 px-2  rounded text-white">
//                     {codeVoucher}
//                   </p>
//                   <div
//                     className="bg-blue-600 rounded-full p-[1px] absolute -top-1 -right-1 cursor-pointer "
//                     onClick={() => {
//                       setPrecent(0);
//                       setCodeVoucher("");
//                     }}
//                   >
//                     <img
//                       src={Images.iconClose2}
//                       alt=""
//                       className="  w-3 h-3 object-contain "
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//             {!!listDetailShoe && (
//               <ShowVoucherList
//                 setVoucher={setVoucher}
//                 setCodeVoucher={setCodeVoucher}
//                 setPrecent={setPrecent}
//                 valueCheck={cartItems.reduce((total, cartItem) => {
//                   const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                   return (
//                     total +
//                     (item?.discountValue
//                       ? item?.discountValue
//                       : item?.price || 0) *
//                       cartItem.quantity
//                   );
//                 }, 0)}
//               />
//             )}
//           </div>
//         </div>
//         {/* Thanh toán */}
//         <div className="mt-10 bg-gray-50 px-4 pt-2 lg:mt-0">
//           <p className="text-base font-medium  ">Chi tiết thanh toán</p>
//           <p className="text-gray-400">
//             Hoàn thành đơn đặt hàng của bạn bằng cách cung cấp chi tiết thanh
//             toán của bạn.
//           </p>
//           <div className="mt-2">
//             <div className="flex justify-between w-full px-4 my-5">
//               <div className="relative z-0  w-[45%]">
//                 <input
//                   value={textHVT}
//                   onChange={(e) => {
//                     setTextHVT(e?.target?.value);
//                   }}
//                   autoComplete="off"
//                   type="text"
//                   id="floating_standard"
//                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập họ và tên
//                 </label>
//               </div>
//               <div className="relative z-0 w-[45%] ">
//                 <input
//                   autoComplete="off"
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e?.target?.value);
//                   }}
//                   type="text"
//                   id="floating_standard"
//                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập email
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-between w-full px-4 my-3">
//               <div className="relative z-0  w-[45%] ">
//                 <div>
//                   <select
//                     value={selectedProvince}
//                     onChange={(e: any) => setSelectedProvince(e?.target?.value)}
//                     id="underline_select"
//                     className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
//                   >
//                     {provinces.map((province) => (
//                       <option
//                         key={province.ProvinceID}
//                         value={province.ProvinceID}
//                       >
//                         {province.ProvinceName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập Tỉnh/Thành Phố
//                 </label>
//               </div>
//               <div className="relative z-0  w-[45%] ">
//                 <div>
//                   <select
//                     value={selectedDistrict}
//                     onChange={(e: any) => setSelectedDistrict(e?.target?.value)}
//                     id="underline_select"
//                     className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-200 peer"
//                   >
//                     {districts.map((district) => (
//                       <option
//                         key={district.DistrictID}
//                         value={district.DistrictID.toString()}
//                       >
//                         {district.DistrictName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập Quận/Huyện
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-between w-full px-4 my-5">
//               <div className="relative z-0 w-[45%]">
//                 <div>
//                   <select
//                     value={selectedWard}
//                     onChange={(e: any) => setSelectedWard(e?.target?.value)}
//                     id="underline_select"
//                     className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
//                   >
//                     {/* Kiểm tra wards trước khi map */}
//                     {wards && wards.length > 0 ? (
//                       wards.map((ward) => (
//                         <option
//                           key={ward.WardCode}
//                           value={ward.WardCode.toString()}
//                         >
//                           {ward.WardName}
//                         </option>
//                       ))
//                     ) : (
//                       <option value="">Chọn Phường/Xã</option>
//                     )}
//                   </select>
//                 </div>
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập Phường/Xã
//                 </label>
//               </div>
//               <div className="relative z-0  w-[45%]">
//                 <input
//                   value={specificAddress}
//                   onChange={(e: any) => setSpecificAddress(e?.target?.value)}
//                   type="text"
//                   id="floating_standard"
//                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập địa chỉ cụ thể
//                 </label>
//               </div>
//             </div>
//             <div className="w-full flex justify-between items-end  px-4 my-5">
//               <div className="relative z-0 w-[45%] ">
//                 <input
//                   autoComplete="off"
//                   value={phoneNumber}
//                   onChange={(e) => {
//                     setPhoneNumber(e?.target?.value);
//                   }}
//                   type="text"
//                   id="floating_standard"
//                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập số điện thoại
//                 </label>
//               </div>
//               <div className=" flex  items-end justify-between    w-[45%]">
//                 <span className="text-sm font-medium">Lời nhắn :</span>
//                 <input
//                   className="py-1 border border-gray-300 rounded focus:border-gray-500 p-2 outline-none  text-sm "
//                   type="text"
//                   value={note}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     setNote(e.target.value);
//                   }}
//                 />
//               </div>
//             </div>
//             <label
//               htmlFor="card-holder"
//               className="mt-4 mb-2 block text-sm font-medium text-gray-900"
//             >
//               Chọn phương thức thanh toán
//             </label>

//             <div className="flex items-center justify-around">
//               <div className="flex">
//                 <div className="flex items-center h-5">
//                   <input
//                     value={0}
//                     checked={radioChoose === 0}
//                     name="payment"
//                     onChange={handleChange}
//                     id="option2"
//                     aria-describedby="helper-radio-text"
//                     type="radio"
//                     className=" peer-checked:border-gray-500  peer-checked: peer-checked:ring-gray-500 w-4 h-4 text-gray-500 bg-gray-100 border-gray-300 focus:ring-gray-500  "
//                   />
//                 </div>
//                 <div className="ml-2 text-sm">
//                   <label
//                     htmlFor="option2"
//                     className="font-medium text-gray-900 dark:text-gray-300"
//                   >
//                     Thanh toán khi nhận hàng
//                   </label>
//                 </div>
//               </div>
//               <div className="flex">
//                 <div className="flex items-center h-5">
//                   <input
//                     value={1}
//                     checked={radioChoose === 1}
//                     name="payment"
//                     onChange={handleChange}
//                     id="option3"
//                     aria-describedby="helper-radio-text"
//                     type="radio"
//                     className=" peer-checked:border-gray-500  peer-checked: peer-checked:ring-gray-500 w-4 h-4 text-gray-500 bg-gray-100 border-gray-300 focus:ring-gray-500  "
//                   />
//                 </div>
//                 <div className="ml-2 text-sm">
//                   <label
//                     htmlFor="option3"
//                     className="font-medium text-gray-900 dark:text-gray-300"
//                   >
//                     Thanh toán vnpay
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Total */}
//             <div className="mt-6 border-t border-b py-2">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium text-gray-900">
//                   Tổng tiền hàng
//                 </p>
//                 {!!listDetailShoe && (
//                   <p className="font-normal text-gray-900">
//                     {formatCurrency(
//                       cartItems.reduce((total, cartItem) => {
//                         const item = listDetailShoe.find(
//                           (i) => i.id === cartItem.id
//                         );
//                         return (
//                           total +
//                           (item?.discountValue
//                             ? item?.discountValue
//                             : item?.price || 0) *
//                             cartItem?.quantity
//                         );
//                       }, 0)
//                     )}
//                   </p>
//                 )}
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium text-gray-900">
//                   Phí vận chuyển
//                 </p>
//                 <p className="font-normal text-gray-900">
//                   {formatCurrency(feeShip ? feeShip : 0)}
//                 </p>
//               </div>
//               {!!listDetailShoe && !!percent ? (
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-gray-900">
//                     Giảm giá voucher
//                   </p>
//                   <p className="font-normal text-gray-900">
//                     -{" "}
//                     {formatCurrency(
//                       (percent / 100) *
//                         cartItems.reduce((total, cartItem) => {
//                           const item = listDetailShoe.find(
//                             (i) => i.id === cartItem.id
//                           );
//                           return (
//                             total +
//                             (item?.discountValue
//                               ? item?.discountValue
//                               : item?.price || 0) *
//                               cartItem.quantity
//                           );
//                         }, 0)
//                     )}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-gray-900">
//                     Giảm giá voucher
//                   </p>
//                   <p className="font-normal text-gray-900">
//                     - {formatCurrency(0)}
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="mt-6 flex items-center justify-between">
//               <p className="text-sm font-medium text-gray-900">
//                 Tổng thanh toán
//               </p>
//               {!!listDetailShoe && feeShip && (
//                 <p className="text-2xl font-semibold text-red-500">
//                   {formatCurrency(
//                     cartItems.reduce((total, cartItem) => {
//                       const item = listDetailShoe.find(
//                         (i) => i.id === cartItem.id
//                       );
//                       return (
//                         total +
//                         (item?.discountValue
//                           ? item?.discountValue
//                           : item?.price || 0) *
//                           cartItem.quantity
//                       );
//                     }, 0) +
//                       feeShip -
//                       (percent / 100) *
//                         cartItems.reduce((total, cartItem) => {
//                           const item = listDetailShoe.find(
//                             (i) => i.id === cartItem.id
//                           );
//                           return (
//                             total +
//                             (item?.discountValue
//                               ? item?.discountValue
//                               : item?.price || 0) *
//                               cartItem.quantity
//                           );
//                         }, 0)
//                   )}
//                 </p>
//               )}
//             </div>
//           </div>
//           <button
//             className="mt-4 mb-8 w-full rounded-md bg-red-500 px-6 py-3 font-medium text-white"
//             onClick={() => {
//               if (cartItems.length === 0) {
//                 toast.warning("Cần có sản phẩm");
//                 return;
//               } else {
//                 setShowMoal(true);
//               }
//             }}
//           >
//             Đặt hàng
//           </button>
//         </div>
//       </div>
//       {showModal && (
//         <ModalComponent
//           check={true}
//           isVisible={showModal}
//           onClose={() => {
//             setShowMoal(false);
//           }}
//         >
//           <div className="w-full flex flex-col justify-center">
//             <svg
//               className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//               />
//             </svg>
//             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 text-center   ">
//               Xác nhận đặt đơn hàng ?
//             </h3>

//             <div className="w-full flex justify-around items-center mb-2 gap-16">
//               <button
//                 onClick={() => {
//                   setShowMoal(false);
//                 }}
//                 data-modal-hide="popup-modal"
//                 type="button"
//                 className="text-white bg-green-400  rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={() => {
//                   postBill();
//                   setShowMoal(false);
//                 }}
//                 data-modal-hide="popup-modal"
//                 type="button"
//                 className="text-white bg-red-600  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
//               >
//                 Đặt hàng
//               </button>
//             </div>
//           </div>
//         </ModalComponent>
//       )}
//       {/* <ShowVoucher isOpen={isModalOpenVoucher} onClose={toggleModal} />  */}
//     </div>
//   );
// };

// export default PaymentPage;




// import React, { useState, useEffect } from "react";
// import ShippingProcess from "../../components/shippingProcess";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   CustomError,
//   IDetailProductCart2,
//   IVoucher,
// } from "../../types/product.type";
// import {
//   convertToCurrencyString,
//   regexPhoneNumber,
//   validateEmail,
// } from "../../utils/format";
// import { useShoppingCart } from "../../context/shoppingCart.context";
// import { formatCurrency } from "../../utils/formatCurrency";
// import API, { baseUrl } from "../../api";
// import ModalComponent from "../../components/Modal";
// import { configApi } from "../../utils/config";
// import { toast } from "react-toastify";
// import Images from "../../static";
// import ShowVoucherList from "./showVoucherList";

// interface Province {
//   ProvinceID: number;
//   ProvinceName: string;
// }
// interface District {
//   DistrictID: number;
//   DistrictName: string;
// }
// interface Ward {
//   WardCode: number;
//   WardName: string;
// }

// const ItemPayMent = ({ item }: { item: any }) => {
//   const [inforShoe, setInforShoe] = useState<IDetailProductCart2>();
//   const getDetailShoeWithId = async () => {
//     const res = await axios({
//       method: "get",
//       url: API.getShoeDetailWithId(item?.id),
//     });
//     if (res.status) {
//       setInforShoe(res?.data?.data);
//     }
//   };
//   useEffect(() => {
//     getDetailShoeWithId();
//   }, [item?.id]);
//   return (
//     <div className={`flex px-6 py-2 w-full border-b-[1px] border-gray-500 border-dashed `}>
//       {
//         <img className="h-[90px] w-[80px] object-contain " src={inforShoe?.images.split(",")[0]} />
//       }
//       <div className="flex-1">
//         <div className="flex flex-col justify-between ml-4 flex-grow w-full h-full ">
//           <span className="font-bold text-sm  ">{inforShoe?.name}</span>
//           {/* <span className="text-red-500 text-xs font-medium">
//             <span className="text-xs font-medium  text-[#333333]">Loại đế:</span>{" "}
//             {inforShoe?.sole}
//           </span> */}
//           <p className="  text-xs font-medium  text-[#333333]  ">Số lượng: {item?.quantity}</p>
//           <div className="flex justify-between  ">
//             <div className="flex  ">
//               <span className="text-xs font-medium  text-[#333333]  ">Giá:</span>
//               {inforShoe?.discountValue ? (
//                 <div className="flex items-center gap-1 ml-1 ">
//                   <span className="text-xs font-medium line-through text-gray-400">
//                     {convertToCurrencyString(inforShoe?.price)}
//                   </span>
//                   <span className="text-xs font-medium text-red-500">
//                     {" "}{convertToCurrencyString(inforShoe?.discountValue)}
//                   </span>
//                 </div>
//               ) : (
//                 inforShoe?.price && (
//                   <span className="text-xs font-medium text-red-500 ml-1 ">
//                     {convertToCurrencyString(inforShoe?.price)}
//                   </span>
//                 )
//               )}
//             </div>
//             <span className="text-center  font-medium text-xs w-[45%] text-red-700">
//               <span className="text-[#666666]">Thành tiền: </span>
//               {!!inforShoe?.discountValue
//                 ? formatCurrency(item.quantity * inforShoe?.discountValue)
//                 : inforShoe?.price && formatCurrency(inforShoe?.price * item.quantity)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PaymentPage = () => {
//   const navigate = useNavigate();
//   const { cartItems, clearCart } = useShoppingCart();
//   const [showModal, setShowMoal] = useState<boolean>(false);
//   const [percent, setPrecent] = useState<number>(0);
//   const [radioChoose, setRadioChoose] = React.useState<number>(0);
//   const [voucher, setVoucher] = useState<number | null>(null);
//   const [provinces, setProvinces] = useState<Province[]>([]);
//   const [selectedProvince, setSelectedProvince] = useState<number>();
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [selectedDistrict, setSelectedDistrict] = useState<number>();
//   const [wards, setWards] = useState<Ward[]>([]);
//   const [selectedWard, setSelectedWard] = useState<number>();
//   const [specificAddress, setSpecificAddress] = useState<string>(" ");
//   const [codeVoucher, setCodeVoucher] = useState<string>();
//   const [feeShip, setFeeShip] = useState(0);
//   const [listDetailShoe, setListDetailShoe] = useState<IDetailProductCart2[]>();
//   const [textHVT, setTextHVT] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [note, setNote] = useState<string>("");
//   const [paymentMethod, setPaymentMethod] = useState<number>(0);
//   const [phoneNumber, setPhoneNumber] = useState<string>("");

//   const getDetailShoe = async () => {
//     const res = await axios({
//       method: "get",
//       url: API.getAllShoeDetail(),
//     });
//     if (res.status) {
//       setListDetailShoe(res?.data?.data);
//     }
//   };

//   const postBill = async () => {
//     if (textHVT === "" || textHVT === null || textHVT === undefined) {
//       toast.warning("Không được để trống họ và tên");
//     } else if (email === "" || email === null || email === undefined) {
//       toast.warning("Không được để email");
//     } else if (!regexPhoneNumber.test(phoneNumber)) {
//       toast.warning("Số điện không hợp lệ");
//     } else if (!validateEmail(email)) {
//       toast.warning("Email không hợp lệ");
//     } else if (
//       selectedDistrict === null ||
//       selectedDistrict === undefined ||
//       selectedProvince === null ||
//       selectedProvince === undefined ||
//       selectedWard === null ||
//       selectedWard === undefined ||
//       specificAddress === null ||
//       specificAddress === undefined ||
//       specificAddress === " "
//     ) {
//       toast.warning("Không được để trống địa chỉ");
//     } else if (paymentMethod === null || paymentMethod === undefined) {
//       toast.warning("Hãy chọn phương thức thanh toán");
//     } else {
//       if (listDetailShoe) {
//         try {
//           const newBill = {
//             customerName: textHVT,
//             email: email,
//             phoneNumber: phoneNumber,
//             voucher: voucher ? voucher : null,
//             district: selectedDistrict,
//             province: selectedProvince,
//             ward: selectedWard,
//             specificAddress: specificAddress,
//             moneyShip: Number(feeShip),
//             moneyReduce:
//               (percent / 100) *
//               cartItems.reduce((total, cartItem) => {
//                 const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                 return (
//                   total +
//                   (item?.discountValue
//                     ? item?.discountValue
//                     : item?.price || 0) *
//                     cartItem.quantity
//                 );
//               }, 0),
//             totalMoney:
//               cartItems.reduce((total, cartItem) => {
//                 const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                 return (
//                   total +
//                   (item?.discountValue
//                     ? item?.discountValue
//                     : item?.price || 0) *
//                     cartItem.quantity
//                 );
//               }, 0) -
//               (percent / 100) *
//                 cartItems.reduce((total, cartItem) => {
//                   const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                   return (
//                     total +
//                     (item?.discountValue
//                       ? item?.discountValue
//                       : item?.price || 0) *
//                       cartItem.quantity
//                   );
//                 }, 0),
//             note: note,
//             paymentMethod: paymentMethod,
//             carts: cartItems,
//           };

//           if (radioChoose === 0) {
//             const response = await axios.post(baseUrl + "api/bill/create-bill-client", newBill);
//             if (response.status) {
//               toast.success("Đặt hàng thành công");
//               navigate(`/showBillCheck/${response?.data?.data?.data?.id}/${response?.data?.data?.data?.code}`);
//               clearCart();
//             }
//           }
//           if (radioChoose === 1) {
//             const tempNewBill = { ...newBill, id: generateUUID() };
//             localStorage.setItem("checkout", JSON.stringify(tempNewBill));
//             try {
//               const response = await axios.get(
//                 baseUrl +
//                   `api/vn-pay/payment?id=${tempNewBill.id}&total=${
//                     cartItems.reduce((total, cartItem) => {
//                       const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                       return (
//                         total +
//                         (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem.quantity
//                       );
//                     }, 0) +
//                     feeShip -
//                     (percent / 100) *
//                       cartItems.reduce((total, cartItem) => {
//                         const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                         return (
//                           total +
//                           (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem.quantity
//                         );
//                       }, 0)
//                   }`
//               );
//               if (response.status) {
//                 window.location.href = response.data.data;
//               }
//             } catch (error) {
//               if (typeof error === "string") {
//                 toast.error(error);
//               } else if (error instanceof Error) {
//                 const customError = error as CustomError;
//                 if (customError.response && customError.response.data) {
//                   toast.error(customError.response.data);
//                 } else {
//                   toast.error(customError.message);
//                 }
//               } else {
//                 toast.error("Hãy thử lại.");
//               }
//             }
//           }
//         } catch (error) {
//           if (typeof error === "string") {
//             toast.error(error);
//           } else if (error instanceof Error) {
//             const customError = error as CustomError;
//             if (customError.response && customError.response.data) {
//               toast.error(customError.response.data);
//             } else {
//               toast.error(customError.message);
//             }
//           } else {
//             toast.error("Hãy thử lại.");
//           }
//         }
//       }
//     }
//   };

//   function generateUUID() {
//     var d = new Date().getTime();
//     var d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//       var r = Math.random() * 16;
//       if (d > 0) {
//         r = (d + r) % 16 | 0;
//         d = Math.floor(d / 16);
//       } else {
//         r = (d2 + r) % 16 | 0;
//         d2 = Math.floor(d2 / 16);
//       }
//       return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
//     });
//   }

//   // Hàm lấy danh sách dịch vụ khả dụng từ GHN
//   const getAvailableServices = async (fromDistrict: number, toDistrict: number) => {
//     try {
//       const response = await axios.post(
//         "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
//         {
//           shop_id: 2483458,
//           from_district: fromDistrict,
//           to_district: toDistrict,
//         },
//         {
//           headers: {
//             Token: "650687b2-f5c1-11ef-9bc9-aecca9e2a07c",
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const availableServices = response.data.data;
//       if (availableServices && availableServices.length > 0) {
//         return availableServices[0].service_id; // Lấy service_id đầu tiên
//       } else {
//         throw new Error("Không tìm thấy gói dịch vụ khả dụng");
//       }
//     } catch (error) {
//       console.error("Lỗi khi lấy gói dịch vụ:", error);
//       toast.error("Không thể lấy thông tin gói dịch vụ!");
//       return null;
//     }
//   };

//   // Hàm tính phí ship từ GHN
//   const caculateFee = async () => {
//     if (!selectedDistrict || !selectedWard) return;

//     const fromDistrict = 1542; // Quận cố định của cửa hàng
//     const toDistrict = Number(selectedDistrict);

//     const serviceId = await getAvailableServices(fromDistrict, toDistrict);

//     if (!serviceId) {
//       toast.error("Không thể tính phí vận chuyển do không tìm thấy dịch vụ!");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
//         {
//           service_id: serviceId,
//           service_type_id: 3,
//           to_district_id: toDistrict,
//           to_ward_code: String(selectedWard),
//           height: 11,
//           length: 28,
//           weight: 300,
//           width: 16,
//         },
//         {
//           headers: {
//             Token: "650687b2-f5c1-11ef-9bc9-aecca9e2a07c",
//             "Content-Type": "application/json",
//             ShopId: 2483458,
//           },
//         }
//       );
//       setFeeShip(response.data.data.total);
//     } catch (error) {
//       console.error("Lỗi khi tính phí vận chuyển:", error);
//       toast.error("Không thể tính phí vận chuyển!");
//     }
//   };

//   const fetchProvinces = async () => {
//     try {
//       const response = await axios.get(
//         "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
//         configApi
//       );
//       setProvinces(response?.data?.data);
//       setSelectedProvince(response?.data?.data[0]?.ProvinceID);
//     } catch (error) {
//       console.error("Lỗi:", error);
//     }
//   };

//   const fetchDistrictsByProvince = async (provinceId: number) => {
//     try {
//       const response = await axios.get(
//         `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
//         configApi
//       );
//       setDistricts(response?.data?.data);
//       setSelectedDistrict(response?.data?.data[0]?.DistrictID);
//     } catch (error) {
//       console.error("Error fetching districts:", error);
//     }
//   };

//   const fetchWardsByDistrict = async (districtId: number) => {
//     try {
//       const response = await axios.get(
//         `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
//         configApi
//       );
//       setWards(response.data.data);
//       setSelectedWard(response?.data?.data[0]?.WardCode);
//     } catch (error) {
//       console.error("Error fetching wards:", error);
//     }
//   };

//   useEffect(() => {
//     getDetailShoe();
//     fetchProvinces();
//   }, []);

//   useEffect(() => {
//     if (selectedProvince) {
//       fetchDistrictsByProvince(selectedProvince);
//     }
//   }, [selectedProvince]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       fetchWardsByDistrict(selectedDistrict);
//     }
//   }, [selectedDistrict]);

//   useEffect(() => {
//     if (selectedWard !== undefined) {
//       caculateFee();
//     } else {
//       return;
//     }
//   }, [selectedWard]);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPaymentMethod(parseInt(event.target.value, 10));
//     setRadioChoose(parseInt(event.target.value, 10));
//   };

//   return (
//     <div className="w-full h-full">
//       <ShippingProcess type={2} />
//       <div className="grid sm:px-5 lg:grid-cols-2 lg:px-10 xl:px-10 shadow-md my-10 bg-[#f9fafb] py-4">
//         <div className="px-4 ">
//           <p className="text-base font-medium text-black mt-3">Trang Thanh Toán</p>
//           <p className="text-gray-400 text-sm">
//             Kiểm tra các mặt hàng của bạn. Và chọn một phương thức vận chuyển phù hợp.
//           </p>

//           {!!cartItems && cartItems.length ? (
//             <div className="mt-4 space-y-3  bg-white overflow-y-scroll h-[360px] ">
//               {cartItems.map((item, index) => {
//                 return <ItemPayMent item={item} key={index} />;
//               })}
//             </div>
//           ) : (
//             <img src={Images.isEmtyCart} className="h-72  mx-auto" />
//           )}

//           <div className=" w-full   mt-2">
//             <div className="flex gap-5 items-center mb-1">
//               <span className=" text-sm font-medium"> ÁP DỤNG MÃ GIẢM GIÁ</span>
//               {!!codeVoucher && (
//                 <div className="relative">
//                   <p className="font-semibold bg-blue-600 px-2  rounded text-white">{codeVoucher}</p>
//                   <div
//                     className="bg-blue-600 rounded-full p-[1px] absolute -top-1 -right-1 cursor-pointer "
//                     onClick={() => {
//                       setPrecent(0);
//                       setCodeVoucher("");
//                     }}
//                   >
//                     <img src={Images.iconClose2} alt="" className="  w-3 h-3 object-contain " />
//                   </div>
//                 </div>
//               )}
//             </div>
//             {!!listDetailShoe && (
//               <ShowVoucherList
//                 setVoucher={setVoucher}
//                 setCodeVoucher={setCodeVoucher}
//                 setPrecent={setPrecent}
//                 valueCheck={cartItems.reduce((total, cartItem) => {
//                   const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                   return (
//                     total +
//                     (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem.quantity
//                   );
//                 }, 0)}
//               />
//             )}
//           </div>
//         </div>
//         {/* Thanh toán */}
//         <div className="mt-10 bg-gray-50 px-4 pt-2 lg:mt-0">
//           <p className="text-base font-medium  ">Chi tiết thanh toán</p>
//           <p className="text-gray-400">
//             Hoàn thành đơn đặt hàng của bạn bằng cách cung cấp chi tiết thanh toán của bạn.
//           </p>
//           <div className="mt-2">
//             <div className="flex justify-between w-full px-4 my-5">
//               <div className="relative z-0  w-[45%]">
//                 <input
//                   value={textHVT}
//                   onChange={(e) => {
//                     setTextHVT(e?.target?.value);
//                   }}
//                   autoComplete="off"
//                   type="text"
//                   id="floating_standard"
//                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập họ và tên
//                 </label>
//               </div>
//               <div className="relative z-0 w-[45%] ">
//                 <input
//                   autoComplete="off"
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e?.target?.value);
//                   }}
//                   type="text"
//                   id="floating_standard"
//                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập email
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-between w-full px-4 my-3">
//               <div className="relative z-0  w-[45%] ">
//                 <div>
//                   <select
//                     value={selectedProvince}
//                     onChange={(e: any) => setSelectedProvince(e?.target?.value)}
//                     id="underline_select"
//                     className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
//                   >
//                     {provinces.map((province) => (
//                       <option key={province.ProvinceID} value={province.ProvinceID}>
//                         {province.ProvinceName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập Tỉnh/Thành Phố
//                 </label>
//               </div>
//               <div className="relative z-0  w-[45%] ">
//                 <div>
//                   <select
//                     value={selectedDistrict}
//                     onChange={(e: any) => setSelectedDistrict(e?.target?.value)}
//                     id="underline_select"
//                     className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-200 peer"
//                   >
//                     {districts.map((district) => (
//                       <option key={district.DistrictID} value={district.DistrictID.toString()}>
//                         {district.DistrictName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập Quận/Huyện
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-between w-full px-4 my-5">
//               <div className="relative z-0 w-[45%]">
//                 <div>
//                   <select
//                     value={selectedWard}
//                     onChange={(e: any) => setSelectedWard(e?.target?.value)}
//                     id="underline_select"
//                     className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
//                   >
//                     {wards && wards.length > 0 ? (
//                       wards.map((ward) => (
//                         <option key={ward.WardCode} value={ward.WardCode.toString()}>
//                           {ward.WardName}
//                         </option>
//                       ))
//                     ) : (
//                       <option value="">Chọn Phường/Xã</option>
//                     )}
//                   </select>
//                 </div>
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập Phường/Xã
//                 </label>
//               </div>
//               <div className="relative z-0  w-[45%]">
//                 <input
//                   value={specificAddress}
//                   onChange={(e: any) => setSpecificAddress(e?.target?.value)}
//                   type="text"
//                   id="floating_standard"
//                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập địa chỉ cụ thể
//                 </label>
//               </div>
//             </div>
//             <div className="w-full flex justify-between items-end  px-4 my-5">
//               <div className="relative z-0 w-[45%] ">
//                 <input
//                   autoComplete="off"
//                   value={phoneNumber}
//                   onChange={(e) => {
//                     setPhoneNumber(e?.target?.value);
//                   }}
//                   type="text"
//                   id="floating_standard"
//                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor="floating_standard"
//                   className="absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//                 >
//                   Nhập số điện thoại
//                 </label>
//               </div>
//               <div className=" flex  items-end justify-between    w-[45%]">
//                 {/* <span className="text-sm font-medium">Lời nhắn :</span> */}
//                 {/* <input
//                   className="py-1 border border-gray-300 rounded focus:border-gray-500 p-2 outline-none  text-sm "
//                   type="text"
//                   value={note}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     setNote(e.target.value);
//                   }}
//                 /> */}
//               </div>
//             </div>
//             <label
//               htmlFor="card-holder"
//               className="mt-4 mb-2 block text-sm font-medium text-gray-900"
//             >
//               Chọn phương thức thanh toán
//             </label>
//             <div className="flex items-center justify-around">
//               <div className="flex">
//                 <div className="flex items-center h-5">
//                   <input
//                     value={0}
//                     checked={radioChoose === 0}
//                     name="payment"
//                     onChange={handleChange}
//                     id="option2"
//                     aria-describedby="helper-radio-text"
//                     type="radio"
//                     className=" peer-checked:border-gray-500  peer-checked: peer-checked:ring-gray-500 w-4 h-4 text-gray-500 bg-gray-100 border-gray-300 focus:ring-gray-500  "
//                   />
//                 </div>
//                 <div className="ml-2 text-sm">
//                   <label htmlFor="option2" className="font-medium text-gray-900 dark:text-gray-300">
//                     Thanh toán khi nhận hàng
//                   </label>
//                 </div>
//               </div>
//               <div className="flex">
//                 <div className="flex items-center h-5">
//                   <input
//                     value={1}
//                     checked={radioChoose === 1}
//                     name="payment"
//                     onChange={handleChange}
//                     id="option3"
//                     aria-describedby="helper-radio-text"
//                     type="radio"
//                     className=" peer-checked:border-gray-500  peer-checked: peer-checked:ring-gray-500 w-4 h-4 text-gray-500 bg-gray-100 border-gray-300 focus:ring-gray-500  "
//                   />
//                 </div>
//                 <div className="ml-2 text-sm">
//                   <label htmlFor="option3" className="font-medium text-gray-900 dark:text-gray-300">
//                     Thanh toán vnpay
//                   </label>
//                 </div>
//               </div>
//             </div>
//             {/* Total */}
//             <div className="mt-6 border-t border-b py-2">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium text-gray-900">Tổng tiền hàng</p>
//                 {!!listDetailShoe && (
//                   <p className="font-normal text-gray-900">
//                     {formatCurrency(
//                       cartItems.reduce((total, cartItem) => {
//                         const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                         return (
//                           total +
//                           (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem?.quantity
//                         );
//                       }, 0)
//                     )}
//                   </p>
//                 )}
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium text-gray-900">Phí vận chuyển</p>
//                 <p className="font-normal text-gray-900">{formatCurrency(feeShip ? feeShip : 0)}</p>
//               </div>
//               {!!listDetailShoe && !!percent ? (
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-gray-900">Giảm giá voucher</p>
//                   <p className="font-normal text-gray-900">
//                     -{" "}
//                     {formatCurrency(
//                       (percent / 100) *
//                         cartItems.reduce((total, cartItem) => {
//                           const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                           return (
//                             total +
//                             (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem.quantity
//                           );
//                         }, 0)
//                     )}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-gray-900">Giảm giá voucher</p>
//                   <p className="font-normal text-gray-900">- {formatCurrency(0)}</p>
//                 </div>
//               )}
//             </div>
//             <div className="mt-6 flex items-center justify-between">
//               <p className="text-sm font-medium text-gray-900">Tổng thanh toán</p>
//               {!!listDetailShoe && feeShip && (
//                 <p className="text-2xl font-semibold text-red-500">
//                   {formatCurrency(
//                     cartItems.reduce((total, cartItem) => {
//                       const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                       return (
//                         total +
//                         (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem.quantity
//                       );
//                     }, 0) +
//                       feeShip -
//                       (percent / 100) *
//                         cartItems.reduce((total, cartItem) => {
//                           const item = listDetailShoe.find((i) => i.id === cartItem.id);
//                           return (
//                             total +
//                             (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem.quantity
//                           );
//                         }, 0)
//                   )}
//                 </p>
//               )}
//             </div>
//           </div>
//           <button
//             className="mt-4 mb-8 w-full rounded-md bg-red-500 px-6 py-3 font-medium text-white"
//             onClick={() => {
//               if (cartItems.length === 0) {
//                 toast.warning("Cần có sản phẩm");
//                 return;
//               } else {
//                 setShowMoal(true);
//               }
//             }}
//           >
//             Đặt hàng
//           </button>
//         </div>
//       </div>
//       {showModal && (
//         <ModalComponent
//           check={true}
//           isVisible={showModal}
//           onClose={() => {
//             setShowMoal(false);
//           }}
//         >
//           <div className="w-full flex flex-col justify-center">
//             <svg
//               className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//               />
//             </svg>
//             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 text-center   ">
//               Xác nhận đặt đơn hàng ?
//             </h3>
//             <div className="w-full flex justify-around items-center mb-2 gap-16">
//               <button
//                 onClick={() => {
//                   setShowMoal(false);
//                 }}
//                 data-modal-hide="popup-modal"
//                 type="button"
//                 className="text-white bg-green-400  rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={() => {
//                   postBill();
//                   setShowMoal(false);
//                 }}
//                 data-modal-hide="popup-modal"
//                 type="button"
//                 className="text-white bg-red-600  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
//               >
//                 Đặt hàng
//               </button>
//             </div>
//           </div>
//         </ModalComponent>
//       )}
//     </div>
//   );
// };

// export default PaymentPage;





import React, { useState, useEffect } from "react";
import ShippingProcess from "../../components/shippingProcess";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CustomError,
  IDetailProductCart2,
  IVoucher,
} from "../../types/product.type";
import {
  convertToCurrencyString,
  regexPhoneNumber,
  validateEmail,
} from "../../utils/format";
import { useShoppingCart } from "../../context/shoppingCart.context";
import { formatCurrency } from "../../utils/formatCurrency";
import API, { baseUrl } from "../../api";
import ModalComponent from "../../components/Modal";
import { configApi } from "../../utils/config";
import { toast } from "react-toastify";
import Images from "../../static";
import ShowVoucherList from "./showVoucherList";

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}
interface District {
  DistrictID: number;
  DistrictName: string;
}
interface Ward {
  WardCode: number;
  WardName: string;
}

const ItemPayMent = ({ item }: { item: any }) => {
  const [inforShoe, setInforShoe] = useState<IDetailProductCart2>();
  const getDetailShoeWithId = async () => {
    const res = await axios({
      method: "get",
      url: API.getShoeDetailWithId(item?.id),
    });
    if (res.status) {
      setInforShoe(res?.data?.data);
    }
  };
  useEffect(() => {
    getDetailShoeWithId();
  }, [item?.id]);
  // return (
  //   <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3">
  //     <img
  //       className="h-20 w-20 object-contain rounded-md"
  //       src={inforShoe?.images.split(",")[0]}
  //       alt={inforShoe?.name}
  //     />
  //     <div className="ml-4 flex-1">
  //       <h3 className="text-base font-semibold text-gray-800">{inforShoe?.name}</h3>
  //       <p className="text-sm text-gray-500">Số lượng: {item?.quantity}</p>
  //       <div className="flex justify-between items-center mt-2">
  //         <div className="flex items-center gap-2">
  //           <span className="text-sm font-medium text-gray-600">Giá:</span>
  //           {inforShoe?.discountValue ? (
  //             <div className="flex items-center gap-2">
  //               <span className="text-sm text-gray-400 line-through">
  //                 {convertToCurrencyString(inforShoe?.price)}
  //               </span>
  //               <span className="text-sm font-semibold text-red-600">
  //                 {convertToCurrencyString(inforShoe?.discountValue)}
  //               </span>
  //             </div>
  //           ) : (
  //             inforShoe?.price && (
  //               <span className="text-xs font-medium text-red-500 ml-1 ">
  //                 {convertToCurrencyString(inforShoe?.price)}
  //               </span>
  //             ))}
            
  //         </div>
  //         <span className="text-sm font-semibold text-red-600">
  //           Thành tiền:{" "}
  //           {!!inforShoe?.discountValue
  //             ? formatCurrency(item.quantity * inforShoe?.discountValue)
  //             : inforShoe?.price && formatCurrency(inforShoe?.price * item.quantity)}
  //         </span>
  //       </div>
  //     </div>
  //   </div>
  // );
  



    return (
    <div className={`flex px-6 py-2 w-full border-b-[1px] border-gray-500 border-dashed `}>
      {
        <img className="h-[90px] w-[80px] object-contain " src={inforShoe?.images.split(",")[0]} />
      }
      <div className="flex-1">
        <div className="flex flex-col justify-between ml-4 flex-grow w-full h-full ">
          <span className="font-bold text-sm  ">{inforShoe?.name}</span>
          {/* <span className="text-red-500 text-xs font-medium">
            <span className="text-xs font-medium  text-[#333333]">Loại đế:</span>{" "}
            {inforShoe?.sole}
          </span> */}
          <p className="  text-xs font-medium  text-[#333333]  ">Số lượng: {item?.quantity}</p>
          <div className="flex justify-between  ">
            <div className="flex  ">
              <span className="text-xs font-medium  text-[#333333]  ">Giá:</span>
              {inforShoe?.discountValue ? (
                <div className="flex items-center gap-1 ml-1 ">
                  <span className="text-xs font-medium line-through text-gray-400">
                    {convertToCurrencyString(inforShoe?.price)}
                  </span>
                  <span className="text-xs font-medium text-red-500">
                    {" "}{convertToCurrencyString(inforShoe?.discountValue)}
                  </span>
                </div>
              ) : (
                inforShoe?.price && (
                  <span className="text-xs font-medium text-red-500 ml-1 ">
                    {convertToCurrencyString(inforShoe?.price)}
                  </span>
                )
              )}
            </div>
            <span className="text-center  font-medium text-xs w-[45%] text-red-700">
              <span className="text-[#666666]">Thành tiền: </span>
              {!!inforShoe?.discountValue
                ? formatCurrency(item.quantity * inforShoe?.discountValue)
                : inforShoe?.price && formatCurrency(inforShoe?.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useShoppingCart();
  const [showModal, setShowMoal] = useState<boolean>(false);
  const [percent, setPrecent] = useState<number>(0);
  const [radioChoose, setRadioChoose] = React.useState<number>(0);
  const [voucher, setVoucher] = useState<number | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number>();
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedWard, setSelectedWard] = useState<number>();
  const [specificAddress, setSpecificAddress] = useState<string>(" ");
  const [codeVoucher, setCodeVoucher] = useState<string>();
  const [feeShip, setFeeShip] = useState(0);
  const [listDetailShoe, setListDetailShoe] = useState<IDetailProductCart2[]>();
  const [textHVT, setTextHVT] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const getDetailShoe = async () => {
    const res = await axios({
      method: "get",
      url: API.getAllShoeDetail(),
    });
    if (res.status) {
      setListDetailShoe(res?.data?.data);
    }
  };

  const postBill = async () => {
    if (textHVT === "" || textHVT === null || textHVT === undefined) {
      toast.warning("Không được để trống họ và tên");
    } else if (email === "" || email === null || email === undefined) {
      toast.warning("Không được để email");
    } else if (!regexPhoneNumber.test(phoneNumber)) {
      toast.warning("Số điện không hợp lệ");
    } else if (!validateEmail(email)) {
      toast.warning("Email không hợp lệ");
    } else if (
      selectedDistrict === null ||
      selectedDistrict === undefined ||
      selectedProvince === null ||
      selectedProvince === undefined ||
      selectedWard === null ||
      selectedWard === undefined ||
      specificAddress === null ||
      specificAddress === undefined ||
      specificAddress === " "
    ) {
      toast.warning("Không được để trống địa chỉ");
    } else if (paymentMethod === null || paymentMethod === undefined) {
      toast.warning("Hãy chọn phương thức thanh toán");
    } else {
      if (listDetailShoe) {
        try {
          const newBill = {
            customerName: textHVT,
            email: email,
            phoneNumber: phoneNumber,
            voucher: voucher ? voucher : null,
            district: selectedDistrict,
            province: selectedProvince,
            ward: selectedWard,
            specificAddress: specificAddress,
            moneyShip: Number(feeShip),
            moneyReduce:
              (percent / 100) *
              cartItems.reduce((total, cartItem) => {
                const item = listDetailShoe.find((i) => i.id === cartItem.id);
                return (
                  total +
                  (item?.discountValue
                    ? item?.discountValue
                    : item?.price || 0) *
                    cartItem.quantity
                );
              }, 0),
            totalMoney:
              cartItems.reduce((total, cartItem) => {
                const item = listDetailShoe.find((i) => i.id === cartItem.id);
                return (
                  total +
                  (item?.discountValue
                    ? item?.discountValue
                    : item?.price || 0) *
                    cartItem.quantity
                );
              }, 0) -
              (percent / 100) *
                cartItems.reduce((total, cartItem) => {
                  const item = listDetailShoe.find((i) => i.id === cartItem.id);
                  return (
                    total +
                    (item?.discountValue
                      ? item?.discountValue
                      : item?.price || 0) *
                      cartItem.quantity
                  );
                }, 0),
            note: note,
            paymentMethod: paymentMethod,
            carts: cartItems,
          };

          if (radioChoose === 0) {
            const response = await axios.post(baseUrl + "api/bill/create-bill-client", newBill);
            if (response.status) {
              toast.success("Đặt hàng thành công");
              navigate(`/showBillCheck/${response?.data?.data?.data?.id}/${response?.data?.data?.data?.code}`);
              clearCart();
            }
          }
          if (radioChoose === 1) {
            const tempNewBill = { ...newBill, id: generateUUID() };
            localStorage.setItem("checkout", JSON.stringify(tempNewBill));
            try {
              const response = await axios.get(
                baseUrl +
                  `api/vn-pay/payment?id=${tempNewBill.id}&total=${
                    cartItems.reduce((total, cartItem) => {
                      const item = listDetailShoe.find((i) => i.id === cartItem.id);
                      return (
                        total +
                        (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem.quantity
                      );
                    }, 0) +
                    feeShip -
                    (percent / 100) *
                      cartItems.reduce((total, cartItem) => {
                        const item = listDetailShoe.find((i) => i.id === cartItem.id);
                        return (
                          total +
                          (item?.discountValue ? item?.discountValue : item?.price || 0) * cartItem.quantity
                        );
                      }, 0)
                  }`
              );
              if (response.status) {
                window.location.href = response.data.data;
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
      }
    }
  };

  function generateUUID() {
    var d = new Date().getTime();
    var d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
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

  const getAvailableServices = async (fromDistrict: number, toDistrict: number) => {
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

  const caculateFee = async () => {
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

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        configApi
      );
      setProvinces(response?.data?.data);
      setSelectedProvince(response?.data?.data[0]?.ProvinceID);
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
      setDistricts(response?.data?.data);
      setSelectedDistrict(response?.data?.data[0]?.DistrictID);
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
      setWards(response.data.data);
      setSelectedWard(response?.data?.data[0]?.WardCode);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    getDetailShoe();
    fetchProvinces();
  }, []);

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

  useEffect(() => {
    if (selectedWard !== undefined) {
      caculateFee();
    } else {
      return;
    }
  }, [selectedWard]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(parseInt(event.target.value, 10));
    setRadioChoose(parseInt(event.target.value, 10));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ShippingProcess type={2} />
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          {/* Cart Summary Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Giỏ hàng của bạn</h2>
            <p className="text-sm text-gray-500 mb-6">
              Kiểm tra các mặt hàng và áp dụng mã giảm giá nếu có.
            </p>
            {!!cartItems && cartItems.length ? (
              <div className="max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map((item, index) => (
                  <ItemPayMent item={item} key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-10">
                <img src={Images.isEmtyCart} className="h-40 mb-4" alt="Empty Cart" />
                <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
              </div>
            )}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Mã giảm giá</h3>
                {!!codeVoucher && (
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {codeVoucher}
                    </span>
                    <button
                      onClick={() => {
                        setPrecent(0);
                        setCodeVoucher("");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {!!listDetailShoe && (
                <ShowVoucherList
                  setVoucher={setVoucher}
                  setCodeVoucher={setCodeVoucher}
                  setPrecent={setPrecent}
                  valueCheck={cartItems.reduce((total, cartItem) => {
                    const item = listDetailShoe.find((i) => i.id === cartItem.id);
                    return (
                      total +
                      (item?.discountValue ? item?.discountValue : item?.price || 0) *
                        cartItem.quantity
                    );
                  }, 0)}
                />
              )}
            </div>
          </div>

          {/* Payment Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin thanh toán</h2>
            <p className="text-sm text-gray-500 mb-6">
              Vui lòng cung cấp thông tin để hoàn tất đơn hàng.
            </p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={textHVT}
                    onChange={(e) => setTextHVT(e.target.value)}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {provinces.map((province) => (
                      <option key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {districts.map((district) => (
                      <option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {wards && wards.length > 0 ? (
                      wards.map((ward) => (
                        <option key={ward.WardCode} value={ward.WardCode}>
                          {ward.WardName}
                        </option>
                      ))
                    ) : (
                      <option value="">Chọn Phường/Xã</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ cụ thể <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập địa chỉ cụ thể"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phương thức thanh toán <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      value={0}
                      checked={radioChoose === 0}
                      name="payment"
                      onChange={handleChange}
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Thanh toán khi nhận hàng</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      value={1}
                      checked={radioChoose === 1}
                      name="payment"
                      onChange={handleChange}
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Thanh toán VNPay</span>
                  </label>
                </div>
              </div>
              {/* Order Summary */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng tiền hàng</span>
                    {!!listDetailShoe && (
                      <span className="text-gray-800">
                        {formatCurrency(
                          cartItems.reduce((total, cartItem) => {
                            const item = listDetailShoe.find((i) => i.id === cartItem.id);
                            return (
                              total +
                              (item?.discountValue ? item?.discountValue : item?.price || 0) *
                                cartItem.quantity
                            );
                          }, 0)
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="text-gray-800">{formatCurrency(feeShip ? feeShip : 0)}</span>
                  </div>
                  {!!listDetailShoe && !!percent ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá voucher</span>
                      <span className="text-green-600">
                        -{" "}
                        {formatCurrency(
                          (percent / 100) *
                            cartItems.reduce((total, cartItem) => {
                              const item = listDetailShoe.find((i) => i.id === cartItem.id);
                              return (
                                total +
                                (item?.discountValue ? item?.discountValue : item?.price || 0) *
                                  cartItem.quantity
                              );
                            }, 0)
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá voucher</span>
                      <span className="text-gray-800">{formatCurrency(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span className="text-gray-800">Tổng thanh toán</span>
                    {!!listDetailShoe && feeShip && (
                      <span className="text-red-600">
                        {formatCurrency(
                          cartItems.reduce((total, cartItem) => {
                            const item = listDetailShoe.find((i) => i.id === cartItem.id);
                            return (
                              total +
                              (item?.discountValue ? item?.discountValue : item?.price || 0) *
                                cartItem.quantity
                            );
                          }, 0) +
                            feeShip -
                            (percent / 100) *
                              cartItems.reduce((total, cartItem) => {
                                const item = listDetailShoe.find((i) => i.id === cartItem.id);
                                return (
                                  total +
                                  (item?.discountValue ? item?.discountValue : item?.price || 0) *
                                    cartItem.quantity
                                );
                              }, 0)
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (cartItems.length === 0) {
                    toast.warning("Cần có sản phẩm");
                    return;
                  } else {
                    setShowMoal(true);
                  }
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                Đặt hàng ngay
              </button>
            </form>
          </div>
        </div>
      </div>
      {showModal && (
        <ModalComponent
          check={true}
          isVisible={showModal}
          onClose={() => setShowMoal(false)}
        >
          <div className="p-6 text-center">
            <svg
              className="mx-auto mb-4 text-gray-400 w-12 h-12"
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
            <h3 className="mb-5 text-lg font-medium text-gray-700">
              Bạn có chắc muốn đặt đơn hàng này?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowMoal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  postBill();
                  setShowMoal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default PaymentPage;