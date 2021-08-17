import { getUser } from '../common/userDb'
import { MD5, delay } from '../lib'
import { FileBox, UrlLink, MiniProgram } from 'wechaty'

/**
 * 统一触发加群欢迎词
 * @param room 群
 * @param roomName 群名
 * @param contactName 进群人
 * @param msg 消息
 */
async function addRoomWelcomeSay(room: { say: (arg0: string | FileBox) => any }, roomName: any, contactName: any, msg: { type: number; content: string; url: string }) {
  if (msg.type === 1 && msg.content !== '') {
    // 文字
    console.log('回复内容', msg.content)
    await room.say(`${roomName}：欢迎新朋友 @${contactName}，<br>${msg.content}`)
  } else if (msg.type === 2 && msg.url !== '') {
    // url文件
    let obj = FileBox.fromUrl(msg.url)
    console.log('回复内容', obj)
    await room.say(obj)
  }
}

/**
 * 更新用户信息
 */
async function updateContactInfo(that: { Contact: { findAll: () => any } }) {
  try {
    const contactSelf = await getUser()
    const hasWeixin = !!contactSelf.weixin
    const contactList = await that.Contact.findAll()
    let res = []
    const notids = ['filehelper', 'fmessage']
    let realContact = hasWeixin ? contactList.filter((item: { payload: { type: number; friend: any; id: string } }) => item.payload.type == 1 && item.payload.friend && !notids.includes(item.payload.id)) : contactList
    for (let i of realContact) {
      let contact = i.payload
      let obj = {
        robotId: hasWeixin ? contactSelf.weixin : MD5(contactSelf.name),
        contactId: hasWeixin ? contact.id : MD5(contactSelf.name + contact.name + contact.alias + contact.province + contact.city + contact.gender),
        name: contact.name,
        alias: contact.alias,
        gender: contact.gender,
        province: contact.province,
        city: contact.city,
        avatar: hasWeixin ? contact.avatar : '',
        friend: contact.friend,
        signature: contact.signature,
        star: contact.star,
        type: hasWeixin ? contact.type : '',
        weixin: hasWeixin ? contact.weixin : '',
      }
      res.push(obj)
    }
    //     console.log('用户信息', res)
    //     await updateFriendInfo(res, 20)
  } catch (e) {
    console.log('e', e)
  }
}

/**
 * 分批次更新好友信息
 * @param {*} list 好友列表
 * @param {*} num 每次发送数据
 */
// async function updateFriendInfo(list: any[], num: number) {
//   const arr = groupArray(list, num)
//   arr.forEach(async (item: any) => {
//     await sendFriend(item)
//     await delay(10000)
//   })
// }

/**
 * 更新好友
 * @returns {Promise<void>}
 * @param url
 */
// async function sendFriend(friend: any): Promise<void> {
//   try {
//     let option = {
//       method: 'POST',
//       url: '/wechat/friend',
//       params: { friend: friend },
//     }
//     const content = await aiBotReq(option)
//     if (!content.code === 200) {
//       console.log('推送失败', content.msg)
//     }
//   } catch (error) {
//     console.log('推送好友列表失败')
//   }
// }

/**
 * 更新群列表
 */
async function updateRoomInfo(that: { Room: { findAll: () => any } }) {
  try {
    const contactSelf = await getUser()
    const hasWeixin = !!contactSelf.weixin
    const roomList = await that.Room.findAll()
    let res = []
    for (let i of roomList) {
      let room = i.payload
      let obj = {
        robotId: hasWeixin ? contactSelf.weixin : MD5(contactSelf.name),
        roomId: MD5(room.topic),
        topic: room.topic,
        avatar: room.avatar || '',
        ownerId: room.ownerId || '',
        adminIds: room.adminIdList.toString(),
        memberCount: room.memberIdList.length,
      }
      res.push(obj)
    }
    console.log(res)
    //     await updateRoomsInfo(res, 20)
  } catch (e) {
    console.log('e', e)
  }
}

/**
 * 更新群信息
 * @param {*} list 好友列表
 * @param {*} num 每次发送数据
 */
// async function updateRoomsInfo(list, num) {
//   const arr = groupArray(list, num)
//   arr.forEach(async (item) => {
//     await sendRoom(item)
//     await delay(10000)
//   })
// }

/**
 * 私聊发送消息
 * @param contact
 * @param msg
 * @param isRoom
 *  type 1 文字 2 图片url 3 图片base64 4 url链接 5 小程序  6 名片
 */
async function contactSay(contact: any, msg: any, isRoom = false) {
  try {
    if (msg.type === 1 && msg.content) {
      // 文字
      console.log('回复内容', msg.content)
      await contact.say(msg.content)
    } else if (msg.type === 2 && msg.url) {
      // url文件
      let obj = FileBox.fromUrl(msg.url)
      console.log('回复内容', obj)
      if (isRoom) {
        await contact.say(`@${contact.name()}`)
        await delay(500)
      }
      await contact.say(obj)
    } else if (msg.type === 3 && msg.url) {
      // bse64文件
      let obj = FileBox.fromDataURL(msg.url, 'user-avatar.jpg')
      await contact.say(obj)
    } else if (msg.type === 4 && msg.url && msg.title && msg.description && msg.thumbUrl) {
      let url = new UrlLink({
        description: msg.description,
        thumbnailUrl: msg.thumbUrl,
        title: msg.title,
        url: msg.url,
      })
      await contact.say(url)
    } else if (msg.type === 5 && msg.appid && msg.title && msg.pagePath && msg.description && msg.thumbUrl && msg.thumbKey) {
      let miniProgram = new MiniProgram({
        appid: msg.appid,
        title: msg.title,
        pagePath: msg.pagePath,
        description: msg.description,
        thumbUrl: msg.thumbUrl,
        thumbKey: msg.thumbKey,
      })
      await contact.say(miniProgram)
    }
  } catch (e) {
    console.log('私聊发送消息失败', e)
  }
}

/**
 * 群关键词回复
 * @param {*} contact
 * @param {*} msg
 * @param {*} isRoom
 */
async function roomSay(room: any, contact: any, msg: any) {
  try {
    if (msg.type === 1 && msg.content) {
      // 文字
      console.log('回复内容', msg.content)
      contact ? await room.say(msg.content, contact) : await room.say(msg.content)
    } else if (msg.type === 2 && msg.url) {
      // url文件
      let obj = FileBox.fromUrl(msg.url)
      console.log('回复内容', obj)
      contact ? await room.say('', contact) : ''
      await delay(500)
      await room.say(obj)
    } else if (msg.type === 3 && msg.url) {
      // bse64文件
      let obj = FileBox.fromDataURL(msg.url, 'room-avatar.jpg')
      contact ? await room.say('', contact) : ''
      await delay(500)
      await room.say(obj)
    } else if (msg.type === 4 && msg.url && msg.title && msg.description) {
      console.log('in url')
      let url = new UrlLink({
        description: msg.description,
        thumbnailUrl: msg.thumbUrl,
        title: msg.title,
        url: msg.url,
      })
      console.log(url)
      await room.say(url)
    } else if (msg.type === 5 && msg.appid && msg.title && msg.pagePath && msg.description && msg.thumbUrl && msg.thumbKey) {
      let miniProgram = new MiniProgram({
        appid: msg.appid,
        title: msg.title,
        pagePath: msg.pagePath,
        description: msg.description,
        thumbUrl: msg.thumbUrl,
        thumbKey: msg.thumbKey,
      })
      await room.say(miniProgram)
    }
  } catch (e) {
    console.log('群回复错误', e)
  }
}

/**
 * 统一邀请加群
 * @param that
 * @param contact
 */
async function addRoom(that, contact, roomName, replys) {
  let room = await that.Room.find({ topic: roomName })
  if (room) {
    try {
      for (const item of replys) {
        await delay(2000)
        contactSay(contact, item)
      }
      await room.add(contact)
    } catch (e) {
      console.error('加群报错', e)
    }
  } else {
    console.log(`不存在此群：${roomName}`)
  }
}

export { updateContactInfo, updateRoomInfo, addRoomWelcomeSay, roomSay, contactSay, addRoom }
