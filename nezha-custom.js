// ==UserScript==
// @version      2.2
// @description  哪吒详情页直接展示网络波动卡片（网络延迟置顶修复版）
// @author       Modified based on nodeseek post
// @match        *://*/server/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    // 【核心参数更新区域】—— 严格适配新版 HTML 结构，解决详情图表消失的问题
    // =========================================================================

    // 1. "网络" 按钮：通过文本精准定位，避免类名失效
    const getNetworkButton = () => {
        const p = Array.from(document.querySelectorAll('p.whitespace-nowrap')).find(el => el.textContent.trim() === '网络');
        return p ? p.closest('.cursor-pointer') : null;
    };

    // 2. Tab 切换栏区域
    const getTabSection = () => {
        return document.querySelector('div:has(> .bg-stone-100\\/70), div:has(> .dark\\:bg-stone-800\\/70)')?.parentElement;
    };

    // 3. 整个详情页容器
    const selectorContainer = '.server-info';

    // 4. 详情图表区域（包含 server-charts 的 div）
    const selectorDetailCharts = '.server-info > div:has(.server-charts)';

    // 5. 网络图表区域（新版通过 #Peak 按钮或固定第3个节点精准定位，绝不误抓详情）
    const getNetworkCharts = () => {
        return document.querySelector('.server-info > div:has(#Peak)') || document.querySelector('.server-info > div:nth-of-type(3)');
    };

    // 伪代理映射，完美兼容你原本的 document.querySelector 语法
    const selectorNetworkButton = { query: getNetworkButton };
    const selectorTabSection = { query: getTabSection };
    const selectorNetworkCharts = { query: getNetworkCharts };

    const originalQuerySelector = document.querySelector.bind(document);
    document.querySelector = function (selector) {
        if (selector && selector.query) return selector.query();
        return originalQuerySelector(selector);
    };
    // =========================================================================

    // 是否已点击过“网络”按钮
    let hasClicked = false;

    // 当前页面 URL（用于 SPA 路由检测）
    let lastUrl = location.href;

    // 监听 URL 变化（单页应用切换页面时重置状态）
    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            hasClicked = false;
            console.log('[UserScript] 检测到路由变化，状态已重置');
        }
    }

    // 自动点击“网络”按钮加载网络图表
    function tryClickNetworkButton() {
        if (hasClicked) return;

        const btn = document.querySelector(selectorNetworkButton);
        if (btn) {
            btn.click();
            hasClicked = true;
            console.log('[UserScript] 已点击网络按钮');

            // 等待图表渲染完成后执行布局调整
            setTimeout(() => {
                forceBothVisible();
                swapIfNeeded();
            }, 300);
        }
    }

    // 隐藏原本的 Tab 切换栏
    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.setProperty('display', 'none', 'important');
        }
    }

    // 强制显示详情图表和网络图表
    function forceBothVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            detailDiv.style.setProperty('display', 'block', 'important');
            if (detailDiv.classList.contains('hidden')) {
                detailDiv.classList.remove('hidden');
            }
        }
        if (networkDiv) {
            networkDiv.style.setProperty('display', 'block', 'important');
            // 参数更新：移除新版自带的 hidden 隐藏类，防止网络页空白
            if (networkDiv.classList.contains('hidden')) {
                networkDiv.classList.remove('hidden');
            }
        }
    }

    // 如果网络图表在详情图表后面，则交换顺序，实现置顶
    function swapIfNeeded() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (
            detailDiv &&
            networkDiv &&
            detailDiv.parentNode === networkDiv.parentNode
        ) {
            if (
                detailDiv.compareDocumentPosition(networkDiv) &
                Node.DOCUMENT_POSITION_FOLLOWING
            ) {
                detailDiv.parentNode.insertBefore(networkDiv, detailDiv);
                console.log('[UserScript] 已调整顺序：网络延迟已置顶');
            }
        }
    }

    // 主逻辑：执行点击、隐藏、显示、排序等操作
    function injectLayout() {
        checkUrlChange();

        const container = document.querySelector(selectorContainer);
        if (!container) return;

        tryClickNetworkButton();
        hideTabSection();
        forceBothVisible();
        swapIfNeeded();
    }

    // 启动 MutationObserver 监听 DOM 变化（适配 React 重渲染）
    function startObserver() {
        const root = document.querySelector('#root') || document.body;
        if (!root) return;

        let debounceTimer = null;

        const observer = new MutationObserver(() => {
            if (debounceTimer) return;

            debounceTimer = setTimeout(() => {
                debounceTimer = null;
                injectLayout();
            }, 50);
        });

        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class'],
        });

        console.log('[UserScript] 观察器已启动（置顶优化修复版）');
    }

    // 启动监听
    startObserver();

    // 兜底定时执行，防止极端情况下未触发
    setInterval(injectLayout, 60000);

})();
