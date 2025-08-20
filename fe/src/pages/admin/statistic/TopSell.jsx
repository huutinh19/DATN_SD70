



import { Col, Row, Table, Carousel, DatePicker, Button, Space, Typography, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import httpRequest from '~/utils/httpRequest';
import moment from 'moment';
import 'moment-timezone';
import FormatDate from '~/utils/FormatDate';

// Đặt múi giờ mặc định là Việt Nam
moment.tz.setDefault('Asia/Ho_Chi_Minh');

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

function TopSell() {
  const [topSell, setTopSell] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [filterType, setFilterType] = useState('day');
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null }); // Lưu trữ startDate, endDate

  const fetchTopSell = async (top = 5, startDate = null, endDate = null) => {
    setLoading(true);
    try {
      const params = { top };
      if (startDate && endDate) {
        // Format dates in Vietnam timezone without converting to UTC
        params.startDate = startDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // e.g., 2025-04-22T00:00:00.000+07:00
        params.endDate = endDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');   // e.g., 2025-04-22T23:59:59.999+07:00
      }
      console.log('Request params:', params);
      console.log('Request URL:', httpRequest.getUri({ url: '/shoe/top-sell', params }));
  
      const response = await httpRequest.get('/shoe/top-sell', { params });
      console.log('Full response:', response);
      console.log('Response data:', response.data);
  
      if (!Array.isArray(response.data)) {
        console.error('Response data is not an array:', response.data);
        message.error('Dữ liệu trả về không hợp lệ!');
        setTopSell([]);
        return;
      }
  
      if (response.data.length === 0) {
        message.warning('Không có sản phẩm nào trong khoảng thời gian này!');
      }
  
      setTopSell(
        response.data.map((item, index) => ({
          ...item,
          index: index + 1,
        }))
      );
      setSelectedDateRange({ startDate, endDate });
    } catch (error) {
      console.error('Error fetching top sell:', error);
      message.error('Không thể tải dữ liệu, vui lòng thử lại!');
      setTopSell([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Gọi API với bộ lọc mặc định là 'day' khi component được mount
    const now = moment();
    const startDate = now.clone().startOf('day');
    const endDate = now.clone().endOf('day');
    fetchTopSell(5, startDate, endDate);
  }, []);

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setDateRange([null, null]);

    const now = moment();
    let startDate = null;
    let endDate = now;

    switch (value) {
      case 'day':
        startDate = now.clone().startOf('day');
        endDate = now.clone().endOf('day');
        break;
      case 'week':
        startDate = now.clone().startOf('week');
        endDate = now.clone().endOf('week');
        break;
      case 'month':
        startDate = now.clone().startOf('month');
        endDate = now.clone().endOf('month');
        break;
      case 'year':
        startDate = now.clone().startOf('year');
        endDate = now.clone().endOf('year');
        break;
      case 'custom':
        return;
      default:
        return;
    }

    console.log('Filter type:', value, 'Start:', startDate.toISOString(), 'End:', endDate.toISOString());
    fetchTopSell(5, startDate, endDate);
  };

  const handleDateChange = (dates) => {
    console.log('Selected date range:', dates);
    setDateRange(dates);
  };

  const handleFilter = () => {
    if (filterType === 'custom' && dateRange && dateRange[0] && dateRange[1]) {
      const adjustedStartDate = dateRange[0].clone().startOf('day');
      const adjustedEndDate = dateRange[1].clone().endOf('day');
      console.log('Filtering with:', {
        start: adjustedStartDate.toISOString(),
        end: adjustedEndDate.toISOString(),
      });
      fetchTopSell(5, adjustedStartDate, adjustedEndDate);
    } else {
      message.warning('Vui lòng chọn khoảng thời gian hợp lệ!');
    }
  };

  const handleReset = () => {
    setFilterType('day');
    setDateRange([null, null]);
    const now = moment();
    const startDate = now.clone().startOf('day');
    const endDate = now.clone().endOf('day');
    fetchTopSell(5, startDate, endDate);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'images',
      className: 'text-center',
      render: (images) => (
        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '100px' }}>
          {images?.split(',').map((image, index) => (
            <img
              key={index}
              src={image}
              alt='images'
              style={{ width: '100px', height: '100px' }}
              className='object-fit-contain'
            />
          ))}
        </Carousel>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (x, record) => (
        <ul className='list-unstyled'>
          <li className='fw-semibold'>{x}</li>
          <small>
            <li className='text-danger fw-semibold'>
              <FormatCurrency value={record.minPrice} /> - <FormatCurrency value={record.maxPrice} />
            </li>
           
          </small>
        </ul>
      ),
    },
    {
      title: <span className='text-nowrap'>Số lượng bán ra</span>,
      dataIndex: 'quantitySold',
      key: 'quantitySold',
    },
  ];

  // Hàm để lấy tiêu đề dựa trên filterType và hiển thị ngày giờ
  const getTitle = () => {
    let baseTitle = '';
    switch (filterType) {
      case 'day':
        baseTitle = 'TOP SẢN PHẨM BÁN CHẠY THEO NGÀY';
        break;
      case 'week':
        baseTitle = 'TOP SẢN PHẨM BÁN CHẠY THEO TUẦN';
        break;
      case 'month':
        baseTitle = 'TOP SẢN PHẨM BÁN CHẠY THEO THÁNG';
        break;
      case 'year':
        baseTitle = 'TOP SẢN PHẨM BÁN CHẠY THEO NĂM';
        break;
      case 'custom':
        baseTitle = 'TOP SẢN PHẨM BÁN CHẠY THEO KHOẢNG THỜI GIAN';
        break;
      default:
        baseTitle = 'TOP SẢN PHẨM BÁN CHẠY';
    }

    // Nếu có startDate và endDate, thêm vào tiêu đề
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      return (
        <>
          {baseTitle} (Từ <FormatDate date={selectedDateRange.startDate.toISOString()} /> đến{' '}
          <FormatDate date={selectedDateRange.endDate.toISOString()} />)
        </>
      );
    }
    return baseTitle;
  };

  return (
    <div>
      <Title level={5}>{getTitle()}</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Select
              value={filterType}
              onChange={handleFilterTypeChange}
              style={{ width: 150 }}
              placeholder="Chọn thời gian"
            >
              <Option value="day">Ngày</Option>
              <Option value="week">Tuần</Option>
              <Option value="month">Tháng</Option>
              <Option value="year">Năm</Option>
              <Option value="custom">Tùy chỉnh</Option>
            </Select>
            {filterType === 'custom' && (
              <RangePicker
                value={dateRange}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            )}
            {filterType === 'custom' && (
              <Button
                type="primary"
                onClick={handleFilter}
                disabled={!dateRange || !dateRange[0] || !dateRange[1]}
              >
                Lọc
              </Button>
            )}
            <Button onClick={handleReset}>Xóa bộ lọc</Button>
          </Space>
        </Col>
      </Row>
      <Table
        className="text-nowrap"
        columns={columns}
        dataSource={topSell}
        pagination={false}
        loading={loading}
      />
    </div>
  );
}

export default TopSell;