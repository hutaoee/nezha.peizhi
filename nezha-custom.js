<script>
    const selectorButton = '#root > div.flex.min-h-screen.w-full.flex-col > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > section.flex.items-center.my-2.w-full > div.flex.justify-center.w-full.max-w-\\[200px\\] > div > div > div.relative.cursor-pointer.rounded-3xl.px-2\\.5.py-\\[8px\\].text-\\[13px\\].font-semibold.transition-all.duration-500.text-stone-400.dark\\:text-stone-500';
    const selectorSection = '#root > div.flex.min-h-screen.w-full.flex-col > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > section.flex.items-center.my-2.w-full';
    const containerPath = '#root > div.flex.min-h-screen.w-full.flex-col > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info';

    let hasTriggered = false;
    let lastUrl = location.href;

    // 路由改变检测：如果 URL 变了，重置触发状态
    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            hasTriggered = false; // 重置状态，允许在新页面重新点击
        }
    }

    function injectLayout() {
        checkUrlChange();

        const container = document.querySelector(containerPath);
        if (!container) return;

        const section = document.querySelector(selectorSection);
        const btn = document.querySelector(selectorButton);

        // 1. 如果还没加载过数据，且按钮存在
        if (!hasTriggered && btn) {
            btn.click(); 
            hasTriggered = true;
            return; 
        }

        // 2. 强制显示所有内容块
        const contentDivs = Array.from(container.children);

        if (contentDivs.length > 0) {
            // 隐藏切换工具栏
            if (section) section.style.setProperty('display', 'none', 'important');

            contentDivs.forEach(div => {
                // 跳过特定的加载占位符或工具栏本身
                if (div === section || div.classList.contains('flex-center')) return;

                div.style.setProperty('display', 'block', 'important');
                div.style.setProperty('visibility', 'visible', 'important');
                div.style.setProperty('height', 'auto', 'important');
                div.style.setProperty('opacity', '1', 'important');
                
                if (div.hasAttribute('hidden')) {
                    div.removeAttribute('hidden');
                }
            });
        }
    }

    // 初始化观察器
    const startObserver = () => {
        const root = document.querySelector('#root');
        if (!root) return;

        const observer = new MutationObserver(() => {
            injectLayout();
        });

        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: false // 减少性能开销，通常 childList 足够
        });
    };

    // 执行
    startObserver();
    setInterval(injectLayout, 30000);
</script>
