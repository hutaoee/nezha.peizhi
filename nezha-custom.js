// ==UserScript==
// @version      2.1
// @description  哪吒详情页展示网络+详情图表（网络在上）
// @author       https://www.nodeseek.com/post-349102-1
// ==/UserScript==

(function () {
    'use strict';

    const selectorNetworkButton =
        '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';

    const selectorTabSection =
        '.server-info section.flex.items-center.my-2.w-full';

    const selectorDetailCharts =
        '.server-info > div:has(.server-charts)';

    const selectorNetworkCharts =
        '.server-info > div:nth-of-type(3)';

    let hasClicked = false;
    let divVisible = false;
    let hasReordered = false;

    function forceBothVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) detailDiv.style.display = 'block';
        if (networkDiv) networkDiv.style.display = 'block';
    }

    function reorderCharts() {
        if (hasReordered) return;

        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv && networkDiv && detailDiv.parentNode) {
            // 把网络图表插入到详情图表前面
            detailDiv.parentNode.insertBefore(networkDiv, detailDiv);
            hasReordered = true;
            console.log('[UserScript] 图表顺序已调整：网络在上');
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
            setTimeout(() => {
                forceBothVisible();
                reorderCharts();
            }, 500);
        }
    }

    function tryClickPeak(retryCount = 10, interval = 200) {
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) {
            peakBtn.click();
        } else if (retryCount > 0) {
            setTimeout(() => tryClickPeak(retryCount - 1, interval), interval);
        }
    }

    const observer = new MutationObserver(() => {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        const isDetailVisible =
            detailDiv && getComputedStyle(detailDiv).display !== 'none';
        const isNetworkVisible =
            networkDiv && getComputedStyle(networkDiv).display !== 'none';

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
            reorderCharts();
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
        console.log('[UserScript] 观察器已启动（网络在上版本）');
    }
})();
