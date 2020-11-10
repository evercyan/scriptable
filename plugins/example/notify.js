/**
 * System
 */

class Notify {
    constructor(args = {}, loader = null) {
        this.args = args
        this.loader = loader
        this.widgetSize = config.widgetFamily
    }

    // --------------------------------

    async test() {
        if (config.runsInWidget) {
            return
        }
        let notify = new Notification();
        // 标题
        notify.title = '快喝水呀'
        // 正文
        notify.body = 'hello world'
        // 消息数
        notify.badge = 1
        // 打开动作
        notify.openURL = URLScheme.forRunningScript()
        notify.scriptName = Script.name()
        // 声音
        notify.sound = 'complete'
        notify.threadIdentifier = Script.name()
        await notif.schedule();
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

module.exports = Notify
