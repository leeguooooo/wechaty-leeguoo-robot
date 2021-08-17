import { contactSay, roomSay } from '../common'
import { getContactTextReply, getRoomTextReply } from '../common/reply'
import { delay } from '../lib/index'
import { dispatchAsync } from '../service/room-async-service'
import { allConfig } from '../common/configDb'

/**
 * 根据消息类型过滤私聊消息事件
 * @param {*} that bot实例
 * @param {*} msg 消息主体
 */
async function dispatchFriendFilterByMsgType(that: { Contact: { Type: { Official: any } }; Message: { Type: { Text: any; Emoticon: any; Image: any; Url: any; Video: any; Audio: any } } }, msg: { type: () => any; talker: () => any; text: () => string }) {
  try {
    const type = msg.type()
    const contact = msg.talker() // 发消息人
    const isOfficial = contact.type() === that.Contact.Type.Official
    let content = ''
    let replys = []
    switch (type) {
      case that.Message.Type.Text:
        content = msg.text()
        if (!isOfficial) {
          console.log(`发消息人${await contact.name()}:${content}`)
          if (content.trim()) {
            replys = await getContactTextReply(that, contact, content)
            for (let reply of replys) {
              await delay(1000)
              await contactSay(contact, reply)
            }
          }
        } else {
          console.log('公众号消息')
        }
        break
      case that.Message.Type.Emoticon:
        console.log(`发消息人${await contact.name()}:发了一个表情`)
        break
      case that.Message.Type.Image:
        console.log(`发消息人${await contact.name()}:发了一张图片`)
        break
      case that.Message.Type.Url:
        console.log(`发消息人${await contact.name()}:发了一个链接`)
        break
      case that.Message.Type.Video:
        console.log(`发消息人${await contact.name()}:发了一个视频`)
        break
      case that.Message.Type.Audio:
        console.log(`发消息人${await contact.name()}:发了一个视频`)
        break
      default:
        break
    }
  } catch (error) {
    console.log('监听消息错误', error)
  }
}

/**
 * 根据消息类型过滤群消息事件
 * @param {*} that bot实例
 * @param {*} room room对象
 * @param {*} msg 消息主体
 */
async function dispatchRoomFilterByMsgType(
  that: { userSelf: () => { (): any; new (): any; name: { (): any; new (): any } }; Message: { Type: { Text: any; Emoticon: any; Image: any; Url: any; Video: any; Audio: any } } },
  room: { topic: () => any },
  msg: { talker: () => any; type: () => any; text: () => string }
) {
  const contact = msg.talker() // 发消息人
  const contactName = contact.name()
  const roomName = await room.topic()
  const type = msg.type()
  const userSelfName = that.userSelf().name()
  let content = ''
  let replys = ''
  let contactId = contact.id || '111'
  let contactAvatar = await contact.avatar()
  switch (type) {
    case that.Message.Type.Text:
      content = msg.text()
      console.log(`群名: ${roomName} 发消息人: ${contactName} 内容: ${content}`)
      const mentionSelf = content.includes(`@${userSelfName}`)
      if (mentionSelf) {
        content = content.replace(/@[^,，：:\s@]+/g, '').trim()
        replys = await getRoomTextReply(that, content, contactName, contactId, contactAvatar, room)
        for (let reply of replys) {
          await delay(1000)
          await roomSay(room, contact, reply)
        }
      }
      break
    case that.Message.Type.Emoticon:
      console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个表情`)
      break
    case that.Message.Type.Image:
      console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一张图片`)
      break
    case that.Message.Type.Url:
      console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个链接`)
      break
    case that.Message.Type.Video:
      console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个视频`)
      break
    case that.Message.Type.Audio:
      console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个语音`)
      break
    default:
      break
  }
}

async function onMessage(msg: { room: () => any; self: () => any }) {
  const config = await allConfig()
  const { role } = config.userInfo
  const room = msg.room() // 是否为群消息
  const msgSelf = msg.self() // 是否自己发给自己的消息
  if (msgSelf) return
  if (room) {
    dispatchRoomFilterByMsgType(this, room, msg)
    const roomAsyncList = config.roomAsyncList || []
    if (roomAsyncList.length) {
      dispatchAsync(this, msg, roomAsyncList)
    }
  } else {
    dispatchFriendFilterByMsgType(this, msg)
  }
}

export default onMessage
