export interface GoldShop {
  id: string;
  name: string;
  location: string;
  image: string;
  updatedAt: string; // e.g. "10:30"
}

export const GOLD_SHOPS: GoldShop[] = [
  {
    id: "ngoc-diep",
    name: "Ngọc Diệp",
    location: "Đà Nẵng",
    image: "images/ngoc-diep.jpg",
    updatedAt: "08:25",
  },
  {
    id: "ngoc-thinh",
    name: "Ngọc Thịnh",
    location: "Đà Nẵng",
    image: "images/ngoc-thinh.jpg",
    updatedAt: "08:24",
  },
  {
    id: "kim-khanh-viet-hung",
    name: "Kim Khánh Việt Hùng",
    location: "Đà Nẵng",
    image: "images/kim-khanh-viet-hung.jpg",
    updatedAt: "08:07",
  },
  {
    id: "tru-cam-le",
    name: "Trữ Cẩm Lệ",
    location: "Đà Nẵng",
    image: "images/tru-cam-le.jpg",
    updatedAt: "10:48",
  },
];

export const TODAY = new Date().toLocaleDateString("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
