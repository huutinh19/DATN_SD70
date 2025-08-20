





import React, { useEffect, useState } from "react";
import SliderHome from "../../components/sliderHome/SliderHome";
import Images from "../../static";
import "./styles.css";
import TitleBrand from "../../components/TitleBrand";
import { useNavigate } from "react-router-dom";
import SliderListBrand from "../../components/SliderListBrand";
import axios from "axios";
import API from "../../api";
import { IProduct } from "../../types/product.type";
import ProductStanding from "../../components/ProductStanding";
import { toSlug } from "../../utils/format";
import SekeletonItemShoe from "../../components/SekeletonItemShoe";
import Fade from "react-reveal/Fade";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Slider, { Settings } from "react-slick";
import Pagination from "../../components/Pagination";
import Chatbot from "../../components/ChatBot";

const Line = () => {
  return (
    <span className="border-b-2 border-[#f1f1f1] border-solid w-full h-[1px] my-8" />
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState<number>(1);
  const [discountPage, setDiscountPage] = React.useState<number>(1);
  const [products, setProducts] = useState<IProduct[]>();
  const [productsAll, setProductsAll] = useState<IProduct[]>();
  const [productsTop, setProductsTop] = useState<IProduct[]>();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalDiscountPages, setTotalDiscountPages] = useState<number>(1);
  const [sekeletonItemShoe, setSekeletonItemShoe] = useState<boolean>(true);
  const [sekeletonItemShoeAll, setSekeletonItemShoeAll] = useState<boolean>(true);
  const [sekeletonItemShoeTop, setSekeletonItemShoeTop] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false); // Trạng thái hiển thị chat

  const itemsPerPage = 8;

  const settings: Settings = {
    dots: false,
    arrows: false,
    className: "center",
    infinite: true,
    slidesToShow: 4,
    swipeToSlide: true,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
  const sliderRef = React.useRef<Slider>(null);

  const next = () => sliderRef.current?.slickNext();
  const prev = () => sliderRef.current?.slickPrev();

  // API calls
  const getDataShoes = async () => {
    setSekeletonItemShoe(true);
    try {
      const res = await axios({
        method: "get",
        url: API.getShoe(page, itemsPerPage),
      });
      if (res.status) {
        setProducts(res?.data?.data);
        setTotalPages(res?.data?.totalPages);
        setSekeletonItemShoe(false);
      }
    } catch (error) {
      console.error("Error fetching shoes:", error);
      setSekeletonItemShoe(false);
    }
  };

  const getAllShoe = async () => {
    setSekeletonItemShoeAll(true);
    try {
      const res = await axios({
        method: "get",
        url: API.getAllShoe(1, 10000),
      });
      if (res.status) {
        const allProducts = res?.data?.data;
        setProductsAll(allProducts);
        const discountedProducts = allProducts.filter(
          (item: IProduct) => !item.status && item.discountValue
        );
        setTotalDiscountPages(
          Math.ceil(discountedProducts.length / itemsPerPage)
        );
        setSekeletonItemShoeAll(false);
      }
    } catch (error) {
      console.error("Error fetching all shoes:", error);
      setSekeletonItemShoeAll(false);
    }
  };

  const getDataTopSale = async () => {
    setSekeletonItemShoeTop(true);
    try {
      const res = await axios({
        method: "get",
        url: API.getTopSale(15),
      });
      if (res.status) {
        setProductsTop(res?.data);
        setSekeletonItemShoeTop(false);
      }
    } catch (error) {
      console.error("Error fetching top sale:", error);
      setSekeletonItemShoeTop(false);
    }
  };

  useEffect(() => {
    getDataShoes();
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getDataTopSale();
    getAllShoe();
  }, []);

  return (
    <div className="w-full flex flex-col flex-1 bg-white no-scrollbar overflow-x-hidden">
      <SliderHome />
      <Line />

      {/* Thông tin ưu đãi */}
      <Fade top distance="10%" duration={3000}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-between gap-4 py-6">
          {[
            {
              img:
                "https://sneakerdaily.vn/wp-content/uploads/2022/09/doi-mau-doi-size-mien-phi.jpg",
              text: "Đổi mẫu, đổi size miễn phí",
            },
            {
              img:
                "https://sneakerdaily.vn/wp-content/uploads/2022/09/mua-truoc-tra-sau-mien-lai.jpg",
              text: "Mua trước, trả sau miễn lãi",
            },
            {
              img:
                "https://sneakerdaily.vn/wp-content/uploads/2022/09/giao-hang-doi-tra-tan-nha.jpg",
              text: "Giao hàng, đổi trả tận nhà",
            },
            {
              img:
                "https://sneakerdaily.vn/wp-content/uploads/2022/09/hang-gia-den-tien-gap-doi.jpg",
              text: "Hàng giả, đền tiền gấp đôi",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <LazyLoadImage
                src={item.img}
                alt=""
                className="w-12 h-12 object-contain"
              />
              <span className="text-base text-gray-700 font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </Fade>
      <Line />

      {/* Top Sản Phẩm Bán Chạy */}
      {/* {productsTop && productsTop.length && (
        <>
          <div className="flex flex-col items-center py-8">
            <p className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
              Top Những Sản Phẩm Bán Chạy
            </p>
          </div>
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {sekeletonItemShoeTop
                ? Array(5)
                    .fill({})
                    .map((_, index) => <SekeletonItemShoe key={index} />)
                : productsTop
                    .filter((item) => !item.status)
                    .map((item, index) => (
                      <ProductStanding product={item} key={index} />
                    ))}
            </div>
          </div>
        </>
      )} */}
      <Line />

      {/* Sản phẩm đang giảm giá */}
      {productsAll && productsAll.length && (
        <>
          <div className="flex flex-col items-center py-8">
            <p className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
  
            </p>
          </div>
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sekeletonItemShoeAll
                ? Array(5)
                    .fill({})
                    .map((_, index) => <SekeletonItemShoe key={index} />)
                : productsAll
                    .filter((item) => !item.status && item.discountValue)
                    .slice(
                      (discountPage - 1) * itemsPerPage,
                      discountPage * itemsPerPage
                    )
                    .map((item, index) => (
                      <ProductStanding product={item} key={index} />
                    ))}
            </div>
            {totalDiscountPages > 1 && (
              <Pagination
                currentPage={discountPage}
                totalPages={totalDiscountPages}
                onPageChange={setDiscountPage}
              />
            )}
          </div>
        </>
      )}
      <Line />

      {/* Sản Phẩm Nổi Bật */}
      {products && products.length && (
        <>
          <div className="flex flex-col items-center py-8">
            <p className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
              Danh sách sản phẩm
            </p>
          </div>
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sekeletonItemShoe
                ? Array(5)
                    .fill({})
                    .map((_, index) => <SekeletonItemShoe key={index} />)
                : products
                    .filter((item) => item.quantity && !item.status)
                    .map((item, index) => (
                      <ProductStanding product={item} key={index} />
                    ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </>
      )}

      
    </div>
  );
};

export default HomePage;