(function() {
    // 1. 动态注入你满意的清爽半透明与抖音体 CSS 样式
    const css = `
        @font-face {
            font-family: 'Douyin Sans';
            src: url('https://github.com/hutaoee/nezha.peizhi/raw/refs/heads/main/DouyinSansBold.ttf') format('truetype');
            font-display: swap;
        }
        * { 
            font-family: 'Douyin Sans', sans-serif !important; 
        }
        #root { background-color: unset !important; }
        img { border: none; }

        /* 全屏大背景图压暗与轻微模糊（大幅削弱，不晃眼） */
        .dark .bg-cover::after {
            content: ""; position: absolute; inset: 0; z-index: -1;
            -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px);
            background-color: rgba(0, 0, 0, 0.4); 
        }
        .light .bg-cover::after {
            content: ""; position: absolute; inset: 0; z-index: -1;
            -webkit-backdrop-filter: blur(1.5px); backdrop-filter: blur(1.5px);
            background-color: rgba(255, 255, 255, 0.2); 
        }

        /* 卡片去颗粒感（降低模糊，优化饱和度） */
        [class*="bg-card"], .bottom-marquee, .max-w-5xl.gap-4>div:first-child {
            backdrop-filter: blur(3px) saturate(140%) !important;
            -webkit-backdrop-filter: blur(2px) saturate(140%) !important;
            border-radius: 16px !important;
            position: relative !important;
            overflow: hidden !important;
        }
        html.dark [class*="bg-card"], html.dark .bottom-marquee, html.dark .max-w-5xl.gap-4>div:first-child {
            background-color: rgba(20, 20, 20, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        html.light [class*="bg-card"], html.light .bottom-marquee, html.light .max-w-5xl.gap-4>div:first-child {
            background-color: rgba(255, 255, 255, 0.5) !important; 
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
        }

        /* 动态扫光效果动画 */
        [class*="bg-card"]::after, .max-w-5xl.gap-4>div:first-child::after {
            content: ''; position: absolute; top: 0; left: -150%; width: 100%; height: 100%;
            transform: skewX(-30deg);
            background-image: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%);
            transition: left 0.8s ease-in-out;
        }
        [class*="bg-card"]:hover::after, .max-w-5xl.gap-4>div:first-child:hover::after { left: 150%; }

        .text-green-600 { color: rgb(34, 197, 94); }
        .bg-green-600 { background-color: rgb(34, 197, 94); }
        .vps-info { border-radius: 12px; padding: 12px; }
        img[alt="BackIcon"] { margin-right: 12px; }
        footer, .site-footer { display: none !important; }
    `;
    const styleNode = document.createElement('style');
    styleNode.innerHTML = css;
    document.head.appendChild(styleNode);

    // 2. 动态注入 3D 地球的 HTML 节点结构
    const earthHTML = `
        <div id="earth-toggle-btn"></div>
        <div id="earth-drawer-container">
            <div class="earth-header">
                <div class="earth-title">GLOBAL NETWORK STATS</div>
                <div id="earth-close-btn">CLOSE</div>
            </div>
            <div id="earth-render-area"></div>
        </div>
    `;
    const earthContainer = document.createElement('div');
    earthContainer.innerHTML = earthHTML;
    document.body.appendChild(earthContainer);

    // 3. 动态加载 3D 地球依赖的核心 JS 脚本
    const globeScript = document.createElement('script');
    globeScript.src = "https://unpkg.com/globe.gl@2.27.2/dist/globe.gl.min.js";
    document.head.appendChild(globeScript);
})();
