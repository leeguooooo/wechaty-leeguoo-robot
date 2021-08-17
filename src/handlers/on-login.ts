import { delay, MD5 } from '../lib'
import { addUser } from '../common/userDb'
import { initAllSchedule } from '../task'
var pjson = require('../../package.json')
// import { initMqtt } from '../proxy/mqtt'
import { allConfig } from '../common/configDb'

/**
 * 登录成功监听事件
 * @param {*} user 登录用户
 */
async function onLogin(user: { payload: { weixin: any }; name: () => any; avatar: () => any }) {
  console.log(`贴心助理${user}登录了`)
  const config = await allConfig()
  console.log('config:', config)
  const userInfo = {
    ...user.payload,
    robotId: user.payload.weixin || MD5(user.name()),
  }
  await addUser(userInfo) // 全局存储登录用户信息
  const file = await user.avatar()
  const base = await file.toDataURL()
  console.log(user.name(), userInfo.robotId) // 更新用户头像
  await delay(3000)
  // await initAllSchedule(this) // 初始化任务
  // await initMqtt(this) // 初始化mqtt任务
}

export default onLogin
