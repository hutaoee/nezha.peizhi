<style>
/* ==========================================
   1. 字体与全局样式优化
   ========================================== */
@font-face {
    font-family: 'Douyin Sans';
    src: url('https://github.com/hutaoee/nezha.peizhi/raw/refs/heads/main/DouyinSansBold.ttf') format('truetype');
    font-display: swap;
}
* { 
    font-family: 'Douyin Sans', sans-serif !important; 
}

#root {
    background-color: unset !important;
}

img {
    border: none;
}


/* ==========================================
   2. 核心微调：全屏大背景图压暗与轻微模糊（大幅削弱，不晃眼）
   ========================================== */
/* 深色模式：模糊度从 6px 降低到 3px，纯净度大幅提升 */
.dark .bg-cover::after {
    content: "";
    position: absolute;
    inset: 0;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 0.4); 
    z-index: -1;
}

/* 浅色模式：模糊度从 3px 降低到 1.5px，透出更清晰的背景 */
.light .bg-cover::after {
    content: "";
    position: absolute;
    inset: 0;
    -webkit-backdrop-filter: blur(1.5px);
    backdrop-filter: blur(1.5px);
    background-color: rgba(255, 255, 255, 0.2); 
    z-index: -1;
}


/* ==========================================
   3. 核心微调：卡片去颗粒感（降低模糊，优化饱和度）
   ========================================== */
/* 降低卡片内部模糊（5px->3px），并将饱和度微调至 140%，呈现通透但扎实的安卓乳白/乳黑质感 */
[class*="bg-card"], .bottom-marquee, .max-w-5xl.gap-4>div:first-child {
    backdrop-filter: blur(3px) saturate(140%) !important;
    -webkit-backdrop-filter: blur(2px) saturate(140%) !important;
    border-radius: 16px !important;
    position: relative !important;
    overflow: hidden !important;
}

/* 深色模式卡片（更显内敛透亮） */
html.dark [class*="bg-card"], 
html.dark .bottom-marquee,
html.dark .max-w-5xl.gap-4>div:first-child {
    background-color: rgba(20, 20, 20, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* 浅色模式卡片（干净清爽） */
html.light [class*="bg-card"], 
html.light .bottom-marquee,
html.light .max-w-5xl.gap-4>div:first-child {
    background-color: rgba(255, 255, 255, 0.5) !important; 
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
}


/* ==========================================
   4. 核心保留：动态扫光效果动画
   ========================================== */
[class*="bg-card"]::after, .max-w-5xl.gap-4>div:first-child::after {
    content: '';
    position: absolute;
    top: 0; left: -150%;
    width: 100%; height: 100%;
    transform: skewX(-30deg);
    background-image: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%);
    transition: left 0.8s ease-in-out;
}
[class*="bg-card"]:hover::after, .max-w-5xl.gap-4>div:first-child:hover::after { 
    left: 150%; 
}


/* ==========================================
   5. 其他必要修正与元素隐藏
   ========================================== */
.text-green-600 { color: rgb(34, 197, 94); }
.bg-green-600 { background-color: rgb(34, 197, 94); }
.vps-info { border-radius: 12px; padding: 12px; }
img[alt="BackIcon"] { margin-right: 12px; }

/* 隐藏冗余元素 */
footer, .site-footer { display: none !important; }
</style>

<script src="//unpkg.com/globe.gl@2.27.2/dist/globe.gl.min.js"></script>
<div id="earth-toggle-btn">
    </div>
<div id="earth-drawer-container">
    <div class="earth-header">
        <div class="earth-title">GLOBAL NETWORK STATS</div>
        <div id="earth-close-btn">CLOSE</div>
    </div>
    <div id="earth-render-area"></div>
</div>
