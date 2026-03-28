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
    image: "/images/ngoc-diep.jpg",
    updatedAt: "10:00",
  },
  {
    id: "ngoc-thinh",
    name: "Ngọc Thịnh",
    location: "Đà Nẵng",
    image: "/images/ngoc-thinh.jpg",
    updatedAt: "10:00",
  },
  {
    id: "kim-khanh-viet-hung",
    name: "Kim Khánh Việt Hùng",
    location: "Đà Nẵng",
    image: "/images/kim-khanh-viet-hung.jpg",
    updatedAt: "10:00",
  },
];

// Today's date formatted as dd/mm/yyyy
export const TODAY = "28/03/2026";
