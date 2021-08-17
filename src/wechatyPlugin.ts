import { addAibotConfig } from './common/aiDb'
import onScan from './handlers/on-scan'
import onLogin from './handlers/on-login'
import onLogout from './handlers/on-logout'
import onFriend from './handlers/on-friend'
import onRoomjoin from './handlers/on-roomjoin'
import onMessage from './handlers/on-message'
import onReady from './handlers/on-ready'
import onHeartbeat from './handlers/on-heartbeat'
import onError from './handlers/on-error'
import onRoomtopic from './handlers/on-roomtopic'
import onRoomleave from './handlers/on-roomleave'

function wechatyPlugin(config: any) {
  addAibotConfig(config)
  return function (bot: any) {
    bot.on('scan', onScan)
    bot.on('login', onLogin)
    bot.on('logout', onLogout)
    bot.on('friendship', onFriend)
    bot.on('room-join', onRoomjoin)
    bot.on('room-topic', onRoomtopic)
    bot.on('room-leave', onRoomleave)
    bot.on('message', onMessage)
    bot.on('ready', onReady)
    bot.on('heartbeat', onHeartbeat)
    bot.on('error', onError)
  }
}

export default wechatyPlugin
