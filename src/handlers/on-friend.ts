import { Friendship } from 'wechaty'
import { delay } from '../lib'
import { allConfig } from '../common/configDb'

/**
 * 好友添加
 */
async function onFriend(friendship) {
  const config = await allConfig()
  let logMsg, hello
  try {
    let name = friendship.contact().name()
    hello = friendship.hello()
    logMsg = name + '，发送了好友请求'
    console.log(logMsg)
    if (config.autoAcceptFriend) {
      switch (friendship.type()) {
        case Friendship.Type.Receive:
          if (config.acceptFriendKeyWords.length === 0) {
            console.log('无认证关键词,10秒后将会自动通过好友请求')
            await delay(10000)
            await friendship.accept()
          } else if (config.acceptFriendKeyWords.length > 0 && config.acceptFriendKeyWords.includes(hello)) {
            console.log(`触发关键词${hello},10秒后自动通过好友请求`)
            await delay(10000)
            await friendship.accept()
          } else {
            console.log('未触发任何关键词，好友自动添加失败')
          }
          break
        case Friendship.Type.Confirm:
          logMsg = '已确认添加好友：' + name
          console.log(logMsg)
          break
      }
    } else {
      console.log('未开启自动添加好友功能，忽略好友添加')
    }
  } catch (e) {
    logMsg = e
    console.log('添加好友出错：', logMsg)
  }
}

export default onFriend
