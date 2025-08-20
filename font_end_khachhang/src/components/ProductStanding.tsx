import { IProduct } from "../types/product.type";
import { convertToCurrencyString } from "../utils/format";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Images from "../static";
import Fade from "react-reveal/Fade";
import QuickViewDetail from "./QuickViewDetail";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductStanding = ({ product }: { product: IProduct }) => {
  const navigate = useNavigate();
  const [showQuickView, setShowQuickView] = useState<boolean>(false);

  return product.minPrice && product.maxPrice ? (
    <div>
      <div
        className="border border-gray-200 rounded-lg shadow-sm p-4 relative h-[380px] group bg-white overflow-hidden transition-transform duration-300 hover:shadow-lg cursor-pointer"
        onClick={() => {
          if (product.minPrice && product.maxPrice && product.images) {
            navigate(`/product/${product.id}`);
          }
        }}
      >
        {!!product.discountPercent && (
          <p className="text-sm bg-red-500 font-semibold absolute top-3 left-3 z-10 text-white px-4 py-1 rounded-full">
            Sale {product.discountPercent}%
          </p>
        )}

        <button
          className="opacity-0 group-hover:opacity-100 absolute bottom-4 z-10 left-0 right-0 mx-auto bg-blue-600 text-white text-sm font-semibold py-2 px-6 rounded-full transition-opacity duration-300 ease-in-out cursor-pointer"
          type="button"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            setShowQuickView(true);
          }}
        >
          Xem Nhanh
        </button>

        <div className="zh-[220px] flex flex-col items-center justify-center">
          <LazyLoadImage
            src={product.images.split(",")[0]}
            className="max-h-[180px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
            alt={product.name}
          />

          {/* <p className="text-gray-800 font-semibold text-sm text-center mt-2 line-clamp-2">
              {product.name}
            </p>
            <div className="mt-2">
              {product.discountValue ? (
                <div className="flex items-center justify-center gap-3">
                  <p className="text-red-600 font-bold text-lg">
                    {convertToCurrencyString(product.discountValue)}
                  </p>
                  <p className="text-gray-500 font-medium text-sm line-through">
                    {convertToCurrencyString(product.minPrice)}
                  </p>
                </div>
              ) : (
                <p className="text-red-600 font-bold text-lg text-center">
                  {convertToCurrencyString(product.minPrice)}
                </p>
              )}
           
            </div> */}

          <p className="text-gray-800 font-bold text-3xl text-center mt-2 line-clamp-2">
            {product.name}
          </p>
          <div className="mt-2">
            {product.discountValue ? (
              <div className="flex items-center justify-center gap-3">
                <p className="text-red-600 font-semibold text-lg">
                  {convertToCurrencyString(product.discountValue)}
                </p>
                <p className="text-gray-500 font-medium text-base line-through">
                  {convertToCurrencyString(product.minPrice)}
                </p>
              </div>
            ) : (
              <p className="text-red-600 font-semibold text-2xl text-center">
                {convertToCurrencyString(product.minPrice)}
              </p>
            )}
          </div>
        </div>
      </div>

      {showQuickView && (
        <QuickViewDetail
          product={product}
          setShowQuickView={setShowQuickView}
        />
      )}
    </div>
  ) : (
    <Fade bottom distance="10%" duration={1500}>
      <div className="border border-gray-200 rounded-lg shadow-sm p-4 relative h-[380px] bg-white overflow-hidden">
        <div className="h-[220px] flex items-center justify-center">
          <LazyLoadImage
            src={Images.imgNotFound}
            className="max-h-[220px] w-full object-contain"
            alt="Not found"
          />
        </div>
        <p className="text-gray-500 font-medium text-sm text-center mt-4">
          Sản phẩm không khả dụng
        </p>
      </div>
    </Fade>
  );
};

export default ProductStanding;
