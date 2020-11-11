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

    async getData(desc = true, limit = 0) {
        let list = []
        if (this.fm.fileExists(this.file)) {
            let content = this.fm.readString(this.file)
            list = JSON.parse(content)
            if (list) {
                // 按日期倒序
                list.sort(function (a, b) {
                    return desc ? (a.date < b.date ? 1 : -1) : (a.date > b.date ? 1 : -1)
                })
                if (limit) {
                    list = list.slice(0, limit)
                }
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

        return await this.test()
    }

    getEmoji(count = 0) {
        if (!count) {
            return '💪'
        }
        let repeatNum = Math.ceil(count / 5)
        if (repeatNum > 5) {
            repeatNum = 5
        }
        return '💀'.repeat(repeatNum)
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
        // widget.backgroundColor = Color.black()

        let cigarette = widget.addText('🚬')
        cigarette.centerAlignText()
        cigarette.font = Font.heavyRoundedSystemFont(50)

        widget.addSpacer(5)

        let count = await this.getTodayCount()

        let number = widget.addText(count.toString())
        number.centerAlignText()
        // number.textColor = Color.white()
        number.font = Font.heavyRoundedSystemFont(30)

        widget.addSpacer(5)

        let emoji = widget.addText(this.getEmoji(count))
        emoji.centerAlignText()
        emoji.font = Font.boldSystemFont(10)

        return widget
    }

    // renderMedium ...
    async renderMedium() {
        let widget = new ListWidget()
        widget.setPadding(0, 0, 0, 0)
        // widget.backgroundColor = Color.black()

        let data = await this.getData(false, 7)
        if (!data) {
            return await this.renderSmall()
        }
        let title = (await this.getTodayCount()).toString() + ' 🚬'
        let list = []
        for (let info of data) {
            list.push({
                'title': this.loader.getDate(info.date, 'day'),
                'count': info.count.toString(),
            })
        }
        let options = {
            'widgetSize': this.widgetSize,
        }

        widget.backgroundImage = await this.loader.drawChart(title, list, options)
        return widget
    }

    // renderMedium ...
    async renderLarge() {
        let widget = new ListWidget()
        widget.setPadding(0, 0, 0, 0)
        widget = this.loader.background(widget, this.args)

        let cigarette = widget.addText('🚬')
        cigarette.centerAlignText()
        cigarette.font = Font.heavyRoundedSystemFont(80)

        widget.addSpacer(5)

        let count = await this.getTodayCount()

        let number = widget.addText(count.toString())
        number.centerAlignText()
        // number.textColor = Color.white()
        number.font = Font.heavyRoundedSystemFont(40)

        widget.addSpacer(5)

        let emoji = widget.addText(this.getEmoji(count))
        emoji.centerAlignText()
        emoji.font = Font.boldSystemFont(15)

        widget.addSpacer(5)

        let data = await this.getData(false, 7)
        let list = []
        for (let info of data) {
            list.push({
                'title': this.loader.getDate(info.date, 'day'),
                'count': info.count.toString(),
            })
        }
        let chart = widget.addImage(await this.loader.drawChart('', list, {
            'widgetSize': 'medium',
        }))
        chart.centerAlignImage()

        return widget
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

module.exports = Smoke
