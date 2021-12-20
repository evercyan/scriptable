<div align="center">

![scriptable](logo.png)

iOS scriptable 神器也!!!

</div>

---

## Install

- iOS App Store 下载应用 [Scriptable](https://apps.apple.com/cn/app/scriptable/id1405459188)
- iOS Safari 打开链接 [加载器](https://cdn.jsdelivr.net/gh/evercyan/scriptable/loader.js), 下载后通过 `Scriptable` 打开安装
- 回主屏幕, 安装组件, 如下图

## Usage

加载器 (Loader) 统一应用入口, 聚合了 `插件管理` `组件自更新` `透明背景` 等等功能

![s-menu](https://cdn.jsdelivr.net/gh/evercyan/repository/resource/b3/b3dabe04475811278dbcc53db57f0a11.png)

---

- 插件管理

渲染已安装插件列表
支持已安装插件的 `运行` `更新` `删除` 等

- 透明背景

即上传空屏截图, 按组件大小 `small` `medium` `large` 对应的位置对截图进行裁剪, 生成相应的背景图
需要使用透明背景组件时, 只需取其对应大小和位置的背景图片即可

```javascript
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

---

加载器最主要是实现组件的渲染, 编辑组件:
- Script: 选择 Loader
- Parameter: 即需要传入 Loader 的入参, 组件也是根据入参去加载不同插件

Parameter 解析规则如下
```
e.g. example/hello?foo=1&bar=2

plugin: example/system
下载 example 目录下的 system.js 插件
如特殊 friday, 则自动补全为 friday/friday

args: {
    'foo': 1,
    'bar': 2,
}
调用 system 插件时, 会向其 constructor 传入该 args 对象
```

![s-param](https://cdn.jsdelivr.net/gh/evercyan/repository/resource/0f/0f6a9a4d356bd0fbc473d34fba78a8a4.png)

---

## Plugin

### 今天到周五了没

![s-friday](https://cdn.jsdelivr.net/gh/evercyan/repository/resource/f5/f514543f615113e01773c01cd2762ffa.png)

Parameter 参数

- date: 指定日期, 可选, 默认当天 (e.g. 2020-12-31)
- bg: 背景颜色, 可选, 默认 '#000'
- color: 字体颜色, 可选, 默认 '#fff'
- position: 组件位置, 可选, (e.g. top-left), 设置此值时, 即使用 `透明背景`

### 历史上的今天

![s-history](https://cdn.jsdelivr.net/gh/evercyan/repository/resource/17/17d88a0ad333b91e4698ea47c324463f.png)

Parameter 参数

- date: 指定日期, 可选, 默认当天 (e.g. 12-31)
