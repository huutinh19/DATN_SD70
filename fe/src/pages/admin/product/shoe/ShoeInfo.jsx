



import {
  Breadcrumb,
  Button,
  Carousel,
  Col,
  Divider,
  Empty,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import request from "~/utils/httpRequest";
import UpdateShoe from "./UpdateShoe";
import UpdateShoeDetail from "./UpdateShoeDetail";
import FormatCurrency from "~/utils/FormatCurrency";
import Title from "antd/es/typography/Title";
// import QRCode from 'qrcode-generator';
// import download from 'downloadjs';
// import JSZip from "jszip";

function ShoeInfo() {
 const { id } = useParams();
  const [product, setProduct] = useState({});
  const [listProductDetail, setListProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [listUpdate, setListUpdate] = useState([]);
  const [listSize, setListSize] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listXuatXu, setListXuatXu] = useState([]);
  const [listThuongHieu, setListThuongHieu] = useState([]);
  const [listCoAo, setListCoAo] = useState([]);
  const [listTayAo, setListTayAo] = useState([]);
  const [listChatLieu, setListChatLieu] = useState([]);
  const [searchSize, setSearchSize] = useState('');
  const [dataFilter, setDataFilter] = useState({});
  const [formFilter] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [shoeDetailSelect, setShoeDetailSelect] = useState([]);
  const [errors, setErrors] = useState({});

  // Row selection for table
  const onSelectChange = (newSelectedRowKeys, selectedRows) =>{
    setSelectedRowKeys(newSelectedRowKeys);
    setShoeDetailSelect(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Handle inline changes for quantity, price

  // const handleQuantityChange = (value, id) => {
  //   const detail = listProductDetail.find((detail) => detail.id === id);
  //   const index = listUpdate.findIndex((item) => item.id === id);
  //   if (index !== -1) {
  //     listUpdate[index].quantity = value;
  //   } else {
  //     listUpdate.push({ id, quantity: value, price: detail.price });
  //   }
  // };

  // const handlePriceChange = (value, id) => {
  //   const detail = listProductDetail.find((detail) => detail.id === id);
  //   const index = listUpdate.findIndex((item) => item.id === id);
  //   if (index !== -1) {
  //     listUpdate[index].price = value;
  //   } else {
  //     listUpdate.push({ id, quantity: detail.quantity, price: value });
  //   }
  // };
  // const handleWeightChange = (value, id) => {
  //   const detail = listProductDetail.find((detail) => detail.id === id);
  //   const index = listUpdate.findIndex((item) => item.id === id);
  //   if (index !== -1) {
  //     listUpdate[index].weight = value;
  //   } else {
  //     listUpdate.push({ id, quantity: detail.quantity, price: detail.price, weight: value });
  //   }
  // };



  const handleQuantityChange = (value, id) => {
  const detail = listProductDetail.find((detail) => detail.id === id);
  const index = listUpdate.findIndex((item) => item.id === id);
  let newErrors = { ...errors };

  // Kiểm tra rỗng hoặc âm
  if (value === null || value === undefined) {
    newErrors[id] = { ...newErrors[id], quantity: "Số lượng không được để trống!" };
  } else if (value < 0) {
    newErrors[id] = { ...newErrors[id], quantity: "Số lượng không được âm!" };
  } else {
    newErrors[id] = { ...newErrors[id], quantity: null }; // Xóa lỗi nếu hợp lệ
  }

  setErrors(newErrors);

  // Cập nhật listUpdate
  if (index !== -1) {
    listUpdate[index].quantity = value;
  } else {
    listUpdate.push({ id, quantity: value, price: detail.price, weight: detail.weight });
  }
  setListUpdate([...listUpdate]);
};

const handlePriceChange = (value, id) => {
  const detail = listProductDetail.find((detail) => detail.id === id);
  const index = listUpdate.findIndex((item) => item.id === id);
  let newErrors = { ...errors };

  // Kiểm tra rỗng hoặc âm
  if (value === null || value === undefined) {
    newErrors[id] = { ...newErrors[id], price: "Đơn giá không được để trống!" };
  } else if (value < 0) {
    newErrors[id] = { ...newErrors[id], price: "Đơn giá không được âm!" };
  } else {
    newErrors[id] = { ...newErrors[id], price: null }; // Xóa lỗi nếu hợp lệ
  }

  setErrors(newErrors);

  // Cập nhật listUpdate
  if (index !== -1) {
    listUpdate[index].price = value;
  } else {
    listUpdate.push({ id, quantity: detail.quantity, price: value, weight: detail.weight });
  }
  setListUpdate([...listUpdate]);
};

const handleWeightChange = (value, id) => {
  const detail = listProductDetail.find((detail) => detail.id === id);
  const index = listUpdate.findIndex((item) => item.id === id);
  let newErrors = { ...errors };

  // Kiểm tra rỗng hoặc âm
  if (value === null || value === undefined) {
    newErrors[id] = { ...newErrors[id], weight: "Cân nặng không được để trống!" };
  } else if (value < 0) {
    newErrors[id] = { ...newErrors[id], weight: "Cân nặng không được âm!" };
  } else {
    newErrors[id] = { ...newErrors[id], weight: null }; // Xóa lỗi nếu hợp lệ
  }

  setErrors(newErrors);

  // Cập nhật listUpdate
  if (index !== -1) {
    listUpdate[index].weight = value;
  } else {
    listUpdate.push({ id, quantity: detail.quantity, price: detail.price, weight: value });
  }
  setListUpdate([...listUpdate]);
};
  // Fetch filter options (size, color, xuatXu, thuongHieu, coAo, tayAo, chatLieu)
  useEffect(() => {
    request.get('/size', { params: { name: searchSize } }).then(response => {
      setListSize(response.data.data);
    }).catch(e => console.error(e));
    request.get('/color', { params: { name: searchSize } }).then(response => {
      setListColor(response.data.data);
    }).catch(e => console.error(e));
    request.get('/xuatxu', { params: { name: searchSize } }).then(response => {
      setListXuatXu(response.data.data);
    }).catch(e => console.error(e));
    request.get('/brand', { params: { name: searchSize } }).then(response => {
      setListThuongHieu(response.data.data);
    }).catch(e => console.error(e));
    request.get('/coao', { params: { name: searchSize } }).then(response => {
      setListCoAo(response.data.data);
    }).catch(e => console.error(e));
    request.get('/tayao', { params: { name: searchSize } }).then(response => {
      setListTayAo(response.data.data);
    }).catch(e => console.error(e));
    request.get('/chatlieu', { params: { name: searchSize } }).then(response => {
      setListChatLieu(response.data.data);
    }).catch(e => console.error(e));
  }, [searchSize]);

  // Load product data
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadData(id);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  const loadData = async (id) => {
    setLoading(true);
    try {
      const response = await request.get(`/shoe/${id}`);
      setProduct(response.data || {});
      setLoading(false);
    } catch (e) {
      console.error("Error loading product:", e);
      setProduct({});
      setLoading(false);
    }
  };

  // Load shoe details with filters
  useEffect(() => {
    loadShoeDetail(id, currentPage, pageSize);
  }, [id, currentPage, pageSize, dataFilter]);

  const loadShoeDetail = (id, currentPage, pageSize) => {
    setLoading(true);
    request
      .get("/shoe-detail", {
        params: {
          name: dataFilter.name,
          size: dataFilter.size,
          color: dataFilter.color,
          xuatXu: dataFilter.xuatXu,
          thuongHieu: dataFilter.thuongHieu,
          coAo: dataFilter.coAo,
          tayAo: dataFilter.tayAo,
          chatLieu: dataFilter.chatLieu,
          shoe: id,
          page: currentPage,
          sizePage: pageSize,
        },
      })
      .then((response) => {
        const uniqueDetails = [];
        const seenIds = new Set();
        response.data.data.forEach((item) => {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueDetails.push(item);
          }
        });
        setListProductDetail(uniqueDetails);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading shoe details:", error);
        setListProductDetail([]);
        setTotalPages(0);
        setLoading(false);
      });
  };

  // Handle status change
  const handleStatusChange = (record, checked) => {
    const newStatus = !checked;
    const payload = {
      price: record.price,
      quantity: record.quantity,
      weight: record.weight,
      color: record.color,
      size: record.size,
      deleted: newStatus,
    };

    request
      .put(`/shoe-detail/${record.id}`, payload)
      .then(() => {
        message.success("Cập nhật trạng thái thành công!");
        loadShoeDetail(id, currentPage, pageSize);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        message.error("Cập nhật trạng thái thất bại!");
      });
  };

  // Handle bulk update
  const handleUpdateFast = () => {
  // Kiểm tra xem có lỗi nào không
  const hasErrors = Object.values(errors).some(
    (error) => error?.quantity || error?.price || error?.weight
  );

  if (hasErrors) {
    message.error("Vui lòng sửa các lỗi trước khi cập nhật!");
    return; // Ngăn không cho tiếp tục nếu có lỗi
  }

  // Hiển thị Modal xác nhận nếu không có lỗi
  Modal.confirm({
    title: "Xác nhận",
    maskClosable: true,
    content: `Xác nhận cập nhật ${selectedRowKeys.length} sản phẩm?`,
    okText: "Xác nhận",
    cancelText: "Hủy",
    onOk: () => {
      request
        .put("/shoe-detail/update-fast", listUpdate)
        .then(() => {
          message.success("Cập nhật thành công!");
          loadShoeDetail(id, currentPage, pageSize);
          setSelectedRowKeys([]);
          setListUpdate([]);
          setErrors({}); // Xóa lỗi sau khi cập nhật thành công
        })
        .catch((e) => {
          console.error(e);
          message.error("Cập nhật thất bại!");
        });
    },
  });
};

  if (loading) {
    return (
      <BaseUI>
        <Loading />
      </BaseUI>
    );
  }

  const productInfoColumns = [
    { title: "STT", dataIndex: "stt", key: "stt", width: 50 },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Xuất xứ", dataIndex: "xuatXu", key: "xuatXu" },
    { title: "Thương hiệu", dataIndex: "thuongHieu", key: "thuongHieu" },
    { title: "Cổ áo", dataIndex: "coAo", key: "coAo" },
    { title: "Tay áo", dataIndex: "tayAo", key: "tayAo" },
    { title: "Chất liệu", dataIndex: "chatLieu", key: "chatLieu" },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: () =>
        product && product.id ? (
          <UpdateShoe
            props={product}
            onSuccess={() => {
              loadData(id);
              loadShoeDetail(id, currentPage, pageSize);
            }}
          />
        ) : null,
    },
  ];
  

  const productInfoData = [
    {
      key: "1",
      stt: "1",
      name: product.name || "N/A",
      xuatXu: product.xuatXu?.name || "N/A",
      thuongHieu: product.thuongHieu?.name || "N/A",
      coAo: product.coAo?.name || "N/A",
      tayAo: product.tayAo?.name || "N/A",
      chatLieu: product.chatLieu?.name || "N/A",
    },
  ];

  const detailColumns = [
  { title: "STT", dataIndex: "index", key: "index" },
  { title: "Mã", dataIndex: "code", key: "code" },
  { title: "Tên", dataIndex: "name", key: "name" },
  { title: "Màu sắc", dataIndex: "color", key: "color" },
  { title: "Size", dataIndex: "size", key: "size" },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    render: (x, record) => (
      <div>
        {selectedRowKeys.includes(record.id) ? (
          <>
            <InputNumber
              defaultValue={x}
              formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              controls={false}
    
              onChange={(value) => handleQuantityChange(value, record.id)}
            />
            {errors[record.id]?.quantity && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors[record.id].quantity}
              </div>
            )}
          </>
        ) : (
          <>{x == null ? 0 : x}</>
        )}
      </div>
    ),
  },
  {
    title: "Đơn giá",
    dataIndex: "price",
    key: "price",
    render: (x, record) => (
      <div>
        {selectedRowKeys.includes(record.id) ? (
          <>
            <InputNumber
              defaultValue={x}
              formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              controls={false}

              onChange={(value) => handlePriceChange(value, record.id)}
            />
            {errors[record.id]?.price && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors[record.id].price}
              </div>
            )}
          </>
        ) : (
          <>
            {record.discountPercent !== null ? (
              <>
                <span className="text-danger">
                  <FormatCurrency value={record.discountValue} />
                </span>{" "}
                <br />{" "}
                <span className="text-decoration-line-through text-secondary">
                  <FormatCurrency value={record.price} />
                </span>
              </>
            ) : (
              <span className="text-danger">
                <FormatCurrency value={record.price} />
              </span>
            )}
          </>
        )}
      </div>
    ),
  },
  // {
  //   title: "Cân nặng",
  //   dataIndex: "weight",
  //   key: "weight",
  //   render: (x, record) => (
  //     <div>
  //       {selectedRowKeys.includes(record.id) ? (
  //         <>
  //           <InputNumber
  //             defaultValue={x}
  //             formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
  //             parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
  //             controls={false}
  //             min={0}
  //             onChange={(value) => handleWeightChange(value, record.id)}
  //           />
  //           {errors[record.id]?.weight && (
  //             <div style={{ color: "red", fontSize: "12px" }}>
  //               {errors[record.id].weight}
  //             </div>
  //           )}
  //         </>
  //       ) : (
  //         <>{x}</>
  //       )}
  //     </div>
  //   ),
  // },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status, record) => (
      <Switch
        checkedChildren="Đang bán"
        unCheckedChildren="Ngừng bán"
        checked={!status}
        onChange={(checked) => handleStatusChange(record, checked)}
      />
    ),
  },
  {
    title: <i>Ảnh</i>,
    dataIndex: "images",
    key: "images",
    render: (images, record) => (
      <div style={{ position: "relative", width: "100px", height: "100px" }}>
        {record.discountPercent !== null && (
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
              alt="product"
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
    title: "Hành động",
    key: "action",
    render: (_, record) => (
      <UpdateShoeDetail
        props={record}
        onSuccess={() => loadShoeDetail(id, currentPage, pageSize)}
      />
    ),
  },
];

  return (
    <BaseUI>
      <h6 className="fw-semibold brand-title">Danh sách sản phẩm</h6>

      <Row gutter={24}>
        <Col
          xl={24}
          className="d-flex align-items-center py-1 mb-3"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <div className="flex-grow-1">
            <Title level={5} className="my-2">
              Thông tin sản phẩm
            </Title>
          </div>
        </Col>
        <Col xl={24}>
          <Table
            dataSource={productInfoData}
            columns={productInfoColumns}
            pagination={false}
            bordered
            size="middle"
          />
        </Col>
        <Divider />
      </Row>

      <div className="d-flex">
        <div className="flex-grow-1">
          <Title level={5}>Chi tiết sản phẩm</Title>
        </div>
        {selectedRowKeys.length > 0 && (
          <>
            <div className="me-2">
              {/* <Button type="primary" onClick={downloadAllQRCode}>
                <i className="fa-solid fa-download me-2"></i> Tải QR
              </Button> */}
            </div>
            <div>
              <Button type="primary" className="bg-warning" onClick={handleUpdateFast}>
                Cập nhật {selectedRowKeys.length} sản phẩm
              </Button>
            </div>
          </>
        )}
      </div>

      <Form layout="vertical" onFinish={(data) => setDataFilter(data)} form={formFilter}>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item label="Kích cỡ" name="size">
              <Select
                showSearch
                placeholder="Chọn kích cỡ..."
                optionFilterProp="children"
                style={{ width: "100%" }}
                onSearch={setSearchSize}
              >
                <Select.Option value="">Chọn kích cỡ</Select.Option>
                {listSize.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Màu sắc" name="color">
              <Select
                showSearch
                placeholder="Chọn màu sắc..."
                optionFilterProp="children"
                style={{ width: "100%" }}
                onSearch={setSearchSize}
              >
                <Select.Option value="">Chọn màu sắc</Select.Option>
                {listColor.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
        </Row>
        <div className="text-center">
          <Button
            className="me-1 bg-danger"
            onClick={() => formFilter.resetFields()}
            type="primary"
            icon={<i className="fa-solid fa-rotate-left"></i>}
          >
            Làm mới
          </Button>
          <Button
            htmlType="submit"
            className="bg-warning text-dark"
            type="primary"
            icon={<i className="fas fa-search"></i>}
          >
            Tìm kiếm
          </Button>
        </div>
      </Form>

      <Table
        dataSource={listProductDetail}
        columns={detailColumns}
        className="mt-3"
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showQuickJumper: true,
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        loading={loading}
      />
    </BaseUI>
  );
}

export default ShoeInfo;