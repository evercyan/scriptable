/**
 * Transparent
 * 所谓透明背景, 即需要先上传一张手机空屏截图
 * 会根据组件大小和位置, 生成各 `大小-位置` 的背景图片
 * 应用组件时, 和手机背景重合, 营造透明效果
 * 
 * eg: 
 * - example/transparent?position=top-left
 * 
 * parameter:
 * - position: 组件位于屏幕的位置 (eg: top-left) (下面为各尺寸组件可选的位置及说明)
 * 
 * {
 *     'small': [           // 小组件
 *         'top-left',      // 上左
 *         'top-right',     // 上右
 *         'middle-left',   // 中左
 *         'middle-right',  // 中右
 *         'bottom-left',   // 下左
 *         'bottom-right',  // 下右
 *     ],
 *     'medium': [          // 中组件
 *         'top',           // 上
 *         'middle',        // 中
 *         'bottom',        // 下
 *     ],
 *     'large': [           // 大组件
 *         'top',           // 上
 *         'bottom',        // 下
 *     ]
 * }
 * 
 */

class Transparent {
    constructor(args = {}, loader = null) {
        this.args = args
        this.loader = loader
        this.widgetSize = config.widgetFamily
    }

    // --------------------------------

    async render() {
        try {
            let widget = new ListWidget()

            // 获取透明背景图片
            widget.backgroundImage = await this.loader.getTransparentBg(
                this.widgetSize,    // 组件尺寸
                this.args.position  // 组件位置
            )

            let text = widget.addText("❤️\n\nhello world")
            text.centerAlignText()
            text.font = Font.regularRoundedSystemFont(30)

            return widget
        } catch (e) {
            return this.loader.fail(e.message)
        }
    }

    // --------------------------------

    async test() {
        if (config.runsInWidget) {
            return
        }

        this.widgetSize = 'large'
        this.args.position = 'top'
        let w = await this.render()
        await w.presentLarge()
    }

    async init() {
        if (config.runsInApp) {
            return
        }
        let widget = await this.render()
        Script.setWidget(widget)
        Script.complete()
    }
}

module.exports = Transparent
