/**
 * Smoke 
 * 
 * 纪录你的每一次烟雾缭绕的成仙之旅
 */

class Smoke {

    constructor(args = {}, loader = null) {
        this.args = args
        this.loader = loader
        this.widgetSize = config.widgetFamily
    }

    // --------------------------------

    // render ...
    async render() {
        if (this.widgetSize === 'medium') {
            return await this.renderMedium()
        } else if (this.widgetSize === 'large') {
            return await this.renderLarge()
        } else {
            return await this.renderSmall()
        }
    }

    // renderSmall ...
    async renderSmall() {
        let widget = new ListWidget()
        widget.setPadding(0, 0, 0, 0)

        let cigarette = widget.addText('🚭')
        cigarette.centerAlignText()
        cigarette.font = Font.heavyRoundedSystemFont(50)

        widget.addSpacer(5)

        let count = widget.addText(dateInfo.weekAbbr)
        count.centerAlignText()
        count.font = Font.heavyRoundedSystemFont(40)

        widget.addSpacer(5)

        let emoji = widget.addText('🤬🤬🤬')
        emoji.centerAlignText()
        emoji.font = Font.boldSystemFont(25)

        return widget
    }

    // renderMedium ...
    async renderMedium() {
        return await this.renderSmall()
    }

    // renderMedium ...
    async renderLarge() {
        return await this.renderSmall()
    }

    // --------------------------------

    async test() {
        if (config.runsInWidget) {
            return
        }

        this.widgetSize = 'small'
        let s = await this.render()
        await s.presentSmall()

        // this.widgetSize = 'medium'
        // let m = await this.render()
        // await m.presentMedium()

        // this.widgetSize = 'large'
        // let l = await this.render()
        // await l.presentLarge()
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

module.exports = Smoke
