import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const rootDir = process.cwd();
const assetsDir = path.join(rootDir, 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Helper to get base64 image data URI
function getBase64Image(fileName) {
  const filePath = path.join(assetsDir, fileName);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(fileName).slice(1);
    const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
    const base64 = fs.readFileSync(filePath).toString('base64');
    return `data:${mime};base64,${base64}`;
  }
  return '';
}

// Common Google Fonts & Reset CSS
const commonHead = `
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #FFFFFF;
      color: #0B132B;
      overflow: hidden;
    }
  </style>
`;

/**
 * 1. SOFTWARE HERO MACBOOK (assets/software-hero-macbook.png)
 * Viewport: 1024x700 @ 2x -> 2048x1400 PNG
 */
async function generateHeroMacbook(browser) {
  const page = await browser.newPage({
    viewport: { width: 1024, height: 700, deviceScaleFactor: 2 }
  });

  const dashboardHeroB64 = getBase64Image('dashboard-hero.png');
  const logoB64 = getBase64Image('logo.png');

  const html = `<!DOCTYPE html>
<html>
<head>
  ${commonHead}
  <style>
    .canvas-container {
      width: 1024px;
      height: 700px;
      position: relative;
      background: radial-gradient(1200px 800px at 50% 20%, #FAFDFE 0%, #F1F5F9 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    /* Subtle background tech grid */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(0, 102, 204, 0.07) 1px, transparent 0);
      background-size: 24px 24px;
      pointer-events: none;
    }

    .ambient-glow-1 {
      position: absolute;
      top: -100px;
      left: 15%;
      width: 450px;
      height: 350px;
      background: radial-gradient(circle, rgba(0, 102, 204, 0.12) 0%, rgba(0, 102, 204, 0) 70%);
      filter: blur(50px);
      pointer-events: none;
    }

    .ambient-glow-2 {
      position: absolute;
      top: -50px;
      right: 15%;
      width: 400px;
      height: 300px;
      background: radial-gradient(circle, rgba(200, 16, 46, 0.08) 0%, rgba(200, 16, 46, 0) 70%);
      filter: blur(50px);
      pointer-events: none;
    }

    /* MacBook Pro Mockup */
    .macbook-wrapper {
      position: relative;
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 10;
    }

    /* Screen Lid */
    .macbook-lid {
      width: 720px;
      height: 450px;
      background: #0F172A;
      border-radius: 18px 18px 0 0;
      padding: 10px 10px 0 10px;
      box-shadow: 
        0 0 0 1.5px #334155,
        0 10px 30px rgba(11, 19, 43, 0.15);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Camera Notch / Dot */
    .macbook-camera {
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: #020617;
      border-radius: 50%;
      box-shadow: 0 0 0 1px #1E293B;
    }

    /* Screen Inner Content */
    .macbook-screen {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      border: 1px solid #1E293B;
    }

    /* macOS Window Bar */
    .macbook-titlebar {
      height: 30px;
      background: #0F172A;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      border-bottom: 1px solid #1E293B;
    }

    .traffic-lights {
      display: flex;
      gap: 6px;
    }
    .traffic-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .dot-red { background: #FF5F56; }
    .dot-yellow { background: #FFBD2E; }
    .dot-green { background: #27C93F; }

    .url-bar {
      background: #1E293B;
      border-radius: 6px;
      padding: 3px 14px;
      font-size: 11px;
      font-weight: 500;
      color: #94A3B8;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .url-bar svg { width: 12px; height: 12px; fill: #10B981; }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      font-weight: 700;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.12);
      padding: 2px 8px;
      border-radius: 12px;
      border: 1px solid rgba(56, 189, 248, 0.25);
    }
    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #38BDF8;
      box-shadow: 0 0 6px #38BDF8;
    }

    /* Dashboard Viewport */
    .dashboard-viewport {
      flex: 1;
      width: 100%;
      background: #0A0F1D;
      position: relative;
      overflow: hidden;
    }

    /* Dashboard Inner Application Container */
    .dashboard-saas-app {
      width: 100%;
      height: 100%;
      background: #0B132B;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      padding: 10px 14px;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      overflow: hidden;
      position: relative;
    }

    /* Top Control Bar inside App */
    .saas-top-ctrl {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 8px;
      flex-shrink: 0;
    }
    .ctrl-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ctrl-logo {
      font-size: 8.5px;
      font-weight: 900;
      background: #C8102E;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Montserrat', sans-serif;
    }
    .ctrl-tenant {
      font-size: 9px;
      font-weight: 700;
      color: #F8FAFC;
    }
    .ctrl-tenant span {
      color: #38BDF8;
      font-size: 7.5px;
      font-weight: 500;
      margin-left: 4px;
      background: rgba(56, 189, 248, 0.15);
      padding: 1.5px 5px;
      border-radius: 3px;
    }
    .ctrl-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .time-btn {
      font-size: 7.5px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #E2E8F0;
      padding: 2.5px 8px;
      border-radius: 4px;
    }
    .export-saas-btn {
      font-size: 7.5px;
      font-weight: 800;
      background: #0066CC;
      color: white;
      padding: 2.5px 8px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    /* 4 KPI Cards Row */
    .saas-kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 8px;
      flex-shrink: 0;
    }
    .saas-kpi-box {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .saas-kpi-box.active {
      border-color: rgba(0, 240, 255, 0.35);
      background: rgba(0, 102, 204, 0.08);
    }
    .kpi-head-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5px;
      font-weight: 700;
      color: #94A3B8;
      margin-bottom: 2px;
    }
    .kpi-val-row {
      display: flex;
      align-items: baseline;
      gap: 3px;
      margin-bottom: 2px;
    }
    .kpi-number {
      font-size: 15px;
      font-weight: 900;
      font-family: 'Montserrat', sans-serif;
      line-height: 1;
      color: #FFFFFF;
    }
    .kpi-unit-lbl {
      font-size: 7.5px;
      color: #64748B;
      font-family: 'JetBrains Mono', monospace;
    }
    .kpi-tag-status {
      font-size: 6.8px;
      font-weight: 700;
      padding: 1.5px 5px;
      border-radius: 3px;
      align-self: flex-start;
    }
    .kpi-tag-status.pass { background: rgba(5, 150, 105, 0.2); color: #34D399; }
    .kpi-tag-status.opt { background: rgba(0, 102, 204, 0.2); color: #38BDF8; }
    .kpi-tag-status.safe { background: rgba(200, 16, 46, 0.2); color: #FF6B81; }
    .kpi-tag-status.sync { background: rgba(217, 119, 6, 0.2); color: #FBBF24; }

    /* Center Big Line/Area Chart */
    .saas-main-chart-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px 10px 6px 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      margin-bottom: 8px;
    }
    .chart-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .chart-title-txt {
      font-size: 8.5px;
      font-weight: 800;
      color: #F8FAFC;
      letter-spacing: -0.01em;
    }
    .chart-legend-items {
      display: flex;
      gap: 10px;
      font-size: 7px;
      font-weight: 600;
      color: #94A3B8;
    }
    .leg-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 3px;
      vertical-align: middle;
    }
    .svg-area-chart {
      width: 100%;
      height: 130px;
      overflow: visible;
    }

    /* Bottom Widgets Row */
    .saas-bottom-widgets {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 8px;
      height: 72px;
      flex-shrink: 0;
    }
    .widget-panel {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .widget-title {
      font-size: 7.5px;
      font-weight: 800;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    /* Mini Bar Chart */
    .mini-bar-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 7px;
      color: #E2E8F0;
    }
    .bar-track {
      flex: 1;
      height: 5px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      margin: 0 6px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 3px;
    }
    /* AI Status Alert */
    .ai-smart-card {
      background: rgba(200, 16, 46, 0.08);
      border: 1px solid rgba(200, 16, 46, 0.25);
      border-radius: 6px;
      padding: 5px 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .ai-badge-sq {
      font-size: 8px;
      font-weight: 900;
      background: #C8102E;
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ai-smart-txt {
      font-size: 7px;
      color: #E2E8F0;
      line-height: 1.25;
    }
    .ai-smart-txt strong { color: #38BDF8; }
    /* Glass Reflection on Screen */
    .screen-glare {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 45%);
      pointer-events: none;
    }

    /* MacBook Base / Chassis */
    .macbook-base {
      width: 830px;
      height: 14px;
      background: linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 50%, #94A3B8 100%);
      border-radius: 0 0 16px 16px;
      position: relative;
      box-shadow: 
        0 1px 2px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .macbook-notch {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 5px;
      background: #64748B;
      border-radius: 0 0 6px 6px;
    }

    /* Realistic Ground Shadow */
    .ground-shadow {
      position: absolute;
      bottom: 25px;
      width: 780px;
      height: 35px;
      background: radial-gradient(ellipse at 50% 50%, rgba(11, 19, 43, 0.24) 0%, rgba(11, 19, 43, 0.05) 55%, transparent 75%);
      filter: blur(12px);
      z-index: 5;
    }

    /* 4 Floating Feature Pills */
    .feature-pill {
      position: absolute;
      background: #FFFFFF;
      border-radius: 32px;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 14px 34px rgba(11, 19, 43, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
      z-index: 20;
      transition: transform 0.2s ease;
      border: 1px solid rgba(226, 232, 240, 0.9);
    }

    .pill-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .pill-content {
      display: flex;
      flex-direction: column;
    }

    .pill-title {
      font-size: 13px;
      font-weight: 800;
      color: #0B132B;
      letter-spacing: -0.2px;
      line-height: 1.2;
    }

    .pill-subtitle {
      font-size: 10.5px;
      font-weight: 600;
      color: #64748B;
      margin-top: 1px;
    }

    /* Pill 1: Giám Sát Thời Gian Thực (100ms) - Cyan */
    .pill-1 {
      top: 55px;
      left: 35px;
      border-left: 3.5px solid #00A3C4;
    }
    .pill-1 .pill-icon-box {
      background: rgba(0, 163, 196, 0.12);
      color: #00A3C4;
    }

    /* Pill 2: Trợ Lý AI Chẩn Đoán Tự Động - Crimson */
    .pill-2 {
      top: 65px;
      right: 35px;
      border-left: 3.5px solid #C8102E;
    }
    .pill-2 .pill-icon-box {
      background: rgba(200, 16, 46, 0.12);
      color: #C8102E;
    }

    /* Pill 3: Xuất Báo Cáo Sở TN&MT 1-Click - Tech Blue */
    .pill-3 {
      bottom: 75px;
      left: 25px;
      border-left: 3.5px solid #0066CC;
    }
    .pill-3 .pill-icon-box {
      background: rgba(0, 102, 204, 0.12);
      color: #0066CC;
    }

    /* Pill 4: Phân Quyền Multi-Tenant RBAC - Emerald */
    .pill-4 {
      bottom: 75px;
      right: 25px;
      border-left: 3.5px solid #059669;
    }
    .pill-4 .pill-icon-box {
      background: rgba(5, 150, 105, 0.12);
      color: #059669;
    }

    /* Top Center Header Tag */
    .top-header-badge {
      position: absolute;
      top: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 5px 16px;
      box-shadow: 0 4px 12px rgba(11, 19, 43, 0.05);
      z-index: 15;
    }
    .top-header-badge span {
      font-size: 11px;
      font-weight: 700;
      color: #0066CC;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }
  </style>
</head>
<body>
  <div class="canvas-container">
    <div class="bg-grid"></div>
    <div class="ambient-glow-1"></div>
    <div class="ambient-glow-2"></div>

    <div class="top-header-badge">
      <div class="pulse-dot"></div>
      <span>5S CLOUD SAAS PLATFORM • CÔNG NGHỆ THỜI GIAN THỰC</span>
    </div>

    <!-- Pill 1: Real-time Telemetry -->
    <div class="feature-pill pill-1">
      <div class="pill-icon-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <div class="pill-content">
        <div class="pill-title">Giám Sát Thời Gian Thực (100ms)</div>
        <div class="pill-subtitle">Tốc độ siêu cao • 0% trễ số liệu</div>
      </div>
    </div>

    <!-- Pill 2: AI Diagnostics -->
    <div class="feature-pill pill-2">
      <div class="pill-icon-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
      </div>
      <div class="pill-content">
        <div class="pill-title">Trợ Lý AI Chẩn Đoán Tự Động</div>
        <div class="pill-subtitle">Dự báo sớm & tối ưu vận hành</div>
      </div>
    </div>

    <!-- MacBook Mockup -->
    <div class="macbook-wrapper">
      <div class="macbook-lid">
        <div class="macbook-camera"></div>
        <div class="macbook-screen">
          <div class="macbook-titlebar">
            <div class="traffic-lights">
              <div class="traffic-dot dot-red"></div>
              <div class="traffic-dot dot-yellow"></div>
              <div class="traffic-dot dot-green"></div>
            </div>
            <div class="url-bar">
              <svg viewBox="0 0 24 24"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"/></svg>
              cloud.5s-cems.vn/dashboard/live-telemetry
            </div>
            <div class="status-badge">
              <div class="status-dot"></div>
              Live • 99.99% Uptime
            </div>
          </div>
          <div class="dashboard-viewport">
            <!-- 100% Vector SaaS Analytics Multi-Chart Dashboard -->
            <div class="dashboard-saas-app">
              <!-- Top In-App Control Bar -->
              <div class="saas-top-ctrl">
                <div class="ctrl-left">
                  <span class="ctrl-logo">5S CLOUD</span>
                  <span class="ctrl-tenant">Tập Đoàn Thép Sao Việt <span>NHÀ MÁY 01 (CEMS 24/7)</span></span>
                </div>
                <div class="ctrl-right">
                  <span class="time-btn">24 Giờ Qua ▼</span>
                  <span class="export-saas-btn">📄 Xuất Báo Cáo Sở</span>
                </div>
              </div>

              <!-- 4 KPI Cards Row with Sparklines -->
              <div class="saas-kpi-grid">
                <div class="saas-kpi-box active">
                  <div class="kpi-head-row">
                    <span>BỤI TỔNG (PM)</span>
                    <span style="color: #38BDF8;">QCVN: 144</span>
                  </div>
                  <div class="kpi-val-row">
                    <span class="kpi-number">4.22</span>
                    <span class="kpi-unit-lbl">mg/Nm³</span>
                  </div>
                  <span class="kpi-tag-status pass">● ĐẠT CHUẨN (-12.4%)</span>
                </div>

                <div class="saas-kpi-box">
                  <div class="kpi-head-row">
                    <span>KHÍ CO</span>
                    <span style="color: #34D399;">QCVN: 800</span>
                  </div>
                  <div class="kpi-val-row">
                    <span class="kpi-number">0.21</span>
                    <span class="kpi-unit-lbl">mg/Nm³</span>
                  </div>
                  <span class="kpi-tag-status opt">● TỐI ƯU (ỔN ĐỊNH)</span>
                </div>

                <div class="saas-kpi-box">
                  <div class="kpi-head-row">
                    <span>KHÍ NOx</span>
                    <span style="color: #FF6B81;">QCVN: 680</span>
                  </div>
                  <div class="kpi-val-row">
                    <span class="kpi-number">1.31</span>
                    <span class="kpi-unit-lbl">mg/Nm³</span>
                  </div>
                  <span class="kpi-tag-status safe">● AN TOÀN (-4.8%)</span>
                </div>

                <div class="saas-kpi-box">
                  <div class="kpi-head-row">
                    <span>ĐỒNG BỘ SỞ</span>
                    <span style="color: #FBBF24;">63 SỞ TN&amp;MT</span>
                  </div>
                  <div class="kpi-val-row">
                    <span class="kpi-number">99.98%</span>
                    <span class="kpi-unit-lbl">SLA</span>
                  </div>
                  <span class="kpi-tag-status sync">● THÔNG SUỐT (5P/LẦN)</span>
                </div>
              </div>

              <!-- Main Multi-Series Timeseries Area Chart -->
              <div class="saas-main-chart-card">
                <div class="chart-header-row">
                  <span class="chart-title-txt">BIỂU ĐỒ DIỄN BIẾN NỒNG ĐỘ KHÍ THẢI THEO THỜI GIAN THỰC (24H LIÊN TỤC)</span>
                  <div class="chart-legend-items">
                    <span><span class="leg-dot" style="background: #00F0FF;"></span> Bụi PM</span>
                    <span><span class="leg-dot" style="background: #10B981;"></span> Khí CO</span>
                    <span><span class="leg-dot" style="background: #818CF8;"></span> Khí NOx</span>
                    <span style="color: #FF5A6B;">--- Ngưỡng QCVN (144)</span>
                  </div>
                </div>

                <!-- SVG Area Chart -->
                <svg class="svg-area-chart" viewBox="0 0 670 120">
                  <defs>
                    <linearGradient id="gradPM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.4" />
                      <stop offset="100%" stop-color="#00F0FF" stop-opacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradCO" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#10B981" stop-opacity="0.3" />
                      <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>

                  <!-- Horizontal Grid Lines -->
                  <line x1="30" y1="20" x2="660" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
                  <line x1="30" y1="50" x2="660" y2="50" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
                  <line x1="30" y1="80" x2="660" y2="80" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
                  <line x1="30" y1="105" x2="660" y2="105" stroke="rgba(255,255,255,0.12)" />

                  <!-- Red Dashed QCVN Limit Line -->
                  <line x1="30" y1="15" x2="660" y2="15" stroke="#FF5A6B" stroke-width="1.2" stroke-dasharray="4,3" />
                  <text x="560" y="12" fill="#FF5A6B" font-size="6.5" font-family="JetBrains Mono" font-weight="bold">NGƯỠNG QCVN 19</text>

                  <!-- PM Area & Curve (Cyan) -->
                  <path d="M 30 90 Q 90 75 150 82 T 270 65 T 390 78 T 510 55 T 660 62 L 660 105 L 30 105 Z" fill="url(#gradPM)" />
                  <path d="M 30 90 Q 90 75 150 82 T 270 65 T 390 78 T 510 55 T 660 62" fill="none" stroke="#00F0FF" stroke-width="2" />

                  <!-- CO Area & Curve (Emerald) -->
                  <path d="M 30 98 Q 90 88 150 92 T 270 82 T 390 89 T 510 74 T 660 80 L 660 105 L 30 105 Z" fill="url(#gradCO)" />
                  <path d="M 30 98 Q 90 88 150 92 T 270 82 T 390 89 T 510 74 T 660 80" fill="none" stroke="#10B981" stroke-width="1.8" />

                  <!-- NOx Curve (Indigo/Violet) -->
                  <path d="M 30 102 Q 90 96 150 99 T 270 91 T 390 95 T 510 85 T 660 88" fill="none" stroke="#818CF8" stroke-width="1.5" />

                  <!-- Active Hover Tooltip Callout -->
                  <circle cx="510" cy="55" r="4" fill="#00F0FF" stroke="#FFFFFF" stroke-width="1.5" />
                  <line x1="510" y1="55" x2="510" y2="105" stroke="rgba(0, 240, 255, 0.4)" stroke-dasharray="2,2" />
                  <rect x="440" y="24" width="135" height="25" rx="4" fill="#1E293B" stroke="#00F0FF" stroke-width="1" />
                  <text x="448" y="34" fill="#FFFFFF" font-size="6.8" font-family="Plus Jakarta Sans" font-weight="bold">14:20 • Lò 02: PM 4.22 mg</text>
                  <text x="448" y="44" fill="#34D399" font-size="6.2" font-family="Plus Jakarta Sans" font-weight="bold">✓ 100% Đạt chuẩn QCVN 19</text>

                  <!-- Time-axis Labels -->
                  <text x="30" y="115" fill="#64748B" font-size="6.5" font-family="JetBrains Mono">00:00</text>
                  <text x="135" y="115" fill="#64748B" font-size="6.5" font-family="JetBrains Mono">04:00</text>
                  <text x="240" y="115" fill="#64748B" font-size="6.5" font-family="JetBrains Mono">08:00</text>
                  <text x="345" y="115" fill="#64748B" font-size="6.5" font-family="JetBrains Mono">12:00</text>
                  <text x="450" y="115" fill="#64748B" font-size="6.5" font-family="JetBrains Mono">16:00</text>
                  <text x="555" y="115" fill="#64748B" font-size="6.5" font-family="JetBrains Mono">20:00</text>
                  <text x="640" y="115" fill="#64748B" font-size="6.5" font-family="JetBrains Mono">24:00</text>
                </svg>
              </div>

              <!-- Bottom Widgets: Bar Chart & AI Predictive Status -->
              <div class="saas-bottom-widgets">
                <!-- Left Widget: Shift Distribution Bars -->
                <div class="widget-panel">
                  <div class="widget-title">PHÂN BỔ NỒNG ĐỘ THEO CA KÍP SẢN XUẤT (TRUNG BÌNH)</div>
                  <div class="mini-bar-row">
                    <span style="width: 38px;">Ca 1 (Sáng)</span>
                    <div class="bar-track"><div class="bar-fill" style="width: 32%; background: #38BDF8;"></div></div>
                    <span style="width: 50px; text-align: right; color: #34D399;">3.82 mg (26%)</span>
                  </div>
                  <div class="mini-bar-row">
                    <span style="width: 38px;">Ca 2 (Chiều)</span>
                    <div class="bar-track"><div class="bar-fill" style="width: 36%; background: #00F0FF;"></div></div>
                    <span style="width: 50px; text-align: right; color: #34D399;">4.22 mg (29%)</span>
                  </div>
                  <div class="mini-bar-row">
                    <span style="width: 38px;">Ca 3 (Đêm)</span>
                    <div class="bar-track"><div class="bar-fill" style="width: 28%; background: #818CF8;"></div></div>
                    <span style="width: 50px; text-align: right; color: #34D399;">3.45 mg (24%)</span>
                  </div>
                </div>

                <!-- Right Widget: 5S Neural Advisor Insight -->
                <div class="widget-panel">
                  <div class="widget-title">DỰ BÁO TRỢ LÝ AI 5S NEURAL ENGINE</div>
                  <div class="ai-smart-card">
                    <div class="ai-badge-sq">AI</div>
                    <div class="ai-smart-txt">
                      <div>Trạng thái buồng đốt: <strong>TỐI ƯU 98.4%</strong></div>
                      <div style="color: #94A3B8; font-size: 6.2px; margin-top: 1px;">Dự báo 6h tới: Không có nguy cơ vượt ngưỡng QCVN.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="screen-glare"></div>
          </div>
        </div>
      </div>
      <div class="macbook-base">
        <div class="macbook-notch"></div>
      </div>
    </div>

    <!-- Ground Shadow -->
    <div class="ground-shadow"></div>

    <!-- Pill 3: 1-Click Reports -->
    <div class="feature-pill pill-3">
      <div class="pill-icon-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <div class="pill-content">
        <div class="pill-title">Xuất Báo Cáo Sở TN&MT 1-Click</div>
        <div class="pill-subtitle">Chuẩn Thông tư 10/2021/TT-BTNMT</div>
      </div>
    </div>

    <!-- Pill 4: RBAC & Multi-tenant -->
    <div class="feature-pill pill-4">
      <div class="pill-icon-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      </div>
      <div class="pill-content">
        <div class="pill-title">Phân Quyền Multi-Tenant RBAC</div>
        <div class="pill-subtitle">Bảo mật dữ liệu chuẩn ISO 27001</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle' });
  const outputPath = path.join(assetsDir, 'software-hero-macbook.png');
  await page.screenshot({ path: outputPath });
  await page.close();
  console.log(`✓ Successfully generated: assets/software-hero-macbook.png (2048x1400)`);
}

/**
 * 2. SOFTWARE CLOUD ARCHITECTURE DIAGRAM (assets/software-cloud-architecture.png)
 * Viewport: 1024x700 @ 2x -> 2048x1400 PNG
 */
async function generateCloudArchitecture(browser) {
  const page = await browser.newPage({
    viewport: { width: 1024, height: 700, deviceScaleFactor: 2 }
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  ${commonHead}
  <style>
    .canvas-container {
      width: 1024px;
      height: 700px;
      position: relative;
      background: #FAFDFE;
      display: flex;
      flex-direction: column;
      padding: 24px 30px;
      overflow: hidden;
    }

    /* Background technical pattern */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(0, 102, 204, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 102, 204, 0.04) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
    }

    /* Diagram Header */
    .diagram-header {
      position: relative;
      z-index: 10;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title-group {
      display: flex;
      flex-direction: column;
    }

    .diagram-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 102, 204, 0.08);
      border: 1px solid rgba(0, 102, 204, 0.2);
      border-radius: 16px;
      padding: 3px 10px;
      width: fit-content;
      margin-bottom: 6px;
    }
    .diagram-badge span {
      font-size: 10px;
      font-weight: 800;
      color: #0066CC;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }

    .diagram-title {
      font-size: 22px;
      font-weight: 900;
      color: #0B132B;
      letter-spacing: -0.5px;
    }

    .diagram-subtitle {
      font-size: 12px;
      font-weight: 600;
      color: #64748B;
      margin-top: 2px;
    }

    .trust-chips {
      display: flex;
      gap: 8px;
    }
    .trust-chip {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 700;
      color: #334155;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .trust-chip svg { width: 14px; height: 14px; color: #0066CC; }

    /* Pipeline 4-Stage Columns */
    .pipeline-grid {
      position: relative;
      z-index: 10;
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 28px 1fr 28px 1fr 28px 1fr;
      align-items: stretch;
      gap: 0;
    }

    .stage-card {
      background: #FFFFFF;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 10px 24px rgba(11, 19, 43, 0.05);
      display: flex;
      flex-direction: column;
      padding: 16px;
      position: relative;
      transition: all 0.2s ease;
    }

    .stage-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 12px;
      border-bottom: 1px solid #F1F5F9;
      margin-bottom: 12px;
    }

    .stage-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stage-info {
      display: flex;
      flex-direction: column;
    }
    .stage-step {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stage-name {
      font-size: 13.5px;
      font-weight: 800;
      color: #0B132B;
      line-height: 1.2;
    }

    /* Sub-modules inside stage */
    .module-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .module-item {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .module-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #0F172A;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .module-desc {
      font-size: 10px;
      font-weight: 500;
      color: #64748B;
    }

    .module-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      background: #E2E8F0;
      color: #334155;
    }

    /* Stage Footer / Tech Stack Tag */
    .stage-footer {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px dashed #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stage-tag {
      font-size: 9.5px;
      font-weight: 700;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Stage Themes */
    /* Stage 1: Data Ingestion (Cyan / Slate) */
    .stage-1 { border-top: 4px solid #00A3C4; }
    .stage-1 .stage-icon { background: rgba(0, 163, 196, 0.12); color: #00A3C4; }
    .stage-1 .stage-step { color: #00A3C4; }

    /* Stage 2: Real-time Stream & AI (Crimson / Violet) */
    .stage-2 { border-top: 4px solid #C8102E; }
    .stage-2 .stage-icon { background: rgba(200, 16, 46, 0.12); color: #C8102E; }
    .stage-2 .stage-step { color: #C8102E; }

    /* Stage 3: Database & Cloud Multi-tenant (Tech Blue) */
    .stage-3 { border-top: 4px solid #0066CC; }
    .stage-3 .stage-icon { background: rgba(0, 102, 204, 0.12); color: #0066CC; }
    .stage-3 .stage-step { color: #0066CC; }

    /* Stage 4: Applications & Integrations (Emerald) */
    .stage-4 { border-top: 4px solid #059669; }
    .stage-4 .stage-icon { background: rgba(5, 150, 105, 0.12); color: #059669; }
    .stage-4 .stage-step { color: #059669; }

    /* Flow Connectors */
    .connector-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .flow-arrow-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .flow-line {
      width: 2px;
      height: 60px;
      background: linear-gradient(180deg, #CBD5E1 0%, #94A3B8 100%);
      display: none;
    }

    .flow-arrow-btn {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0066CC;
    }

    .flow-label {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
      font-size: 9px;
      font-weight: 700;
      color: #94A3B8;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 4px;
    }

    /* Bottom Architecture Legend */
    .bottom-specs {
      position: relative;
      z-index: 10;
      margin-top: 18px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(11, 19, 43, 0.03);
    }
    .spec-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }
    .spec-item svg { width: 14px; height: 14px; color: #0066CC; }
    .spec-divider { width: 1px; height: 16px; background: #E2E8F0; }
  </style>
</head>
<body>
  <div class="canvas-container">
    <div class="bg-grid"></div>

    <!-- Header -->
    <div class="diagram-header">
      <div class="title-group">
        <div class="diagram-badge">
          <span>Enterprise Cloud Architecture</span>
        </div>
        <div class="diagram-title">Kiến Trúc Nền Tảng Dữ Liệu 5S Cloud SaaS</div>
        <div class="diagram-subtitle">Hạ tầng phân tán thời gian thực, độ trễ &lt;100ms, tuân thủ ISO 27001 &amp; Thông tư 10/2021/TT-BTNMT</div>
      </div>
      <div class="trust-chips">
        <div class="trust-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          ISO 27001
        </div>
        <div class="trust-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          TT 10/2021
        </div>
        <div class="trust-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
          SLA 99.99%
        </div>
      </div>
    </div>

    <!-- 4 Pipeline Stages -->
    <div class="pipeline-grid">
      <!-- STAGE 1 -->
      <div class="stage-card stage-1">
        <div class="stage-header">
          <div class="stage-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle>
            </svg>
          </div>
          <div class="stage-info">
            <div class="stage-step">Tầng 01 • Ingestion</div>
            <div class="stage-name">Nguồn &amp; IoT Edge</div>
          </div>
        </div>
        <div class="module-list">
          <div class="module-item">
            <div class="module-title">
              <span>Trạm CEMS Khí Thải</span>
              <span class="module-pill">CEMS</span>
            </div>
            <div class="module-desc">SO2, NOx, CO, O2, Bụi, Nhiệt, Áp suất</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>5S Datalogger / Gateway</span>
              <span class="module-pill">Modbus</span>
            </div>
            <div class="module-desc">Thu nhận tín hiệu 24/7 &amp; đệm buffer</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>Cảm Biến Không Khí IoT</span>
              <span class="module-pill">MQTT</span>
            </div>
            <div class="module-desc">Trạm quan trắc xung quanh &amp; vi khí hậu</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>API Tích Hợp Thứ 3</span>
              <span class="module-pill">REST</span>
            </div>
            <div class="module-desc">Hệ thống SCADA / DCS nhà máy</div>
          </div>
        </div>
        <div class="stage-footer">
          <span class="stage-tag">⚡ TLS 1.3 / Gzip Edge</span>
        </div>
      </div>

      <!-- CONNECTOR 1 -->
      <div class="connector-col">
        <div class="flow-arrow-wrapper">
          <div class="flow-arrow-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <div class="flow-label">&lt;100ms Stream</div>
        </div>
      </div>

      <!-- STAGE 2 -->
      <div class="stage-card stage-2">
        <div class="stage-header">
          <div class="stage-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
          </div>
          <div class="stage-info">
            <div class="stage-step">Tầng 02 • Stream Core</div>
            <div class="stage-name">Xử Lý &amp; AI Engine</div>
          </div>
        </div>
        <div class="module-list">
          <div class="module-item">
            <div class="module-title">
              <span>Stream Engine Event-Driven</span>
              <span class="module-pill">Kafka</span>
            </div>
            <div class="module-desc">Xử lý hàng triệu thông điệp/giây</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>AI Anomaly Detection</span>
              <span class="module-pill">AI Core</span>
            </div>
            <div class="module-desc">Phát hiện bất thường &amp; trôi zero/span</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>Data Validation TT10</span>
              <span class="module-pill">Auto</span>
            </div>
            <div class="module-desc">Kiểm duyệt tính hợp lệ số liệu tự động</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>Dynamic Alert Dispatcher</span>
              <span class="module-pill">Rules</span>
            </div>
            <div class="module-desc">Phát cảnh báo đa ngưỡng tức thời</div>
          </div>
        </div>
        <div class="stage-footer">
          <span class="stage-tag">🧠 AI Model In-Memory</span>
        </div>
      </div>

      <!-- CONNECTOR 2 -->
      <div class="connector-col">
        <div class="flow-arrow-wrapper">
          <div class="flow-arrow-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <div class="flow-label">Validated Data</div>
        </div>
      </div>

      <!-- STAGE 3 -->
      <div class="stage-card stage-3">
        <div class="stage-header">
          <div class="stage-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
          </div>
          <div class="stage-info">
            <div class="stage-step">Tầng 03 • Persistence</div>
            <div class="stage-name">Cloud Database</div>
          </div>
        </div>
        <div class="module-list">
          <div class="module-item">
            <div class="module-title">
              <span>TimescaleDB Time-Series</span>
              <span class="module-pill">TSDB</span>
            </div>
            <div class="module-desc">Tối ưu truy vấn dữ liệu chuỗi thời gian</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>Multi-Tenant Partitioning</span>
              <span class="module-pill">Isolated</span>
            </div>
            <div class="module-desc">Cô lập dữ liệu doanh nghiệp an toàn tuyệt đối</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>Distributed Cache</span>
              <span class="module-pill">Redis</span>
            </div>
            <div class="module-desc">Truy xuất dashboard tức thì dưới 10ms</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>Hot/Cold Storage Lake</span>
              <span class="module-pill">S3/AES</span>
            </div>
            <div class="module-desc">Lưu trữ lịch sử 10+ năm, mã hóa AES-256</div>
          </div>
        </div>
        <div class="stage-footer">
          <span class="stage-tag">🔒 Multi-AZ Auto-Failover</span>
        </div>
      </div>

      <!-- CONNECTOR 3 -->
      <div class="connector-col">
        <div class="flow-arrow-wrapper">
          <div class="flow-arrow-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <div class="flow-label">OpenAPI / GraphQL</div>
        </div>
      </div>

      <!-- STAGE 4 -->
      <div class="stage-card stage-4">
        <div class="stage-header">
          <div class="stage-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div class="stage-info">
            <div class="stage-step">Tầng 04 • Application</div>
            <div class="stage-name">Ứng Dụng &amp; Tích Hợp</div>
          </div>
        </div>
        <div class="module-list">
          <div class="module-item">
            <div class="module-title">
              <span>Enterprise Web Portal</span>
              <span class="module-pill">React</span>
            </div>
            <div class="module-desc">Bản đồ GIS, giám sát và phân tích đồ thị</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>Mobile App Native</span>
              <span class="module-pill">iOS/Android</span>
            </div>
            <div class="module-desc">Nhận cảnh báo đẩy tức thì mọi lúc mọi nơi</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>Cổng Dịch Vụ Công TN&amp;MT</span>
              <span class="module-pill">TT10 FTP</span>
            </div>
            <div class="module-desc">Đồng bộ tự động về 63 Sở TN&amp;MT</div>
          </div>
          <div class="module-item">
            <div class="module-title">
              <span>OpenAPI / ERP Integration</span>
              <span class="module-pill">REST</span>
            </div>
            <div class="module-desc">Kết nối SAP, ERP, MES nội bộ nhà máy</div>
          </div>
        </div>
        <div class="stage-footer">
          <span class="stage-tag">📱 100% Responsive &amp; App</span>
        </div>
      </div>
    </div>

    <!-- Bottom Specs -->
    <div class="bottom-specs">
      <div class="spec-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Thời gian phản hồi: <strong>&lt;100ms</strong></span>
      </div>
      <div class="spec-divider"></div>
      <div class="spec-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <span>Chi phí hạ tầng: <strong>Tiết kiệm 65%</strong></span>
      </div>
      <div class="spec-divider"></div>
      <div class="spec-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>Phân quyền: <strong>Multi-Tenant RBAC</strong></span>
      </div>
      <div class="spec-divider"></div>
      <div class="spec-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <span>Bảo mật: <strong>Mã Hóa Kép AES-256</strong></span>
      </div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle' });
  const outputPath = path.join(assetsDir, 'software-cloud-architecture.png');
  await page.screenshot({ path: outputPath });
  await page.close();
  console.log(`✓ Successfully generated: assets/software-cloud-architecture.png (2048x1400)`);
}

/**
 * 3. SOFTWARE MULTI-PLATFORM SHOWCASE (assets/software-multi-platform.png)
 * Viewport: 1024x700 @ 2x -> 2048x1400 PNG
 */
async function generateMultiPlatform(browser) {
  const page = await browser.newPage({
    viewport: { width: 1024, height: 700, deviceScaleFactor: 2 }
  });

  const dashboardHeroB64 = getBase64Image('dashboard-hero.png');

  const html = `<!DOCTYPE html>
<html>
<head>
  ${commonHead}
  <style>
    .canvas-container {
      width: 1024px;
      height: 700px;
      position: relative;
      background: radial-gradient(1000px 700px at 50% 30%, #FAFDFE 0%, #F1F5F9 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 20px;
    }

    /* Tech grid */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(0, 102, 204, 0.06) 1px, transparent 0);
      background-size: 24px 24px;
      pointer-events: none;
    }

    .ambient-glow-center {
      position: absolute;
      top: 15%;
      left: 30%;
      width: 500px;
      height: 400px;
      background: radial-gradient(circle, rgba(0, 102, 204, 0.1) 0%, rgba(0, 102, 204, 0) 70%);
      filter: blur(60px);
      pointer-events: none;
    }

    /* Top Badge */
    .showcase-header {
      position: absolute;
      top: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 5px 16px;
      box-shadow: 0 4px 12px rgba(11, 19, 43, 0.05);
      z-index: 20;
    }
    .showcase-header span {
      font-size: 11px;
      font-weight: 800;
      color: #0066CC;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .header-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #0066CC;
    }

    /* Layout Stage */
    .devices-stage {
      position: relative;
      width: 960px;
      height: 580px;
      margin-top: 30px;
      display: flex;
      align-items: center;
    }

    /* DESKTOP BROWSER MOCKUP */
    .desktop-browser {
      position: absolute;
      left: 10px;
      top: 40px;
      width: 660px;
      height: 440px;
      background: #0F172A;
      border-radius: 12px;
      box-shadow: 
        0 24px 60px rgba(11, 19, 43, 0.16),
        0 6px 18px rgba(11, 19, 43, 0.08),
        0 0 0 1px #334155;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      z-index: 10;
    }

    .browser-header {
      height: 32px;
      background: #0B132B;
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 12px;
      border-bottom: 1px solid #1E293B;
    }
    .browser-dots {
      display: flex;
      gap: 6px;
    }
    .b-dot { width: 9px; height: 9px; border-radius: 50%; }
    .b-dot.red { background: #FF5F56; }
    .b-dot.yellow { background: #FFBD2E; }
    .b-dot.green { background: #27C93F; }

    .browser-url {
      background: #1E293B;
      border-radius: 6px;
      padding: 3px 12px;
      font-size: 11px;
      color: #94A3B8;
      font-weight: 500;
      flex: 1;
      max-width: 320px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .desktop-body {
      flex: 1;
      background: #0A0F1D;
      position: relative;
      overflow: hidden;
    }
    .desktop-body img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top left;
      display: block;
    }

    /* SMARTPHONE MOCKUP */
    .smartphone-wrapper {
      position: absolute;
      right: 40px;
      top: 15px;
      width: 280px;
      height: 520px;
      background: #0F172A;
      border-radius: 40px;
      padding: 10px;
      box-shadow: 
        0 30px 70px rgba(11, 19, 43, 0.25),
        0 10px 25px rgba(11, 19, 43, 0.12),
        0 0 0 3px #334155;
      z-index: 25;
      display: flex;
      flex-direction: column;
    }

    .phone-screen {
      width: 100%;
      height: 100%;
      background: #0B132B;
      border-radius: 32px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      border: 1px solid #1E293B;
    }

    /* Dynamic Island */
    .phone-island {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 20px;
      background: #020617;
      border-radius: 12px;
      z-index: 40;
    }

    /* Phone Status Bar */
    .phone-status-bar {
      height: 38px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 20px 6px 20px;
      color: #F8FAFC;
      font-size: 11px;
      font-weight: 700;
      position: relative;
      z-index: 30;
    }

    /* Phone App Content */
    .phone-app {
      flex: 1;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: linear-gradient(180deg, #0B132B 0%, #060B18 100%);
    }

    .phone-app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }
    .phone-brand {
      font-size: 13px;
      font-weight: 900;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .phone-brand-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #C8102E;
    }

    .station-selector {
      background: #1E293B;
      border-radius: 8px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .station-name {
      font-size: 11px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .station-status {
      font-size: 9px;
      font-weight: 700;
      color: #10B981;
      background: rgba(16, 185, 129, 0.15);
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Sensor Metric Cards on Mobile */
    .phone-metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .phone-metric-card {
      background: #131E3A;
      border-radius: 10px;
      padding: 8px 10px;
      border: 1px solid rgba(255,255,255,0.05);
      display: flex;
      flex-direction: column;
    }
    .pm-label {
      font-size: 9.5px;
      font-weight: 600;
      color: #94A3B8;
    }
    .pm-value {
      font-size: 16px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: 'JetBrains Mono', monospace;
      margin: 2px 0;
    }
    .pm-value.warning { color: #F59E0B; }
    .pm-unit {
      font-size: 8px;
      font-weight: 600;
      color: #64748B;
    }

    /* Mini Mobile Chart */
    .phone-chart-box {
      background: #131E3A;
      border-radius: 10px;
      padding: 8px 10px;
      border: 1px solid rgba(255,255,255,0.05);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .phone-chart-title {
      font-size: 9.5px;
      font-weight: 700;
      color: #CBD5E1;
      display: flex;
      justify-content: space-between;
    }
    .phone-chart-svg {
      width: 100%;
      height: 45px;
    }

    /* FLOATING PUSH NOTIFICATION (Crucial requirement!) */
    .push-notification-banner {
      position: absolute;
      top: 105px;
      right: 15px;
      width: 320px;
      background: #FFFFFF;
      border-radius: 16px;
      padding: 12px 14px;
      box-shadow: 
        0 20px 45px rgba(11, 19, 43, 0.2),
        0 4px 12px rgba(0, 0, 0, 0.06);
      border: 1.5px solid #F87171;
      z-index: 50;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .push-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .push-app-info {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .push-app-icon {
      width: 18px;
      height: 18px;
      background: #C8102E;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 900;
    }
    .push-app-name {
      font-size: 11px;
      font-weight: 800;
      color: #0B132B;
    }
    .push-time {
      font-size: 9.5px;
      font-weight: 600;
      color: #94A3B8;
    }

    .push-title {
      font-size: 12px;
      font-weight: 800;
      color: #DC2626;
      line-height: 1.25;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .push-body {
      font-size: 11px;
      font-weight: 500;
      color: #334155;
      line-height: 1.35;
    }

    .push-actions {
      display: flex;
      gap: 6px;
      margin-top: 4px;
    }
    .push-btn {
      flex: 1;
      padding: 5px 0;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      text-align: center;
      border: none;
    }
    .push-btn-primary {
      background: #0066CC;
      color: #FFFFFF;
    }
    .push-btn-secondary {
      background: #F1F5F9;
      color: #475569;
    }

    /* Floating Feature Badges */
    .float-chip {
      position: absolute;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 24px;
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 800;
      color: #0B132B;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 10px 24px rgba(11, 19, 43, 0.08);
      z-index: 30;
    }
    .float-chip svg { width: 16px; height: 16px; }

    .chip-1 {
      bottom: 25px;
      left: 40px;
      border-left: 3px solid #0066CC;
    }
    .chip-1 svg { color: #0066CC; }

    .chip-2 {
      bottom: 25px;
      left: 320px;
      border-left: 3px solid #10B981;
    }
    .chip-2 svg { color: #10B981; }
  </style>
</head>
<body>
  <div class="canvas-container">
    <div class="bg-grid"></div>
    <div class="ambient-glow-center"></div>

    <div class="showcase-header">
      <div class="header-dot"></div>
      <span>NỀN TẢNG ĐA THIẾT BỊ • TRUY CẬP 24/7 MỌI LÚC MỌI NƠI</span>
    </div>

    <div class="devices-stage">
      <!-- Desktop Mockup -->
      <div class="desktop-browser">
        <div class="browser-header">
          <div class="browser-dots">
            <div class="b-dot red"></div>
            <div class="b-dot yellow"></div>
            <div class="b-dot green"></div>
          </div>
          <div class="browser-url">
            <span>🔒</span>
            <span>https://cloud.5s-cems.vn/operations/live</span>
          </div>
        </div>
        <div class="desktop-body">
          <img src="${dashboardHeroB64}" alt="Desktop Web Portal" />
        </div>
      </div>

      <!-- Smartphone Mockup -->
      <div class="smartphone-wrapper">
        <div class="phone-screen">
          <div class="phone-island"></div>
          <div class="phone-status-bar">
            <span>09:41</span>
            <span>5G • 100%</span>
          </div>
          <div class="phone-app">
            <div class="phone-app-header">
              <div class="phone-brand">
                <div class="phone-brand-dot"></div>
                <span>5S CEMS MOBILE</span>
              </div>
              <span style="font-size: 10px; color: #38BDF8; font-weight: 700;">LIVE</span>
            </div>

            <div class="station-selector">
              <div>
                <div class="station-name">Trạm Ống Khói #01</div>
                <div style="font-size: 9px; color: #94A3B8;">Nhà Máy Xi Măng Hà Tiên</div>
              </div>
              <div class="station-status">ONLINE</div>
            </div>

            <div class="phone-metrics-grid">
              <div class="phone-metric-card">
                <div class="pm-label">Chỉ số CO</div>
                <div class="pm-value warning">38.2</div>
                <div class="pm-unit">mg/Nm³ (80% ngưỡng)</div>
              </div>
              <div class="phone-metric-card">
                <div class="pm-label">Chỉ số SO2</div>
                <div class="pm-value">45.1</div>
                <div class="pm-unit">mg/Nm³ (Chuẩn)</div>
              </div>
              <div class="phone-metric-card">
                <div class="pm-label">Nồng độ Bụi</div>
                <div class="pm-value">22.4</div>
                <div class="pm-unit">mg/Nm³ (An toàn)</div>
              </div>
              <div class="phone-metric-card">
                <div class="pm-label">Lưu Lượng</div>
                <div class="pm-value">124.8</div>
                <div class="pm-unit">k m³/h (Ổn định)</div>
              </div>
            </div>

            <div class="phone-chart-box">
              <div class="phone-chart-title">
                <span>Xu Hướng 24 Giờ</span>
                <span style="color: #38BDF8;">AI Predictive</span>
              </div>
              <svg class="phone-chart-svg" viewBox="0 0 200 45">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0066CC" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#0066CC" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 35 Q 30 20, 60 28 T 120 15 T 160 30 T 200 10 L 200 45 L 0 45 Z" fill="url(#chartGrad)"/>
                <path d="M0 35 Q 30 20, 60 28 T 120 15 T 160 30 T 200 10" fill="none" stroke="#38BDF8" stroke-width="2"/>
                <circle cx="200" cy="10" r="3" fill="#C8102E"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Push Notification Banner -->
      <div class="push-notification-banner">
        <div class="push-header">
          <div class="push-app-info">
            <div class="push-app-icon">5S</div>
            <span class="push-app-name">5S Cloud AI Alert</span>
          </div>
          <span class="push-time">Vừa xong</span>
        </div>
        <div class="push-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Cảnh báo: Chỉ số CO chạm 80% ngưỡng
        </div>
        <div class="push-body">
          AI đề xuất: Tăng độ mở van gió thứ cấp +15% tại Lò nung số 2 để tối ưu hóa quá trình cháy.
        </div>
        <div class="push-actions">
          <button class="push-btn push-btn-primary">Xem Chẩn Đoán AI</button>
          <button class="push-btn push-btn-secondary">Xác Nhận</button>
        </div>
      </div>

      <!-- Feature Badges -->
      <div class="float-chip chip-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        <span>Đồng Bộ Web &amp; Mobile Real-Time (&lt;100ms)</span>
      </div>

      <div class="float-chip chip-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
        <span>Ứng Dụng Native iOS &amp; Android</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle' });
  const outputPath = path.join(assetsDir, 'software-multi-platform.png');
  await page.screenshot({ path: outputPath });
  await page.close();
  console.log(`✓ Successfully generated: assets/software-multi-platform.png (2048x1400)`);
}

async function main() {
  console.log('=== STARTING 5S B2B SOFTWARE ASSET GENERATION (2x Resolution) ===');
  const browser = await chromium.launch({ headless: true });

  try {
    console.log('\n[1/3] Generating MacBook Pro SaaS Dashboard Hero...');
    await generateHeroMacbook(browser);

    console.log('\n[2/3] Generating Cloud Architecture Pipeline Diagram...');
    await generateCloudArchitecture(browser);

    console.log('\n[3/3] Generating Multi-Platform Web & Mobile Showcase...');
    await generateMultiPlatform(browser);

    console.log('\n✅ All 3 B2B Software Assets generated successfully!');
  } catch (error) {
    console.error('❌ Error generating software assets:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
