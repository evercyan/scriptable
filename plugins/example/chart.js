/**
 * Chart
 * 
 * eg: 
 * - 图表类型: example/chart?mode=line
 * 
 * parameter:
 * - mode: 图表类型, 默认 line
 *     - line: 折线图
 *     - bar: 竖状图
 */

class Chart {
    constructor(args = {}, loader = null) {
        this.args = args
        this.loader = loader
        this.widgetSize = config.widgetFamily

        this.mode = this.args.mode ? this.args.mode : 'line'
    }

    // --------------------------------

    async getData() {
        let list = []
        for (let i = 1; i <= 10; i++) {
            let title = i < 10 ? '0' + i : i.toString()
            list.push({
                'title': title,
                'count': Math.round(Math.random() * 100),
            })
        }
        return list
    }

    // --------------------------------

    async render() {
        let widget = new ListWidget()
        widget.setPadding(0, 0, 0, 0)
        widget.backgroundColor = Color.black()

        let title = '图表示例'
        let list = await this.getData()
        let options = {
            'line': {
                'mode': 'line',
                'vertLineConfig': {
                    'width': 0.5,
                    'color': 'ffffff',
                }
            },
            'bar': {
                'mode': 'bar',
                'vertLineConfig': {
                    'width': 20,
                    'color': '33cc33'
                }
            }
        }
        let option = options[this.mode]
        option.widgetSize = this.widgetSize
        widget.backgroundImage = await this.loader.drawChart(
            title, list, option
        )
        return widget
    }

    // --------------------------------

    async test() {
        if (config.runsInWidget) {
            return
        }

        this.mode = 'line'

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

module.exports = Chart
