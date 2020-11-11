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

        this.fm = FileManager.iCloud()
        this.file = this.fm.joinPath(this.loader.docPath, 'smoke.json')
        this.loader.log('constructor file', this.file)
    }

    // --------------------------------

    async getData() {
        let list = []
        if (this.fm.fileExists(this.file)) {
            let content = this.fm.readString(this.file)
            list = JSON.parse(content)
            if (list) {
                // 按日期倒序
                list.sort(function (a, b) {
                    return a.date < b.date ? 1 : -1
                })
            }
        }
        this.loader.log('getData list', list)
        return list
    }

    async getTodayCount() {
        let list = await this.getData()
        let date = this.loader.getDate()
        for (let info of list) {
            if (info.date == date) {
                return info.count
            }
        }
        return 0
    }

    async setTodayCount() {
        let list = await this.getData()
        this.loader.log('setTodayCount list begin', list)
        let date = this.loader.getDate()
        let isExist = false
        for (let i = 0; i < list.length; i++) {
            if (list[i].date == date) {
                list[i].count++
                isExist = true
                break
            }
        }
        if (!isExist) {
            list.unshift({
                'date': date,
                'count': 1,
            })
        }
        this.loader.log('setTodayCount list end', list)
        this.fm.writeString(this.file, JSON.stringify(list))
    }

    getEmoji(count = 0) {
        if (count > 20) {
            return '💀💀💀💀'
        } else if (count > 10) {
            return '😡🤬😡'
        } else if (count > 5) {
            return '😠😠'
        } else if (count > 0) {
            return '😳'
        }
        return '😊'
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
        widget.backgroundColor = Color.black()
        widget.refreshAfterDate = new Date(Date.now() + 1000 * 20)

        let cigarette = widget.addText('🚬')
        cigarette.centerAlignText()
        cigarette.font = Font.heavyRoundedSystemFont(50)

        widget.addSpacer(5)

        let count = await this.getTodayCount()

        let number = widget.addText(count.toString())
        number.centerAlignText()
        number.textColor = Color.white()
        number.font = Font.heavyRoundedSystemFont(30)

        widget.addSpacer(5)

        let emoji = widget.addText(this.getEmoji(count))
        emoji.centerAlignText()
        emoji.font = Font.boldSystemFont(20)

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

    // smoke 点击组件, 触发吸烟动作回调
    async smoke() {
        let selected = await this.loader.dialog(
            'Are you smoking now?',
            ['Yes 🐶'],
            '',
            'No 👋'
        )
        if (selected == -1) {
            return
        }
        return await this.setTodayCount()
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
