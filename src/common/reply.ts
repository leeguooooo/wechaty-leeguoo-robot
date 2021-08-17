import { filterFriendMsg, filterRoomMsg } from '../service/msg-filter-service'
/**
 * 获取私聊返回内容
 */
async function getContactTextReply(that: any, contact: any, msg: any) {
  let result = await filterFriendMsg(that, contact, msg)
  return result
}

/**
 * 获取群消息回复
 * @param {*} content 群消息内容
 * @param {*} name 发消息者昵称
 * @param {*} id 发消息者id
 */
async function getRoomTextReply(that: any, content: any, name: any, id: any, avatar: any, room: any) {
  let result = await filterRoomMsg(that, content, name, id, avatar, room)
  return result
}

export { getContactTextReply, getRoomTextReply }
