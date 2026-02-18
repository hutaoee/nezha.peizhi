// ==UserScript==
// @version      2.0
// @description  哪吒详情页直接展示网络波动卡片（适配新版HTML结构）
// @author       https://www.nodeseek.com/post-349102-1
// ==/UserScript==

(function () {
    'use strict';

    // "网络" 按钮选择器：未激活状态下的 Tab 按钮（灰色文字）
    const selectorNetworkButton = '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';

    // Tab 切换区域的 section 选择器（包含"详情"和"网络"按钮的区域）
    const selectorTabSection = '.server-info section.flex.items-center.my-2.w-full';

    // 详情图表视图 - 包含 server-charts 的 div
    const selectorDetailCharts = '.server-info > div:has(.server-charts)';

    // 网络图表视图 - 紧跟在详情图表后面的 div（通常是隐藏的）
    // div顺序：1=服务器信息卡片, 2=详情图表, 3=网络图表
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';

    let hasClicked = false;
    let divVisible = false;

    function forceBothVisible() {
        // 使用更精确的选择器找到详情和网络两个视图
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            detailDiv.style.display = 'block';
            console.log('[UserScript] 详情图表已显示');
        }
        if (networkDiv) {
            networkDiv.style.display = 'block';
            console.log('[UserScript] 网络图表已显示');
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.display = 'none';
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
