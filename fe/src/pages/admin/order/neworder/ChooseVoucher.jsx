


import { Badge, Button, Col, Result, Input, Modal, Radio, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import FormatDate from '~/utils/FormatDate';
import * as request from "~/utils/httpRequest";

function ChooseVoucher({ onSelectVoucher, customerId, orderTotal = 0, selectedVoucherId = null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [publicVoucher, setPublicVoucher] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    // Hàm tính trạng thái voucher
    const getVoucherStatus = (voucher) => {
        const minBillValue = voucher.minBillValue;
        const maxDiscount = voucher.maxBillValue;
        const discountValue = (orderTotal * voucher.percentReduce) / 100;
        const currentDate = new Date();
        const endDate = new Date(voucher.endDate);

        return {
            isApplicable: orderTotal >= minBillValue && currentDate <= endDate && voucher.quantity > 0,
            actualDiscount: Math.min(discountValue, maxDiscount),
        };
    };

    // Hàm chọn voucher tốt nhất
    const selectBestVoucher = (vouchers) => {
        let bestVoucher = null;
        let maxDiscount = 0;

        vouchers.forEach(voucher => {
            const status = getVoucherStatus(voucher);
            if (status.isApplicable && status.actualDiscount > maxDiscount) {
                bestVoucher = voucher;
                maxDiscount = status.actualDiscount;
            }
        });

        return bestVoucher;
    };

    // Load danh sách voucher
    const loadData = (searchValue) => {
        request.get('/voucher', {
            params: {
                name: searchValue,
               
                status: 1
            }
        }).then(response => {
            const sortedVouchers = response.data.sort((a, b) => {
                const aStatus = getVoucherStatus(a);
                const bStatus = getVoucherStatus(b);
                return bStatus.actualDiscount - aStatus.actualDiscount; // Sắp xếp theo actualDiscount giảm dần
            });
            setPublicVoucher(sortedVouchers);

            // Chọn voucher tốt nhất khi load lần đầu
            const bestVoucher = selectBestVoucher(sortedVouchers);
            if (bestVoucher && (!selectedVoucher || selectedVoucher.id !== bestVoucher.id)) {
                setSelectedVoucher(bestVoucher);
                onSelectVoucher(bestVoucher);
            }
        }).catch(e => {
            console.log(e);
        });
    };

    // Load dữ liệu khi component mount hoặc searchValue thay đổi
    useEffect(() => {
        loadData(searchValue);
    }, [searchValue]);

    // Kiểm tra lại voucher khi orderTotal thay đổi
    useEffect(() => {
        if (publicVoucher.length > 0) {
            const bestVoucher = selectBestVoucher(publicVoucher);
            if (bestVoucher) {
                // Chỉ cập nhật nếu voucher mới khác với voucher hiện tại
                if (!selectedVoucher || bestVoucher.id !== selectedVoucher.id) {
                    setSelectedVoucher(bestVoucher);
                    onSelectVoucher(bestVoucher);
                }
            } else {
                // Nếu không có voucher nào khả dụng, xóa selectedVoucher
                if (selectedVoucher) {
                    setSelectedVoucher(null);
                    onSelectVoucher(null);
                }
            }
        }
    }, [orderTotal, publicVoucher]);

    // Đồng bộ selectedVoucher với selectedVoucherId từ props
    useEffect(() => {
        if (selectedVoucherId) {
            const voucher = publicVoucher.find(v => v.id === selectedVoucherId);
            if (voucher) {
                setSelectedVoucher(voucher);
                onSelectVoucher(voucher);
            }
        } else if (selectedVoucher) {
            setSelectedVoucher(null);
            onSelectVoucher(null);
        }
    }, [selectedVoucherId, publicVoucher]);

    // Xử lý khi chọn voucher thủ công
    const handleVoucherSelect = (voucher) => {
        const voucherStatus = getVoucherStatus(voucher);
        if (voucherStatus.isApplicable) {
            setSelectedVoucher(voucher);
            onSelectVoucher(voucher);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <Col xl={24}>
                <div className="border-1 p-2 d-flex rounded-2" style={{ cursor: "pointer" }}>
                    <div className="flex-grow-1">
                        Phiếu giảm giá (Đơn hàng: <FormatCurrency value={orderTotal} />):
                        {selectedVoucher ? (
                            <Tag color="green">
                                {selectedVoucher.name} ({selectedVoucher.percentReduce}%)
                            </Tag>
                        ) : (
                            <span>Chưa áp dụng</span>
                        )}
                    </div>
                    <div>
                        {/* <Button
                            type="primary"
                            size="small"
                            onClick={() => { setIsModalOpen(true); loadData(searchValue); }}
                        >
                            Chọn phiếu giảm giá
                        </Button> */}
                        <Button
        type="primary"
    
        onClick={() => { 
            setIsModalOpen(true); 
            loadData(searchValue); 
        }}
        style={{
            backgroundColor: '#4CAF50',  // Màu nền nút
            borderColor: '#388E3C',  // Màu viền
            borderRadius: '12px',  // Bo góc
            padding: '8px 16px',  // Khoảng cách bên trong nút
            fontWeight: 'bold',  // In đậm chữ
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // Hiệu ứng bóng đổ
            transition: 'all 0.3s ease',  // Thêm hiệu ứng chuyển động
        }}
        className="custom-button"
    >
        Chọn phiếu giảm giá
    </Button>
                    </div>
                </div>
            </Col>

            <Modal
                title={`Chọn phiếu giảm giá (Tổng đơn: ${FormatCurrency({ value: orderTotal })})`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
            >
                <div style={{ maxHeight: '64vh', overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="container">
                        <Input
                            placeholder='Tìm kiếm phiếu giảm giá theo mã, tên...'
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="mb-3"
                        />

                        {publicVoucher.length === 0 ? (
                            <Result description="Danh sách phiếu giảm giá trống" />
                        ) : (
                            publicVoucher.map((item) => {
                                const voucherStatus = getVoucherStatus(item);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleVoucherSelect(item)}
                                        className={`d-flex align-items-center position-relative pt-2 mt-3 border rounded-2 px-2 ${
                                            selectedVoucher?.id === item.id ? 'border-warning bg-light' :
                                            !voucherStatus.isApplicable ? 'bg-light text-muted' : 'border-success'
                                        }`}
                                        style={{ cursor: voucherStatus.isApplicable ? 'pointer' : 'not-allowed' }}
                                    >
                                        <div className="flex-grow-1">
                                            <ul className='list-unstyled'>
                                                <li className='fw-semibold'>
                                                    <span className='text-warning'>[{item.code}]</span> {item.name}
                                                    <Tag color="gold">{item.percentReduce}%</Tag>
                                                    <Tag color={voucherStatus.isApplicable ? 'green' : 'red'}>
                                                        {voucherStatus.isApplicable ? 'Tốt' : 'Không áp dụng được'}
                                                    </Tag>
                                                </li>
                                                <li className='small'>
                                                    Đơn tối thiểu: <FormatCurrency value={item.minBillValue} />
                                                    {orderTotal < item.minBillValue && (
                                                        <span className="text-danger ms-2">
                                                            (Còn thiếu: <FormatCurrency value={item.minBillValue - orderTotal} />)
                                                        </span>
                                                    )}
                                                </li>
                                                <li className='small'>
                                                    Giảm tối đa: <FormatCurrency value={item.maxBillValue} />
                                                    {voucherStatus.isApplicable && (
                                                        <span className="text-success ms-2">
                                                            (Giảm thực tế: <FormatCurrency value={voucherStatus.actualDiscount} />)
                                                        </span>
                                                    )}
                                                </li>
                                                <li className='small'>
                                                    Ngày kết thúc: <FormatDate date={item.endDate} />
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <Radio
                                                checked={selectedVoucher?.id === item.id}
                                                disabled={!voucherStatus.isApplicable}
                                            />
                                        </div>
                                        <Badge
                                            count={item.quantity}
                                            className="position-absolute top-0 start-100 translate-middle"
                                            style={{ backgroundColor: '#1890ff' }}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ChooseVoucher;