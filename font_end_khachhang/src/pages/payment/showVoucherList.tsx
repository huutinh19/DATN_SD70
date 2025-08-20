// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import Images from "../../static";
// import axios from "axios";
// import API from "../../api";
// import { IVoucher } from "../../types/product.type";
// import { formartDate } from "../../utils/formatCurrency";
// import { convertToCurrencyString } from "../../utils/format";
// import { toast } from "react-toastify";
// const ShowVoucherList = ({
//   valueCheck,
//   setPrecent,
//   setCodeVoucher,
//   setVoucher,
// }: {
//   valueCheck: number;
//   setPrecent: any;
//   setCodeVoucher: any;
//   setVoucher: any;
// }) => {
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     arrows: false,
//     slidesToShow: 2,
//     slidesToScroll: 1,
//   };
//   const [dataVoucher, setDataVoucher] = useState<IVoucher[]>();
//   const [inputVoucher, setInputVoucher] = useState<string>();
//   const sliderRef = React.useRef<Slider>(null);
//   const next = () => {
//     if (sliderRef.current) {
//       sliderRef.current.slickNext();
//     }
//   };
//   const prev = () => {
//     if (sliderRef.current) {
//       sliderRef.current.slickPrev();
//     }
//   };
//   const getVoucherSearch = async () => {
//     const res = await axios({
//       method: "get",
//       url: API.getVoucherSearchPub(inputVoucher ? inputVoucher : ""),
//     });
//     if (res.status) {
//       if (res?.data?.data.length === 1) {
//         if (valueCheck >= res?.data?.data[0].minBillValue) {
//           setPrecent(res?.data?.data[0]?.percentReduce);
//           setVoucher(res?.data?.data[0]?.id);
//           toast.success("Áp dụng voucher thành công");
//         } else {
//           toast.warning("Voucher không được áp dụng");
//         }
//       } else {
//         toast.warning("Không tìm thấy mã");
//       }
//     }
//   };
//   const getAllVoucher = async () => {
//     const res = await axios({
//       method: "get",
//       url: API.getVoucherPublic(),
//     });
//     if (res.status) {
//       setDataVoucher(res?.data?.data);
//     }
//   };
//   const handleChangeInput = (event: any) => {
//     setInputVoucher(event?.target?.value);
//   };
//   useEffect(() => {
//     getAllVoucher();
//   }, []);

//   return (
//     <div className="">
//       <div className="flex items-center gap-5 mx-4 mb-4">
//         <input
//           onChange={handleChangeInput}
//           value={inputVoucher}
//           type="text"
//           placeholder="Nhập mã voucher tại đây"
//           className="text-sm font-semibold py-2 border-gray-300 rounded-[5px] w-[75%]"
//         />
//         <div
//           className="border-[1px] border-gray-400 px-4 py-1 rounded-[5px] cursor-pointer"
//           onClick={() => {
//             getVoucherSearch();
//           }}
//         >
//           <span className="font-medium">Áp dụng</span>
//         </div>
//       </div>
//       <div className="flex items-center  mr-4">
//         {!!dataVoucher && dataVoucher.length <= 2 ? (
//           !!dataVoucher &&
//           dataVoucher.length > 0 &&
//           dataVoucher.map((item, index) => {
//             return (
//               <div
//                 key={index}
//                 className=" cursor-pointer"
//                 onClick={() => {
//                   if (valueCheck >= item?.minBillValue) {
//                     setPrecent(item?.percentReduce);
//                     setCodeVoucher(item?.code);
//                     setVoucher(item?.id);
//                     toast.success("Áp dụng voucher thành công");
//                   } else {
//                     toast.warning("Voucher không được áp dụng");
//                   }
//                 }}
//               >
//                 <div className="w-[250px] h-[88px] absolute flex items-center ">
//                   <img src={Images.iconGift} alt="" className="w-6 ml-4 mr-2" />
//                   <div className="border-l-2 border-dashed  h-[92%] p-1">
//                     <p className="text-[10px] font-semibold text-blue-600">
//                       Nhập mã{" "}
//                       <span className="bg-blue-600 px-1 rounded text-white">
//                         {item?.code}
//                       </span>
//                     </p>
//                     <p className="font-semibold">Giảm {item?.percentReduce}%</p>
//                     <p className="text-[10px] font-normal">
//                       Cho đơn hàng từ:{" "}
//                       {convertToCurrencyString(item?.minBillValue)}
//                     </p>
//                     <p className="text-[8px] text-blue-600">
//                       Thời gian áp dụng từ: {formartDate(item?.startDate)}
//                     </p>
//                   </div>
//                 </div>
//                 <img
//                   src={Images.bgItemVoucher}
//                   className="w-[250px] h-[88px]  "
//                 />
//               </div>
//             );
//           })
//         ) : !!dataVoucher && dataVoucher.length >= 2 ? (
//           <>
//             <button onClick={() => prev()}>
//               <a className="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative   ">
//                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB40lEQVR4nO3V30tTcRjH8f0VhihhaCKKmLZYk1FZIQ3x1gvxRrrwUi8CC8Ux03S45q+lTvztWjK9rFXObWc7++XOZv4BoUgXiiskw2xs8JEdd9HF9/mewts9f8DrDc95vhyVKj//M47mLyFH8w7eNiWwqo9j5UkcS40SFh/HMP9oG3MN25i9H4XtXgQzujCm6sN4ow1hUhPExB0RY2oRllq/yAlcDR+tC8Byyw8y8C/4tC6I8bsCrFqRiZtrOAFlPIT3hl2kztJwdkpMfKRaoANKa7G3h5FOZZCdjS6JiZuqfHSAh9v0Ik6Pfst47N0eXt8WmPhwpZcOUPikzo+DRFLGv+3+gEXjI/FXFZwAE9eKSDj3ZfxX8hzWRoGLD5Z76ADrFDe6JBnP7n6xLaiID9zcogOsO3d25gJ/MlhoFRXx/lI3HWA9olG1gNjanhw5PT7H+EMvFzfe4ASoF2pWe7AvHcuRg53vGKpxk7ihZJMO8J7/2AMvfh5enmnU/hUvK9xMvO/6ZzpA4ebczmdbAvK3yM5qR4SJ9xZ/ogM83FTlw1ClB+vPJJydpLD8NMzEe4o4AR4+nNv5QPkWDGUuGEs3mfiLwo90QAkfJHb+N/78mosOZH8WV8W7Cz4EyEB+VIy5AMnrU4emsRhoAAAAAElFTkSuQmCC" />
//               </a>
//             </button>
//             <Slider {...settings} className="w-[90%] mx-auto" ref={sliderRef}>
//               {!!dataVoucher &&
//                 dataVoucher.length > 0 &&
//                 dataVoucher.map((item, index) => {
//                   return (
//                     <div
//                       key={index}
//                       className=" cursor-pointer"
//                       onClick={() => {
//                         if (valueCheck >= item?.minBillValue) {
//                           setPrecent(item?.percentReduce);
//                           setCodeVoucher(item?.code);
//                           setVoucher(item?.id);
//                           toast.success("Áp dụng voucher thành công");
//                         } else {
//                           toast.warning("Voucher không được áp dụng");
//                         }
//                       }}
//                     >
//                       <div className="w-[250px] h-[88px] absolute flex items-center ">
//                         <img
//                           src={Images.iconGift}
//                           alt=""
//                           className="w-6 ml-4 mr-2"
//                         />
//                         <div className="border-l-2 border-dashed  h-[92%] p-1">
//                           <p className="text-[10px] font-semibold text-blue-600">
//                             Nhập mã{" "}
//                             <span className="bg-blue-600 px-1 rounded text-white">
//                               {item?.code}
//                             </span>
//                           </p>
//                           <p className="font-semibold">
//                             Giảm {item?.percentReduce}%
//                           </p>
//                           <p className="text-[10px] font-normal">
//                             Cho đơn hàng từ:{" "}
//                             {convertToCurrencyString(item?.minBillValue)}
//                           </p>
//                           <p className="text-[8px] text-blue-600">
//                             Thời gian áp dụng từ: {formartDate(item?.startDate)}
//                           </p>
//                         </div>
//                       </div>
//                       <img
//                         src={Images.bgItemVoucher}
//                         className="w-[250px] h-[88px]  "
//                       />
//                     </div>
//                   );
//                 })}
//             </Slider>
//             <button
//               onClick={() => {
//                 next();
//               }}
//             >
//               <a className="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative  ">
//                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB30lEQVR4nO3T309ScRjHcf6KWqs1G+kczZTCCkel5ZqOedtF66ati+60ra2aTkcZ1VQQpVCm2Q9iQVwmGcjpHA4gcUjXvcNWN05sLZk/SLeP4zC9ged7cNzy/AGv99lzvo9KVZmDzP1D09EHh/14eOQzuo/OoOfYDHqPf0FfVQCmE0E8UgfRXz2LJzUhmGs5PNNweH7qKwbqeAzWC7A0CLBoBZEMlItbz4QxrBNBBijcpA6g76Qf/TWzivhIIyNAffmb2zGs/83i4z0JTzUhJj56PkIHqLW47sSRm+2tHTivh5n4C32UDlA7f1wbRNy1KEfWVjZhu8KR+MumGB1g/VDz6QCWEity5NfCKoYauaL4mIERUHotw80c/i1vyJHEhxSsOr4AH780RwdKeYqvbojyv8iNt1MqwJ2X43SglHc+dTOC7Ww+4OuSCvCJlm90QAm3t/L7K0p6UhjViwX45FVGgIUPnePwM5mW8d8//sB+USiKT7Um6ACJn+UheVIynklvwmkMk/jraxIdoC7Ud1fKH1p2B65bMSb+ti1JB6gL9XZK2Mr8x6feBTgMUSb+rp0RoM7frhdhu8DDYYgo4u+N3+kA6/zHFNayh7s75hkBrSCWi7s75sNkoDKqIrML85NThOciw8QAAAAASUVORK5CYII=" />{" "}
//               </a>
//             </button>
//           </>
//         ) : (
//           ""
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShowVoucherList;



// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import Images from "../../static";
// import axios from "axios";
// import API from "../../api";
// import { IVoucher } from "../../types/product.type";
// import { formartDate } from "../../utils/formatCurrency";
// import { convertToCurrencyString } from "../../utils/format";
// import { toast } from "react-toastify";

// const ShowVoucherList = ({
//   valueCheck,
//   setPrecent,
//   setCodeVoucher,
//   setVoucher,
// }: {
//   valueCheck: number;
//   setPrecent: any;
//   setCodeVoucher: any;
//   setVoucher: any;
// }) => {
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     arrows: false,
//     slidesToShow: 2,
//     slidesToScroll: 1,
//   };
//   const [dataVoucher, setDataVoucher] = useState<IVoucher[]>([]);
//   const [inputVoucher, setInputVoucher] = useState<string>("");
//   const sliderRef = React.useRef<Slider>(null);

//   const next = () => sliderRef.current?.slickNext();
//   const prev = () => sliderRef.current?.slickPrev();

//   const getAllVouchers = async () => {
//     try {
//       const res = await axios.get(API.getVoucher());
//       if (res.status === 200) {
//         setDataVoucher(res.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching vouchers:", error);
//     }
//   };

//   const applyVoucherByCode = async () => {
//     try {
//       const res = await axios.get(API.getVoucherSearch(inputVoucher));
//       if (res.status === 200 && res.data.data.length === 1) {
//         const voucher = res.data.data[0];
//         if (valueCheck >= voucher.minBillValue) {
//           setPrecent(voucher.percentReduce);
//           setCodeVoucher(voucher.code);
//           setVoucher(voucher.id);
//           toast.success("Áp dụng voucher thành công");
//           setInputVoucher("");
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
//     getAllVouchers();
//   }, []);

//   return (
//     <div>
//       <div className="flex items-center gap-5 mx-4 mb-4">
//         <input
//           onChange={(e) => setInputVoucher(e.target.value)}
//           value={inputVoucher}
//           type="text"
//           placeholder="Nhập mã voucher tại đây"
//           className="text-sm font-semibold py-2 border-gray-300 rounded-[5px] w-[75%]"
//         />
//         <div
//           className="border-[1px] border-gray-400 px-4 py-1 rounded-[5px] cursor-pointer"
//           onClick={applyVoucherByCode}
//         >
//           <span className="font-medium">Áp dụng</span>
//         </div>
//       </div>
//       <div className="flex items-center mr-4">
//         {dataVoucher.length <= 2 ? (
//           dataVoucher.map((item) => (
//             <div
//               key={item.id}
//               className="cursor-pointer"
//               onClick={() => {
//                 if (valueCheck >= item.minBillValue) {
//                   setPrecent(item.percentReduce);
//                   setCodeVoucher(item.code);
//                   setVoucher(item.id);
//                   toast.success("Áp dụng voucher thành công");
//                 } else {
//                   toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
//                 }
//               }}
//             >
//               <div className="w-[250px] h-[88px] absolute flex items-center">
//                 <img src={Images.iconGift} alt="" className="w-6 ml-4 mr-2" />
//                 <div className="border-l-2 border-dashed h-[92%] p-1">
//                   <p className="text-[10px] font-semibold text-blue-600">
//                     Nhập mã <span className="bg-blue-600 px-1 rounded text-white">{item.code}</span>
//                   </p>
//                   <p className="font-semibold">Giảm {item.percentReduce}%</p>
//                   <p className="text-[10px] font-normal">
//                     Cho đơn hàng từ: {convertToCurrencyString(item.minBillValue)}
//                   </p>
//                   <p className="text-[8px] text-blue-600">
//                     Thời gian áp dụng từ: {formartDate(item.startDate)}
//                   </p>
//                 </div>
//               </div>
//               <img src={Images.bgItemVoucher} className="w-[250px] h-[88px]" />
//             </div>
//           ))
//         ) : (
//           <>
//             <button onClick={prev}>
//               <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB40lEQVR4nO3V30tTcRjH8f0VhihhaCKKmLZYk1FZIQ3x1gvxRrrwUi8CC8Ux03S45q+lTvztWjK9rFXObWc7++XOZv4BoUgXiiskw2xs8JEdd9HF9/mewts9f8DrDc95vhyVKj//M47mLyFH8w7eNiWwqo9j5UkcS40SFh/HMP9oG3MN25i9H4XtXgQzujCm6sN4ow1hUhPExB0RY2oRllq/yAlcDR+tC8Byyw8y8C/4tC6I8bsCrFqRiZtrOAFlPIT3hl2kztJwdkpMfKRaoANKa7G3h5FOZZCdjS6JiZuqfHSAh9v0Ik6Pfst47N0eXt8WmPhwpZcOUPikzo+DRFLGv+3+gEXjI/FXFZwAE9eKSDj3ZfxX8hzWRoGLD5Z76ADrFDe6JBnP7n6xLaiID9zcogOsO3d25gJ/MlhoFRXx/lI3HWA9olG1gNjanhw5PT7H+EMvFzfe4ASoF2pWe7AvHcuRg53vGKpxk7ihZJMO8J7/2AMvfh5enmnU/hUvK9xMvO/6ZzpA4ebczmdbAvK3yM5qR4SJ9xZ/ogM83FTlw1ClB+vPJJydpLD8NMzEe4o4AR4+nNv5QPkWDGUuGEs3mfiLwo90QAkfJHb+N/78mosOZH8WV8W7Cz4EyEB+VIy5AMnrU4emsRhoAAAAAElFTkSuQmCC" />
//             </button>
//             <Slider {...settings} className="w-[90%] mx-auto" ref={sliderRef}>
//               {dataVoucher.map((item) => (
//                 <div
//                   key={item.id}
//                   className="cursor-pointer"
//                   onClick={() => {
//                     if (valueCheck >= item.minBillValue) {
//                       setPrecent(item.percentReduce);
//                       setCodeVoucher(item.code);
//                       setVoucher(item.id);
//                       toast.success("Áp dụng voucher thành công");
//                     } else {
//                       toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
//                     }
//                   }}
//                 >
//                   <div className="w-[250px] h-[88px] absolute flex items-center">
//                     <img src={Images.iconGift} alt="" className="w-6 ml-4 mr-2" />
//                     <div className="border-l-2 border-dashed h-[92%] p-1">
//                       <p className="text-[10px] font-semibold text-blue-600">
//                         Nhập mã <span className="bg-blue-600 px-1 rounded text-white">{item.code}</span>
//                       </p>
//                       <p className="font-semibold">Giảm {item.percentReduce}%</p>
//                       <p className="text-[10px] font-normal">
//                         Cho đơn hàng từ: {convertToCurrencyString(item.minBillValue)}
//                       </p>
//                       <p className="text-[8px] text-blue-600">
//                         Thời gian áp dụng từ: {formartDate(item.startDate)}
//                       </p>
//                     </div>
//                   </div>
//                   <img src={Images.bgItemVoucher} className="w-[250px] h-[88px]" />
//                 </div>
//               ))}
//             </Slider>
//             <button onClick={next}>
//               <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB30lEQVR4nO3T309ScRjHcf6KWqs1G+kczZTCCkel5ZqOedtF66ati+60ra2aTkcZ1VQQpVCm2Q9iQVwmGcjpHA4gcUjXvcNWN05sLZk/SLeP4zC9ged7cNzy/AGv99lzvo9KVZmDzP1D09EHh/14eOQzuo/OoOfYDHqPf0FfVQCmE0E8UgfRXz2LJzUhmGs5PNNweH7qKwbqeAzWC7A0CLBoBZEMlItbz4QxrBNBBijcpA6g76Qf/TWzivhIIyNAffmb2zGs/83i4z0JTzUhJj56PkIHqLW47sSRm+2tHTivh5n4C32UDlA7f1wbRNy1KEfWVjZhu8KR+MumGB1g/VDz6QCWEity5NfCKoYauaL4mIERUHotw80c/i1vyJHEhxSsOr4AH780RwdKeYqvbojyv8iNt1MqwJ2X43SglHc+dTOC7Ww+4OuSCvCJlm90QAm3t/L7K0p6UhjViwX45FVGgIUPnePwM5mW8d8//sB+USiKT7Um6ACJn+UheVIynklvwmkMk/jraxIdoC7Ud1fKH1p2B65bMSb+ti1JB6gL9XZK2Mr8x6feBTgMUSb+rp0RoM7frhdhu8DDYYgo4u+N3+kA6/zHFNayh7s75hkBrSCWi7s75sNkoDKqIrML85NThOciw8QAAAAASUVORK5CYII=" />
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShowVoucherList;



// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import Images from "../../static";
// import axios from "axios";
// import API from "../../api";
// import { IVoucher } from "../../types/product.type";
// import { formartDate } from "../../utils/formatCurrency";
// import { convertToCurrencyString } from "../../utils/format";
// import { toast } from "react-toastify";

// const ShowVoucherList = ({
//   valueCheck,
//   setPrecent,
//   setCodeVoucher,
//   setVoucher,
// }: {
//   valueCheck: number;
//   setPrecent: any;
//   setCodeVoucher: any;
//   setVoucher: any;
// }) => {
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     arrows: false,
//     slidesToShow: 2,
//     slidesToScroll: 1,
//   };
//   const [dataVoucher, setDataVoucher] = useState<IVoucher[]>([]);
//   const [inputVoucher, setInputVoucher] = useState<string>("");
//   const sliderRef = React.useRef<Slider>(null);

//   const next = () => sliderRef.current?.slickNext();
//   const prev = () => sliderRef.current?.slickPrev();

//   const getAllVouchers = async () => {
//     try {
//       const params = {
//         status: 1
//       };
  
//       const res = await axios.get(API.getVoucher(), { params }); // Passing params as query params in the GET request
  
//       if (res.status === 200) {
//         setDataVoucher(res.data.data || []);
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
//           setCodeVoucher(voucher.code);
//           setVoucher(voucher.id);
//           toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
//           setInputVoucher("");
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
//     getAllVouchers();
//   }, []);

//   const renderVoucherItem = (item: IVoucher) => (
//     <div
//       key={item.id}
//       className="cursor-pointer"
//       onClick={() => {
//         if (valueCheck >= item.minBillValue) {
//           const discount = calculateDiscount(item, valueCheck);
//           setPrecent(discount / valueCheck * 100); // Chuyển đổi thành phần trăm thực tế
//           setCodeVoucher(item.code);
//           setVoucher(item.id);
//           toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
//         } else {
//           toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
//         }
//       }}
//     >
//       <div className="w-[250px] h-[88px] absolute flex items-center">
//         <img src={Images.iconGift} alt="" className="w-6 ml-4 mr-2" />
//         <div className="border-l-2 border-dashed h-[92%] p-1">
//           <p className="text-[10px] font-semibold text-blue-600">
//             Nhập mã <span className="bg-blue-600 px-1 rounded text-white">{item.code}</span>
//           </p>
//           <p className="font-semibold">Giảm {item.percentReduce}%</p>
//           <p className="text-[10px] font-normal">
//             Cho đơn hàng từ: {convertToCurrencyString(item.minBillValue)}
//             {item.maxBillValue && `, tối đa ${convertToCurrencyString(item.maxBillValue)}`}
//           </p>
//           <p className="text-[8px] text-blue-600">
//             Thời gian áp dụng từ: {formartDate(item.startDate)}
//           </p>
//         </div>
//       </div>
//       <img src={Images.bgItemVoucher} className="w-[250px] h-[88px]" />
//     </div>
//   );

//   return (
//     <div>
//       <div className="flex items-center gap-5 mx-4 mb-4">
//         <input
//           onChange={(e) => setInputVoucher(e.target.value)}
//           value={inputVoucher}
//           type="text"
//           placeholder="Nhập mã voucher tại đây"
//           className="text-sm font-semibold py-2 border-gray-300 rounded-[5px] w-[75%]"
//         />
//         <div
//           className="border-[1px] border-gray-400 px-4 py-1 rounded-[5px] cursor-pointer"
//           onClick={applyVoucherByCode}
//         >
//           <span className="font-medium">Áp dụng</span>
//         </div>
//       </div>
//       <div className="flex items-center mr-4">
//         {dataVoucher.length <= 2 ? (
//           dataVoucher.map((item) => renderVoucherItem(item))
//         ) : (
//           <>
//             <button onClick={prev}>
//               <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB40lEQVR4nO3V30tTcRjH8f0VhihhaCKKmLZYk1FZIQ3x1gvxRrrwUi8CC8Ux03S45q+lTvztWjK9rFXObWc7++XOZv4BoUgXiiskw2xs8JEdd9HF9/mewts9f8DrDc95vhyVKj//M47mLyFH8w7eNiWwqo9j5UkcS40SFh/HMP9oG3MN25i9H4XtXgQzujCm6sN4ow1hUhPExB0RY2oRllq/yAlcDR+tC8Byyw8y8C/4tC6I8bsCrFqRiZtrOAFlPIT3hl2kztJwdkpMfKRaoANKa7G3h5FOZZCdjS6JiZuqfHSAh9v0Ik6Pfst47N0eXt8WmPhwpZcOUPikzo+DRFLGv+3+gEXjI/FXFZwAE9eKSDj3ZfxX8hzWRoGLD5Z76ADrFDe6JBnP7n6xLaiID9zcogOsO3d25gJ/MlhoFRXx/lI3HWA9olG1gNjanhw5PT7H+EMvFzfe4ASoF2pWe7AvHcuRg53vGKpxk7ihZJMO8J7/2AMvfh5enmnU/hUvK9xMvO/6ZzpA4ebczmdbAvK3yM5qR4SJ9xZ/ogM83FTlw1ClB+vPJJydpLD8NMzEe4o4AR4+nNv5QPkWDGUuGEs3mfiLwo90QAkfJHb+N/78mosOZH8WV8W7Cz4EyEB+VIy5AMnrU4emsRhoAAAAAElFTkSuQmCC" />
//             </button>
//             <Slider {...settings} className="w-[90%] mx-auto" ref={sliderRef}>
//               {dataVoucher.map((item) => renderVoucherItem(item))}
//             </Slider>
//             <button onClick={next}>
//               <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB30lEQVR4nO3T309ScRjHcf6KWqs1G+kczZTCCkel5ZqOedtF66ati+60ra2aTkcZ1VQQpVCm2Q9iQVwmGcjpHA4gcUjXvcNWN05sLZk/SLeP4zC9ged7cNzy/AGv99lzvo9KVZmDzP1D09EHh/14eOQzuo/OoOfYDHqPf0FfVQCmE0E8UgfRXz2LJzUhmGs5PNNweH7qKwbqeAzWC7A0CLBoBZEMlItbz4QxrBNBBijcpA6g76Qf/TWzivhIIyNAffmb2zGs/83i4z0JTzUhJj56PkIHqLW47sSRm+2tHTivh5n4C32UDlA7f1wbRNy1KEfWVjZhu8KR+MumGB1g/VDz6QCWEity5NfCKoYauaL4mIERUHotw80c/i1vyJHEhxSsOr4AH780RwdKeYqvbojyv8iNt1MqwJ2X43SglHc+dTOC7Ww+4OuSCvCJlm90QAm3t/L7K0p6UhjViwX45FVGgIUPnePwM5mW8d8//sB+USiKT7Um6ACJn+UheVIynklvwmkMk/jraxIdoC7Ud1fKH1p2B65bMSb+ti1JB6gL9XZK2Mr8x6feBTgMUSb+rp0RoM7frhdhu8DDYYgo4u+N3+kA6/zHFNayh7s75hkBrSCWi7s75sNkoDKqIrML85NThOciw8QAAAAASUVORK5CYII=" />
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShowVoucherList;



import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Images from "../../static";
import axios from "axios";
import API from "../../api";
import { IVoucher } from "../../types/product.type";
import { formartDate } from "../../utils/formatCurrency";
import { convertToCurrencyString } from "../../utils/format";
import { toast } from "react-toastify";

// Định nghĩa icon prev/next (có thể thay bằng SVG hoặc hình ảnh khác)
const PrevIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const NextIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const ShowVoucherList = ({
  valueCheck,
  setPrecent,
  setCodeVoucher,
  setVoucher,
}: {
  valueCheck: number;
  setPrecent: any;
  setCodeVoucher: any;
  setVoucher: any;
}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [dataVoucher, setDataVoucher] = useState<IVoucher[]>([]);
  const [inputVoucher, setInputVoucher] = useState<string>("");
  const [bestVoucherIndex, setBestVoucherIndex] = useState<number>(-1);
  const sliderRef = React.useRef<Slider>(null);

  const next = () => sliderRef.current?.slickNext();
  const prev = () => sliderRef.current?.slickPrev();

  const getAllVouchers = async () => {
    try {
      const params = {
        status: 1
      };
  
      const res = await axios.get(API.getVoucher(), { params });
      if (res.status === 200) {
        setDataVoucher(res.data.data || []);
        const index = findBestVoucher(res.data.data, valueCheck);
        setBestVoucherIndex(index);
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

  const findBestVoucher = (vouchers: IVoucher[], total: number) => {
    let bestVoucher: IVoucher | null = null;
    let maxDiscount = 0;

    vouchers.forEach((voucher) => {
      if (total >= voucher.minBillValue) {
        const discount = calculateDiscount(voucher, total);
        if (discount > maxDiscount) {
          maxDiscount = discount;
          bestVoucher = voucher;
        }
      }
    });

    return bestVoucher ? vouchers.indexOf(bestVoucher) : -1;
  };

  const applyVoucherByCode = async () => {
    try {
      const res = await axios.get(API.getVoucherSearch(inputVoucher));
      if (res.status === 200 && res.data.data.length === 1) {
        const voucher = res.data.data[0];
        if (valueCheck >= voucher.minBillValue) {
          const discount = calculateDiscount(voucher, valueCheck);
          setPrecent(discount / valueCheck * 100);
          setCodeVoucher(voucher.code);
          setVoucher(voucher.id);
          
          toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
          setInputVoucher("");
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
    getAllVouchers();
  }, [valueCheck]);

  const renderVoucherItem = (item: IVoucher, isBestVoucher: boolean = false) => (
    <div
      key={item.id}
      className="relative w-[260px] h-[140px] mx-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
      onClick={() => {
        if (valueCheck >= item.minBillValue) {
          const discount = calculateDiscount(item, valueCheck);
          setPrecent(discount / valueCheck * 100);
          setCodeVoucher(item.code);
          setVoucher(item.id);
          toast.success(`Áp dụng voucher thành công, giảm ${convertToCurrencyString(discount)}`);
        } else {
          toast.warning("Đơn hàng chưa đủ điều kiện áp dụng voucher");
        }
      }}
    >
      {/* Badge cho voucher tốt nhất */}
      {isBestVoucher && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          Tốt nhất
        </div>
      )}
      <div className="flex h-full">
        {/* Cột trái: Icon và thông tin chính */}
        <div className="w-1/3 flex flex-col items-center justify-center bg-blue-700/50">
          <img src={Images.iconGift} alt="gift" className="w-10 h-10 mb-2" />
          <span className="text-white text-xs font-semibold">{item.code}</span>
        </div>
        {/* Cột phải: Thông tin chi tiết */}
        <div className="w-2/3 p-3 text-white">
        
          <p className="text-lg font-bold">Giảm {item.percentReduce}%</p>
          <p className="text-xs mt-1">
            Đơn từ: {convertToCurrencyString(item.minBillValue)}
          </p>
          {item.maxBillValue && (
            <p className="text-xs">Tối đa: {convertToCurrencyString(item.maxBillValue)}</p>
          )}
          <p className="text-xs">Số lượng còn: {item.quantity}</p>
          <p className="text-[10px] opacity-80 mt-1">
            HSD: {formartDate(item.endDate)}
          </p>
          
          <button className="absolute bottom-2 right-2 bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-100 transition">
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      {/* Input và nút áp dụng */}
      <div className="flex items-center gap-3 mb-6">
        <input
          onChange={(e) => setInputVoucher(e.target.value)}
          value={inputVoucher}
          type="text"
          placeholder="Nhập mã voucher"
          className="text-sm font-medium py-3 px-4 border-gray-300 rounded-lg w-[70%] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />
        <button
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-md"
          onClick={applyVoucherByCode}
        >
          Áp dụng
        </button>
      </div>

      {/* Gợi ý voucher tốt nhất */}
      {bestVoucherIndex !== -1 && (
        <div className="text-center text-sm text-green-600 mb-4">
          Gợi ý: Dùng mã{" "}
          <span className="font-bold">{dataVoucher[bestVoucherIndex].code}</span> để tiết kiệm tối đa!
        </div>
      )}

      {/* Slider hoặc danh sách voucher */}
      <div className="flex items-center justify-center gap-4">
        {dataVoucher.length <= 2 ? (
          <div className="flex gap-4">
            {dataVoucher.map((item, index) => renderVoucherItem(item, index === bestVoucherIndex))}
          </div>
        ) : (
          <>
            <button
              className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition"
              onClick={prev}
            >
              <PrevIcon />
            </button>
            <Slider {...settings} className="w-[80%] mx-auto" ref={sliderRef}>
              {dataVoucher.map((item, index) => renderVoucherItem(item, index === bestVoucherIndex))}
            </Slider>
            <button
              className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition"
              onClick={next}
            >
              <NextIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowVoucherList;