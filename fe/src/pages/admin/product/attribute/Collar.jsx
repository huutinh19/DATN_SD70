import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Table,
  Tooltip,
} from "antd";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  .collar-container {
    padding: 24px;
    background: #f8f9fe;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .collar-title {
    color: #2c3e50;
    font-weight: 600;
    font-size: 24px;
    margin-bottom: 24px;
    letter-spacing: 0.5px;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

function Collar() {
  const [collarList, setCollarList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [statusCollar, setStatusCollar] = useState(null);
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
    loadData(currentPage, pageSize, searchValue, statusCollar);
  }, [currentPage, pageSize, searchValue, statusCollar]);

  const loadData = (currentPage, pageSize, searchValue, statusCollar) => {
    request
      .get("/coao", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: statusCollar,
        },
      })
      .then((response) => {
        setCollarList(response.data);
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
      title: "Tên cổ áo",
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
          checkedChildren={<i className="fa-solid fa-check"></i>}
          unCheckedChildren={<i className="fa-solid fa-xmark"></i>}
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
            <Link to={"/admin/collar"}>
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

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn sửa trạng thái hoạt động?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .remove(`/coao/${item.id}`)
          .then((response) => {
            if (response.status === 200) {
              loadData(currentPage, pageSize, searchValue, statusCollar);
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

  const handleAdd = (data) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thêm cổ áo mới? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .post("/coao", data)
          .then((response) => {
            if (response.status === 200) {
              console.log(response);
              toast.success("Thêm mới thành công!");
              setIsModalAddOpen(false);
              loadData(currentPage, pageSize, searchValue, statusCollar);
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

  const handleUpdate = (data) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhật tên cổ áo? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .put(`/coao/${item.id}`, data)
          .then((response) => {
            if (response.status === 200) {
              console.log(response);
              toast.success("Cập nhật thành công!");
              setIsModalUpdateOpen(false);
              loadData(currentPage, pageSize, searchValue, statusCollar);
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

  return (
    <BaseUI>
      <div className="collar-container">
        <h6 className="fw-semibold collar-title">Danh sách cổ áo</h6>
        <div className="card p-3 mb-3">
          <h6 className="fw-semibold">Bộ lọc</h6>
          <Row gutter={10}>
            <Col span={16}>
              <label className="mb-1">Cổ áo</label>
              <Input
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm kiếm cổ áo..."
              />
            </Col>
            <Col span={8}>
              <div className="mb-1">Trạng thái</div>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setStatusCollar(value)}
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
            <h6 className="fw-semibold">Bảng cổ áo</h6>
            <Link to={"/admin/collar"}>
              <Button
                type="primary"
                onClick={showModalAdd}
                className="bg-primary w-100"
              >
                <i className="fas fa-plus-circle me-1"></i>Thêm cổ áo
              </Button>
            </Link>
          </div>
          <Table
            dataSource={collarList}
            columns={columns}
            className="mt-3"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalPages * pageSize,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
          />

          <Modal
            title="Thêm cổ áo"
            open={isModalAddOpen}
            onCancel={handleCancelAdd}
            footer=""
          >
            <Form onFinish={handleAdd} layout="vertical" form={formAdd}>
              <Form.Item
                label={"Cổ áo"}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Tên cổ áo không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên cổ áo..." />
              </Form.Item>
              <div className="d-flex justify-content-end">
                <Button type="primary" htmlType="submit">
                  <i className="fas fa-plus-circle me-1"></i> Thêm
                </Button>
              </div>
            </Form>
          </Modal>

          <Modal
            title="Chỉnh sửa cổ áo"
            open={isModalUpdateOpen}
            onCancel={handleCancelUpdate}
            footer=""
          >
            <Form onFinish={handleUpdate} layout="vertical" form={formUpdate}>
              <Form.Item
                label={"Cổ áo"}
                name={"name"}
                rules={[
                  { required: true, message: "Cổ áo không được để trống!" },
                ]}
              >
                <Input placeholder="Nhập cổ áo..." />
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

export default Collar;