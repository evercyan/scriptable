// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: home;

// Loader
// https://github.com/evercyan/scriptable
// 插件加载器, 提供如插件下载更新调试等功能

// 插件单独使用时, 依赖 loader 的部分将无法生效, 请自行调整
// 应用内调试: await new Test().test()
// 组件单独使用: await new Test(args.widgetParameter).init()

// 可通过 widget.refreshAfterDate = new Date(Date.now() + 1000 * 20) 减小组件刷新间隔

class Loader {
    // 调试模式
    debugMode = true

    loadString = 'string'
    loadJSON = 'json'
    loadImage = 'image'

    // 组件大小
    widgetSizeList = [
        'small', 'medium', 'large',
    ]
    // 组件位置
    widgetPositions = {
        'small': [
            'top-left', 'top-right',        // 上左, 上右
            'middle-left', 'middle-right',  // 中左, 中右
            'bottom-left', 'bottom-right',  // 下左, 下右
        ],
        'medium': [
            'top', 'middle', 'bottom',      // 上中下
        ],
        'large': [
            'top', 'bottom',                // 上下
        ]
    }
    // 截图尺寸
    phoneSizes = {
        '2532': {
            'models': ['12', '12 Pro'],
            'small': { 'w': 474, 'h': 474 },
            'medium': { 'w': 1014, 'h': 474 },
            'large': { 'w': 1014, 'h': 1062 },
            'left': 78,
            'right': 618,
            'top': 231,
            'middle': 819,
            'bottom': 1407
        },
        '2688': {
            'models': ['Xs Max', '11 Pro Max'],
            'small': { 'w': 507, 'h': 507 },
            'medium': { 'w': 1080, 'h': 507 },
            'large': { 'w': 1080, 'h': 1137 },
            'left': 81,
            'right': 654,
            'top': 228,
            'middle': 858,
            'bottom': 1488
        },
        '1792': {
            'models': ['11', 'Xr'],
            'small': { 'w': 338, 'h': 338 },
            'medium': { 'w': 720, 'h': 338 },
            'large': { 'w': 720, 'h': 758 },
            'left': 54,
            'right': 436,
            'top': 160,
            'middle': 580,
            'bottom': 1000
        },
        '2436': {
            'models': ['X', 'Xs', '11 Pro'],
            'small': { 'w': 465, 'h': 465 },
            'medium': { 'w': 987, 'h': 465 },
            'large': { 'w': 987, 'h': 1035 },
            'left': 69,
            'right': 591,
            'top': 213,
            'middle': 783,
            'bottom': 1353
        },
        '2208': {
            'models': ['6+', '6s+', '7+', '8+'],
            'small': { 'w': 471, 'h': 471 },
            'medium': { 'w': 1044, 'h': 471 },
            'large': { 'w': 1044, 'h': 1071 },
            'left': 99,
            'right': 672,
            'top': 114,
            'middle': 696,
            'bottom': 1278
        },
        '1334': {
            'models': ['6', '6s', '7', '8'],
            'small': { 'w': 296, 'h': 296 },
            'medium': { 'w': 642, 'h': 296 },
            'large': { 'w': 642, 'h': 648 },
            'left': 54,
            'right': 400,
            'top': 60,
            'middle': 412,
            'bottom': 764
        },
        '1136': {
            'models': ['5', '5s', '5c', 'SE'],
            'small': { 'w': 282, 'h': 282 },
            'medium': { 'w': 584, 'h': 282 },
            'large': { 'w': 584, 'h': 622 },
            'left': 30,
            'right': 332,
            'top': 59,
            'middle': 399,
            'bottom': 399
        }
    }
    // 屏幕尺寸
    screenSizes = {
        // XR, 11, 11 Pro Max
        '414x896': {
            'small': [169, 169], 'medium': [360, 169], 'large': [360, 376],
        },
        // X, XS, 11 Pro
        '375x812': {
            'small': [155, 155], 'medium': [329, 155], 'large': [329, 345],
        },
        // 6/7/8(S) Plus
        '414x736': {
            'small': [159, 159], 'medium': [348, 159], 'large': [348, 357],
        },
        // 6/7/8(S) and 2nd Gen SE
        '375x667': {
            'small': [148, 148], 'medium': [322, 148], 'large': [322, 324],
        },
        // 1st Gen SE
        '320x568': {
            'small': [141, 141], 'medium': [291, 141], 'large': [291, 299],
        },
    }

    // --------------------------------

    constructor() {
        this.user = 'evercyan'
        this.repo = 'scriptable'
        this.repoUrl = `https://github.com/${this.user}/${this.repo}`
        this.downloadUrl = `https://gitee.com/${this.user}/${this.repo}`

        this.fm = FileManager.local()
        this.docPath = this.fm.joinPath(this.fm.documentsDirectory(), this.user)
        if (!this.fm.fileExists(this.docPath)) {
            this.fm.createDirectory(this.docPath, true)
        }

        this.initConfig()
    }

    // --------------------------------

    /**
     * 初始化配置
     *
     * eg: example/hello?foo=1&bar=2
     *
     * plugin: example/hello
     * 下载 example 目录下的 hello.js 插件
     *
     * args: {
     *      'foo': 1,
     *      'bar': 2,
     * }
     * 调用 hello 插件时, 会向其 constructor 传入该 args 对象
     *
     * fileName: evercyan/example@hello.scriptable
     * 本地存储时, 会将 / 替换为 @
     */
    initConfig(arg = '') {
        if (arg == '') {
            arg = args.widgetParameter || args['queryParameters']['__widget__']
        }
        this.log('initConfig begin', arg)

        this.plugin = 'friday/friday'
        this.args = {}
        if (arg) {
            let params = arg.split('?')
            if (params[0].indexOf('/') !== -1) {
                this.plugin = params[0]
            } else {
                // 不存在 /, 如 friday, 则解析成 friday/friday
                this.plugin = params[0] + '/' + params[0]
            }
            if (params.length === 2) {
                let vars = params[1].split('&');
                for (let i = 0; i < vars.length; i++) {
                    let pair = vars[i].split('=');
                    this.args[pair[0]] = pair[1]
                }
            }
        }

        this.fileName = this.getFileName(this.plugin)
        this.filePath = this.fm.joinPath(this.docPath, this.fileName)
        this.log('initConfig end', {
            'plugin': this.plugin,
            'args': this.args,
            'fileName': this.fileName,
            'filePath': this.filePath,
        })
    }

    // --------------------------------

    // log 输出日志
    log() {
        let params = []
        for (let i = 0; i < arguments.length; i++) {
            if (typeof (arguments[i]) === 'string') {
                params.push(arguments[i])
            } else {
                params.push(JSON.stringify(arguments[i]))
            }
        }
        console.log(params.join(' '))
    }

    // get 请求
    async get(url, load = this.loadString) {
        this.log('get url', url)
        let req = new Request(url)
        req.headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/85.0.4183.102'
        }

        let resp
        if (load == this.loadJSON) {
            resp = await req.loadJSON()
        } else if (load == this.loadImage) {
            resp = await req.loadImage()
        } else {
            resp = await req.loadString()
        }
        this.debugMode && this.log('get resp', resp)

        if (req.response['statusCode'] !== 200) {
            throw new Error(`请求错误, 状态码: ${req.response['statusCode']}`)
        }

        return resp
    }

    // getDate ...
    getDate(dateText = '', event = 'date') {
        let date = new Date()
        if (dateText) {
            date = new Date(dateText)
        }
        let month = date.getMonth() + 1
        if (month < 10) {
            month = '0' + month
        }
        let day = date.getDate()
        if (day < 10) {
            day = '0' + day
        }
        let resp = `${date.getFullYear()}-${month}-${day}`
        switch (event) {
            case 'year':
                resp = date.getFullYear().toString()
                break
            case 'month':
                resp = month.toString()
                break
            case 'day':
                resp = day.toString()
                break
        }
        return resp
    }

    // dialog 对话框
    async dialog(title = '', actions = [], message = '', cancel = '关闭') {
        let alert = new Alert()
        alert.title = title
        if (message) {
            alert.message = message
        }
        if (actions) {
            for (let action of actions) {
                alert.addAction(action)
            }
        }
        if (cancel) {
            alert.addCancelAction(cancel)
        }
        return await alert.presentAlert()
    }

    // fail ...
    async fail(err) {
        let widget = new ListWidget()
        let emoji = widget.addText('🥺')
        emoji.centerAlignText()
        emoji.font = Font.boldSystemFont(30)
        widget.addSpacer(15)
        let text = widget.addText(err)
        text.centerAlignText()
        text.textColor = Color.red()
        text.font = Font.heavyRoundedSystemFont(15)
        return widget
    }

    background(widget, args = {}) {
        if (args.position && args.widgetSize) {
            // 透明背景
            widget.backgroundImage = await this.getTransparentBg(
                args.widgetSize,
                args.position
            )
        } else if (args.bg) {
            // 背景色
            widget.backgroundColor = new Color(args.bg, 1)
        }
        return widget
    }

    // -------------------------------- 透明背景

    // getTransparentBgPath ...
    getTransparentBgPath(widgetSize, widgetPosition) {
        return this.fm.joinPath(this.docPath, `${widgetSize}-${widgetPosition}.jpg`)
    }

    // getTransparentBackground 获取透明背景图
    async getTransparentBg(widgetSize = '', widgetPosition = '') {
        this.log('getTransparentBg', widgetSize, widgetPosition)
        if (!this.widgetPositions[widgetSize]
            || this.widgetPositions[widgetSize].indexOf(widgetPosition) === -1) {
            throw new Error('请设置有效的组件位置')
        }
        let imgPath = this.getTransparentBgPath(widgetSize, widgetPosition)
        this.log('getTransparentBg imgPath', imgPath)
        if (!this.fm.fileExists(imgPath)) {
            return '请设置透明背景'
        }
        return this.fm.readImage(imgPath)
    }

    // --------------------------------

    // drawChart
    // options
    // - mode: 图表类型, 默认 line
    //   - line 折线图
    //   - bar 竖状图
    async drawChart(title = '', list = [], options = {}) {
        this.log('drawChart options', options)
        // 图表配置
        let mode = options.mode ? options.mode : 'line'
        let widgetSize = options.widgetSize ? options.widgetSize : 'medium'
        // 标题
        let titleConfig = options.titleConfig ? options.titleConfig : {
            'size': 36,
            'font': Font.semiboldSystemFont(36),
            // 'color': '33cc33',
            'coord': new Point(30, 30),
        }
        this.log('drawChart titleConfig', titleConfig)
        // 坐标点文本
        let xConfig = options.xConfig ? options.xConfig : {
            'size': 22,
            'font': Font.systemFont(22),
            // 'color': 'ffffff',
        }
        this.log('drawChart xConfig', xConfig)
        // 坐标点竖线
        let vertLineConfig = options.vertLineConfig ? options.vertLineConfig : {
            'width': 0.5,
            // 'color': 'ffffff',
        }
        this.log('drawChart vertLineConfig', vertLineConfig)
        // 数据点文本
        let textConfig = options.textConfig ? options.textConfig : {
            'size': 22,
            'font': Font.systemFont(22),
            // 'color': 'ffffff',
        }
        this.log('drawChart textConfig', textConfig)
        // 数据点连线
        let lineConfig = options.lineConfig ? options.lineConfig : {
            'width': 2,
            'color': '33cc33',
        }
        this.log('drawChart lineConfig', lineConfig)

        let widgetPointSize = this.getWidgetPointSize(widgetSize)
        let wpWidth = widgetPointSize.width * 2
        let wpHeight = widgetPointSize.height * 2

        // 组件内边距
        let widgetPaddingX = 80
        let widghtPaddingY = 30
        // 元素外边距
        let elementMargin = 15

        // --------------------------------

        // 数据
        // 数据最大值
        let countMax
        list.forEach(item => {
            if (typeof (countMax) == 'undefined' || parseInt(item['count']) > countMax) {
                countMax = parseInt(item['count'])
            }
        })
        // 有 xCount 个横轴坐标点
        let xCount = list.length
        // 坐标点间距 xSpace = (组件宽度 - 组件内边距*2) / (xCount - 1)
        let xSpace = (wpWidth - widgetPaddingX * 2) / (xCount - 1)
        // 坐标点在组件内的纵坐标
        let xCoordY = wpHeight - widghtPaddingY - xConfig.size
        this.log('drawChart x', {
            'xCount': xCount,
            'xSpace': xSpace,
            'xCoordY': xCoordY,
            'countMax': countMax,
        })
        // 图表下边纵坐标
        let graphBottomY = wpHeight - widghtPaddingY - xConfig.size - elementMargin
        // 图表高度
        let graphHeight = wpHeight - widghtPaddingY - titleConfig.size - xConfig.size - textConfig.size - elementMargin * 3 - titleConfig.coord.y

        // --------------------------------

        // 开始绘制
        let context = new DrawContext()
        context.size = new Size(wpWidth, wpHeight)
        context.opaque = false

        // 标题
        context.setFont(titleConfig.font)
        if (titleConfig.color) {
            context.setTextColor(new Color(titleConfig.color, 1))
        }
        context.drawText(title, titleConfig.coord)

        context.setTextAlignedCenter()

        // 图表区
        for (let i = 0; i < xCount; i++) {
            let title = (list[i].title).toString()
            let count = (list[i].count).toString()

            // 横轴坐标点文本
            context.setFont(xConfig.font)
            if (xConfig.color) {
                context.setTextColor(new Color(xConfig.color, 1))
            }
            let xCoordX = widgetPaddingX + xSpace * i - xConfig.size / 2
            context.drawText(title, new Point(xCoordX, xCoordY))

            // 横轴竖线或竖状
            let vertCoordX = widgetPaddingX + xSpace * i - vertLineConfig.width / 2
            if (mode == 'bar') {
                vertCoordX = widgetPaddingX + xSpace * i
            }
            let vertPointCoordY = graphBottomY - (count / countMax) * graphHeight
            let vertPointBegin = new Point(vertCoordX, graphBottomY) // 起始点
            let vertPointEnd = new Point(vertCoordX, vertPointCoordY) // 结束点
            context = this.drawLine(
                context,
                vertPointBegin,
                vertPointEnd,
                vertLineConfig.color,
                vertLineConfig.width
            )

            // 数据点文本
            context.setFont(textConfig.font)
            if (textConfig.color) {
                context.setTextColor(new Color(textConfig.color, 1))
            }
            let textPoint = new Point(
                widgetPaddingX + xSpace * i - textConfig.size / 2,
                vertPointCoordY - elementMargin - textConfig.size
            )
            context.drawText(count, textPoint)

            // 如果是折线图
            if (mode !== 'bar') {
                // 数据点连线
                if (i < xCount - 1) {
                    let textPointBegin = new Point(vertCoordX, vertPointCoordY)
                    let nextVertPointCoordY = graphBottomY - (list[i + 1].count / countMax) * graphHeight
                    let textPointEnd = new Point(vertCoordX + xSpace, nextVertPointCoordY)
                    context = this.drawLine(
                        context,
                        textPointBegin,
                        textPointEnd,
                        lineConfig.color,
                        lineConfig.width
                    )
                }
            }
        }

        return context.getImage()
    }

    // drawLine ...
    drawLine(context, pointBegin, pointEnd, color, width) {
        let path = new Path()
        path.move(pointBegin)
        path.addLine(pointEnd)
        context.addPath(path)
        if (color) {
            context.setStrokeColor(new Color(color, 1))
        }
        context.setLineWidth(width)
        context.strokePath()
        return context
    }

    // drawTextInRect ...
    drawTextInRect(context, rect, text, font, color) {
        context.setFont(font)
        if (color) {
            context.setTextColor(new Color(color, 1))
        }
        context.drawTextInRect(text.toString(), rect)
        return context
    }

    // getWidgetPointSize 获取组件 point 宽高
    getWidgetPointSize(widgetSize = (config.runsInWidget ? config.widgetFamily : null)) {
        const screenSize = `${Device.screenSize().width}x${Device.screenSize().height}`
        if (!this.screenSizes[screenSize]
            || !this.screenSizes[screenSize][widgetSize]) {
            return null
        }
        return new Size(...this.screenSizes[screenSize][widgetSize])
    }

    // --------------------------------

    // getFileName ...
    getFileName(pluginName) {
        return `${pluginName.replace('/', '@')}.${this.repo}`
    }

    // getPluginName ...
    getPluginName(fileName) {
        return fileName.replace(`.${this.repo}`, '').replace('@', '/')
    }

    // isPlugin ...
    isPlugin(fileName) {
        return fileName.indexOf(`.${this.repo}`) !== -1
    }

    // download 下载插件代码
    async downloadPlugin() {
        let fileUrl = `${this.downloadUrl}/raw/main/plugins/${this.plugin}.js?_=${+new Date}`
        try {
            let content = await this.get(fileUrl)
            await this.fm.writeString(this.filePath, content)
        } catch (e) {
            throw new Error(`${this.plugin} not found`)
        }
    }

    // --------------------------------

    // runsInApp ...
    async runsInApp() {
        this.log('runsInApp begin')
        if (this.args.callback) {
            // 如果入参存在回调组件的 callback
            let callback = this.args.callback
            let module = importModule(this.filePath)
            let plugin = new module(this.args, this)
            if (typeof (plugin[callback]) === 'function') {
                return await plugin[callback]()
            }
        }

        // 菜单操作
        let actions = [
            '插件商店',
            '插件管理',
            '组件更新',
            '透明背景',
        ]
        if (this.debugMode) {
            actions.push(...[
                '文件管理',
                '调试',
            ])
        }

        let commands = [
            this.remotePlugin,
            this.localPlugin,
            this.updateLoader,
            this.updateBgImage,
            this.fileManage,
            this.debug,
        ]
        let selected = await this.dialog('菜单', actions)
        this.log('runsInApp selected', selected)
        if (selected == -1) {
            return
        }
        return commands[selected].apply(this)
    }

    // remotePlugin 插件商店
    async remotePlugin() {
        return Safari.openInApp(this.repoUrl, false)
    }

    // managePlugin 本地插件
    async localPlugin() {
        // 本地插件列表
        let docList = this.fm.listContents(this.docPath)
        this.log('localPlugin docList', docList)
        let pluginList = []
        for (let i = 0; i < docList.length; i++) {
            if (!this.isPlugin(docList[i])) {
                continue
            }
            pluginList.push(this.getPluginName(docList[i]))
        }
        this.log('localPlugin pluginList', pluginList)

        // 插件弹窗
        let selectedPlugin = await this.dialog('插件管理', pluginList, '点击管理该插件')
        this.log('localPlugin selectedPlugin', selectedPlugin)
        if (selectedPlugin == -1) {
            return
        }
        let pluginName = pluginList[selectedPlugin]
        this.log('localPlugin pluginName', pluginName)

        // 操作弹窗
        let actions = [
            '运行', '更新', '删除',
        ]
        let selectedAction = await this.dialog(pluginName, actions)
        this.log('localPlugin selectedAction', selectedAction)
        if (selectedAction == -1) {
            return
        }
        switch (selectedAction) {
            case 0:
                // 运行
                this.initConfig(pluginName)
                await this.render()
                break
            case 1:
                // 更新
                this.initConfig(pluginName)
                await this.downloadPlugin()
                break
            case 2:
                // 删除
                let pluginPath = this.fm.joinPath(this.docPath, this.getFileName(pluginName))
                this.log('localPlugin pluginPath:' + pluginPath)
                await this.fm.remove(pluginPath)
                break
            default:
                break
        }
    }

    // updateBgImage 更新背景图片
    async updateBgImage() {
        this.log('updateBgImage begin')
        let selected = await this.dialog(
            '透明背景',
            ['上传'],
            '需要上传手机空屏截图'
        )
        this.log('localPlugin selected', selected)
        if (selected == -1) {
            return
        }

        // 上传图片
        let photo = await Photos.fromLibrary()
        this.log('updateBgImage photo', photo)
        if (!photo) {
            return await this.dialog('请重新上传图片')
        }

        // 解析对应手机型号尺寸
        let phoneSize = this.phoneSizes[photo.size.height]
        this.log('updateBgImage phoneSize', phoneSize)
        if (!phoneSize) {
            return await this.dialog('图片必须是手机截图')
        }

        // 需要生成 三种尺寸对应 11 种位置图片
        for (let widgetSize of this.widgetSizeList) {
            for (let widgetPosition of this.widgetPositions[widgetSize]) {
                this.log('updateBgImage', widgetSize, widgetPosition, 'begin')

                let positions = widgetPosition.split('-')
                let imgOption = {
                    width: phoneSize[widgetSize].w,
                    height: phoneSize[widgetSize].h,
                }
                imgOption.x = phoneSize.left
                if (positions.length > 1) {
                    imgOption.x = phoneSize[positions[1]]
                }
                imgOption.y = phoneSize[positions[0]]
                // large bottom, 其左上实际处于 middle
                if (widgetSize == 'large' && positions[0] == 'bottom') {
                    imgOption.y = phoneSize['middle']
                }
                this.log('updateBgImage imgOption', imgOption)

                let context = new DrawContext()
                context.size = new Size(imgOption.width, imgOption.height)
                context.drawImageAtPoint(photo, new Point(-imgOption.x, -imgOption.y))
                let img = context.getImage()
                let imgPath = this.getTransparentBgPath(widgetSize, widgetPosition)
                this.log('updateBgImage imgPath', imgPath)
                this.fm.writeImage(imgPath, img)

                this.log('updateBgImage', widgetSize, widgetPosition, 'end')
            }
        }

        return await this.dialog('上传成功')
    }

    // updateLoader 更新加载器
    async updateLoader() {
        try {
            let fileUrl = `${this.downloadUrl}/raw/main/loader.js?_=${+new Date}`
            let content = await this.get(fileUrl)
            await this.fm.writeString(module.filename, content)
        } catch (e) {
            return await this.dialog(e.message)
        }
    }

    // fileManage 文件管理
    async fileManage() {
        this.log('fileManage begin')

        let fileList = this.fm.listContents(this.docPath)
        this.log('fileManage fileList', fileList)

        let selected = await this.dialog('文件管理', fileList, '点击删除该文件')
        this.log('fileManage selected', selected)
        if (selected == -1) {
            return
        }

        let filePath = this.fm.joinPath(this.docPath, fileList[selected])
        this.log('fileManage filePath', filePath)

        await this.fm.remove(filePath)
    }

    // debug 调试
    async debug() {
        this.initConfig('smoke')
        // this.initConfig('example/health')
        // this.initConfig('example/notify')
        // this.initConfig('example/chart')
        // this.initConfig('example/transparent')
        // this.initConfig('example/system')
        // this.initConfig('history')
        // this.initConfig('friday')
        // this.initConfig('example/bg')
        await this.downloadPlugin()
        await this.render()
    }

    // --------------------------------

    // main ...
    async main() {
        try {
            if (config.runsInApp) {
                return this.runsInApp()
            }
            if (this.fm.fileExists(this.filePath)) {
                return await this.render()
            }
            await this.downloadPlugin()
            return await this.render()
        } catch (e) {
            return await this.fail(e.message)
        }
    }

    // render ...
    async render() {
        this.log('render begin', this.filePath)
        let module = importModule(this.filePath)
        let plugin = new module(this.args, this)
        if (config.runsInApp && typeof (plugin['test']) === 'function') {
            return await plugin.test()
        }
        return await plugin.render()
    }
}

const widget = await new Loader().main()
if (config.runsInWidget && widget) {
    Script.setWidget(widget)
}
Script.complete()
