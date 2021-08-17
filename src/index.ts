import { Wechaty } from 'wechaty'
import wechatyPlugin from './wechatyPlugin'

const name = 'wechaty-leeguoo-robot'
const bot = new Wechaty({ name, puppet: 'wechaty-puppet-wechat' })

bot
  .use(wechatyPlugin({}))
  .start()
  .catch((e) => console.error(e))
