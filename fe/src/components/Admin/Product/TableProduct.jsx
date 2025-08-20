



// // import {
// //   Button,
// //   Collapse,
// //   Empty,
// //   Input,
// //   InputNumber,
// //   Modal,
// //   Upload,
// //   message,
// // } from "antd";
// // import React, { useEffect, useState } from "react";
// // import { toast } from "react-toastify";
// // import ImageModal from "./ImageModal";
// // import "./TableProduct.css";

// // function TableProduct({ props, handleChange }) {
// //   const [groupByColor, setGroupByColor] = useState([]);

// //   // Price formatting function
// //   const formatPrice = (price) => {
// //     if (price === undefined || price === null) return "0";
// //     return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`;
// //   };

// //   const handleImageSelect = (colorName, index, files) => {
// //     const updatedItems = [...groupByColor[colorName]];
// //     for (let i = 0; i < updatedItems.length; i++) {
// //       updatedItems[i] = { ...updatedItems[i], images: files };
// //     }
// //     setGroupByColor({
// //       ...groupByColor,
// //       [colorName]: updatedItems,
// //     });
// //     handleChange(
// //       Object.values({
// //         ...groupByColor,
// //         [colorName]: [...updatedItems],
// //       }).flat()
// //     );
// //     console.log(groupByColor);
// //   };

// //   const handleChangeQuantity = (value, colorName, index) => {
// //     if (value < 1) {
// //       toast.error("Số lượng phải >= 1!");
// //     } else {
// //       const updatedItems = [...groupByColor[colorName]];
// //       updatedItems[index] = { ...updatedItems[index], quantity: value };
// //       setGroupByColor({
// //         ...groupByColor,
// //         [colorName]: updatedItems,
// //       });
// //       handleChange(
// //         Object.values({
// //           ...groupByColor,
// //           [colorName]: [...updatedItems],
// //         }).flat()
// //       );
// //     }
// //   };

// //   const handleChangePrice = (event, colorName, index) => {
// //     const value = parseInt(event.target.value.replace(/[^0-9]/g, "")); // Remove non-numeric characters
// //     if (isNaN(value) || value < 1) {
// //       toast.error("Đơn giá không hợp lệ!");
// //     } else {
// //       const updatedItems = [...groupByColor[colorName]];
// //       updatedItems[index] = { ...updatedItems[index], price: value };
// //       setGroupByColor({
// //         ...groupByColor,
// //         [colorName]: updatedItems,
// //       });
// //       handleChange(
// //         Object.values({
// //           ...groupByColor,
// //           [colorName]: [...updatedItems],
// //         }).flat()
// //       );
// //     }
// //   };

// //   const handleChangeWeight = (event, colorName, index) => {
// //     const value = parseInt(event.target.value);
// //     if (value < 1) {
// //       toast.error("Cân nặng không hợp lệ!");
// //     } else {
// //       const updatedItems = [...groupByColor[colorName]];
// //       updatedItems[index] = { ...updatedItems[index], weight: value };
// //       setGroupByColor({
// //         ...groupByColor,
// //         [colorName]: updatedItems,
// //       });
// //       handleChange(
// //         Object.values({
// //         ...groupByColor,
// //         [colorName]: [...updatedItems],
// //       }).flat()
// //     );
// //   }
// // };

// // const deleteProductDetail = (colorName, index) => {
// //   const items = groupByColor[colorName];
// //   items.splice(index, 1);

// //   // Cập nhật lại groupByColor sau khi xóa
// //   setGroupByColor({
// //     ...groupByColor,
// //     [colorName]: [...items],
// //   });

// //   const allItems = Object.values({
// //     ...groupByColor,
// //     [colorName]: [...items],
// //   }).flat();
// //   handleChange(allItems);
// //   toast.success("Xóa thành công!");
// // };

// // useEffect(() => {
// //   const groupedProducts = {};
// //   props.forEach((option) => {
// //     const colorName = option.color.name;

// //     if (!groupedProducts[colorName]) {
// //       groupedProducts[colorName] = [];
// //     }

// //     groupedProducts[colorName].push(option);
// //   });
// //   setGroupByColor(groupedProducts);
// // }, [props]);

// // return (
// //   <>
// //     <Collapse defaultActiveKey={0} className="rounded-0 border-0">
// //       <Collapse.Panel key={0} className="border-bottom-0">
// //         <div className="table-responsive">
// //           <table className="table table-borderless text-nowrap">
// //             <tbody>
// //               {Object.entries(groupByColor).map(([key, items], index) => (
// //                 <React.Fragment key={index}>
// //                   <tr className="fw-semibold">
// //                     <td className="bg-primary">STT</td>
// //                     <td className="bg-primary">Sản phẩm</td>
// //                     <td className="bg-primary">Số lượng</td>
// //                     <td className="bg-primary">Đơn giá</td>
// //                     {/* <td className="bg-primary">Cân nặng</td> */}
// //                     <td className="bg-primary">Xuất xứ</td>
// //                     <td className="bg-primary">Thương hiệu</td>
// //                     <td className="bg-primary">Cổ áo</td>
// //                     <td className="bg-primary">Tay áo</td>
// //                     <td className="bg-primary">Chất liệu</td>
// //                     <td className="bg-primary"></td>
// //                   </tr>

// //                   {items.map((option, idx) => (
// //                     <tr key={idx}>
// //                       <>
// //                         {option.shoe &&
// //                         option.shoe !== undefined &&
// //                         option.shoe !== null ? (
// //                           <>
// //                             <td>{idx + 1}</td>
// //                             <td>
// //                               {option.shoe === undefined ||
// //                               option.shoe === null
// //                                 ? "Vui lòng chọn sản phẩm"
// //                                 : option.shoe.name}{" "}
// //                               [{option.color.name} - {option.size.name}]
// //                             </td>
// //                             <td width="100px">
// //                               <InputNumber
// //                                 className="table-input-number"
// //                                 defaultValue={option.quantity}
// //                                 onChange={(value) =>
// //                                   handleChangeQuantity(value, key, idx)
// //                                 }
// //                                 min={1}
// //                               />
// //                             </td>
// //                             <td width="150px">
// //                               <Input
// //                                 className="table-input"
// //                                 value={formatPrice(option.price)} // Display formatted price
// //                                 onChange={(event) =>
// //                                   handleChangePrice(event, key, idx)
// //                                 }
// //                                 onFocus={(e) =>
// //                                   e.target.value = option.price
// //                                 } // Show raw number on focus
// //                                 onBlur={(e) =>
// //                                   e.target.value = formatPrice(option.price)
// //                                 } // Show formatted price on blur
// //                               />
// //                             </td>
// //                             {/* <td width="100px">
// //                               <Input
// //                                 className="table-input"
// //                                 defaultValue={option.weight}
// //                                 onChange={(value) =>
// //                                   handleChangeWeight(value, key, idx)
// //                                 }
// //                               />
// //                             </td> */}
// //                             <td>{option.shoe.xuatXu}</td>
// //                             <td>{option.shoe.thuongHieu}</td>
// //                             <td>{option.shoe.coAo}</td>
// //                             <td>{option.shoe.tayAo}</td>
// //                             <td>{option.shoe.chatLieu}</td>
// //                             <td>
// //                               <button
// //                                 className="btn btn-sm"
// //                                 onClick={() => deleteProductDetail(key, idx)}
// //                               >
// //                                 <i className="fas fa-trash"></i>
// //                               </button>
// //                             </td>
// //                             {idx === 0 ? (
// //                               <>
// //                                 <td
// //                                   className="align-middle"
// //                                   rowSpan={items.length}
// //                                 ></td>
// //                               </>
// //                             ) : (
// //                               ""
// //                             )}
// //                           </>
// //                         ) : (
// //                           ""
// //                         )}
// //                       </>
// //                     </tr>
// //                   ))}
// //                 </React.Fragment>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </Collapse.Panel>
// //     </Collapse>
// //   </>
// // );
// // }

// // export default TableProduct;


// import {
//   Button,
//   Collapse,
//   Empty,
//   Input,
//   InputNumber,
//   Modal,
//   Upload,
//   message,
// } from "antd";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import ImageModal from "./ImageModal";
// import "./TableProduct.css";

// function TableProduct({ props, handleChange }) {
//   const [groupByColor, setGroupByColor] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [inputValues, setInputValues] = useState({});

//   const formatPrice = (price) => {
//     if (price === undefined || price === null || price === "" || isNaN(price)) return "";
//     return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
//   };

//   const validateField = (value, field, colorName, index) => {
//     let error = "";
//     if (value === null || value === undefined || value === "") {
//       error = `${field} không được để trống!`;
//     } else if (isNaN(value)) {
//       error = `${field} phải là số hợp lệ!`;
//     } else if (value < 0) {
//       error = `${field} không được âm!`;
//     }
//     setErrors((prev) => ({
//       ...prev,
//       [`${colorName}_${index}_${field.toLowerCase()}`]: error,
//     }));
//     return !error;
//   };

//   const hasErrors = () => {
//     return Object.values(errors).some((error) => error !== "");
//   };

//   const handleImageSelect = (colorName, index, files) => {
//     const updatedItems = [...groupByColor[colorName]];
//     for (let i = 0; i < updatedItems.length; i++) {
//       updatedItems[i] = { ...updatedItems[i], images: files };
//     }
//     setGroupByColor({
//       ...groupByColor,
//       [colorName]: updatedItems,
//     });
//     handleChange(
//       Object.values({
//         ...groupByColor,
//         [colorName]: [...updatedItems],
//       }).flat(),
//       hasErrors()
//     );
//   };

//   const handleChangeQuantity = (value, colorName, index) => {
//     const updatedItems = [...groupByColor[colorName]];
//     updatedItems[index] = { ...updatedItems[index], quantity: value };
//     setGroupByColor({
//       ...groupByColor,
//       [colorName]: updatedItems,
//     });
//     validateField(value, "Số lượng", colorName, index);
//     handleChange(
//       Object.values({
//         ...groupByColor,
//         [colorName]: [...updatedItems],
//       }).flat(),
//       hasErrors()
//     );
//   };

//   const handleChangePrice = (event, colorName, index) => {
//     const rawValue = event.target.value.replace(/,/g, "");
//     setInputValues((prev) => ({
//       ...prev,
//       [`${colorName}_${index}_price`]: rawValue,
//     }));

//     const value = rawValue === "" ? "" : parseInt(rawValue);
//     const updatedItems = [...groupByColor[colorName]];
//     updatedItems[index] = { ...updatedItems[index], price: value };
//     setGroupByColor({
//       ...groupByColor,
//       [colorName]: updatedItems,
//     });
//     validateField(value, "Đơn giá", colorName, index);
//     handleChange(
//       Object.values({
//         ...groupByColor,
//         [colorName]: [...updatedItems],
//       }).flat(),
//       hasErrors()
//     );
//   };

//   const handleBlurPrice = (event, colorName, index) => {
//     const rawValue = event.target.value.replace(/,/g, "");
//     const value = rawValue === "" ? "" : parseInt(rawValue);
//     validateField(value, "Đơn giá", colorName, index);
//     if (!isNaN(value) && value >= 0) {
//       setInputValues((prev) => ({
//         ...prev,
//         [`${colorName}_${index}_price`]: formatPrice(value),
//       }));
//     }
//   };

//   const handleChangeWeight = (event, colorName, index) => {
//     const rawValue = event.target.value;
//     const value = rawValue === "" ? "" : parseInt(rawValue);
//     const updatedItems = [...groupByColor[colorName]];
//     updatedItems[index] = { ...updatedItems[index], weight: value };
//     setGroupByColor({
//       ...groupByColor,
//       [colorName]: updatedItems,
//     });
//     validateField(value, "Cân nặng", colorName, index);
//     handleChange(
//       Object.values({
//         ...groupByColor,
//         [colorName]: [...updatedItems],
//       }).flat(),
//       hasErrors()
//     );
//   };

//   const deleteProductDetail = (colorName, index) => {
//     const items = groupByColor[colorName];
//     items.splice(index, 1);

//     setGroupByColor({
//       ...groupByColor,
//       [colorName]: [...items],
//     });

//     const allItems = Object.values({
//       ...groupByColor,
//       [colorName]: [...items],
//     }).flat();
//     handleChange(allItems, hasErrors());
//     toast.success("Xóa thành công!");
//   };

//   useEffect(() => {
//     const groupedProducts = {};
//     props.forEach((option) => {
//       const colorName = option.color.name;
//       if (!groupedProducts[colorName]) {
//         groupedProducts[colorName] = [];
//       }
//       groupedProducts[colorName].push(option);
//     });
//     setGroupByColor(groupedProducts);
//   }, [props]);

//   return (
//     <>
//       <Collapse defaultActiveKey={0} className="rounded-0 border-0">
//         <Collapse.Panel key={0} className="border-bottom-0">
//           <div className="table-responsive">
//             <table className="table table-borderless text-nowrap">
//               <tbody>
//                 {Object.entries(groupByColor).map(([key, items], index) => (
//                   <React.Fragment key={index}>
//                     <tr className="fw-semibold">
//                       <td className="bg-primary">STT</td>
//                       <td className="bg-primary">Sản phẩm</td>
//                       <td className="bg-primary">Số lượng</td>
//                       <td className="bg-primary">Đơn giá</td>
//                       <td className="bg-primary">Xuất xứ</td>
//                       <td className="bg-primary">Thương hiệu</td>
//                       <td className="bg-primary">Cổ áo</td>
//                       <td className="bg-primary">Tay áo</td>
//                       <td className="bg-primary">Chất liệu</td>
//                       <td className="bg-primary"></td>
//                     </tr>

//                     {items.map((option, idx) => (
//                       <tr key={idx}>
//                         <>
//                           {option.shoe &&
//                           option.shoe !== undefined &&
//                           option.shoe !== null ? (
//                             <>
//                               <td>{idx + 1}</td>
//                               <td>
//                                 {option.shoe === undefined ||
//                                 option.shoe === null
//                                   ? "Vui lòng chọn sản phẩm"
//                                   : option.shoe.name}{" "}
//                                 [{option.color.name} - {option.size.name}]
//                               </td>
//                               <td width="100px">
//                                 <InputNumber
//                                   className="table-input-number"
//                                   value={option.quantity}
//                                   onChange={(value) =>
//                                     handleChangeQuantity(value, key, idx)
//                                   }
//                                   allowClear
//                                 />
//                                 {errors[`${key}_${idx}_số lượng`] && (
//                                   <div style={{ color: "red", fontSize: "12px" }}>
//                                     {errors[`${key}_${idx}_số lượng`]}
//                                   </div>
//                                 )}
//                               </td>
//                               <td width="150px">
//                                 <Input
//                                   className="table-input"
//                                   value={inputValues[`${key}_${idx}_price`] || formatPrice(option.price)}
//                                   onChange={(event) =>
//                                     handleChangePrice(event, key, idx)
//                                   }
//                                   onBlur={(event) =>
//                                     handleBlurPrice(event, key, idx)
//                                   }
//                                   onFocus={(e) =>
//                                     (e.target.value = inputValues[`${key}_${idx}_price`] || option.price || "")
//                                   }
//                                 />
//                                 {errors[`${key}_${idx}_đơn giá`] && (
//                                   <div style={{ color: "red", fontSize: "12px" }}>
//                                     {errors[`${key}_${idx}_đơn giá`]}
//                                   </div>
//                                 )}
//                               </td>
//                               <td>{option.shoe.xuatXu}</td>
//                               <td>{option.shoe.thuongHieu}</td>
//                               <td>{option.shoe.coAo}</td>
//                               <td>{option.shoe.tayAo}</td>
//                               <td>{option.shoe.chatLieu}</td>
//                               <td>
//                                 <button
//                                   className="btn btn-sm"
//                                   onClick={() => deleteProductDetail(key, idx)}
//                                 >
//                                   <i className="fas fa-trash"></i>
//                                 </button>
//                               </td>
//                               {idx === 0 ? (
//                                 <td
//                                   className="align-middle"
//                                   rowSpan={items.length}
//                                 ></td>
//                               ) : (
//                                 ""
//                               )}
//                             </>
//                           ) : (
//                             ""
//                           )}
//                         </>
//                       </tr>
//                     ))}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Collapse.Panel>
//       </Collapse>
//     </>
//   );
// }

// export default TableProduct;


import {
  Button,
  Collapse,
  Empty,
  Input,
  InputNumber,
  Modal,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImageModal from "./ImageModal";
import "./TableProduct.css";

function TableProduct({ props, handleChange }) {
  const [groupByColor, setGroupByColor] = useState([]);
  const [errors, setErrors] = useState({});
  const [inputValues, setInputValues] = useState({});

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "" || isNaN(price)) return "";
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const validateField = (value, field, colorName, index) => {
    let error = "";
    if (value === null || value === undefined || value === "") {
      error = `${field} không được để trống!`;
    } else if (isNaN(value)) {
      error = `${field} phải là số hợp lệ!`;
    } else if (value < 0) {
      error = `${field} không được âm!`;
    }
    setErrors((prev) => ({
      ...prev,
      [`${colorName}_${index}_${field.toLowerCase()}`]: error,
    }));
    return !error;
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  const handleImageSelect = (colorName, index, files) => {
    const updatedItems = [...groupByColor[colorName]];
    for (let i = 0; i < updatedItems.length; i++) {
      updatedItems[i] = { ...updatedItems[i], images: files };
    }
    setGroupByColor({
      ...groupByColor,
      [colorName]: updatedItems,
    });
    handleChange(
      Object.values({
        ...groupByColor,
        [colorName]: [...updatedItems],
      }).flat(),
      hasErrors(),
      null,
      null
    );
  };

  const handleChangeQuantity = (value, colorName, index) => {
    const updatedItems = [...groupByColor[colorName]];
    updatedItems[index] = { ...updatedItems[index], quantity: value };
    setGroupByColor({
      ...groupByColor,
      [colorName]: updatedItems,
    });
    validateField(value, "Số lượng", colorName, index);
    handleChange(
      Object.values({
        ...groupByColor,
        [colorName]: [...updatedItems],
      }).flat(),
      hasErrors(),
      null,
      null
    );
  };

  const handleChangePrice = (event, colorName, index) => {
    const rawValue = event.target.value.replace(/,/g, "");
    setInputValues((prev) => ({
      ...prev,
      [`${colorName}_${index}_price`]: rawValue,
    }));

    const value = rawValue === "" ? "" : parseInt(rawValue);
    const updatedItems = [...groupByColor[colorName]];
    updatedItems[index] = { ...updatedItems[index], price: value };
    setGroupByColor({
      ...groupByColor,
      [colorName]: updatedItems,
    });
    validateField(value, "Đơn giá", colorName, index);
    handleChange(
      Object.values({
        ...groupByColor,
        [colorName]: [...updatedItems],
      }).flat(),
      hasErrors(),
      null,
      null
    );
  };

  const handleBlurPrice = (event, colorName, index) => {
    const rawValue = event.target.value.replace(/,/g, "");
    const value = rawValue === "" ? "" : parseInt(rawValue);
    validateField(value, "Đơn giá", colorName, index);
    if (!isNaN(value) && value >= 0) {
      setInputValues((prev) => ({
        ...prev,
        [`${colorName}_${index}_price`]: formatPrice(value),
      }));
    }
  };

  const handleChangeWeight = (event, colorName, index) => {
    const rawValue = event.target.value;
    const value = rawValue === "" ? "" : parseInt(rawValue);
    const updatedItems = [...groupByColor[colorName]];
    updatedItems[index] = { ...updatedItems[index], weight: value };
    setGroupByColor({
      ...groupByColor,
      [colorName]: updatedItems,
    });
    validateField(value, "Cân nặng", colorName, index);
    handleChange(
      Object.values({
        ...groupByColor,
        [colorName]: [...updatedItems],
      }).flat(),
      hasErrors(),
      null,
      null
    );
  };

  const deleteProductDetail = (colorName, index) => {
    const items = [...groupByColor[colorName]];
    const removedItem = items[index];
    items.splice(index, 1);

    // Kiểm tra xem màu sắc hoặc kích cỡ có còn được sử dụng trong các biến thể khác không
    const allItems = Object.values({
      ...groupByColor,
      [colorName]: [...items],
    }).flat();

    const removedColorId = !allItems.some((item) => item.color.id === removedItem.color.id)
      ? removedItem.color.id
      : null;
    const removedSizeId = !allItems.some((item) => item.size.id === removedItem.size.id)
      ? removedItem.size.id
      : null;

    setGroupByColor({
      ...groupByColor,
      [colorName]: [...items],
    });

    handleChange(allItems, hasErrors(), removedColorId, removedSizeId);
    toast.success("Xóa thành công!");
  };

  useEffect(() => {
    const groupedProducts = {};
    props.forEach((option) => {
      const colorName = option.color.name;
      if (!groupedProducts[colorName]) {
        groupedProducts[colorName] = [];
      }
      groupedProducts[colorName].push(option);
    });
    setGroupByColor(groupedProducts);
  }, [props]);

  return (
    <>
      <Collapse defaultActiveKey={0} className="rounded-0 border-0">
        <Collapse.Panel key={0} className="border-bottom-0">
          <div className="table-responsive">
            <table className="table table-borderless text-nowrap">
              <tbody>
                {Object.entries(groupByColor).map(([key, items], index) => (
                  <React.Fragment key={index}>
                    <tr className="fw-semibold">
                      <td className="bg-primary">STT</td>
                      <td className="bg-primary">Sản phẩm</td>
                      <td className="bg-primary">Số lượng</td>
                      <td className="bg-primary">Đơn giá</td>
                      <td className="bg-primary">Xuất xứ</td>
                      <td className="bg-primary">Thương hiệu</td>
                      <td className="bg-primary">Cổ áo</td>
                      <td className="bg-primary">Tay áo</td>
                      <td className="bg-primary">Chất liệu</td>
                      <td className="bg-primary"></td>
                    </tr>

                    {items.map((option, idx) => (
                      <tr key={idx}>
                        <>
                          {option.shoe &&
                          option.shoe !== undefined &&
                          option.shoe !== null ? (
                            <>
                              <td>{idx + 1}</td>
                              <td>
                                {option.shoe === undefined ||
                                option.shoe === null
                                  ? "Vui lòng chọn sản phẩm"
                                  : option.shoe.name}{" "}
                                [{option.color.name} - {option.size.name}]
                              </td>
                              <td width="100px">
                                <InputNumber
                                  className="table-input-number"
                                  value={option.quantity}
                                  onChange={(value) =>
                                    handleChangeQuantity(value, key, idx)
                                  }
                                  allowClear
                                />
                                {errors[`${key}_${idx}_số lượng`] && (
                                  <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors[`${key}_${idx}_số lượng`]}
                                  </div>
                                )}
                              </td>
                              <td width="150px">
                                <Input
                                  className="table-input"
                                  value={inputValues[`${key}_${idx}_price`] || formatPrice(option.price)}
                                  onChange={(event) =>
                                    handleChangePrice(event, key, idx)
                                  }
                                  onBlur={(event) =>
                                    handleBlurPrice(event, key, idx)
                                  }
                                  onFocus={(e) =>
                                    (e.target.value = inputValues[`${key}_${idx}_price`] || option.price || "")
                                  }
                                />
                                {errors[`${key}_${idx}_đơn giá`] && (
                                  <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors[`${key}_${idx}_đơn giá`]}
                                  </div>
                                )}
                              </td>
                              <td>{option.shoe.xuatXu}</td>
                              <td>{option.shoe.thuongHieu}</td>
                              <td>{option.shoe.coAo}</td>
                              <td>{option.shoe.tayAo}</td>
                              <td>{option.shoe.chatLieu}</td>
                              <td>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => deleteProductDetail(key, idx)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                              {idx === 0 ? (
                                <td
                                  className="align-middle"
                                  rowSpan={items.length}
                                ></td>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default TableProduct;