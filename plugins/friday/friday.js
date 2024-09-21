/**
 * Friday
 *
 * eg:
 * - 指定日期: friday/friday?date=2020-12-31
 * - 透明背景: friday?position=top-left
 * - 指定颜色: friday?bg=000000&color=ffffff
 *
 * parameter:
 * - date: 指定日期, 可选, 默认当天 (eg: 2020-12-31)
 * - bg: 背景颜色, 可选, 默认 '#000'
 * - color: 字体颜色, 可选, 默认 '#fff'
 * - position: 组件位置, 可选, (eg: top-left), 设置此值时, 即使用`透明背景`
 */

class Friday {
    // 周缩写
    weekAbbrs = [
        'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT',
    ]
    // 表情文本配置
    weekTexts = {
        'DEFAULT': {
            'text': `to friday`,
            'emoji': '🤮',
        },
        'FRI': {
            'text': `it's friday`,
            'emoji': '🎉🎉🎉',
        },
        'SAT': {
            'text': `happy weekend`,
            'emoji': '🥳🥳🥳',
        },
        'SUN': {
            'text': `happy weekend`,
            'emoji': '🥳🥳🥳',
        },
    }
    // 字体色
    color = Color.white()
    // 背景色
    bgColor = Color.black()

    constructor(args = {}, loader = null) {
        this.args = args
        this.loader = loader
        this.widgetSize = config.widgetFamily
    }

    // --------------------------------

    // getDateInfo 获取当前日期信息, 也可根据入参进行初始化
    getDateInfo() {
        let date = new Date()
        if (typeof (this.args.date) != 'undefined') {
            date = new Date(this.args.date)
        }
        let dayOfWeek = date.getDay()
        let weekAbbr = this.weekAbbrs[dayOfWeek]

        let dateInfo = {
            dayOfWeek: dayOfWeek,   // 周几
            weekAbbr: weekAbbr,     // 周几缩写
        }
        if (this.weekTexts[weekAbbr]) {
            dateInfo['textInfo'] = this.weekTexts[weekAbbr]
        } else {
            let weekText = this.weekTexts['DEFAULT']
            let nextFriday = (5 - dayOfWeek + 7) % 7
            let daysText = nextFriday === 1 ? 'day' : 'days'
            dateInfo['textInfo'] = {
                'text': `${nextFriday} ${daysText} ${weekText['text']}`,
                'emoji': weekText['emoji'].repeat(nextFriday),
            }
        }

        return dateInfo
    }

    // --------------------------------

    async render() {
        if (this.widgetSize === 'medium') {
            return await this.renderMedium()
        } else if (this.widgetSize === 'large') {
            return await this.renderLarge()
        } else {
            return await this.renderSmall()
        }
    }

    // renderSmall 渲染小尺寸组件, 默认 multiple 1, 大尺寸时 multiple 为 2
    async renderSmall(multiple = 1) {
        let dateInfo = this.getDateInfo()
        let widget = new ListWidget()
        widget.setPadding(0, 0, 0, 0)

        try {
            if (this.args.color) {
                // 字体颜色
                this.color = new Color(this.args.color, 1)
            }
            if (this.args.position) {
                // 透明背景
                widget.backgroundImage = await this.loader.getTransparentBg(
                    this.widgetSize,
                    this.args.position
                )
            } else {
                // 背景色
                if (this.args.bg) {
                    this.bgColor = new Color(this.args.bg, 1)
                }
                widget.backgroundColor = this.bgColor
            }
        } catch (e) {
            return this.loader.fail(e.message)
        }

        // 周缩写
        let weekArea = widget.addText(dateInfo.weekAbbr)
        weekArea.centerAlignText()
        weekArea.textColor = this.color
        weekArea.font = Font.heavyRoundedSystemFont(40 * multiple)

        widget.addSpacer(5 * multiple)

        // 文本
        let textArea = widget.addText(dateInfo['textInfo']['text'])
        textArea.centerAlignText()
        textArea.textColor = this.color
        textArea.font = Font.heavyRoundedSystemFont(15 * multiple)

        widget.addSpacer(10 * multiple)

        // 表情
        let emojiArea = widget.addText(dateInfo['textInfo']['emoji'])
        emojiArea.centerAlignText()
        emojiArea.font = Font.boldSystemFont(25 * multiple)

        return widget
    }

    async renderMedium() {
        return await this.renderSmall()
    }

    async renderLarge() {
        return await this.renderSmall(2)
    }

    // --------------------------------

    async test() {
        if (config.runsInWidget) {
            return
        }
        this.widgetSize = 'small'
        let s = await this.render()
        await s.presentSmall()

        this.widgetSize = 'medium'
        let m = await this.render()
        await m.presentMedium()

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

module.exports = Friday
