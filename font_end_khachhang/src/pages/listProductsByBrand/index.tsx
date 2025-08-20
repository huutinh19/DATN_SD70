



import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import path from "../../constants/path";
import axios from "axios";
import API from "../../api";
import { IProduct, Product } from "../../types/product.type";
import ProductStanding from "../../components/ProductStanding";
import SekeletonItemShoe from "../../components/SekeletonItemShoe";
import Pagination from "../../components/Pagination";

interface ShoeSize {
  id: number;
  size: string;
  selected: boolean;
}
interface ShoeMaterial {
  id: number;
  material: string;
  selected: boolean;
}
interface ShoseBrand {
  id: number;
  brand: string;
  selected: boolean;
}
interface ShoseColor {
  id: number;
  color: string;
  selected: boolean;
}
interface ShoseCategory {
  id: number;
  category: string;
  selected: boolean;
}
interface PriceRange {
  id: number;
  minPrice: number;
  maxPrice: any;
  priceRange: string;
}

const ListProductsByBrand = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState<boolean>(true);
  const [isDropdownOpen3, setIsDropdownOpen3] = useState<boolean>(true);
  const [isDropdownOpen4, setIsDropdownOpen4] = useState<boolean>(true);
  const [isDropdownOpen5, setIsDropdownOpen5] = useState<boolean>(true);
  const [isDropdownOpen6, setIsDropdownOpen6] = useState<boolean>(true);
  const [priceRange2, setPriceRange2] = useState([
    {
      id: 1,
      minPrice: 0,
      maxPrice: 1000000,
      priceRange: "0₫ - 1.000.000₫",
    },
    {
      id: 2,
      minPrice: 1000000,
      maxPrice: 3000000,
      priceRange: "1.000.000₫ - 3.000.000₫",
    },
    {
      id: 3,
      minPrice: 3000000,
      maxPrice: 5000000,
      priceRange: "3.000.000₫ - 5.000.000₫",
    },
    {
      id: 4,
      minPrice: 5000000,
      maxPrice: 7000000,
      priceRange: "5.000.000₫ - 7.000.000₫",
    },
    {
      id: 5,
      minPrice: 7000000,
      maxPrice: 10000000,
      priceRange: "7.000.000₫ - 10.000.000₫",
    },
    {
      id: 6,
      minPrice: 10000000,
      maxPrice: "",
      priceRange: "lớn hơn 10.000.000₫ ",
    },
  ]);
  const [selectedSizes, setSelectedSizes] = useState<ShoeSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<ShoseColor[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<ShoeMaterial[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({
    id: 0,
    minPrice: 0,
    maxPrice: "",
    priceRange: "",
  });
  const [selectedBrands, setSelectedBrands] = useState<ShoseBrand[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ShoseCategory[]>([]);
  const [shoeSizes, setShoesSize] = useState<Product[]>();
  const [colors, setColors] = useState<Product[]>();
  const [materials, setMaterials] = useState<Product[]>();
  const [brands, setBrands] = useState<Product[]>();
  const [categories, setCategories] = useState<Product[]>();
  const [listShoes, setListShoes] = useState<IProduct[]>();
  const [idCategories, setIDCategories] = useState<any>("");
  const [idBrands, setIdBrands] = useState<any>();
  const [name, setName] = useState<String>("Tất cả sản phẩm");

  const handleSizeSelect = (size: Product) => {
    setSelectedSizes((prevSizes) => {
      const existingSize = prevSizes.find((s) => s.size === size.name);
      if (existingSize) {
        return prevSizes.filter((s) => s.size !== size.name);
      } else {
        return [...prevSizes, { id: size.id, size: size.name, selected: true }];
      }
    });
  };

  const handleMaterialsSelect = (material: Product) => {
    setSelectedMaterials((prevMaterial) => {
      const existingSize = prevMaterial.find((s) => s.material === material.name);
      if (existingSize) {
        return prevMaterial.filter((s) => s.material !== material.name);
      } else {
        return [...prevMaterial, { id: material.id, material: material.name, selected: true }];
      }
    });
  };

  const handleColorsSelect = (color: Product) => {
    setSelectedColors((prevColor) => {
      const existingColor = prevColor.find((s) => s.color === color.name);
      if (existingColor) {
        return prevColor.filter((s) => s.color !== color.name);
      } else {
        return [...prevColor, { id: color.id, color: color.name, selected: true }];
      }
    });
  };

  const handleBrandSelect = (brand: Product) => {
    setSelectedBrands((prevBrands) => {
      const existingBrand = prevBrands.find((s) => s.brand === brand.name);
      if (existingBrand) {
        return prevBrands.filter((s) => s.brand !== brand.name);
      } else {
        return [...prevBrands, { id: brand.id, brand: brand.name, selected: true }];
      }
    });
  };

  const handleCategorySelect = (category: Product) => {
    setSelectedCategories((prevCategories) => {
      const existingCategory = prevCategories.find((s) => s.category === category.name);
      if (existingCategory) {
        return prevCategories.filter((s) => s.category !== category.name);
      } else {
        return [...prevCategories, { id: category.id, category: category.name, selected: true }];
      }
    });
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedId = parseInt(event.target.value);
    const selectedRange = priceRange2.find((item) => item.id === selectedId);
    if (selectedRange) {
      setSelectedPriceRange({ ...selectedRange });
    }
  };

  const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);
  const handleDropdownTogglePrice = () => setIsDropdownOpen2(!isDropdownOpen2);
  const handleDropdownToggleMaterial = () => setIsDropdownOpen3(!isDropdownOpen3);
  const handleDropdownToggleBrand = () => setIsDropdownOpen4(!isDropdownOpen4);
  const handleDropdownToggleColor = () => setIsDropdownOpen5(!isDropdownOpen5);
  const handleDropdownToggleCategory = () => setIsDropdownOpen6(!isDropdownOpen6);

  const getNameParam = async () => {
    const res = await axios({
      method: "get",
      url: API.getBrandWithId(idBrands),
    });
    if (res) setName(res?.data.name);
  };

  const getNameParamCate = async () => {
    const res = await axios({
      method: "get",
      url: API.getCategoryWithId(idCategories),
    });
    if (res) setName(res?.data.name);
  };

  const getDataSize = async () => {
    const res = await axios({
      method: "get",
      url: API.getSizeAll(),
    });
    if (res.status) setShoesSize(res?.data?.data);
  };

  const getDataColor = async () => {
    const res = await axios({
      method: "get",
      url: API.getAllColors(),
    });
    if (res.status) setColors(res?.data?.data);
  };

  // const getDataSole = async () => {
  //   const res = await axios({
  //     method: "get",
  //     url: API.getSole(),
  //   });
  //   if (res.status) setMaterials(res.data?.data);
  // };

  const getDataBrand = async () => {
    const res = await axios({
      method: "get",
      url: API.getBrand(),
    });
    if (res.status) setBrands(res.data?.data);
  };

  // const getDataCategory = async () => {
  //   const res = await axios({
  //     method: "get",
  //     url: API.getCategory(),
  //   });
  //   if (res.status) setCategories(res.data?.data);
  // };

  const getFilter = async () => {
    const myColor = selectedColors.map((i) => i.id);
    const idColors = myColor.join(",");
    const mySize = selectedSizes.map((i) => i.id);
    const idSizes = mySize.join(",");
    const myBrand = selectedBrands.map((i) => i.id);
    const idBrandsFilter = myBrand.join(",");
    const myCategory = selectedCategories.map((i) => i.id);
    const idCategoriesFilter = myCategory.join(",");
    const myMaterials = selectedMaterials.map((i) => i.id);
    const idMaterials = myMaterials.join(",");

    try {
      const res = await axios({
        method: "get",
        url: API.getFilter(
          idColors,
          idSizes,
          idMaterials,
          idBrandsFilter || idBrands || "",
          idCategoriesFilter || idCategories || "",
          selectedPriceRange?.minPrice,
          selectedPriceRange?.maxPrice,
          page
        ),
      });
      if (res.status) {
        setTotalPage(res?.data?.totalPages);
        setListShoes(res?.data?.data);
      }
    } catch (error) {
      console.error("Lỗi: ", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getDataSize();
    // getDataSole();
    getDataColor();
    getDataBrand();
    // getDataCategory();
  }, []);

  useEffect(() => {
    if (params?.idBrand) {
      setIdBrands(params?.idBrand);
    } else if (params?.idCategory) {
      setIDCategories(params?.idCategory);
    }
  }, [params]);

  useEffect(() => {
    if (idBrands && idBrands !== "") getNameParam();
    else if (idCategories && idCategories !== "") getNameParamCate();
  }, [idBrands, idCategories]);

  useEffect(() => {
    getFilter();
  }, [
    selectedColors,
    selectedSizes,
    selectedMaterials,
    selectedBrands,
    selectedCategories,
    page,
    idBrands,
    idCategories,
    params,
    selectedPriceRange,
  ]);

  return (
    <div className="w-full h-full">
      <style>
        {`
          /* Container for the entire filter sidebar */
          #logo-sidebar {
            background-color: #ffffff;
            padding: 20px;
            border-right: 1px solid #e5e7eb;
            height: calc(100vh - 68px); /* Adjust based on header height */
            position: sticky;
            top: 68px; /* Match mt-[68px] */
            overflow-y: auto;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }

          /* Filter title */
          #logo-sidebar > span {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          /* Filter container */
          #logo-sidebar .filter-container {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            background-color: #f9fafb;
          }

          /* Dropdown button styling */
          .btn4 {
            background-color: #f3f4f6 !important;
            color: #1f2937 !important;
            font-weight: 600;
            text-transform: uppercase;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.3s ease, color 0.3s ease;
            position: relative;
            border-bottom: 1px solid #e5e7eb;
          }

          .btn4:hover {
            background-color: #e5e7eb !important;
            color: #111827 !important;
          }

          .btn4 svg {
            transition: transform 0.3s ease;
          }

          .btn4[aria-expanded="true"] svg {
            transform: rotate(180deg);
          }

          /* Dropdown content */
          .dropdown-content {
            background-color: #ffffff;
            padding: 12px;
            border-radius: 0 0 8px 8px;
            animation: slideDown 0.3s ease-in-out;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Color and Size grid items */
          .grid-cols-2 .cursor-pointer {
            background-color: #f3f4f6;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
            transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }

          .grid-cols-2 .cursor-pointer:hover {
            background-color: #d1d5db;
            transform: translateY(-2px);
          }

          .grid-cols-2 .bg-gray-600 {
            background-color: #4b5563 !important;
            color: #ffffff !important;
          }

          /* Checkbox and Radio inputs */
          input[type="checkbox"],
          input[type="radio"] {
            accent-color: #4b5563;
            width: 16px;
            height: 16px;
            border: 2px solid #d1d5db;
            border-radius: 4px;
            transition: border-color 0.2s ease, background-color 0.2s ease;
            cursor: pointer;
          }

          input[type="checkbox"]:checked,
          input[type="radio"]:checked {
            background-color: #4b5563;
            border-color: #4b5563;
          }

          input[type="checkbox"]:focus,
          input[type="radio"]:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.2);
          }

          /* Checkbox and Radio labels */
          .space-y-2 li,
          .mb-4 {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            border-radius: 6px;
            transition: background-color 0.2s ease;
            cursor: pointer;
          }

          .space-y-2 li:hover,
          .mb-4:hover {
            background-color: #f3f4f6;
          }

          .space-y-2 li span,
          .mb-4 label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-left: 8px;
            text-transform: capitalize;
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            #logo-sidebar {
              width: 100%;
              height: auto;
              position: static;
              border-right: none;
              border-bottom: 1px solid #e5e7eb;
              padding: 16px;
            }

            .filter-container {
              margin: 0;
            }

            .btn4 {
              font-size: 0.875rem;
              padding: 10px 12px;
            }

            .grid-cols-2 {
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            }
          }
        `}
      </style>

      <div className="w-full h-full">
        <div className="flex w-full relative">
          {/* Lọc */}
          <aside
            id="logo-sidebar"
            className="w-64 h-auto transition-transform -translate-x-full sm:translate-x-0 mt-[68px]"
            aria-label="Sidebar"
          >
            <span className="-mt-6 ml-4 block">Bộ lọc</span>
            <div className="mx-2 my-5 h-fit filter-container -mt-2">
              <div className="flex flex-col items-center justify-center w-full">
                {/* Bộ lọc màu sắc */}
                <button
                  onClick={handleDropdownToggleColor}
                  className="btn4 w-full"
                  type="button"
                  aria-expanded={isDropdownOpen5}
                >
                  <p className="font-medium text-xs">màu sắc</p>
                  <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen5 && (
                  <div className="w-full dropdown-content">
                    <div className="grid grid-cols-2 gap-2">
                      {colors?.length &&
                        colors.map((color) => {
                          const isSelected = selectedColors.some((s) => s.color === color.name && s.selected);
                          return (
                            <div
                              key={color.id}
                              className={`cursor-pointer flex items-center justify-center rounded py-1 w-full ${
                                isSelected ? "bg-gray-600 text-white" : "bg-[#EDEDED]"
                              }`}
                              onClick={() => handleColorsSelect(color)}
                            >
                              <span
                                className={`text-sm font-medium line-clamp-1 px-1 ${
                                  isSelected ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {color.name}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Bộ lọc kích cỡ */}
                <button
                  onClick={handleDropdownToggle}
                  className="btn4 w-full"
                  type="button"
                  aria-expanded={isDropdownOpen}
                >
                  <p className="font-medium text-xs">Kích cỡ</p>
                  <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="w-full dropdown-content">
                    <div className="grid grid-cols-2 gap-2">
                      {shoeSizes?.length &&
                        shoeSizes.map((size) => {
                          const isSelected = selectedSizes.some((s) => s.size === String(size.name) && s.selected);
                          return (
                            <div
                              key={size.id}
                              className={`cursor-pointer flex items-center justify-center rounded py-1 w-full ${
                                isSelected ? "bg-gray-600 text-white" : "bg-[#EDEDED]"
                              }`}
                              onClick={() => handleSizeSelect(size)}
                            >
                              <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-900"}`}>
                                {size.name}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

               

                {/* Bộ lọc thương hiệu */}
                {/* <button
                  onClick={handleDropdownToggleBrand}
                  className="btn4 w-full"
                  type="button"
                  aria-expanded={isDropdownOpen4}
                >
                  <p className="font-medium text-xs">Thương hiệu</p>
                  <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen4 && (
                  <div className="w-full dropdown-content">
                    <ul className="space-y-2 text-sm">
                      {brands &&
                        brands.length &&
                        brands.map((brand) => {
                          const isSelected = selectedBrands.some((s) => s.brand === brand.name && s.selected);
                          return (
                            <li
                              key={brand.id}
                              className="flex items-center cursor-pointer"
                              onClick={() => handleBrandSelect(brand)}
                            >
                              <input
                                id={`brand-${brand.id}`}
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-4 h-4"
                              />
                              <span className="ml-2 text-sm font-medium">{brand.name}</span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )} */}

               

                {/* Bộ lọc khoảng giá */}
                <button
                  onClick={handleDropdownTogglePrice}
                  className="btn4 w-full"
                  type="button"
                  aria-expanded={isDropdownOpen2}
                >
                  <p className="font-medium text-xs">khoảng giá</p>
                  <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen2 && (
                  <div className="w-full dropdown-content">
                    {priceRange2.map((item) => (
                      <div className="flex items-center mb-4 cursor-pointer p-2" key={item.id}>
                        <input
                          id={`default-radio-${item.id}`}
                          type="radio"
                          value={item.id}
                          name="default-radio"
                          onChange={(value) => handleRadioChange(value)}
                          className="w-4 h-4"
                        />
                        <label className="ml-2 text-xs font-medium" htmlFor={`default-radio-${item.id}`}>
                          {item.priceRange}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Danh sách sản phẩm */}
          <div className="w-full mb-10">
            <div className="mx-auto flex flex-col my-4 items-center">
              <span className="text-3xl font-medium uppercase">{name}</span>
            </div>
            <div className="w-full mx-auto">
              <div className="w-full flex justify-between items-center">
                <div className="px-2">
                  <span
                    className="cursor-pointer font-medium text-base text-[#909097]"
                    onClick={() => navigate(path.home)}
                  >
                    Trang chủ
                  </span>
                  /<span className="text-base font-medium"> {name}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mx-auto mt-4 px-2">
                {listShoes && listShoes.length ? (
                  listShoes.map((item, index) => {
                    if (!item?.quantity || item.status === true) return null;
                    return <ProductStanding product={item} key={index} />;
                  })
                ) : listShoes && listShoes.length === 0 ? (
                  <div className="text-sm font-semibold">Không có sản phẩm</div>
                ) : (
                  Array(10)
                    .fill({})
                    .map((_, index) => <SekeletonItemShoe key={index} />)
                )}
              </div>
              {totalPage > 1 && (
                <div className="my-10">
                  <Pagination currentPage={page} totalPages={totalPage} onPageChange={setPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListProductsByBrand;