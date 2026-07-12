// ==UserScript==
// @name         哪吒详情页直接展示网络波动卡片（适配新版HTML结构）
// @version      2.1
// @description  哪吒详情页直接展示网络波动卡片（适配新版HTML结构）
// @author       https://www.nodeseek.com/post-349102-1
// @match        *://*/server/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ======= 新版参数（选择器）更新区域 =======
    
    // 1. "网络" 按钮：定位文本为“网络”的标签，并向上找到可点击的父级 div
    function getNetworkButton() {
        const p = Array.from(document.querySelectorAll('p.whitespace-nowrap')).find(el => el.textContent.trim() === '网络');
        return p ? p.closest('.cursor-pointer') : null;
    }

    // 2. Tab 切换区域的 section 选择器（定位包含新版特殊背景类的外层包裹 div）
    const selectorTabSection = 'div:has(> .bg-stone-100\\/70), div:has(> .dark\\:bg-stone-800\\/70)';

    // 3. 详情图表视图选择器
    const selectorDetailCharts = '.server-info > div:has(.server-charts)';

    // 4. 网络图表视图选择器：紧跟在详情图表后面的 div 
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';

    // =========================================

    let hasClicked = false;
    let divVisible = false;

    function forceBothVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            detailDiv.style.setProperty('display', 'block', 'important');
            console.log('[UserScript] 详情图表已显示');
        }
        if (networkDiv) {
            networkDiv.style.setProperty('display', 'block', 'important');
            console.log('[UserScript] 网络图表已显示');
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.setProperty('display', 'none', 'important');
            console.log('[UserScript] Tab 切换区域已隐藏');
        }
    }

    function tryClickNetworkButton() {
        const btn = getNetworkButton(); // 使用新的动态文本选择器获取网络按钮
        if (btn && !hasClicked) {
            btn.click();
            hasClicked = true;
            console.log('[UserScript] 已点击网络按钮');
            setTimeout(forceBothVisible, 500);
        }
    }

    function tryClickPeak(retryCount = 10, interval = 200) {
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) {
            peakBtn.click();
            console.log('[UserScript] 已点击 Peak 按钮');
        } else if (retryCount > 0) {
            setTimeout(() => tryClickPeak(retryCount - 1, interval), interval);
        }
    }

    const observer = new MutationObserver(() => {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        const isDetailVisible = detailDiv && getComputedStyle(detailDiv).display !== 'none';
        const isNetworkVisible = networkDiv && getComputedStyle(networkDiv).display !== 'none';

        const isAnyDivVisible = isDetailVisible || isNetworkVisible;

        if (isAnyDivVisible && !divVisible) {
            hideTabSection();
            tryClickNetworkButton();
            setTimeout(() => tryClickPeak(15, 200), 300);
        } else if (!isAnyDivVisible && divVisible) {
            hasClicked = false;
        }

        divVisible = isAnyDivVisible;

        if (detailDiv && networkDiv) {
            if (!isDetailVisible || !isNetworkVisible) {
                forceBothVisible();
            }
        }
    });

    const root = document.querySelector('#root');
    if (root) {
        observer.observe(root, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
        console.log('[UserScript] 观察器已启动');
    }
})();
