// ==UserScript==
// @name         哪吒详情页网络卡片直显（v2.2 适配新版）
// @version      2.2
// @description  完美适配新版哪吒，解决 React 销毁节点导致的图表无法双显问题
// @author       https://www.nodeseek.com/post-349102-1
// @match        *://*/server/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    let hasInitialized = false;

    function initDoubleCharts() {
        if (hasInitialized) return;

        // 1. 根据你发来的新版 HTML 结构，精确定位“详情”和“网络”按钮
        const pTags = Array.from(document.querySelectorAll('p.whitespace-nowrap'));
        const detailBtn = pTags.find(el => el.textContent.trim() === '详情')?.closest('.cursor-pointer');
        const networkBtn = pTags.find(el => el.textContent.trim() === '网络')?.closest('.cursor-pointer');
        const tabContainer = document.querySelector('.bg-stone-100\\/70, .dark\\:bg-stone-800\\/70')?.parentElement;

        if (!detailBtn || !networkBtn) return;
        hasInitialized = true;

        console.log('[UserScript] 检测到新版 Tab 按钮，开始执行同步加载...');

        // 隐藏顶部的 Tab 切换栏（既然都要双显了，就不需要它了）
        if (tabContainer) {
            tabContainer.style.setProperty('display', 'none', 'important');
        }

        // 2. 核心黑魔法：先切到网络加载数据，将其固定，再切回详情
        // 这样可以确保 React 把两边的图表和 WebSocket/Fetch 数据全部初始化完成
        networkBtn.click();

        setTimeout(() => {
            // 尝试触发 Peak 按钮
            const peakBtn = document.querySelector('#Peak') || Array.from(document.querySelectorAll('button')).find(el => el.textContent?.trim() === 'Peak');
            if (peakBtn) peakBtn.click();

            // 寻找此时挂载出来的网络图表容器
            const serverInfo = document.querySelector('.server-info');
            if (!serverInfo) return;

            // 找到网络图表所在的外部 div (通常是 server-info 下的某个主要子 div)
            const networkView = serverInfo.querySelector('div:has(#Peak)') || serverInfo.children[serverInfo.children.length - 1];
            
            if (networkView) {
                // 克隆一份网络视图，脱离 React 的单选控制
                const clonedNetwork = networkView.cloneNode(true);
                clonedNetwork.id = 'custom-network-view';
                
                // 切回详情页，让 React 把详情图表渲染回来
                detailBtn.click();

                // 延迟等待详情渲染完毕后，把克隆的网络图表追加到页面最下方
                setTimeout(() => {
                    const currentServerInfo = document.querySelector('.server-info');
                    if (currentServerInfo) {
                        currentServerInfo.appendChild(clonedNetwork);
                        console.log('[UserScript] 完美双显：详情与网络图表已并存');
                    }
                }, 200);
            }
        }, 400); // 留出 400ms 给网络图表加载
    }

    // 使用监听器确保在 React 异步渲染完 Tab 按钮后立即介入
    const observer = new MutationObserver(() => {
        const pTags = Array.from(document.querySelectorAll('p.whitespace-nowrap'));
        const hasTabs = pTags.some(el => el.textContent.trim() === '网络');
        if (hasTabs) {
            initDoubleCharts();
        }
    });

    const root = document.querySelector('#root') || document.body;
    if (root) {
        observer.observe(root, {
            childList: true,
            subtree: true
        });
        console.log('[UserScript] 哪吒 v2.2 监听器已启动');
    }
})();
