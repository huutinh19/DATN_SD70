

import React, { useState, useCallback, useEffect } from "react";
import { Layout, Button, Badge, Space, Avatar, Tooltip, Popover, List, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import Footer from "./Footer";
import Sidebar from "./components/Menu/Menu";
import UserProfile from "~/pages/admin/settings/UserProfile";
import * as request from "~/utils/httpRequest";
import { getTokenEmpoloyee } from "~/helper/useCookies";
import { Link, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const BaseUI = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const toggleSidebar = useCallback(() => setCollapsed((prev) => !prev), []);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const decodedToken = jwtDecode(getTokenEmpoloyee());
        const response = await request.get(`/staff/${decodedToken.id}`);
        setUserAvatar(response.avatar);
      } catch (e) {
        console.error("Error loading user data:", e);
      }
    };

    if (!userAvatar) {
      loadUserData();
    }
  }, [userAvatar]);

  // Load notifications
  const loadNotifications = async () => {
    try {
      const decodedToken = jwtDecode(getTokenEmpoloyee());
      const response = await request.get(`/notification/${decodedToken.id}`);
      setNotifications(response.data);
      const unread = response.data.filter((notif) => notif.type === 0).length; // 0 là CHUA_DOC
      setUnreadCount(unread);
    } catch (e) {
      console.error("Error loading notifications:", e);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Mark notification as read and navigate
  const markAsRead = async (id, content) => {
    try {
      // Tìm thông báo hiện tại để kiểm tra trạng thái
      const currentNotification = notifications.find((notif) => notif.id === id);
      if (!currentNotification) {
        console.error("Notification not found:", id);
        return;
      }

      // Nếu thông báo đã đọc (type === 1), không làm gì thêm với unreadCount
      if (currentNotification.type === 1) {
        console.log("Notification already read, skipping unreadCount update");
      } else {
        // Gửi yêu cầu cập nhật trạng thái và giảm unreadCount nếu chưa đọc
        await request.put(`/notification/${id}`);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, type: 1 } : notif // 1 là DA_DOC
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0)); // Đảm bảo không âm
      }

      // Điều hướng đến trang hóa đơn
      console.log("Notification content:", content);
      const billCodeMatch = content.match(/mã (Hoá đơn \d+)/); // Cụ thể hơn cho "Hoá đơn X"
      console.log("Bill code match:", billCodeMatch);
      if (billCodeMatch) {
        const billCode = billCodeMatch[1];
        try {
          const billResponse = await request.get(`/bill/find-by-code?code=${billCode}`);
          console.log("Bill response:", billResponse);
          if (billResponse && billResponse.id) {
            console.log("Navigating to:", `/admin/bill/${billResponse.id}`);
            navigate(`/admin/bill/${billResponse.id}`);
          } else {
            console.error("No bill ID found in response");
          }
        } catch (apiError) {
          console.error("Error fetching bill:", apiError.response?.data || apiError);
        }
      } else {
        console.error("No bill code found in notification content");
      }
    } catch (e) {
      console.error("Error marking notification as read:", e.response?.data || e);
    }
  };

  const notificationContent = (
    <div style={{ width: 300, maxHeight: 400, overflowY: "auto" }}>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            onClick={() => markAsRead(item.id, item.content)}
            style={{
              cursor: "pointer",
              backgroundColor: item.type === 0 ? "#f0f0f0" : "white", // Nền xám nhạt cho chưa đọc
            }}
          >
            <List.Item.Meta
              title={
                <Text strong={item.type === 0} style={{ opacity: item.type === 1 ? 0.6 : 1 }}>
                  {item.title}
                </Text>
              }
              description={
                <>
                  <Text style={{ opacity: item.type === 1 ? 0.6 : 1 }}>{item.content}</Text>
                  <br />
                  <Text type="secondary" style={{ opacity: item.type === 1 ? 0.6 : 1 }}>
                    {new Date(item.createAt).toLocaleString()}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />
      {notifications.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">Không có thông báo nào.</Text>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Sidebar />
      </Sider>
      <Layout>
        <Header className="bg-body px-3 d-flex align-items-center justify-content-between">
          <Button
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
          />
          <Space size="middle">
            <Tooltip title="Thông báo">
              <Popover content={notificationContent} title="Thông báo" trigger="click">
                <Badge count={unreadCount} size="small" color="#f5222d">
                  <BellOutlined className="fs-5" />
                </Badge>
              </Popover>
            </Tooltip>
            <Tooltip title="Tài khoản">
              <Link to="/admin/profile">
                <Avatar src={userAvatar || <UserOutlined />} size="large" />
              </Link>
            </Tooltip>
          </Space>
        </Header>
        <Content className="m-3 p-3 bg-body" style={{ minHeight: "100vh" }}>
          {showProfile ? <UserProfile setUserAvatar={setUserAvatar} /> : children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default BaseUI;