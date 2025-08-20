import React, { useEffect, useState } from "react";
import Loading from "~/components/Loading/Loading";
import * as request from "~/utils/httpRequest";
import "./ImageGallery.css";
import { set } from "react-hook-form";

function ImageGallery({ onImageSelect, selectedImages }) {
  const [listImages, setListImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("loading ở đây1");
    
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await request.get(`/image-gallery/products`);
        setListImages(response || []);
        console.log("loading ở đây2");
      } catch (e) {
        console.error("Lỗi khi lấy danh sách ảnh:", e);
        console.log("loading ở đây3");
      } finally {
        console.log("loading ở đây4");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh!");
      return;
    }

    const confirmUpload = window.confirm(`Bạn có chắc muốn thêm ${files.length} ảnh này vào hệ thống?`);
    if (!confirmUpload) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    formData.append("folder", "products");

    try {
      await request.post("/image-gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Ảnh đã được tải lên thành công!");
      const updatedResponse = await request.get(`/image-gallery/products`);
      setListImages(updatedResponse || []);
    } catch (error) {
      console.error("Lỗi upload:", error);
      alert("Upload thất bại!");
    }
  };

  
  // const handleSelectImage = (listImages) => {
  //   if (selectedImages.includes(listImages)) {
  //     // Nếu hình ảnh đã được chọn, xóa nó khỏi danh sách
  //     onImageSelect(listImages, true); // Gọi hàm onImageSelect với tham số thứ hai là true để xóa
  //   } else {
  //     // Nếu hình ảnh chưa được chọn, thêm nó vào danh sách
  //     onImageSelect(listImages);
  //   }
  // };
  const handleSelectImage = (imageUrl) => {
    if (selectedImages.includes(imageUrl)) {
      onImageSelect(imageUrl, true);
    } else {
      onImageSelect(imageUrl);
    }
  };
  
 
  
  
  
  return (
    <div>
      
      <div className="text-end">
  <label htmlFor="upload-input" className="btn btn-warning mb-3">
    Thêm ảnh từ hệ hống
  </label>
</div>

      <input
        id="upload-input"
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      
  
      {loading ? (
        <Loading />
      ) : listImages.length === 0 ? (
        <p>Chưa có ảnh nào trong thư mục "products".</p>
      ) : (
        <div className="image-gallery" >
          
          {listImages.map((item, index) => (
            <div className="image-item col-xl-3" key={item.url}>
              <div
                style={{
                  border: selectedImages.includes(item.url) ? "2px solid blue" : "none",
                }}
                onClick={() => handleSelectImage(item.url)}

              >
                <img
                  src={item.url}
                  alt={`image-${index}`}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
                {selectedImages.includes(item.url) && (
                  <span className="selected-label">Đã chọn</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default ImageGallery;


