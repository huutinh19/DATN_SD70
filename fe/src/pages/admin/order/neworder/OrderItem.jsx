import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Carousel,
  Col,
  Divider,
  Result,
  Form,
  Input,
  Modal,
  Row,
  Switch,
  Table,
  Tooltip,
  InputNumber,
} from "antd";
import GHNInfo from "~/components/GhnInfo";
import QrCode from "~/components/QrCode";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";
import Customer from "./Customer";
import ChooseAddress from "./ChooseAddress";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import ShowProductModal from "./ShowProductModal";
import Loading from "~/components/Loading/Loading";
import ChooseVoucher from "./ChooseVoucher";
import numeral from "numeral";
import "./OrderItem.css";

function OrderItem({ index, props, onSuccess }) {
  const [form] = Form.useForm();
  const [listOrderDetail, setListOrderDetail] = useState([]); // Danh sách chi tiết đơn hàng
  const [typeOrder, setTypeOrder] = useState(0); // Loại đơn hàng (0: tại quầy, 1: giao hàng)
  const [customer, setCustomer] = useState(null); // Thông tin khách hàng
  const [listAddress, setListAddress] = useState([]); // Danh sách địa chỉ
  const [autoFillAddress, setAutoFillAddress] = useState({}); // Địa chỉ tự động điền
  const [feeShip, setFeeShip] = useState(0); // Phí vận chuyển
  const [note, setNote] = useState(""); // Ghi chú
  const [waitPay, setWaitPay] = useState(false); // Trạng thái chờ thanh toán
  const [payOnDelivery, setPayOnDelivery] = useState(false); // Thanh toán khi nhận hàng
  const [paymentMethod, setPaymentMethod] = useState(0); // Phương thức thanh toán
  const [extraMoney, setExtraMoney] = useState(null); // Tiền thừa
  const [totalMoney, setTotalMoney] = useState(0); // Tổng tiền hàng
  const [loading, setLoading] = useState(true); // Trạng thái tải
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [pageSize, setPageSize] = useState(3); // Số lượng mục trên mỗi trang
  const [tienKhachDua, setTienKhachDua] = useState(null); // Tiền khách đưa (tiền mặt)
  const [tienChuyenKhoan, setTienChuyenKhoan] = useState(null); // Tiền chuyển khoản
  const [voucher, setVoucher] = useState(null); // Thông tin voucher
  const [moneyReduce, setMoneyReduce] = useState(0); // Số tiền giảm giá
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false); // Hiển thị modal khách hàng
  const [tradingCode, setTradingCode] = useState(""); // Mã giao dịch
  const [showQrCode, setShowQrCode] = useState(false); // Hiển thị mã QR

  // Thông tin ngân hàng cho mã QR
  const bankInfo = {
    bankId: "MB", // Mã ngân hàng (MB Bank)
    accountNumber: "0335867600", // Số tài khoản
    accountHolder: "Lưu Văn Nam", // Tên chủ tài khoản
    template: "compact2", // Mẫu QR
  };

  // Tải thông tin khách hàng và địa chỉ từ localStorage khi component được mount
  useEffect(() => {
    const savedCustomer = localStorage.getItem(`customer_${props.id}`);
    const savedAddress = localStorage.getItem(`autoFillAddress_${props.id}`);
    if (savedCustomer) {
      const parsedCustomer = JSON.parse(savedCustomer);
      setCustomer(parsedCustomer);
    }
    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress);
      setAutoFillAddress(parsedAddress);
      form.setFieldsValue({
        name: parsedAddress.name,
        phoneNumber: parsedAddress.phoneNumber,
        email: parsedAddress.email || "",
        specificAddress: parsedAddress.specificAddress,
        province: parseInt(parsedAddress.province),
        district: parseInt(parsedAddress.district),
        ward: parsedAddress.ward,
      });
    }
    loadListOrderDetail();
  }, [props.id, form, currentPage, pageSize]);

  // Tính tiền thừa dựa trên tiền khách đưa, chuyển khoản và tổng tiền
  useEffect(() => {
    const totalToPay =
      totalMoney - moneyReduce + (typeOrder === 1 ? getFinalShippingFee() : 0);
    if (paymentMethod === 2) {
      const totalPaid = (tienKhachDua || 0) + (tienChuyenKhoan || 0);
      setExtraMoney(totalPaid > 0 ? totalPaid - totalToPay : null);
    } else if (paymentMethod === 0) {
      setExtraMoney(tienKhachDua ? tienKhachDua - totalToPay : null);
    } else if (paymentMethod === 1) {
      setExtraMoney(tienChuyenKhoan ? tienChuyenKhoan - totalToPay : null);
    }
  }, [
    tienKhachDua,
    tienChuyenKhoan,
    totalMoney,
    moneyReduce,
    feeShip,
    typeOrder,
    paymentMethod,
  ]);

  // Tạo mã giao dịch ngân hàng
  function generateBankTransactionCode() {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(2, 12);
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${timestamp}${randomNum}`;
  }

  // Xử lý khi thay đổi phương thức thanh toán hoặc trạng thái thanh toán
  useEffect(() => {
    setTienKhachDua(null);
    setTienChuyenKhoan(null);
    setExtraMoney(null);
    setShowQrCode(false);
    setTradingCode("");
    if (payOnDelivery && typeOrder === 1) {
      setWaitPay(true);
      setPaymentMethod(0);
      setTienKhachDua(null);
      setTienChuyenKhoan(null);
      setTradingCode("");
    }
  }, [paymentMethod, payOnDelivery, typeOrder]);

  // Thêm sản phẩm vào đơn hàng
  const onSelect = (value) => {
    request
      .post("/bill-detail-taiquay", {
        bill: props.id,
        shoeDetail: value,
        quantity: 1,
      })
      .then((response) => {
        toast.success("Thêm sản phẩm thành công!");
        loadListOrderDetail();
        onSuccess();
      })
      .catch((e) => {
        console.log(e);
        toast.error("Lỗi khi thêm sản phẩm!");
      });
  };

  // Tải danh sách chi tiết đơn hàng
  const loadListOrderDetail = async () => {
    setLoading(true);
    try {
      // Lấy danh sách chi tiết đơn hàng cho phân trang
      const response = await request.get(`/bill-detail-taiquay`, {
        params: {
          bill: props.id,
          page: currentPage,
          sizePage: pageSize,
        },
      });
      setListOrderDetail(response.data);
      setTotalPages(response.totalPages);

      // Tính tổng tiền đơn hàng
      const fullResponse = await request.get(`/bill-detail-taiquay`, {
        params: {
          bill: props.id,
          page: 1,
          sizePage: 1_000_000,
        },
      });
      const calculatedTotalMoney = fullResponse.data.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);
      setTotalMoney(calculatedTotalMoney);
    } catch (e) {
      console.log(e);
      toast.error("Lỗi khi tải chi tiết đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi phí vận chuyển
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setFeeShip(rawValue ? Number(rawValue) : 0);
  };

  // Định dạng giá trị đầu vào
  const formatInputValue = (value) => {
    if (!value && value !== 0) return "";
    return numeral(value).format("0,0") + " đ";
  };

  // Lấy thông tin khách hàng và địa chỉ
  const getCustomer = async (id) => {
    try {
      const customerData = await request.get(`/customer/${id}`);
      setCustomer(customerData);
      const dataAddress = await request.get(`/address/${id}`);
      setListAddress(dataAddress.content);
      const defaultAddress =
        dataAddress.content.find((item) => item.defaultAddress === true) ||
        dataAddress.content[0];
      const updatedAddress = {
        ...defaultAddress,
        email: customerData?.email || defaultAddress?.email || "",
      };
      setAutoFillAddress(updatedAddress);
      form.setFieldsValue({
        name: defaultAddress?.name,
        phoneNumber: defaultAddress?.phoneNumber,
        email: customerData?.email || defaultAddress?.email || "",
        specificAddress: defaultAddress?.specificAddress,
        province: parseInt(defaultAddress?.province),
        district: parseInt(defaultAddress?.district),
        ward: defaultAddress?.ward,
      });
      localStorage.setItem(
        `customer_${props.id}`,
        JSON.stringify(customerData)
      );
      localStorage.setItem(
        `autoFillAddress_${props.id}`,
        JSON.stringify(updatedAddress)
      );
    } catch (e) {
      console.log(e);
      toast.error("Lỗi khi lấy thông tin khách hàng!");
    }
  };

  // Chọn khách hàng
  const handleSelectCustomer = (id) => {
    getCustomer(id);
    setIsCustomerModalVisible(false);
  };

  // Xóa thông tin khách hàng
  const handleDeleteCustomer = () => {
    setCustomer(null);
    setAutoFillAddress({});
    setTypeOrder(0);
    form.resetFields();
    localStorage.removeItem(`customer_${props.id}`);
    localStorage.removeItem(`autoFillAddress_${props.id}`);
  };

  // Cập nhật form khi thay đổi địa chỉ
  useEffect(() => {
    if (autoFillAddress && Object.keys(autoFillAddress).length > 0) {
      caculateFee();
      form.setFieldsValue({
        name: autoFillAddress.name,
        phoneNumber: autoFillAddress.phoneNumber,
        email: autoFillAddress.email || "",
        specificAddress: autoFillAddress.specificAddress,
        province: parseInt(autoFillAddress.province),
        district: parseInt(autoFillAddress.district),
        ward: autoFillAddress.ward,
      });
    }
  }, [autoFillAddress, form]);

  // Lấy danh sách dịch vụ vận chuyển từ GHN
  const getAvailableServices = async (fromDistrict, toDistrict) => {
    try {
      const response = await request.post(
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
      return null;
    }
  };

  // Tính phí vận chuyển
  const caculateFee = async () => {
    if (!autoFillAddress.district || !autoFillAddress.ward) return;

    const fromDistrict = 1542;
    const toDistrict = parseInt(autoFillAddress.district);

    const serviceId = await getAvailableServices(fromDistrict, toDistrict);

    if (!serviceId) {
      toast.error("Không thể lấy thông tin gói dịch vụ!");
      return;
    }

    try {
      const response = await request.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          service_id: serviceId,
          service_type_id: 3,
          to_district_id: toDistrict,
          to_ward_code: autoFillAddress.ward,
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

  // Lấy phí vận chuyển cuối cùng
  const getFinalShippingFee = () => {
    return feeShip;
  };

  // Xử lý logic áp dụng voucher
  useEffect(() => {
    if (voucher !== null) {
      const currentDate = new Date();
      const endDate = new Date(voucher.endDate);
      if (totalMoney < voucher.minBillValue) {
        toast.error(
          `Đơn hàng cần tối thiểu ${FormatCurrency({
            value: voucher.minBillValue,
          })} để áp dụng voucher này!`
        );
        setMoneyReduce(0);
      } else if (currentDate > endDate) {
        toast.error("Voucher đã hết hạn!");
        setVoucher(null);
        setMoneyReduce(0);
      } else if (voucher.quantity <= 0) {
        toast.error("Voucher đã hết lượt sử dụng!");
        setVoucher(null);
        setMoneyReduce(0);
      } else {
        const calculatedDiscount = (totalMoney * voucher.percentReduce) / 100;
        const finalDiscount = Math.min(
          calculatedDiscount,
          voucher.maxBillValue
        );
        setMoneyReduce(finalDiscount);
      }
    } else {
      setMoneyReduce(0);
    }
  }, [voucher, totalMoney]);

  // Thay đổi số lượng sản phẩm
  const handleChangeQuantity = (id, quantity) => {
    request
      .get(`/bill-detail-taiquay/update-quantity/${id}`, {
        params: {
          newQuantity: quantity,
        },
      })
      .then((response) => {
        toast.success("Cập nhật số lượng thành công!");
        loadListOrderDetail();
        onSuccess();
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data);
      });
  };

  // Xóa sản phẩm khỏi đơn hàng
  const handleDeleteBillDetail = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận xóa sản phẩm khỏi giỏ hàng?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        request
          .remove(`/bill-detail-taiquay/${id}`)
          .then((response) => {
            toast.success("Xóa sản phẩm thành công!");
            loadListOrderDetail();
            setVoucher(null);
            setMoneyReduce(0);
            onSuccess();
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
          });
      },
    });
  };

  // Cấu hình cột cho bảng chi tiết đơn hàng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: <i>Ảnh</i>,
      dataIndex: "images",
      key: "images",
      render: (images, record) => (
        <div style={{ position: "relative", width: "100px", height: "100px" }}>
          {record.discountValue !== null && (
            <div
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                background: "red",
                color: "white",
                padding: "2px 5px",
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "3px",
                zIndex: 2,
              }}
            >
              SALE {record.discountPercent}%
            </div>
          )}
          <Carousel
            autoplay
            autoplaySpeed={3000}
            dots={false}
            arrows={false}
            style={{ width: "100px" }}
          >
            {images.split(",").map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Sản phẩm"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
              />
            ))}
          </Carousel>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="d-flex flex-column gap-2 p-2">
          {/* Tên sản phẩm */}
          <div className="fw-bold fs-5 text-dark">{name}</div>

          {/* Mã sản phẩm */}
          <div className="text-secondary fs-6">
            <strong className="me-1">Mã:</strong>
            <span className="text-dark">{record.shoeCode}</span>
          </div>

          {/* Thông tin chi tiết */}
          {/* <div className="text-secondary fs-6 d-flex flex-wrap gap-3">
            <div>
              <strong>Xuất xứ:</strong> {record.xuatXu || "N/A"}
            </div>
            <div>
              <strong>Thương hiệu:</strong> {record.thuongHieu || "N/A"}
            </div>
            <div>
              <strong>Cổ áo:</strong> {record.coAo || "N/A"}
            </div>
            <div>
              <strong>Tay áo:</strong> {record.tayAo || "N/A"}
            </div>
            <div>
              <strong>Chất liệu:</strong> {record.chatLieu || "N/A"}
            </div>
          </div> */}

          {/* Đơn giá */}
          <div className="mt-2 fs-5">
            <strong>Đơn giá:</strong>{" "}
            {record.discountPercent !== null ? (
              <>
                <span className="text-danger fw-bold">
                  <FormatCurrency value={record.discountValue} />
                </span>{" "}
                <span className="text-decoration-line-through text-secondary fs-6">
                  <FormatCurrency value={record.shoePrice} />
                </span>
              </>
            ) : (
              <span className="text-danger fw-bold">
                <FormatCurrency value={record.price} />
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <Form key={record.id}>
          <Form.Item
            initialValue={quantity}
            name={"quantity"}
            className="m-0 p-0"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => handleChangeQuantity(record.id, quantity - 1)}
                disabled={quantity <= 0}
              >
                -
              </Button>
              <InputNumber
                min={1}
                style={{ width: "80px" }}
                defaultValue={quantity}
                onBlur={(e) => handleChangeQuantity(record.id, e.target.value)}
              />
              <Button
                onClick={() => handleChangeQuantity(record.id, quantity + 1)}
              >
                +
              </Button>
            </div>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "quantity",
      key: "total",
      render: (quantity, record) => (
        <div className="text-center text-danger fw-semibold">
          <FormatCurrency
            value={
              (record.discountValue !== null
                ? record.discountValue
                : record.price) * record.quantity
            }
          />
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <>
          <Tooltip placement="top" title="Xóa">
            <Button
              onClick={() => handleDeleteBillDetail(id)}
              type="text"
              className="text-danger me-1"
            >
              <i className="fas fa-trash"></i>
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  // Tạo URL mã QR theo định dạng VietQR
  // Hàm tạo URL mã QR
  const generateQrCodeUrl = () => {
    const totalToPay =
      totalMoney - moneyReduce + (typeOrder === 1 ? getFinalShippingFee() : 0);
    const amount = totalToPay || 0; // Sử dụng totalToPay thay vì tienChuyenKhoan
    const addInfo = `Thanh toán đơn hàng ${props.code}`; // Sửa lỗi cú pháp
    const accountName = encodeURIComponent(bankInfo.accountHolder);
    return `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-${bankInfo.template}.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
  };

  // Xử lý tạo hóa đơn
  const handleCreate = async () => {
    const totalToPay =
      totalMoney - moneyReduce + (typeOrder === 1 ? getFinalShippingFee() : 0);

    const data = {
      voucher: voucher === null ? null : voucher.id,
      customer: customer === null ? null : customer.id,
      type: typeOrder,
      customerName:
        typeOrder === 0
          ? customer !== null
            ? customer?.name
            : "Khách hàng lẻ"
          : autoFillAddress.name,
      totalMoney: totalMoney,
      moneyReduce: moneyReduce,
      note: note,
      paymentMethod: paymentMethod,
      tienMat:
        paymentMethod === 0 || paymentMethod === 2 ? tienKhachDua || 0 : 0,
      tienChuyenKhoan:
        paymentMethod === 1 || paymentMethod === 2 ? tienChuyenKhoan || 0 : 0,
      phoneNumber: autoFillAddress.phoneNumber,
      email: customer?.email || autoFillAddress.email || "",
      address:
        typeOrder === 0
          ? null
          : `${autoFillAddress.specificAddress}##${autoFillAddress.ward}##${autoFillAddress.district}##${autoFillAddress.province}`,
      moneyShip: typeOrder === 1 ? getFinalShippingFee() : 0,
      waitPay: waitPay,
      tradingCode:
        paymentMethod === 1 || paymentMethod === 2 ? tradingCode : null,
    };

    // Kiểm tra giỏ hàng
    if (listOrderDetail.length === 0) {
      toast.error("Hãy thêm sản phẩm vào giỏ hàng!");
      return;
    }

    // Kiểm tra thông tin giao hàng
    if (typeOrder === 1) {
      if (!autoFillAddress.name) {
        toast.error("Vui lòng nhập tên khách hàng!");
        return;
      }
      if (!autoFillAddress.phoneNumber) {
        toast.error("Vui lòng nhập số điện thoại!");
        return;
      }
      if (!autoFillAddress.specificAddress) {
        toast.error("Vui lòng nhập địa chỉ cụ thể!");
        return;
      }
      if (!autoFillAddress.province) {
        toast.error("Vui lòng chọn tỉnh/thành phố!");
        return;
      }
      if (!autoFillAddress.district) {
        toast.error("Vui lòng chọn quận/huyện!");
        return;
      }
      if (!autoFillAddress.ward) {
        toast.error("Vui lòng chọn phường/xã!");
        return;
      }
    }

    // Kiểm tra thanh toán
    if (!payOnDelivery) {
      if (typeOrder === 0 || (typeOrder === 1 && !waitPay)) {
        if (paymentMethod === 0) {
          if (tienKhachDua === null || tienKhachDua <= 0) {
            toast.error("Vui lòng nhập số tiền khách đưa!");
            return;
          }
          if (tienKhachDua < totalToPay) {
            toast.error(
              `Vui lòng nhập đủ số tiền (${FormatCurrency({
                value: totalToPay,
              })})!`
            );
            return;
          }
          data.tienMat = tienKhachDua;
        } else if (paymentMethod === 1) {
          if (!tradingCode) {
            toast.error("Vui lòng nhập mã giao dịch!");
            return;
          }
          if (tienChuyenKhoan === null || tienChuyenKhoan <= 0) {
            toast.error("Vui lòng nhập số tiền chuyển khoản!");
            return;
          }
          if (tienChuyenKhoan < totalToPay) {
            toast.error(
              `Vui lòng nhập đủ số tiền chuyển khoản (${FormatCurrency({
                value: totalToPay,
              })})!`
            );
            return;
          }
          data.tienChuyenKhoan = tienChuyenKhoan;
        } else if (paymentMethod === 2) {
          if (!tradingCode) {
            toast.error("Vui lòng nhập mã giao dịch cho phần chuyển khoản!");
            return;
          }
          const totalPaid = (tienKhachDua || 0) + (tienChuyenKhoan || 0);
          if (totalPaid <= 0) {
            toast.error("Vui lòng nhập ít nhất một hình thức thanh toán!");
            return;
          }
          if (totalPaid < totalToPay) {
            toast.error(
              `Tổng tiền thanh toán (${FormatCurrency({
                value: totalPaid,
              })}) chưa đủ (${FormatCurrency({ value: totalToPay })})!`
            );
            return;
          }
          data.tienMat = tienKhachDua || 0;
          data.tienChuyenKhoan = tienChuyenKhoan || 0;
        }
      }
    }

    // Xác nhận tạo hóa đơn
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: `Xác nhận ${
        waitPay || payOnDelivery ? "Tạo đơn hàng thành công!" : "tạo hóa đơn"
      } ?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await request.put(`/bill/${props.id}`, data);
          toast.success(
            waitPay || payOnDelivery
              ? "Tạo đơn hàng thành công!"
              : "Tạo đơn hàng thành công!"
          );
          setTradingCode("");
          setShowQrCode(false);
          localStorage.removeItem(`customer_${props.id}`);
          localStorage.removeItem(`autoFillAddress_${props.id}`);
          setCustomer(null);
          setAutoFillAddress({});
          form.resetFields();
          onSuccess();
        } catch (e) {
          console.log(e);
          toast.error(e.response?.data || "Có lỗi xảy ra!");
        }
      },
    });
  };

  return (
    <div className="brand-container">
      <div className="d-flex">
        <div className="flex-grow-1">
          <Title level={5}>Đơn hàng {props.code}</Title>
        </div>
        <div className="me-1">
          <ShowProductModal
            idBill={props.id}
            onClose={() => {
              loadListOrderDetail();
              onSuccess();
            }}
          />
        </div>
        <div className="">
          <QrCode title={"QR Code sản phẩm"} onQrSuccess={onSelect} />
        </div>
      </div>
      <div
        style={{ boxShadow: "2px 2px 4px 4px rgba(0, 0, 0, 0.03)" }}
        className="my-3 p-2"
      >
        <Title level={5}>Giỏ hàng</Title>

        {loading ? (
          <Loading />
        ) : (
          <Table
            dataSource={listOrderDetail}
            columns={columns}
            className="mt-3"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              showQuickJumper: true,
              total: totalPages * pageSize,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        )}
      </div>

      <div
        style={{ boxShadow: "2px 2px 4px 4px rgba(0, 0, 0, 0.03)" }}
        className="my-3 p-2"
      >
        <div className="d-flex mb-2">
          <div className="flex-grow-1">
            <Title level={5}>Thông tin khách hàng</Title>
          </div>
          {customer !== null && (
            <Button
              className="me-1"
              type="text"
              onClick={() => handleDeleteCustomer()}
            >
              {customer?.name}
              <Tooltip title="Xóa khách hàng">
                <i className="ms-1 fas fa-circle-xmark text-danger"></i>
              </Tooltip>
            </Button>
          )}
          <div className="">
            <Button
              type="primary"
              onClick={() => setIsCustomerModalVisible(true)}
            >
              Chọn khách hàng
            </Button>
          </div>
        </div>
        <Divider className="m-0 mb-3" />
        <Row gutter={10}>
          <Col xl={12}>
            <ul className="list-unstyled">
              <li className="mb-2">
                Tên khách hàng:{" "}
                <span className="float-end fw-semibold">
                  {customer === null ? "Khách hàng lẻ" : customer?.name}
                </span>
              </li>
              {customer !== null && (
                <>
                  <li className="mb-2">
                    Số điện thoại:{" "}
                    <span className="float-end fw-semibold">
                      {customer?.phoneNumber}
                    </span>
                  </li>
                  <li className="mb-2">
                    Email:{" "}
                    <span className="float-end fw-semibold">
                      {typeOrder === 1 && customer !== null
                        ? customer?.email || "Chưa có"
                        : autoFillAddress.email || "Chưa nhập"}
                    </span>
                  </li>
                </>
              )}
              {typeOrder === 1 && customer === null && (
                <>
                  <li className="mb-2">
                    Số điện thoại:{" "}
                    <span className="float-end fw-semibold">
                      {autoFillAddress.phoneNumber || "Chưa nhập"}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </Col>
        </Row>
      </div>

      <Modal
        visible={isCustomerModalVisible}
        onCancel={() => setIsCustomerModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Customer onSelectCustomer={handleSelectCustomer} />
      </Modal>

      <div
        style={{ boxShadow: "2px 2px 4px 4px rgba(0, 0, 0, 0.03)" }}
        className="my-3 p-2 mt-4"
      >
        <div className="d-flex">
          <div className="flex-grow-1">
            <Title level={5}>Thông tin thanh toán</Title>
          </div>
          <div className="">
            {customer !== null && (
              <ChooseAddress
                idCustomer={customer.id}
                onSuccess={(address) => setAutoFillAddress(address)}
              />
            )}
          </div>
        </div>
        <Divider className="m-0 mb-3" />
        <Row gutter={10}>
          <Col xl={14}>
            {typeOrder === 0 ? (
              <img width={"100%"} alt="" />
            ) : (
              <Form
                layout="vertical"
                form={form}
                onFinish={(data) => console.log(data)}
              >
                <Row gutter={10}>
                  <Col xl={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Họ và tên không được để trống!",
                        },
                        {
                          pattern: /^[A-Za-zÀ-Ỹà-ỹ\s]+$/,
                          message: "Họ và tên không hợp lệ!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập họ và tên..."
                        onChange={(e) =>
                          setAutoFillAddress({
                            ...autoFillAddress,
                            name: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: "Số điện thoại không được để trống!",
                        },
                        {
                          pattern: /^(0[0-9]{9,10})$/,
                          message: "Số điện thoại không hợp lệ!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập số điện thoại..."
                        onChange={(e) =>
                          setAutoFillAddress({
                            ...autoFillAddress,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  {/* <Col xl={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                    >
                      <Input
                        placeholder="Nhập email..."
                        onChange={(e) =>
                          setAutoFillAddress({
                            ...autoFillAddress,
                            email: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col> */}
                  <GHNInfo
                    distr={autoFillAddress.district}
                    dataAddress={(data) =>
                      setAutoFillAddress({ ...autoFillAddress, ...data })
                    }
                    prov={autoFillAddress.province}
                    war={autoFillAddress.ward}
                  />
                  <Col xl={18}>
                    <Form.Item label="Địa chỉ cụ thể" name={"specificAddress"}>
                      <Input
                        placeholder="Nhập địa chỉ cụ thể ..."
                        onChange={(e) =>
                          setAutoFillAddress({
                            ...autoFillAddress,
                            specificAddress: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={6}>
                    <img
                      src="https://donhang.ghn.vn/static/media/Giao_Hang_Nhanh_Toan_Quoc_color.b7d18fe5.png"
                      alt=""
                      width={"100%"}
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Col>
          <Col xl={10} md={24}>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Switch
                  onChange={(value) => {
                    setTypeOrder(value ? 1 : 0);
                    if (!value) {
                      setPayOnDelivery(false);
                      setWaitPay(false);
                    }
                  }}
                />{" "}
                Giao hàng
              </li>
              {typeOrder === 1 && (
                <li className="mb-2">
                  <Switch
                    checked={payOnDelivery}
                    onChange={(value) => {
                      setPayOnDelivery(value);
                      setWaitPay(value);
                    }}
                  />{" "}
                  Thanh toán khi nhận hàng
                </li>
              )}
              <Row gutter={10}>
                <ChooseVoucher
                  onSelectVoucher={(selectedVoucher) =>
                    setVoucher(selectedVoucher)
                  }
                  customerId={customer?.id}
                  orderTotal={totalMoney}
                  selectedVoucherId={voucher?.id}
                />
              </Row>
              <li className="mb-2">
                Tiền hàng:{" "}
                <span className="float-end fw-semibold">
                  <FormatCurrency value={totalMoney} />
                </span>
              </li>
              {typeOrder === 1 && (
                <li className="mb-2">
                  Phí vận chuyển:
                  <span
                    className="float-end fw-semibold"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <input
                        type="text"
                        value={formatInputValue(feeShip)}
                        onChange={handleChange}
                        style={{
                          width: "120px",
                          height: "30px",
                          textAlign: "right",
                          paddingRight: "20px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </span>
                </li>
              )}
              <li className="mb-2">
                Giảm giá:{" "}
                <span className="float-end fw-semibold">
                  <FormatCurrency value={moneyReduce} />
                </span>
              </li>
              {voucher !== null && (
                <li className="mb-2">
                  <Tooltip title="Nhấn để bỏ chọn voucher">
                    <Alert
                      message={
                        <>
                          Áp dụng "{voucher?.name}" ({voucher.percentReduce}%)
                          <span
                            className="float-end text-danger"
                            onClick={() => {
                              setVoucher(null);
                              setMoneyReduce(0);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <i className="fas fa-xmark-circle"></i>
                          </span>
                        </>
                      }
                      type="success"
                    />
                  </Tooltip>
                </li>
              )}
              <li className="mb-2">
                Tổng tiền:{" "}
                <span className="float-end fw-semibold text-danger">
                  <FormatCurrency
                    value={
                      totalMoney -
                      moneyReduce +
                      (typeOrder === 1 ? getFinalShippingFee() : 0)
                    }
                  />
                </span>
              </li>
              {!payOnDelivery && (
                <>
                  {paymentMethod === 0 ? (
                    <>
                      <li className="mb-2">
                        <Input
                          placeholder={
                            typeOrder === 0
                              ? "Nhập tiền khách đưa..."
                              : "Nhập tiền khách đưa (nếu thanh toán tại quầy)..."
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setTienKhachDua(value ? Number(value) : null);
                          }}
                          value={
                            tienKhachDua
                              ? numeral(tienKhachDua).format("0,0")
                              : ""
                          }
                          className="mb-2"
                        />
                      </li>
                      <li className="mb-2">
                        {typeOrder === 0 ? (
                          tienKhachDua === null || tienKhachDua <= 0 ? (
                            <Alert
                              message="Vui lòng nhập số tiền khách đưa!"
                              type="warning"
                              showIcon
                            />
                          ) : tienKhachDua <
                            totalMoney -
                              moneyReduce +
                              (typeOrder === 1 ? getFinalShippingFee() : 0) ? (
                            <Alert
                              message={`Vui lòng nhập đủ số tiền (${FormatCurrency(
                                {
                                  value:
                                    totalMoney -
                                    moneyReduce +
                                    (typeOrder === 1
                                      ? getFinalShippingFee()
                                      : 0),
                                }
                              )})!`}
                              type="error"
                              showIcon
                            />
                          ) : (
                            <Alert
                              message="Đã nhập đủ số tiền!"
                              type="success"
                              showIcon
                            />
                          )
                        ) : (
                          tienKhachDua !== null &&
                          tienKhachDua > 0 &&
                          (tienKhachDua <
                          totalMoney -
                            moneyReduce +
                            (typeOrder === 1 ? getFinalShippingFee() : 0) ? (
                            <Alert
                              message={`Vui lòng nhập đủ số tiền (${FormatCurrency(
                                {
                                  value:
                                    totalMoney -
                                    moneyReduce +
                                    (typeOrder === 1
                                      ? getFinalShippingFee()
                                      : 0),
                                }
                              )})!`}
                              type="error"
                              showIcon
                            />
                          ) : (
                            <Alert
                              message="Đã nhập đủ số tiền!"
                              type="success"
                              showIcon
                            />
                          ))
                        )}
                      </li>
                      {tienKhachDua > 0 && (
                        <li className="mb-2">
                          Tiền thừa:{" "}
                          <span className="float-end fw-semibold text-danger">
                            <FormatCurrency
                              value={
                                extraMoney < 0 || extraMoney === null
                                  ? 0
                                  : extraMoney
                              }
                            />
                          </span>
                        </li>
                      )}
                    </>
                  ) : paymentMethod === 1 ? (
                    <>
                      <li className="mb-2">
                        <Form layout="vertical">
                          <Form.Item
                            label="Mã giao dịch"
                            name="tradingCode" // Add name for form validation
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập mã giao dịch",
                              },
                              {
                                pattern: /^\d{10}$/,
                                message: "Mã giao dịch phải gồm 10 chữ số",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Mã giao dịch..."
                              value={tradingCode}
                              onChange={(e) => setTradingCode(e.target.value)}
                              maxLength={10} // Restrict input to 10 characters in UI
                            />
                          </Form.Item>

                          <Form.Item
                            label="Số tiền chuyển khoản"
                            name="tienChuyenKhoan"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số tiền chuyển khoản",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Nhập số tiền khách chuyển khoản..."
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                setTienChuyenKhoan(
                                  value ? Number(value) : null
                                );
                              }}
                              value={
                                tienChuyenKhoan
                                  ? numeral(tienChuyenKhoan).format("0,0")
                                  : ""
                              }
                            />
                          </Form.Item>

                          {/* <Form.Item label="Ghi chú">
                            <TextArea
                              placeholder="Nhập ghi chú (nếu có)..."
                              onChange={(e) => setNote(e.target.value)}
                            />
                          </Form.Item> */}
                        </Form>
                      </li>
                      <li className="mb-2 text-center">
                        {/* <Button
                          type="primary"
                          onClick={() => setShowQrCode(!showQrCode)}
                        >
                          {showQrCode ? "Ẩn mã QR" : "Hiển thị mã QR"}
                        </Button> */}
                      </li>
                      {showQrCode && (
                        <li className="mb-2">
                          <div
                            style={{
                              border: "1px solid #e8e8e8",
                              padding: "15px",
                              borderRadius: "8px",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <div className="text-center mb-3">
                              <img
                                src={generateQrCodeUrl()}
                                alt="QR Code Thanh toán"
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                            <div>
                              <p>
                                <strong>Ngân hàng:</strong> Ngân hàng thương mại
                                cổ phần Quân đội (MB Bank)
                              </p>
                              <p>
                                <strong>Số tài khoản:</strong>{" "}
                                {bankInfo.accountNumber}
                              </p>
                              <p>
                                <strong>Chủ tài khoản:</strong>{" "}
                                {bankInfo.accountHolder}
                              </p>
                              {/* <p>
                                <strong>Số tiền:</strong>{" "}
                                <FormatCurrency value={tienChuyenKhoan || 0} />
                              </p> */}

                              <p>
                                <strong>Số tiền:</strong>{" "}
                                <FormatCurrency
                                  value={
                                    totalMoney -
                                    moneyReduce +
                                    (typeOrder === 1
                                      ? getFinalShippingFee()
                                      : 0)
                                  }
                                />
                              </p>
                              <p>
                                <strong>Nội dung chuyển khoản:</strong> Thanh
                                toán đơn hàng {props.code}
                              </p>
                            </div>
                          </div>
                        </li>
                      )}
                    </>
                  ) : (
                    <>
                      <li className="mb-2">
                        <Form layout="vertical">
                          <Form.Item label="Tiền mặt">
                            <Input
                              placeholder="Nhập số tiền khách đưa bằng tiền mặt..."
                              onChange={(e) => {
                                const totalToPay =
                                  totalMoney -
                                  moneyReduce +
                                  (typeOrder === 1 ? getFinalShippingFee() : 0);
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                const cash = value ? Number(value) : null;
                                setTienKhachDua(cash);
                                const remaining = totalToPay - (cash || 0);
                                setTienChuyenKhoan(
                                  remaining > 0 ? remaining : null
                                );
                              }}
                              value={
                                tienKhachDua
                                  ? numeral(tienKhachDua).format("0,0")
                                  : ""
                              }
                            />
                          </Form.Item>
                          <Form.Item label="Tiền chuyển khoản">
                            <Input
                              placeholder="Nhập số tiền khách chuyển khoản..."
                              onChange={(e) => {
                                const totalToPay =
                                  totalMoney -
                                  moneyReduce +
                                  (typeOrder === 1 ? getFinalShippingFee() : 0);
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                const transfer = value ? Number(value) : null;
                                setTienChuyenKhoan(transfer);
                                const remaining = totalToPay - (transfer || 0);
                                setTienKhachDua(
                                  remaining > 0 ? remaining : null
                                );
                              }}
                              value={
                                tienChuyenKhoan
                                  ? numeral(tienChuyenKhoan).format("0,0")
                                  : ""
                              }
                            />
                          </Form.Item>
                          <Form.Item label="Mã giao dịch" required>
                            <Input
                              placeholder="Mã giao dịch cho phần chuyển khoản..."
                              value={tradingCode}
                              onChange={(e) => setTradingCode(e.target.value)}
                            />
                          </Form.Item>
                          {/* <Form.Item label="Ghi chú">
                            <TextArea
                              placeholder="Nhập ghi chú (nếu có)..."
                              onChange={(e) => setNote(e.target.value)}
                            />
                          </Form.Item> */}
                        </Form>
                      </li>
                      <li className="mb-2">
                        {tienKhachDua === null && tienChuyenKhoan === null ? (
                          <Alert
                            message="Vui lòng nhập ít nhất một hình thức thanh toán!"
                            type="warning"
                            showIcon
                          />
                        ) : (tienKhachDua || 0) + (tienChuyenKhoan || 0) <
                          totalMoney -
                            moneyReduce +
                            (typeOrder === 1 ? getFinalShippingFee() : 0) ? (
                          <Alert
                            message={`Vui lòng nhập đủ số tiền (${FormatCurrency(
                              {
                                value:
                                  totalMoney -
                                  moneyReduce +
                                  (typeOrder === 1 ? getFinalShippingFee() : 0),
                              }
                            )})! Còn thiếu ${FormatCurrency({
                              value:
                                totalMoney -
                                moneyReduce +
                                (typeOrder === 1 ? getFinalShippingFee() : 0) -
                                ((tienKhachDua || 0) + (tienChuyenKhoan || 0)),
                            })}`}
                            type="error"
                            showIcon
                          />
                        ) : (
                          <Alert
                            message="Đã nhập đủ số tiền!"
                            type="success"
                            showIcon
                          />
                        )}
                      </li>
                      {(tienKhachDua || tienChuyenKhoan) && (
                        <li className="mb-2">
                          Tiền thừa:{" "}
                          <span className="float-end fw-semibold text-danger">
                            <FormatCurrency
                              value={
                                extraMoney < 0 || extraMoney === null
                                  ? 0
                                  : extraMoney
                              }
                            />
                          </span>
                        </li>
                      )}
                      
                      {showQrCode && (
                        <li className="mb-2">
                          <div
                            style={{
                              border: "1px solid #e8e8e8",
                              padding: "15px",
                              borderRadius: "8px",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <div className="text-center mb-3">
                              <img
                                src={generateQrCodeUrl()}
                                alt="QR Code Thanh toán"
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                            <div>
                              <p>
                                <strong>Ngân hàng:</strong> Ngân hàng thương mại
                                cổ phần Quân đội (MB Bank)
                              </p>
                              <p>
                                <strong>Số tài khoản:</strong>{" "}
                                {bankInfo.accountNumber}
                              </p>
                              <p>
                                <strong>Chủ tài khoản:</strong>{" "}
                                {bankInfo.accountHolder}
                              </p>
                              <p>
                                <strong>Số tiền chuyển khoản:</strong>{" "}
                                <FormatCurrency value={tienChuyenKhoan || 0} />
                              </p>
                              <p>
                                <strong>Nội dung chuyển khoản:</strong> Thanh
                                toán đơn hàng {props.code}
                              </p>
                            </div>
                          </div>
                        </li>
                      )}
                    </>
                  )}
                  {/* <li className="mb-2">Phương thức thanh toán:</li>
                  <li className="mb-2 text-center">
                    <Row gutter={10}>
                      <Col xl={12} onClick={() => setPaymentMethod(0)}>
                        <div
                          className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${
                            paymentMethod === 0
                              ? "border-primary text-primary"
                              : "text-secondary border-secondary"
                          }`}
                        >
                          <span className="ms-2 fw-semibold text-dark">
                            Tiền mặt
                          </span>
                        </div>
                      </Col>
                      <Col xl={12} onClick={() => setPaymentMethod(1)}>
                        <div
                          className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${
                            paymentMethod === 1
                              ? "border-primary text-primary"
                              : "text-secondary border-secondary"
                          }`}
                        >
                          <span className="ms-2 fw-semibold text-dark">
                            Chuyển khoản
                          </span>
                        </div>
                      </Col>
                      <Col xl={8} onClick={() => setPaymentMethod(2)}>
                        <div
                          className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${
                            paymentMethod === 2
                              ? "border-primary text-primary"
                              : "text-secondary border-secondary"
                          }`}
                        >
                          <span className="ms-2 fw-semibold text-dark">
                            Tiền mặt + Chuyển khoản
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </li> */}
                  <li className="mb-2">Phương thức thanh toán:</li>
                  <li className="mb-3 text-center">
                    <div
                      className="custom-select-wrapper"
                      style={{
                        position: "relative",
                        maxWidth: "600px",
                        margin: "0 auto",
                        fontSize: "16px",
                      }}
                    >
                      <select
                        className="form-select fw-semibold"
                        value={paymentMethod}
                        onChange={(e) =>
                          setPaymentMethod(Number(e.target.value))
                        }
                        style={{
                          padding: "10px 40px 10px 40px",
                          borderRadius: "8px",
                          border: "1px solid #d9d9d9",
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          appearance: "none",
                          backgroundImage:
                            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\')',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 10px center",
                        }}
                      >
                        <option
                          value={0}
                          data-icon="fas fa-money-bill-wave text-success"
                        >
                          Tiền mặt
                        </option>
                        <option
                          value={1}
                          data-icon="fas fa-university text-primary"
                        >
                          Chuyển khoản
                        </option>
                        <option
                          value={2}
                          data-icon="fas fa-wallet text-warning"
                        >
                          Tiền mặt + Chuyển khoản
                        </option>
                      </select>
                      <i
                        className={
                          paymentMethod === 0
                            ? "fas fa-money-bill-wave text-success"
                            : paymentMethod === 1
                            ? "fas fa-university text-primary"
                            : "fas fa-wallet text-warning"
                        }
                        style={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "18px",
                        }}
                      ></i>
                    </div>
                  </li>
                </>
              )}
              <li>
                <Button
                  type="primary"
                  className="bg-warning text-dark w-100"
                  onClick={handleCreate}
                >
                  Tạo hóa đơn
                </Button>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default OrderItem;
