/**
 * History
 * 
 * eg: 
 * - 指定日期: history?date=2020-12-31
 * 
 * parameter:
 * - date: 指定日期, 可选, 默认当天 (eg: 2020-12-31)
 */

class History {
    title = '历史上的今天'
    logo = 'https://gitee.com/evercyan/cantor/raw/master/resource/94/94b6d8f2a46b5e95aff9310605058731.png'

    // 缓存 key
    cachePrefix = "evercyan:history"

    constructor(args = {}, loader = null) {
        this.args = args
        this.loader = loader
        this.widgetSize = config.widgetFamily
    }

    // --------------------------------

    // getBaiduUrl 获取百度搜索链接
    getBaiduUrl(keyword) {
        return `https://www.baidu.com/s?ie=UTF-8&wd=${encodeURIComponent(keyword)}`
    }

    // getApiUrl 获取 api 链接
    getApiUrl(month, day) {
        return `http://api.avatardata.cn/HistoryToday/LookUp?key=99d502aa72fc4918a3dc0c7fe68f2822&yue=${month}&ri=${day}&type=1&page=1&rows=50`
    }

    // getDate 拼接日期
    getDate(year, month, day) {
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return year + '-' + month + '-' + day;
    }

    // getTitle 获取标题
    getTitle(title) {
        return title + Array(40).join(' ')
    }

    // getImage 获取图片
    async getImage(url) {
        return await this.loader.get(url, this.loader.loadImage)
    }

    // getData 获取数据
    async getData() {
        let date = new Date()
        if (typeof (this.args.date) != 'undefined') {
            date = new Date(this.args.date)
        }
        let month = date.getMonth() + 1
        let day = date.getDate()

        let key = `${this.cachePrefix}:${month}:${day}`
        this.loader.log('getData key', key)

        let list = [];
        try {
            let cache = Keychain.get(key)
            this.loader.log('getData cache', cache)
            if (cache) {
                list = JSON.parse(cache)
            }
        } catch (e) { }

        if (list.length <= 0) {
            try {
                let url = this.getApiUrl(month, day)
                let res = await this.loader.get(url, this.loader.loadJSON)
                list = res['result']
            } catch (e) { }
            for (let i = 0; i < list.length; i++) {
                list[i]['date'] = this.getDate(list[i]['year'], list[i]['month'], list[i]['day'])
            }
            this.loader.log('getData list', list)
            Keychain.set(key, JSON.stringify(list))
        }

        // 打乱顺序
        for (let i = list.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }

        return list
    }

    // --------------------------------

    // 渲染页面
    async render() {
        if (this.widgetSize === 'medium') {
            return await this.renderMedium(2)
        } else if (this.widgetSize === 'large') {
            return await this.renderLarge(6)
        } else {
            return await this.renderSmall()
        }
    }

    // renderSmall ...
    async renderSmall() {
        let widget = new ListWidget()
        widget = await this.renderHeader(widget)

        let list = await this.getData()
        if (list.length <= 0) {
            return widget
        }
        let item = list[0]

        let title = widget.addText(this.getTitle(item['title']))
        title.font = Font.lightSystemFont(16)
        title.lineLimit = 3

        widget.addSpacer(10)

        let date = widget.addText(item['date'])
        date.font = Font.lightSystemFont(10)
        date.textOpacity = 0.5
        date.lineLimit = 1

        widget.url = this.getBaiduUrl(item['date'] + ' ' + item['title'])
        return widget
    }

    // renderMedium 渲染中尺寸组件
    async renderMedium(pageSize = 2) {
        return await this.renderLarge(pageSize)
    }

    // renderMedium 渲染大尺寸组件
    async renderLarge(pageSize = 6) {
        let widget = new ListWidget()
        widget = await this.renderHeader(widget)
        let list = await this.getData()
        for (let i in list) {
            if (i >= pageSize) {
                break
            }
            widget = await this.renderRow(widget, list[i])
        }
        return widget
    }

    // renderHeader ...
    async renderHeader(widget) {
        let header = widget.addStack()
        header.centerAlignContent()

        let logo = header.addImage(await this.getImage(this.logo))
        logo.imageSize = new Size(20, 20)
        logo.cornerRadius = 4

        header.addSpacer(10)

        let title = header.addText(this.title)
        title.textOpacity = 0.7
        title.font = Font.heavyRoundedSystemFont(15)

        widget.addSpacer(20)
        return widget
    }

    async renderRow(widget, item) {
        let body = widget.addStack()
        body.url = this.getBaiduUrl(item['date'] + ' ' + item['title'])

        let row = body.addStack()
        row.layoutVertically()

        let title = row.addText(this.getTitle(item['title']))
        title.font = Font.lightSystemFont(14)
        title.lineLimit = 1

        row.addSpacer(5)

        let date = row.addText(item['date'])
        date.font = Font.lightSystemFont(10)
        date.textOpacity = 0.6
        date.lineLimit = 2

        widget.addSpacer(10)
        return widget
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

module.exports = History
