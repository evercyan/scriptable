/**
 * System
 */

class System {
    constructor(args = {}, loader = null) {
        this.args = args
        this.loader = loader
        this.widgetSize = config.widgetFamily
    }

    // --------------------------------

    getBattery() {
        let level = `${Math.round(Device.batteryLevel() * 100)}%`
        let isCharging = Device.isCharging() ? '正在充电' : '未在充电'
        let isFullyCharged = Device.isFullyCharged() ? '电量满格' : '电量不满'
        return `[${level}] [${isCharging}] [${isFullyCharged}]`
    }

    // --------------------------------

    async render() {
        let widget = new ListWidget()

        widget.addText('[电池] ' + this.getBattery())
        widget.addText(`[系统][${Device.name()}][${Device.systemName()}][${Device.systemVersion()}][${Device.model()}]`)
        widget.addText(`[语言][${Device.language()}][设备区域][${Device.locale()}]`)
        widget.addText(`[音量][${Device.volume()}][亮度][${Device.screenBrightness()}]`)
        widget.addText(`[屏幕尺寸][${Device.screenSize().width}x${Device.screenSize().height}]`)

        widget.addText(`[正立][${Device.isInPortrait()}][倒立][${Device.isInPortraitUpsideDown()}]`)
        widget.addText(`[横向左][${Device.isInLandscapeLeft()}][横向右][${Device.isInLandscapeRight()}]`)
        widget.addText(`[面向上][${Device.isFaceUp()}][面向下][${Device.isFaceDown()}]`)

        widget.addText(`[黑暗模式][${Device.isUsingDarkAppearance()}]`)

        return widget
    }

    // --------------------------------

    async test() {
        if (config.runsInWidget) {
            return
        }

        this.widgetSize = 'large'
        let l = await this.render()
        await l.presentLarge()
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

module.exports = System
