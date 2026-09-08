# 5S Software - A4 B2B Brochure Project

Dự án thiết kế và xuất bản Brochure A4 chuẩn in ấn công nghiệp (Print-Ready) và Kỹ thuật số (Interactive Digital PDF) cho **5S Software**.

---

## 📁 Cấu Trúc Thư Mục & Tài Nguyên

```
5S-brochure/
├── BRAND_GUIDELINE.md       # Quy chuẩn nhận diện thương hiệu (Màu HEX/RGB/CMYK, Typography, Mockups)
├── BROCHURE_A4_SOFTWARE.md  # Đặc tả kiến trúc nội dung, wireframe và copy chi tiết (Bi-Fold & Tri-Fold)
├── CHECKLIST_PREPRESS.md    # Bảng kiểm tra kỹ thuật trước khi in (Bleed 3mm, Safe zone, CMYK, 300 DPI)
├── templates/
│   ├── bi-fold.html         # Template HTML/CSS Print A4 Bi-fold (4 trang hoàn chỉnh)
│   └── tri-fold.html        # Template HTML/CSS Print A4 Tri-fold (6 panel gấp 3 ngang)
├── scripts/
│   └── export-pdf.js        # Script tự động xuất PDF chất lượng cao qua Playwright
├── dist/                    # Thư mục chứa file PDF thành phẩm sẵn sàng in ấn
│   ├── 5S-Brochure-BiFold-A4.pdf
│   └── 5S-Brochure-TriFold-A4.pdf
└── package.json
```

---

## 🚀 Managed Agent Skill Đã Được Tích Hợp

Dự án đã khởi tạo và đăng ký skill **`brochure-software-a4`** vào hệ thống Agent.

*   **Tên skill:** `brochure-software-a4`
*   **Chức năng:** Hướng dẫn AI Agent (Claude Code, Cursor, Windsurf, OMP) tự động cấu trúc nội dung brochure phần mềm B2B theo công thức chuẩn:
    *   *Content Arc:* Hook (Bìa) $\rightarrow$ Pain Points $\rightarrow$ Solution Framework $\rightarrow$ Tech Pillars $\rightarrow$ Quantified ROI $\rightarrow$ CTA.
    *   *Khổ chuẩn A4:* $210 \times 297$ mm (Bi-fold 4 trang) và $297 \times 210$ mm (Tri-fold 6 panel).
    *   *Tiêu chuẩn in:* Bleed 3mm, Safe zone 5–8mm, CMYK conversion, 300 DPI, Vector Assets.

---

## 🛠️ Hướng Dẫn Xem & Xuất File PDF

### 1. Xem trực tiếp trên trình duyệt
Mở trực tiếp file `templates/bi-fold.html` hoặc `templates/tri-fold.html` bằng trình duyệt (Chrome/Edge/Safari/Brave) để xem trước và điều chỉnh CSS/nội dung thời gian thực.

### 2. Xuất file PDF tự động
```bash
# Xuất cả 2 định dạng Bi-fold và Tri-fold ra thư mục dist/
npm run export:pdf

# Chỉ xuất Bi-fold A4
npm run export:bifold

# Chỉ xuất Tri-fold A4
npm run export:trifold
```

---

## 🖨️ Quy Cách In Ấn Đề Xuất (Offset & Digital Press)

*   **Bi-fold A4:** Giấy Couche 250gsm – 300gsm, Cán màng mờ (Matte Lamination) 2 mặt, Cấn 1 đường giữa.
*   **Tri-fold A4:** Giấy Couche 150gsm – 200gsm, Cán màng mờ 2 mặt, Cấn 2 đường gấp (kích thước bù gấp $97\text{mm} - 100\text{mm} - 100\text{mm}$).
