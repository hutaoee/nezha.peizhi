// ==UserScript==
// @name         哪吒详情页直接展示网络波动卡片（适配新版HTML结构）
// @version      2.0
// @description  哪吒详情页直接展示网络波动卡片（适配新版HTML结构）
// @author       https://www.nodeseek.com/post-349102-1
// @match        *://*/server/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    // 【核心参数更新区域】—— 严格适配你发给我的新版 HTML 结构
    // =========================================================================

    // 1. "网络" 按钮选择器：通过文字定位“网络”，然后向上找到对应的按钮包裹层
    const getNetworkButton = () => {
        const p = Array.from(document.querySelectorAll('p.whitespace-nowrap')).find(el => el.textContent.trim() === '网络');
        return p ? p.closest('.cursor-pointer') : null;
    };

    // 2. Tab 切换区域的选择器：定位带有新版特殊圆角和背景的包裹层
    const getTabSection = () => {
        return document.querySelector('div:has(> .bg-stone-100\\/70), div:has(> .dark\\:bg-stone-800\\/70)')?.parentElement;
    };

    // 3. 详情图表视图选择器：在新版中通常是第一个带有图表的容器
    const getDetailCharts = () => {
        return document.querySelector('.server-info > div:has(.server-charts)') || document.querySelector('.server-info > div:nth-of-type(2)');
    };

    // 4. 网络图表视图选择器：紧跟在详情图表后面的第3个 div 容器
    const getNetworkCharts = () => {
        return document.querySelector('.server-info > div:has(#Peak)') || document.querySelector('.server-info > div:nth-of-type(3)');
    };

    // 为兼容你原脚本底层的 querySelector 语法，映射为能安全读取样式的伪代理对象
    const selectorNetworkButton = { query: getNetworkButton };
    const selectorTabSection = { query: getTabSection };
    const selectorDetailCharts = { query: getDetailCharts };
    const selectorNetworkCharts = { query: getNetworkCharts };

    // 辅助工具：统一重写 document.querySelector 让它能跑你的老逻辑
    const originalQuerySelector = document.querySelector.bind(document);
    document.querySelector = function(selector) {
        if (selector && selector.query) return selector.query();
        return originalQuerySelector(selector);
    };
    // =========================================================================


    let hasClicked = false;
    let divVisible = false;

    function forceBothVisible() {
        // 使用更精确的选择器找到详情和网络两个视图
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            // 参数更新：使用 setProperty 注入 important 确保不被新版 Tailwind 覆盖
            detailDiv.style.setProperty('display', 'block', 'important');
            console.log('[UserScript] 详情图表已显示');
        }
        if (networkDiv) {
            // 参数更新：注入 important 并强行移除新版可能自带的隐藏类，解决一直刷新空白的问题
            networkDiv.style.setProperty('display', 'block', 'important');
            if (networkDiv.classList.contains('hidden')) {
                networkDiv.classList.remove('hidden');
            }
            console.log('[UserScript] 网络图表已显示');
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            // 参数更新：注入 important 彻底隐藏新版 Tab
            section.style.setProperty('display', 'none', 'important');
            console.log('[UserScript] Tab 切换区域已隐藏');
        }
    }

    function tryClickNetworkButton() {
        const btn = document.querySelector(selectorNetworkButton);
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

        // 确保两个视图都可见
        if (detailDiv && networkDiv) {
            if (!isDetailVisible || !isNetworkVisible) {
                forceBothVisible();
            }
        }
    });

    const root = document.querySelector('#root') || document.body; // 参数更新：做个兜底避免 root 找不到
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
