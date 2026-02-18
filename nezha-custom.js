// ==UserScript==
// @name         哪吒详情页布局调整
// @version      2.1
// @description  调整顺序为：1.服务器信息卡片, 2.网络图表, 3.详情图表
// @author       Gemini
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 选择器定义
    const selectorTabSection = '.server-info section.flex.items-center.my-2.w-full';
    const selectorNetworkButton = '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';
    
    // 容器选择器（基于你的要求：1是卡片，2是详情，3是网络）
    // 调整后：我们要把原本在第3位的网络图表移动到第2位
    const selectorDetailCharts = '.server-info > div:nth-of-type(2)'; 
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';

    let hasClicked = false;

    // 核心功能：调整 DOM 顺序并显示
    function reorderAndShow() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);
        const container = document.querySelector('.server-info');

        if (detailDiv && networkDiv && container) {
            // 关键动作：将网络图表插入到详情图表之前
            if (networkDiv.nextSibling === detailDiv || detailDiv.previousSibling !== networkDiv) {
                container.insertBefore(networkDiv, detailDiv);
                console.log('[UserScript] 已交换顺序：网络图表在前');
            }

            // 强制两者显示
            detailDiv.style.display = 'block';
            networkDiv.style.display = 'block';
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) section.style.display = 'none';
    }

    function tryClickNetworkButton() {
        const btn = document.querySelector(selectorNetworkButton);
        if (btn && !hasClicked) {
            btn.click();
            hasClicked = true;
            console.log('[UserScript] 已激活网络数据加载');
            // 点击后等待数据加载并重新排序
            setTimeout(reorderAndShow, 300);
        }
    }

    function tryClickPeak(retryCount = 15, interval = 200) {
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) {
            peakBtn.click();
            console.log('[UserScript] 已开启 Peak 视图');
        } else if (retryCount > 0) {
            setTimeout(() => tryClickPeak(retryCount - 1, interval), interval);
        }
    }

    const observer = new MutationObserver(() => {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        // 如果检测到图表容器存在
        if (detailDiv || networkDiv) {
            hideTabSection();
            tryClickNetworkButton();
            reorderAndShow();
            
            // 首次运行时尝试点击 Peak
            if (hasClicked) {
                tryClickPeak(1, 0); 
            }
        }
    });

    const root = document.querySelector('#root');
    if (root) {
        observer.observe(root, {
            childList: true,
            subtree: true
        });
        console.log('[UserScript] 排序观察器已启动');
    }
})();
