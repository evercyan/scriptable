/**
 * Health
 */

class Health {
    constructor(args = {}, loader = null) {
        this.args = args
        this.loader = loader
        this.widgetSize = config.widgetFamily
    }

    // --------------------------------

    async render() {
        let widget = new ListWidget()
        widget.setPadding(0, 0, 0, 0)
        widget.backgroundColor = Color.black()

        const fm = FileManager.iCloud();
        const data = fm.readString(fm.joinPath(fm.bookmarkedPath('Shortcuts'), 'step.json'))
        console.log('data: ' + data)

        return widget
    }

    // --------------------------------

    async test() {
        if (config.runsInWidget) {
            return
        }

        // this.widgetSize = 'small'
        // let s = await this.render()
        // await s.presentSmall()

        // this.widgetSize = 'medium'
        // let m = await this.render()
        // await m.presentMedium()

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

module.exports = Health
