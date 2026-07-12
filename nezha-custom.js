// ==UserScript==
// @name         哪吒详情页直接展示网络波动卡片（适配新版HTML结构）
// @version      2.2
// @description  哪吒详情页直接展示网络波动卡片（修复网络卡片空白一直在刷新的问题）
// @author       https://www.nodeseek.com/post-349102-1
// @match        *://*/server/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ======= 新版精确定位参数 =======
    function getTabButtons() {
        const pTags = Array.from(document.querySelectorAll('p.whitespace-nowrap'));
        const detail = pTags.find(el => el.textContent.trim() === '详情')?.closest('.cursor-pointer');
        const network = pTags.find(el => el.textContent.trim() === '网络')?.closest('.cursor-pointer');
        return { detail, network };
    }

    const selectorTabSection = 'div:has(> .bg-stone-100\\/70), div:has(> .dark\\:bg-stone-800\\/70)';
    const selectorDetailCharts = '.server-info > div:has(.server-charts)';
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';
    // =========================================

    let hasClicked = false;
    let divVisible = false;

    function forceBothVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        // 如果 React 把节点干掉了，我们要强制给它创造一个并存的环境
        if (detailDiv && networkDiv) {
            detailDiv.style.setProperty('display', 'block', 'important');
            networkDiv.style.setProperty('display', 'block', 'important');
            
            // 关键：防止 React 的 Unmount 机制让图表彻底变成空白
            // 强制让它们脱离 React 的 display 绑定
            if (networkDiv.classList.contains('hidden')) {
                networkDiv.classList.remove('hidden');
            }
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.setProperty('display', 'none', 'important');
        }
    }

    function tryClickNetworkButton() {
        const { detail, network } = getTabButtons();
        if (network && detail && !hasClicked) {
            hasClicked = true;
            
            // 核心修复逻辑：先去“网络”把真实的数据流拉起来
            network.click();
            console.log('[UserScript] 已切到网络加载真实数据...');
            
            setTimeout(() => {
                // 点击 Peak 按钮
                const peakBtn = document.querySelector('#Peak');
                if (peakBtn) peakBtn.click();
                
                // 数据加载完成，瞬间切回“详情”，让详情组件也挂载
                detail.click();
                console.log('[UserScript] 已切回详情，准备强行双显...');
                
                // 切回后立即锁死双显，隐藏切换栏
                setTimeout(() => {
                    hideTabSection();
                    forceBothVisible();
                }, 100);
                
            }, 400); // 给网络组件 400ms 的初始化和建立 WebSocket 连接的时间
        }
    }

    const observer = new MutationObserver(() => {
        const { network } = getTabButtons();
        if (network) {
            const detailDiv = document.querySelector(selectorDetailCharts);
            const networkDiv = document.querySelector(selectorNetworkCharts);
            const isAnyDivVisible = !!(detailDiv || networkDiv);

            if (isAnyDivVisible && !divVisible) {
                tryClickNetworkButton();
            } else if (!isAnyDivVisible && divVisible) {
                hasClicked = false;
            }

            divVisible = isAnyDivVisible;

            if (hasClicked) {
                forceBothVisible();
            }
        }
    });

    const root = document.querySelector('#root') || document.body;
    if (root) {
        observer.observe(root, {
            childList: true,
            subtree: true
        });
        console.log('[UserScript] 哪吒数据流修复版观察器已启动');
    }
})();
