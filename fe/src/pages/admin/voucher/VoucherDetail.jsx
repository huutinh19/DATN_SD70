// import {
//   Modal,
//   Button,
//   Col,
//   Divider,
//   Form,
//   Input,
//   InputNumber,
//   Row,
// } from "antd";
// import { Breadcrumb } from "antd";
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import BaseUI from "~/layouts/admin/BaseUI";
// import Loading from "~/components/Loading/Loading";
// import { FaHome, FaTrash } from "react-icons/fa";
// import { toast } from "react-toastify";
// import * as request from "~/utils/httpRequest";

// function VoucherDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(true);
//   const [voucher, setVoucher] = useState({});

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       loadVoucher(form, id);
//     }, 1000);
//     return () => clearTimeout(timeout);
//   }, [form, id]);

//   const loadVoucher = (form, id) => {
//     request
//       .get(`/voucher/${id}`)
//       .then((response) => {
//         setVoucher(response);
//         form.setFieldsValue({
//           code: response.code,
//           name: response.name,
//           quantity: response.quantity,
//           minBillValue: response.minBillValue,
//           maxBillValue: response.maxBillValue,
//           percentReduce: response.percentReduce,
//           startDate: new Date(response.startDate + "Z")
//             .toISOString()
//             .slice(0, 16),
//           endDate: new Date(response.endDate + "Z").toISOString().slice(0, 16),
//         });
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setLoading(false);
//       });
//   };

//   const onSubmit = async (data) => {
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
//       content: "Xác nhận cập nhật Voucher ?",
//       okText: "Ok",
//       cancelText: "Cancel",
//       onOk: () => {
//         setLoading(true);
//         request
//           .put(`/voucher/update/${id}`, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           })
//           .then((response) => {
//             if (response.status === 200) {
//               toast.success("Cập nhật thành công!");
//               navigate("/admin/voucher");
//             }
//           })
//           .catch((e) => {
//             console.log(e);
//             toast.error(e.response.data || "Cập nhật thất bại!");
//             if (e.response.data.message != null) {
//               toast.error(e.response.data.message);
//             }
//             setLoading(false);
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

//   if (loading) {
//     return (
//       <BaseUI>
//         <Loading />
//       </BaseUI>
//     );
//   }

//   return (
//     <BaseUI>
//       <h6>Thông tin phiếu giảm giá</h6>
//       <div className="container">
//         <Form onFinish={onSubmit} layout="vertical" form={form}>
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
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
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
//                     ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) =>
//                     value !== null && value !== undefined
//                       ? value.replace(/\$\s?|(,*)/g, "")
//                       : ""
//                   }
//                   controls={false}
//                   max={1000000000}
//                   suffix="VNĐ"
//                   placeholder="Nhập giá trị đơn tối thiểu..."
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label={"Giá trị giảm tối đa"}
//                 name={"maxBillValue"}
//                 dependencies={["minBillValue"]}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Giảm tối đa không được để trống!",
//                   },
//                   { validator: validateNonNegative("Giá trị giảm tối đa") },
//                   ({ getFieldValue }) => ({
//                     validator(_, value) {
//                       const minBillValue = getFieldValue("minBillValue");
//                       if (
//                         !value ||
//                         !minBillValue ||
//                         parseFloat(value) <= parseFloat(minBillValue)
//                       ) {
//                         return Promise.resolve();
//                       }
//                       return Promise.reject(
//                         new Error(
//                           "Giá trị giảm tối đa không được lớn hơn giá trị đơn tối thiểu!"
//                         )
//                       );
//                     },
//                   }),
//                 ]}
//                 validateTrigger={["onChange", "onBlur"]}
//               >
//                 <InputNumber
//                   style={{ width: "100%" }}
//                   step={10000}
//                   formatter={(value) =>
//                     ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) =>
//                     value !== null && value !== undefined
//                       ? value.replace(/\$\s?|(,*)/g, "")
//                       : ""
//                   }
//                   controls={false}
//                   max={1000000000}
//                   suffix="VNĐ"
//                   placeholder="Nhập giá trị giảm tối đa..."
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
//             <Col span={12}>
//               <Form.Item className="mt-3 float-end">
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="bg-primary"
//                   style={{ marginTop: "23px" }}
//                 >
//                   <i className="fas fa-save me-2"></i> Cập nhật
//                 </Button>
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </div>
//     </BaseUI>
//   );
// }

// export default VoucherDetail;



import {
  Modal,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
} from "antd";
import { Breadcrumb } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import Loading from "~/components/Loading/Loading";
import { FaHome, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import * as request from "~/utils/httpRequest";

function VoucherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadVoucher(form, id);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [form, id]);

  const loadVoucher = (form, id) => {
    request
      .get(`/voucher/${id}`)
      .then((response) => {
        setVoucher(response);
        form.setFieldsValue({
          code: response.code,
          name: response.name,
          quantity: response.quantity,
          minBillValue: response.minBillValue,
          maxBillValue: response.maxBillValue,
          percentReduce: response.percentReduce,
          startDate: new Date(response.startDate + "Z")
            .toISOString()
            .slice(0, 16),
          endDate: new Date(response.endDate + "Z").toISOString().slice(0, 16),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onSubmit = async (data) => {
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
      content: "Xác nhận cập nhật Voucher ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(true);
        request
          .put(`/voucher/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success("Cập nhật thành công!");
              navigate("/admin/voucher");
            }
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data || "Cập nhật thất bại!");
            if (e.response.data.message != null) {
              toast.error(e.response.data.message);
            }
            setLoading(false);
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

  if (loading) {
    return (
      <BaseUI>
        <Loading />
      </BaseUI>
    );
  }

  return (
    <BaseUI>
      <h6>Cập nhật phiếu giảm giá</h6>
      <div className="container">
        <Form onFinish={onSubmit} layout="vertical" form={form}>
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
                  { validator: validateNonNegativeAndNonZero("Phần trăm giảm") },
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
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Giá trị giảm tối đa"}
                name={"maxBillValue"}
                dependencies={["minBillValue"]}
                rules={[
                  {
                    required: true,
                    message: "Giảm tối đa không được để trống!",
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
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-primary"
                  style={{ marginTop: "23px" }}
                >
                  <i className="fas fa-save me-2"></i> Cập nhật
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </BaseUI>
  );
}

export default VoucherDetail;