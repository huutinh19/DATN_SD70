// import {
//   Breadcrumb,
//   Button,
//   Col,
//   Divider,
//   Form,
//   Input,
//   InputNumber,
//   Space,
//   Modal,
//   Radio,
//   Row,
//   message,
// } from "antd";
// import { FaHome, FaTrash } from "react-icons/fa";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import BaseUI from "~/layouts/admin/BaseUI";
// import * as request from "~/utils/httpRequest";
// import { toast } from "react-toastify";
// import "./AddVoucher.css";

// function AddVoucherForm() {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [inputValue, setInputValue] = useState(null);
//   const handleInputFocus = () => {
//     if (inputValue === null) {
//       setInputValue(0);
//     }
//   };

//   const handAddVoucher = async (data) => {
//     const formData = new FormData();
//     formData.append("code", data.code);
//     formData.append("name", data.name);
//     formData.append("quantity", data.quantity);
//     formData.append("percentReduce", data.percentReduce);
//     formData.append("minBillValue", data.minBillValue);
//     formData.append("maxBillValue", data.maxBillValue);
//     formData.append("startDate", data.startDate);
//     formData.append("endDate", data.endDate);

//     Modal.confirm({
//       title: "Xác nhận",
//       maskClosable: true,
//       content: "Xác nhận thêm Voucher ?",
//       okText: "Ok",
//       cancelText: "Cancel",
//       onOk: () => {
//         request
//           .post("/voucher/add", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           })
//           .then((response) => {
//             console.log(response);
//             if (response.data.success) {
//               toast.success("Thêm thành công!");
//               navigate("/admin/voucher");
//             }
//           })
//           .catch((e) => {
//             console.log(e);
//             toast.error(e.response.data);
//             if (e.response.data.message != null) {
//               toast.error(e.response.data.message);
//             }
//           });
//       },
//     });
//   };

//   // Custom validator for non-negative values
//   const validateNonNegative = (fieldName) => (_, value) => {
//     if (value < 0) {
//       return Promise.reject(`${fieldName} không được là số âm!`);
//     }
//     return Promise.resolve();
//   };

//   return (
//     <BaseUI>
//       <h6 className="fw-semibold brand-title">Thêm phiếu giảm giá</h6>
//       <div className="container">
//         <Form onFinish={handAddVoucher} layout="vertical" form={form}>
//           <Row gutter={10}>
//             <Col span={12}>
//               <Form.Item
//                 label={"Tên phiếu giảm giá"}
//                 name={"name"}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Tên phiếu giảm giá không được để trống!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Nhập tên phiếu giảm giá..." />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 label={"Số lượng"}
//                 name={"quantity"}
//                 rules={[
//                   { required: true, message: "Số lượng không được để trống!" },
//                   { validator: validateNonNegative("Số lượng") },
//                 ]}
//                 validateTrigger={["onChange", "onBlur"]}
//               >
//                 <InputNumber
//                   style={{ width: "100%" }}
//                   controls={false}
//                   placeholder="Nhập số lượng..."
//                   onFocus={handleInputFocus}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label={"Phần trăm giảm"}
//                 name={"percentReduce"}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Phần trăm giảm không được để trống!",
//                   },
//                   { validator: validateNonNegative("Phần trăm giảm") },
//                   {
//                     validator: (_, value) =>
//                       value >= 1 && value <= 50
//                         ? Promise.resolve()
//                         : Promise.reject(
//                             "Phần trăm giảm phải nằm trong khoảng từ 1 đến 50!"
//                           ),
//                   },
//                 ]}
//                 validateTrigger={["onChange", "onBlur"]}
//               >
//                 <InputNumber
//                   style={{ width: "100%" }}
//                   controls={false}
//                   suffix="%"
//                   placeholder="Nhập phần trăm giảm..."
//                   onFocus={handleInputFocus}
//                 />
//               </Form.Item>
//             </Col>
//             <Col xl={12}>
//               <Form.Item
//                 label={"Giá trị đơn tối thiểu"}
//                 name={"minBillValue"}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Đơn tối thiểu không được để trống!",
//                   },
//                   { validator: validateNonNegative("Giá trị đơn tối thiểu") },
//                 ]}
//                 validateTrigger={["onChange", "onBlur"]}
//               >
//                 <InputNumber
//                   style={{ width: "100%" }}
//                   step={10000}
//                   formatter={(value) =>
//                     `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) =>
//                     value !== null && value !== undefined
//                       ? value.replace(/(,*)/g, "")
//                       : ""
//                   }
//                   controls={false}
//                   max={1000000000}
//                   suffix="VNĐ"
//                   placeholder="Nhập giá trị đơn tối thiểu..."
//                   onFocus={handleInputFocus}
//                 />
//               </Form.Item>
//             </Col>
//             <Col xl={12}>
//               <Form.Item
//                 label={"Giá trị giảm tối đa"}
//                 name={"maxBillValue"}
//                 dependencies={["minBillValue"]}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Giá trị giảm tối đa không được để trống!",
//                   },
//                   { validator: validateNonNegative("Giá trị giảm tối đa") },
//                   ({ getFieldValue }) => ({
//                     validator(_, value) {
//                       const minBillValue = getFieldValue("minBillValue");
//                       // Check if both values are defined and maxBillValue > minBillValue
//                       if (
//                         value !== null &&
//                         value !== undefined &&
//                         minBillValue !== null &&
//                         minBillValue !== undefined &&
//                         parseFloat(value) > parseFloat(minBillValue)
//                       ) {
//                         return Promise.reject(
//                           new Error(
//                             "Giá trị giảm tối đa không được lớn hơn giá trị đơn tối thiểu!"
//                           )
//                         );
//                       }
//                       return Promise.resolve();
//                     },
//                   }),
//                 ]}
//                 validateTrigger={["onChange", "onBlur"]}
//               >
//                 <InputNumber
//                   style={{ width: "100%" }}
//                   step={10000}
//                   formatter={(value) =>
//                     `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) =>
//                     value !== null && value !== undefined
//                       ? value.replace(/(,*)/g, "")
//                       : ""
//                   }
//                   controls={false}
//                   max={1000000000}
//                   suffix="VNĐ"
//                   placeholder="Nhập giá trị giảm tối đa..."
//                   onFocus={handleInputFocus}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label={"Ngày bắt đầu"}
//                 name={"startDate"}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Ngày bắt đầu không được để trống!",
//                   },
//                 ]}
//               >
//                 <Input type="datetime-local" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label={"Ngày kết thúc"}
//                 name={"endDate"}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Ngày kết thúc không được để trống!",
//                   },
//                 ]}
//               >
//                 <Input type="datetime-local" />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Form.Item className="mt-3 float-end">
//             <Button type="primary" htmlType="submit" className="bg-primary">
//               <i className="fas fa-plus me-2"></i> Thêm phiếu giảm giá
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </BaseUI>
//   );
// }

// export default AddVoucherForm;



import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Space,
  Modal,
  Radio,
  Row,
  message,
} from "antd";
import { FaHome, FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";
import "./AddVoucher.css";

function AddVoucherForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState(null);
  const handleInputFocus = () => {
    if (inputValue === null) {
      setInputValue(0);
    }
  };

  const handAddVoucher = async (data) => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("quantity", data.quantity);
    formData.append("percentReduce", data.percentReduce);
    formData.append("minBillValue", data.minBillValue);
    formData.append("maxBillValue", data.maxBillValue);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm Voucher ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request
          .post("/voucher/add", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            if (response.data.success) {
              toast.success("Thêm thành công!");
              navigate("/admin/voucher");
            }
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data || "Thêm thất bại!");
            if (e.response.data.message != null) {
              toast.error(e.response.data.message);
            }
          });
      },
    });
  };

  // Custom validator for non-negative and non-zero values
  const validateNonNegativeAndNonZero = (fieldName) => (_, value) => {
    if (value <= 0) {
      return Promise.reject(`${fieldName} phải lớn hơn 0!`);
    }
    return Promise.resolve();
  };

  return (
    <BaseUI>
      <h6 className="fw-semibold brand-title">Thêm phiếu giảm giá</h6>
      <div className="container">
        <Form onFinish={handAddVoucher} layout="vertical" form={form}>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                label={"Tên phiếu giảm giá"}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Tên phiếu giảm giá không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên phiếu giảm giá..." />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={"Số lượng"}
                name={"quantity"}
                rules={[
                  { required: true, message: "Số lượng không được để trống!" },
                  { validator: validateNonNegativeAndNonZero("Số lượng") },
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  controls={false}
                  placeholder="Nhập số lượng..."
                  onFocus={handleInputFocus}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Phần trăm giảm"}
                name={"percentReduce"}
                rules={[
                  {
                    required: true,
                    message: "Phần trăm giảm không được để trống!",
                  },
                  // { validator: validateNonNegativeAndNonZero("Phần trăm giảm") },
                  {
                    validator: (_, value) =>
                      value >= 1 && value <= 80
                        ? Promise.resolve()
                        : Promise.reject(
                            "Phần trăm giảm phải nằm trong khoảng từ 1 đến 80!"
                          ),
                  },
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  controls={false}
                  suffix="%"
                  placeholder="Nhập phần trăm giảm..."
                  onFocus={handleInputFocus}
                />
              </Form.Item>
            </Col>
            <Col xl={12}>
              <Form.Item
                label={"Giá trị đơn tối thiểu"}
                name={"minBillValue"}
                rules={[
                  {
                    required: true,
                    message: "Đơn tối thiểu không được để trống!",
                  },
                  { validator: validateNonNegativeAndNonZero("Giá trị đơn tối thiểu") },
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step={10000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value !== null && value !== undefined
                      ? value.replace(/(,*)/g, "")
                      : ""
                  }
                  controls={false}
                  max={1000000000}
                  suffix="VNĐ"
                  placeholder="Nhập giá trị đơn tối thiểu..."
                  onFocus={handleInputFocus}
                />
              </Form.Item>
            </Col>
            <Col xl={12}>
              <Form.Item
                label={"Giá trị giảm tối đa"}
                name={"maxBillValue"}
                dependencies={["minBillValue"]}
                rules={[
                  {
                    required: true,
                    message: "Giá trị giảm tối đa không được để trống!",
                  },
                  { validator: validateNonNegativeAndNonZero("Giá trị giảm tối đa") },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const minBillValue = getFieldValue("minBillValue");
                      if (
                        value !== null &&
                        value !== undefined &&
                        minBillValue !== null &&
                        minBillValue !== undefined &&
                        parseFloat(value) > parseFloat(minBillValue)
                      ) {
                        return Promise.reject(
                          new Error(
                            "Giá trị giảm tối đa không được lớn hơn giá trị đơn tối thiểu!"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step={10000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value !== null && value !== undefined
                      ? value.replace(/(,*)/g, "")
                      : ""
                  }
                  controls={false}
                  max={1000000000}
                  suffix="VNĐ"
                  placeholder="Nhập giá trị giảm tối đa..."
                  onFocus={handleInputFocus}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Ngày bắt đầu"}
                name={"startDate"}
                rules={[
                  {
                    required: true,
                    message: "Ngày bắt đầu không được để trống!",
                  },
                ]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Ngày kết thúc"}
                name={"endDate"}
                rules={[
                  {
                    required: true,
                    message: "Ngày kết thúc không được để trống!",
                  },
                ]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item className="mt-3 float-end">
                <Button type="primary" htmlType="submit" className="bg-primary">
                  <i className="fas fa-plus me-2"></i> Thêm phiếu giảm giá
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </BaseUI>
  );
}

export default AddVoucherForm;