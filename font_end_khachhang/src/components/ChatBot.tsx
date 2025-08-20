


import React, { useState, useEffect, useRef } from "react";
import { IProduct } from "../types/product.type";
import ProductStanding from "./ProductStanding";
import SekeletonItemShoe from "./SekeletonItemShoe";

interface ChatbotProps {
  products: IProduct[] | undefined;
  onClose: () => void; // Prop để đóng chatbot
}

const Chatbot: React.FC<ChatbotProps> = ({ products, onClose }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [foundProducts, setFoundProducts] = useState<IProduct[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // API Key (Nên lưu trong .env)
  const API_KEY = "AIzaSyDRtXOKwIdD3FWxHBiPFa798m1Rv_uEueM";

  // Hàm gọi Google GenAI
  const callGenAI = async (prompt: string, model: string = "gemini-1.5-flash") => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
    } catch (error) {
      console.error("Lỗi khi gọi GenAI:", error);
      return "Có lỗi xảy ra khi xử lý yêu cầu của bạn.";
    }
  };

  // Chuẩn hóa từ khóa tìm kiếm
  const normalizeQuery = (query: string): string => {
    return query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // Chào hỏi khi khởi động
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "Xin chào! Tôi là trợ lý AI của bạn. Bạn muốn tìm giày Nike, Adidas, hay xem sản phẩm đang giảm giá? 😊",
      },
    ]);
  }, []);

  // Tìm kiếm sản phẩm
  const searchProducts = async (query: string) => {
    setIsLoading(true);
    setFoundProducts([]);

    if (!products || products.length === 0) {
      setIsLoading(false);
      return "Hiện tại không có sản phẩm nào để tìm kiếm. Vui lòng thử lại sau!";
    }

    try {
      const normalizedQuery = normalizeQuery(query);
      let matchedProducts: IProduct[] = [];
      let responseText = "";

      // Kiểm tra nếu người dùng hỏi về "Sản Phẩm Đang Giảm Giá"
      if (
        normalizedQuery.includes("san pham dang giam gia") ||
        normalizedQuery.includes("giam gia") ||
        normalizedQuery.includes("sale")
      ) {
        matchedProducts = products.filter(
          (product) => !product.status && product.discountValue
        );
        responseText = matchedProducts.length
          ? `Tôi đã tìm thấy ${matchedProducts.length} sản phẩm đang giảm giá! Hiển thị ${Math.min(
              matchedProducts.length,
              
            )} sản phẩm.`
          : "Hiện tại không có sản phẩm nào đang giảm giá. Bạn muốn tìm gì khác không?";
      } else {
        // Xử lý các truy vấn tìm kiếm sản phẩm khác
        const prompt = `Trích xuất từ khóa tìm kiếm sản phẩm từ câu sau: "${query}". Chỉ trả về từ khóa chính, không giải thích.`;
        const productQuery = normalizeQuery(await callGenAI(prompt) || query);

        matchedProducts = products.filter((product) => {
          if (product.status) return false; // Bỏ qua sản phẩm không hoạt động
          const name = normalizeQuery(product.name?.toLowerCase() || "");
          const category = normalizeQuery(product.category?.toLowerCase() || "");
          const color = normalizeQuery(product.color?.toLowerCase() || "");
          return (
            name.includes(productQuery) ||
            category.includes(productQuery) ||
            color.includes(productQuery)
          );
        });

        responseText = matchedProducts.length
          ? `Tôi đã tìm thấy ${matchedProducts.length} sản phẩm phù hợp! Hiển thị ${Math.min(
              matchedProducts.length,
              
            )} sản phẩm.`
          : "Xin lỗi, không tìm thấy sản phẩm nào. Bạn muốn thử từ khóa khác không?";
      }

      setFoundProducts(matchedProducts.slice(0)); // Giới hạn 3 sản phẩm
      return responseText;
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      return "Có lỗi khi tìm kiếm sản phẩm. Bạn muốn thử lại không?";
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý tin nhắn người dùng
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const isProductQuery = await callGenAI(
        `Xác định xem câu sau có phải yêu cầu tìm sản phẩm không: "${userInput}". Trả về "yes" hoặc "no".`
      );

      let botResponse = "";
      if (isProductQuery.trim() === "yes") {
        botResponse = await searchProducts(userInput);
      } else {
        const conversationContext = newMessages
          .map((msg) => `${msg.sender === "user" ? "Người dùng" : "AI"}: ${msg.text}`)
          .join("\n");
        const prompt = `${conversationContext}\nNgười dùng: ${userInput}\nAI: `;
        botResponse = await callGenAI(prompt);
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Lỗi xử lý tin nhắn:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Có lỗi xảy ra. Vui lòng thử lại!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động cuộn xuống tin nhắn/sản phẩm mới nhất
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, foundProducts]);

  return (
    <div className="w-96 bg-white shadow-2xl rounded-xl p-4 relative">
      <div className="flex flex-col h-[500px]">
        {/* Tiêu đề */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-xl flex items-center">
          <h3 className="text-lg font-semibold flex-1">Trợ lý AI</h3>
          <button
            onClick={onClose}
            className="text-sm bg-white/20 px-2 py-1 rounded hover:bg-white/30"
          >
            ✕
          </button>
        </div>

        {/* Khu vực tin nhắn */}
        <div
          ref={chatContainerRef}
          className="chat-container flex-1 overflow-y-auto p-3 space-y-3"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}

          {/* Hiển thị skeleton khi đang tải */}
          {isLoading && <SekeletonItemShoe />}

          {/* Hiển thị sản phẩm tìm thấy */}
          {foundProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mt-4">
              {foundProducts.map((product, index) => (
                <div key={index} className="transform scale-90">
                  <ProductStanding product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input và nút gửi */}
        <div className="flex items-center border-t pt-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Hỏi tôi bất cứ điều gì..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;