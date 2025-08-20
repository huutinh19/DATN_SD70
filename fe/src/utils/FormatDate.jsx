import React from "react";

function FormatDate({ date }) {
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    // Lấy ngày tháng năm
    const datePart = dateObj.toLocaleDateString("vi-VN", options);
    
    // Lấy giờ phút giây (24 giờ)
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Dùng định dạng 24 giờ
    };
    
    const timePart = dateObj.toLocaleTimeString("vi-VN", timeOptions);

    // Kết hợp theo thứ tự: ngày/tháng/năm giờ:phút:giây
    return `${datePart} ${timePart}`;
  };

  return <span>{formatDate(date)}</span>;
}

export default FormatDate;
