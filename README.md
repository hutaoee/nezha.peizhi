# nezha-ui
##### 后台添加
###### 自用的探针更改 
```html
<meta name="referrer" content="no-referrer">
<script src="https://cdn.jsdelivr.net/gh/hutaoee/nezha.peizhi@main/nezha-style1.js"></script>
<script>
  window.CustomBackgroundImage = 'https://cdn.nodeimage.com/i/vbJdp0cG72gEQuKfFkei3SyNN8juPBLx.jpg'
  window.CustomMobileBackgroundImage = 'https://cdn.nodeimage.com/i/vbJdp0cG72gEQuKfFkei3SyNN8juPBLx.jpg'
  window.CustomLogo = 'https://cdn.nodeimage.com/i/9aFClHrd6v9AGP77z9DeR2X6ZzG4yRwy.png'
  window.CustomDesc = '服务器监控'
  window.DisableAnimatedMan = "true";
  window.CustomLinks = '[{"link":"https://sms.788555.xyz/","name":"联系我"}]'
</script>
```
###### 周期性流量进度条 
```html
<script>
  window.TrafficScriptConfig = {
    showTrafficStats: true,    // 显示流量统计, 默认开启
    insertAfter: true,         // 如果开启总流量卡片, 是否放置在总流量卡片后面, 默认为true
    interval: 60000,           // 60秒刷新缓存, 单位毫秒, 默认60秒
    toggleInterval: 0,         // 4秒切换流量进度条右上角内容, 0秒不切换, 单位毫秒, 默认5秒
    duration: 500,             // 缓出缓进切换时间, 单位毫秒, 默认500毫秒
    enableLog: false           // 开启日志, 默认关闭
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/hutaoee/nezha.peizhi@main/traffic-progress.js"></script>
```

###### 详情与网络 展示在一个页面
```html
<script src="https://cdn.jsdelivr.net/gh/hutaoee/nezha.peizhi@main/nezha-custom.js"></script>
```
