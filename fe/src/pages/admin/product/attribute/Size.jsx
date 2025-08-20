import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Switch,
  Table,
  message,
  Select,
  Tooltip,
} from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";

function Size() {
  const [sizeList, setSizeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [statusSize, setStatusSize] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const { confirm } = Modal;
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [item, setItem] = useState("");

  const showModalAdd = () => {
    setIsModalAddOpen(true);
  };
  const handleCancelAdd = () => {
    setIsModalAddOpen(false);
  };

  const showModalUpdate = () => {
    setIsModalUpdateOpen(true);
  };
  const handleCancelUpdate = () => {
    setIsModalUpdateOpen(false);
  };

  useEffect(() => {
    if (isModalUpdateOpen === true) {
      formUpdate.setFieldsValue({
        name: item.name,
      });
    }
  }, [isModalUpdateOpen, formUpdate, item.name]);

  useEffect(() => {
    loadData(currentPage, pageSize, searchValue, statusSize);
  }, [currentPage, pageSize, searchValue, statusSize]);

  const loadData = (currentPage, pageSize, searchValue, statusSize) => {
    request
      .get("/size", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: statusSize,
        },
      })
      .then((response) => {
        setSizeList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      className: "text-center",
    },
    {
      title: "Kích cỡ",
      dataIndex: "name",
      key: "name",
      className: "text-center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      className: "text-center",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      className: "text-center",
      render: (x, item) => (
        <Switch
          className={x ? "bg-danger" : "bg-warning"}
          checkedChildren={<i class="fa-solid fa-check"></i>}
          unCheckedChildren={<i class="fa-solid fa-xmark"></i>}
          checked={!x}
          onChange={() => showDeleteConfirm(item)}
        />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "action",
      className: "text-center",
      render: (x, item) => (
        <>
          <Tooltip placement="top" title="Chỉnh sửa">
            <Link to={"/admin/size"}>
              <button
                type="primary"
                onClick={() => {
                  setItem(item);
                  showModalUpdate(item);
                }}
                className="btn btn-sm text-primary"
              >
                <i className="fas fa-edit"></i>
              </button>
            </Link>
          </Tooltip>
        </>
      ),
    },
  ];

  const handleAdd = (data) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thêm kích cỡ mới? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .post("/size", data)
          .then((response) => {
            if (response.status === 200) {
              console.log(response);
              toast.success("Thêm mới thành công!");
              setIsModalAddOpen(false);
              loadData(currentPage, pageSize, searchValue, statusSize);
              formAdd.resetFields();
            }
          })
          .catch((e) => {
            console.log(e);
            if (e.response.status === 500) {
              toast.error(e.response.data);
            }
            toast.error(e.response.data.message);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const showDeleteConfirm = (item) => {
    confirm({
      title: "Xác nhận ",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn sửa trạng thái hoạt động?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk() {
        request
          .remove(`/size/${item.id}`)
          .then((response) => {
            if (response.status === 200) {
              loadData(currentPage, pageSize, searchValue, statusSize);
              toast.success("Thành công!");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleUpdate = (data) => {
    confirm({
      title: "Xác nhận ",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhật số size? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .put(`/size/${item.id}`, data)
          .then((response) => {
            if (response.status === 200) {
              console.log(response);
              toast.success("Cập nhật thành công!");
              setIsModalUpdateOpen(false);
              loadData(currentPage, pageSize, searchValue, statusSize);
              formUpdate.resetFields();
            }
            setIsModalUpdateOpen(false);
          })
          .catch((e) => {
            console.log(e);
            if (e.response.status === 500) {
              toast.error(e.response.data);
            }
            toast.error(e.response.data.message);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };


  const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  .brand-container {
    padding: 24px;
    background: #f8f9fe;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .brand-title {
    color: #2c3e50;
    font-weight: 600;
    font-size: 24px;
    margin-bottom: 24px;
    letter-spacing: 0.5px;
  }

  
`;

// Thêm style vào document
const styleSheet = document.createElement("style");
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

  return (
    <BaseUI>
    <div className="brand-container">
      <h6 className="fw-semibold brand-title">Danh sách kích cỡ</h6>
      <div className="card p-3 mb-3">
        <h6 className="fw-semibold">Bộ lọc</h6>
        <Row gutter={10}>
          <Col span={16}>
            <label className="mb-1">Kích cỡ</label>
            <Input
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Tìm kiếm kích cỡ..."
            />
          </Col>
          
          {/* <Col span={5}>
          <div className="mb-1">Trạng thái</div>
          <Radio.Group
            defaultValue={null}
            onChange={(event) => setStatusSize(event.target.value)}
          >
            <Radio value={null}>Tất cả</Radio>
            <Radio value={false}>Hoạt động</Radio>
            <Radio value={true}>Ngừng hoạt động</Radio>
          </Radio.Group>
        </Col> */}
          <Col span={8}>
            <div className="mb-1">Trạng thái</div>
            <Select
              defaultValue={null}
              style={{ width: "100%" }}
              onChange={(value) => setStatusSize(value)}
            >
              <Select.Option value={null}>Tất cả</Select.Option>
              <Select.Option value={false}>Hoạt động</Select.Option>
              <Select.Option value={true}>Ngừng hoạt động</Select.Option>
            </Select>
          </Col>
        </Row>
      </div>
      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold">Bảng kích cỡ</h6>
          <Link to={"/admin/size"}>
            <Button
              type="primary"
              onClick={showModalAdd}
              className="bg-warning w-200"
            >
              <i className="fas fa-plus-circle me-1"></i>Thêm kích cỡ
            </Button>
          </Link>
        </div>

        <Table
          dataSource={sizeList}
          columns={columns}
          className="mt-3"
          pagination={{
            // showSizeChanger: true,
            current: currentPage,
            pageSize: pageSize,
            // pageSizeOptions: [5, 10, 20, 50, 100],
            // showQuickJumper: true,
            total: totalPages * pageSize,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />

        <Modal
          title="Thêm kích cỡ"
          open={isModalAddOpen}
          onCancel={handleCancelAdd}
          footer=""
        >
          <Form onFinish={handleAdd} layout="vertical" form={formAdd}>
            <Form.Item
              label={"Kích cỡ"}
              name={"name"}
              rules={[
                { required: true, message: "Số kích cỡ không được để trống!" },
              ]}
            >
              <Input placeholder="Nhập số kích cỡ..." />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                <i className="fas fa-plus-circle me-1"></i> Thêm
              </Button>
            </div>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa kích thước"
          open={isModalUpdateOpen}
          onCancel={handleCancelUpdate}
          footer=""
        >
          <Form onFinish={handleUpdate} layout="vertical" form={formUpdate}>
            <Form.Item
              label={"Kích cỡ"}
              name={"name"}
              rules={[
                { required: true, message: "Số kích cỡ không được để trống!" },
              ]}
            >
              <Input placeholder="Nhập số kích cỡ..." />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                <i className="fas fa-plus-circle me-1"></i> Cập nhật
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
      </div>
    </BaseUI>
  );
}

export default Size;
