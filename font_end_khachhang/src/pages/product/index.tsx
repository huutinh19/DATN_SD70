



import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductItem from "../../components/ProductItem";
import SliderListProduct from "../../components/SliderListProduct";
import axios from "axios";
import API from "../../api";
import { IDetailProduct, IInforShoe, IProduct } from "../../types/product.type";

// Tab01 Component (Updated with Three Images)
const Tab01 = ({
  inforShoe,
  dataDetailProduct,
  imgArr,
}: {
  inforShoe?: IInforShoe;
  dataDetailProduct?: IDetailProduct[];
  imgArr?: string[][];
}) => {
  // Select up to five images from imgArr (flatten the array and take first five)
  const images = imgArr?.flat() || [];
  const selectedImages = images.slice(0, 5); // Take up to five images

  return inforShoe ? (
    <div className="w-[90%] max-w-5xl mx-auto py-8">
      {/* Product Image and Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Position 1: Main Product Image */}
        <div className="flex justify-center">
          <img
            src={selectedImages[0] || "https://via.placeholder.com/400"} // First image
            alt={inforShoe.name}
            className="w-full max-w-md rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Product Overview */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {inforShoe.name}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Sản phẩm {inforShoe.name} đến từ thương hiệu{" "}
            <span className="ml-2 text-gray-600">{inforShoe.thuongHieu.name}</span>. 
            Thiết kế basic, dễ ứng dụng, mang lại phong cách trẻ trung, năng động cùng chất liệu cao cấp mang lại sự thoải mái cho người sử dụng.
          </p>
          <div className="flex items-center mb-4">
            <span className="font-semibold text-gray-700">Thương hiệu: </span>
            <span className="ml-2 text-gray-600">{inforShoe.thuongHieu.name}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="font-semibold text-gray-700">Xuất xứ: </span>
            <span className="ml-2 text-gray-600">{inforShoe.xuatXu?.name || "-"}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="font-semibold text-gray-700">Tay áo: </span>
            <span className="ml-2 text-gray-600">{inforShoe.tayAo?.name || "-"}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="font-semibold text-gray-700">Cổ áo: </span>
            <span className="ml-2 text-gray-600">{inforShoe.coAo?.name || "-"}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="font-semibold text-gray-700">Chất liệu: </span>
            <span className="ml-2 text-gray-600">{inforShoe.chatLieu?.name || "-"}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-700">Kích thước: </span>
            <span className="ml-2 text-gray-600">
              {dataDetailProduct?.length
                ? dataDetailProduct.map((e, i) => (
                    <span key={i}>
                      {e.size}
                      {i + 1 < dataDetailProduct.length ? ", " : ""}
                    </span>
                  ))
                : "Không có thông tin"}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Thông Tin Chi Tiết
        </h3>
        <div className="space-y-12">
          {/* Brand Section */}
          <div>
            <h4 className="text-xl font-medium text-gray-700 mb-2">
              Về Thương Hiệu <span className="ml-2 text-gray-600">{inforShoe.thuongHieu.name}</span>
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Là những người dẫn đầu trong việc sản xuất vải denim,{" "}
              <span className="ml-2 text-gray-600">{inforShoe.thuongHieu.name}</span> đã trở thành thương hiệu thời trang độc đáo chuyên cung cấp quần jeans, áo thun, áo polo, áo sơ mi, các phụ kiện thời trang dành cho nam giới, phụ nữ và trẻ em. Bí quyết thành công của thương hiệu thời trang này nằm ở khả năng kết hợp các công nghệ sản xuất tiên tiến, hiện đại với việc chăm sóc sản phẩm một cách thủ công để giúp cho hàng hóa được lâu bền và thoải mái.
            </p>
          </div>

          {/* Design Section with Position 2: Secondary Image */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-2/3">
              <h4 className="text-xl font-medium text-gray-700 mb-2">
                Thiết Kế Sản Phẩm {inforShoe.name}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Sản phẩm {inforShoe.name} được hoàn thiện từ 50% Polyester và 50% Polyurethane nên có độ bền cao. Form chuẩn đẹp với các đường chỉ vô cùng tinh tế, tỉ mỉ đến từng chi tiết. Kiểu dáng có dây buộc, ôm chân với điểm nhấn tên thương hiệu đặt tinh tế. Lớp lót được làm êm ái giúp chân luôn thoải mái dù mang suốt cả ngày. Phần đế có độ ma sát tốt cùng độ nâng phù hợp giúp đôi chân vững vàng hơn khi di chuyển và hoạt động.
              </p>
            </div>
            {selectedImages[1] && (
              <div className="md:w-1/3">
                <img
                  src={selectedImages[1]} // Second image
                  alt={`${inforShoe.name} design`}
                  className="w-full rounded-lg shadow-md object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Features with Position 3: Tertiary Image */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Đặc Điểm Nổi Bật
        </h3>
        {selectedImages[2] && (
          <div className="mb-6 flex justify-center">
            <img
              src={selectedImages[2]} // Third image
              alt={`${inforShoe.name} features`}
              className="w-full max-w-sm rounded-lg shadow-md object-cover"
            />
          </div>
        )}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex items-start">
            <svg
              className="w-6 h-6 text-blue-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-gray-600">
              Chất liệu cao cấp: 50% Polyester, 50% Polyurethane đảm bảo độ bền.
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-6 h-6 text-blue-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-gray-600">
              Thiết kế dây buộc ôm chân, thoải mái cả ngày.
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-6 h-6 text-blue-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-gray-600">
              Chất liệu co giãn, thoải mái khi vận động.
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-6 h-6 text-blue-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-gray-600">
              Phong cách trẻ trung, dễ dàng phối đồ.
            </span>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-gray-500">Không có thông tin sản phẩm.</p>
    </div>
  );
};

const ProductPage = () => {
  const params = useParams();
  const id = params?.id;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);
  const [inforShoe, setInforShoe] = useState<IInforShoe>();
  const [dataDetailProduct, setDataDetailProduct] = useState<IDetailProduct[]>();
  const [dataProductSole, setDataProductSole] = useState<IProduct[]>();

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const getInfoDetailProduct = async () => {
    if (id) {
      const res = await axios({
        method: "get",
        url: API.getShoeDetail(Number(id)),
      });
      if (res.status) {
        setDataDetailProduct(res?.data?.data);
      }
    }
  };

  

  const getProductWithId = async () => {
    if (id) {
      const res = await axios({
        method: "get",
        url: API.getShoeWithId(Number(id)),
      });
      if (res.status) {
        setInforShoe(res.data);
      }
    }
  };

  // Compute imgArr for passing to Tab01
  const imgArr = useMemo(() => {
    const arr: string[][] = [];
    if (dataDetailProduct) {
      for (let i = 0; i < dataDetailProduct.length; i++) {
        arr.push(dataDetailProduct[i].images ? dataDetailProduct[i].images.split(",") : []);
      }
    }
    return arr;
  }, [dataDetailProduct]);

  useEffect(() => {
    getProductWithId();
    getInfoDetailProduct();
  }, [id]);



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full px-4">
      {!!inforShoe && !!dataDetailProduct && !!dataDetailProduct.length && (
        <ProductItem
          product={dataDetailProduct}
          shoeId={Number(id)!}
          inforShoe={inforShoe}
        />
      )}
      <div className="w-full h-[1px] bg-gray-400" />
      <div className="w-full mb-32">
        <div className="flex space-x-10 w-full justify-around mb-10">
          <button
            onClick={() => handleTabClick(0)}
            className={`px-4 ${
              activeTab === 0 ? "bg-[#f5f5f5] border-b-[1px]" : ""
            } py-2 px-4 relative group btn4 leading-none overflow-hidden w-[50%]`}
          >
            <span className="rounded-md font-semibold px-9 text-gray-700">
              MÔ TẢ
            </span>
            <span
              className={`absolute inset-x-0 h-[1.5px] bottom-0 bg-gray-700`}
            />
          </button>
          <button
            onClick={() => handleTabClick(1)}
            className={`px-4 ${
              activeTab === 1 ? "bg-[#f5f5f5] border-b-[1px]" : ""
            } py-2 px-4 relative group btn4 leading-none overflow-hidden w-[50%]`}
          >
            <span className="rounded-md font-semibold px-9 text-gray-700">
  
            </span>
            <span
              className={`absolute inset-x-0 h-[1.5px] bottom-0 bg-gray-700`}
            />
          </button>
        </div>
        <div className="w-full">
          {activeTab === 0 && (
            <Tab01
              inforShoe={inforShoe}
              dataDetailProduct={dataDetailProduct}
              imgArr={imgArr}
            />
          )}
          {/* Add Tab02 for return policy if needed */}
        </div>
        {!!dataProductSole && !!dataProductSole.length && (
          <>
            <div className="flex items-center mt-2">
              <span className="text-base font-medium uppercase text-[#000]">
                Các sản phẩm tương tự
              </span>
              <div className="w-10 h-[1px] bg-[#000] ml-2 self-end" />
            </div>
            <SliderListProduct products={dataProductSole} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;