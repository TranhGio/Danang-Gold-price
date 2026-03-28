"use client";

import Popup from "./components/Popup";
import { GOLD_SHOPS, TODAY } from "./data/goldShops";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Popup />
      <div className="flex flex-col gap-8 mx-auto p-4 sm:p-10 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl font-bold text-center text-[#C41E3A]">
          Cập Nhật Giá Vàng Của Các Tiệm Vàng Ở Đà Nẵng
        </h1>
        {GOLD_SHOPS.map((shop) => (
          <div key={shop.id} className="flex flex-col gap-4">
            <h2 className="text-2xl sm:text-4xl font-semibold">
              Giá vàng {shop.name} {shop.location}
            </h2>
            <p className="text-lg text-gray-500 italic">
              Cập nhật lúc {shop.updatedAt} ngày {TODAY}
            </p>
            <img
              src={shop.image}
              alt={`Giá vàng ${shop.name}`}
              className="w-full rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
