@AGENTS.md

# Project: Gold Price Tracker (Static)

A simple, static Vietnamese gold price website built with Next.js 16, React 19, and Tailwind CSS 4.

## Requirements

- Static website displaying current gold prices
- 3 rows, each row contains:
  - Title: "Giá vang hom nay (ngay 28/03/2026) cua <Gold Shop Name>"
  - An image showing the current gold price for that shop
- Gold shop names (one per row):
  1. Ngoc Diep
  2. Ngoc Thinh
  3. Kim Khanh Viet Hung
- Images are updated daily — only the image per shop changes, the structure stays the same
- Daily update workflow:
  1. Place new images in `data/` folder (ngoc_diep.jpeg, ngoc_thinh.jpeg, kim_khanh_viet_hung.jpeg)
  2. Copy them to `public/images/` as ngoc-diep.jpg, ngoc-thinh.jpg, kim-khanh-viet-hung.jpg
  3. Update `TODAY` in `app/data/goldShops.ts`
- Gold shop config lives in `app/data/goldShops.ts`
- Must be responsive and mobile-friendly
- Keep it simple — no dynamic data fetching, just static content with images
