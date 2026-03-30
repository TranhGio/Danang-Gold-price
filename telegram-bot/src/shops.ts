export const SHOPS = [
  { id: "ngoc-diep", name: "Ngọc Diệp", filename: "ngoc-diep.jpg" },
  { id: "ngoc-thinh", name: "Ngọc Thịnh", filename: "ngoc-thinh.jpg" },
  { id: "kim-khanh-viet-hung", name: "Kim Khánh Việt Hùng", filename: "kim-khanh-viet-hung.jpg" },
  { id: "tru-cam-le", name: "Trữ Cẩm Lệ", filename: "tru-cam-le.jpg" },
] as const;

export function getShopById(id: string) {
  return SHOPS.find((shop) => shop.id === id);
}
