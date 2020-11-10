<div align="center">

![scriptable](https://raw.githubusercontent.com/evercyan/cantor/master/resource/70/70f4eaaac8440477cac15b294c07a615.png)

iOS scriptable 组件神器

</div>

---

## 加载器

---

### 安装

移动端 [点我下载](https://github.com/evercyan/scriptable/releases/download/v0.0.0/loader.js) 直接安装

---

### 功能

加载器 (Loader) 统一入口, 提供以下功能

- 插件商店
```
当前是直接跳转 github repo 页面
```

- 插件管理
```
渲染已安装插件列表
支持已安装插件的 `运行` `更新` `删除` 等
```

- 组件更新: 
```
Loader 自我更新
```

- 透明背景
```
所谓透明背景, 即上传空屏截图, 按组件大小 `small` `medium` `large` 对应的位置对截图进行裁剪, 生成相应的背景图
需要使用透明背景组件时, 只需取其对应大小和位置的背景图片即可
```
```js
{
    'small': [           // 小组件
        'top-left',      // 上左
        'top-right',     // 上右
        'middle-left',   // 中左
        'middle-right',  // 中右
        'bottom-left',   // 下左
        'bottom-right',  // 下右
    ],
    'medium': [          // 中组件
        'top',           // 上
        'middle',        // 中
        'bottom',        // 下
    ],
    'large': [           // 大组件
        'top',           // 上
        'bottom',        // 下
    ]
}
```

![s-menu](https://raw.githubusercontent.com/evercyan/cantor/master/resource/b3/b3dabe04475811278dbcc53db57f0a11.png)

---

### 使用

加载器最主要是实现组件的渲染, 编辑组件:
- Script: 选择 Loader
- Parameter: 即需要传入 Loader 的入参, 组件也是根据入参去加载不同插件

Parameter 解析规则如下
```
eg: example/hello?foo=1&bar=2

plugin: example/system
下载 example 目录下的 system.js 插件
如特殊 friday, 则自动补全为 friday/friday

args: {
    'foo': 1,
    'bar': 2,
}
调用 system 插件时, 会向其 constructor 传入该 args 对象
```

![s-param](https://raw.githubusercontent.com/evercyan/cantor/master/resource/0f/0f6a9a4d356bd0fbc473d34fba78a8a4.png)

---

## 插件列表

---

### 今天到周五了没

![s-friday](https://raw.githubusercontent.com/evercyan/cantor/master/resource/f5/f514543f615113e01773c01cd2762ffa.png)

Parameter 参数

- date: 指定日期, 可选, 默认当天 (eg: 2020-12-31)
- bg: 背景颜色, 可选, 默认 '#000'
- color: 字体颜色, 可选, 默认 '#fff'
- position: 组件位置, 可选, (eg: top-left), 设置此值时, 即使用 `透明背景`

---

### 历史上的今天

![s-history](https://raw.githubusercontent.com/evercyan/cantor/master/resource/17/17d88a0ad333b91e4698ea47c324463f.png)

Parameter 参数

- date: 指定日期, 可选, 默认当天 (eg: 2020-12-31)

---

### example

- chart.js 

使用 `DrawContext` 绘制图表

![s-chart](https://raw.githubusercontent.com/evercyan/cantor/master/resource/56/563d4ad1bdbe43e53cd0cf61c2610766.png)

- health.js

通过 `快捷指令` 将 `健康` 数据写入 `iCloud`, `scriptable` 读取显示

写数据需手动触发, 体验不好 

- notify.js

调用系统通知

- system.js

系统信息

- transparent.js 

透明背景示例

---