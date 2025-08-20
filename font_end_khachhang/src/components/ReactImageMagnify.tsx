import React, { useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const MyReactImageMagnify = React.memo(({ img: imgArr }: { img: any }) => {
  const img: any = [];

  const func = () => {
    // Xóa mảng img trước khi thêm mới để tránh tích lũy dữ liệu cũ
    img.length = 0;

    // Chỉ lấy ảnh từ mảng đầu tiên (hoặc mảng mong muốn) và giới hạn 3 ảnh
    const firstImageSet = imgArr?.[0] || []; // Lấy mảng ảnh đầu tiên
    const limitedImages = firstImageSet.slice(0, 5); // Giới hạn 3 ảnh

    // Thêm các ảnh vào mảng img
    for (let j = 0; j < limitedImages.length; j++) {
      img.push({
        original: limitedImages[j],
        thumbnail: limitedImages[j],
      });
    }

    return img;
  };

  useEffect(() => {
    func();
  }, [imgArr]);

  return (
    <div>
      <ImageGallery
        items={img}
        showPlayButton={false}
        showFullscreenButton={true}
        slideInterval={1000}
        slideOnThumbnailOver={true}
        showIndex={true}
        onPlay={() => {
          alert("slideshow is now playing!");
        }}
      />
    </div>
  );
});

export default MyReactImageMagnify;