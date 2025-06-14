# nezha-ui
##### 后台添加
###### 自用的探针更改 
```html
<meta name="referrer" content="no-referrer">
/* 自用的css格式 */
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hutaoee/nezha.peizhi/nezha-style.css
">
/* 自用的探针修改 */
<script>
  window.CustomBackgroundImage = 'https://img.picui.cn/free/2025/06/13/684c1abac7590.png'
  window.CustomMobileBackgroundImage = 'https://img.picui.cn/free/2025/06/13/684c1abac7590.png'
  window.CustomLogo = 'https://img.picui.cn/free/2025/04/16/67fe9378eb036.png'
  window.CustomDesc = '服务器监控'
  window.ShowNetTransfer = true
  window.DisableAnimatedMan = false
  window.FixedTopServerName = true
  window.ForceCardInline = true
    /* 关掉人物插图 */
    window.DisableAnimatedMan = "true";
 window.CustomLinks =
   '[{"link":"https://sms.857999.xyz/","name":"联系我"}]'
  window.ForceTheme = 'light'
</script>
```
###### 周期性流量进度条 
```html
/* 周期性流量进度条 */
<script>
  window.TrafficScriptConfig = {
    showTrafficStats: true,    // 显示流量统计, 默认开启
    insertAfter: true,         // 如果开启总流量卡片, 是否放置在总流量卡片后面, 默认为true
    interval: 60000,           // 60秒刷新缓存, 单位毫秒, 默认60秒
    toggleInterval: 5000,      // 4秒切换流量进度条右上角内容, 0秒不切换, 单位毫秒, 默认5秒
    duration: 500,             // 缓出缓进切换时间, 单位毫秒, 默认500毫秒
    enableLog: false           // 开启日志, 默认关闭
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/hutaoee/nezha.peizhi/traffic-progress.js
"></script>
```
