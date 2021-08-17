import { setLocalSchedule, delay, cancelAllSchedule } from '../lib'
import { allConfig } from '../common/configDb'
import { getScheduleList, updateSchedule } from '../proxy/aibotk'
import { getEveryDayRoomContent, getEveryDayContent, roomSay } from '../common'

/**
 * 群定时任务，针对群
 * @param {*} that bot对象
 * @param {*} item 任务项
 */
async function setRoomTask(that: { Room: { find: (arg0: { topic: any }) => any } }, item: { date: any; roomName: any; contents: any }, name: string) {
  try {
    let time = item.date
    let room = await that.Room.find({ topic: item.roomName })
    if (!room) {
      console.log(`查找不到群：${item.roomName}，请检查群名是否正确`)
      return
    } else {
      console.log(`群：“${item.roomName}”设置定时任务成功`)
      setLocalSchedule(
        time,
        async () => {
          for (let reply of item.contents) {
            console.log('群定时任务开始发送，内容：', `${reply.type === 1 ? reply.content : reply.url}`)
            await delay(1000)
            await roomSay(room, '', reply)
          }
        },
        name
      )
    }
  } catch (error) {
    console.log('设置群定时任务失败：', error)
  }
}

/**
 * 每日新闻资讯，针对群
 * @param {*} that bot对象
 * @param {*} item 任务项
 */
async function setEveryDayRoomSayTask(that: { Room: { find: (arg0: { topic: any }) => any } }, item: { date: any; roomName: any; sortId: any; endWord: any }, name: string) {
  try {
    let time = item.date
    let room = await that.Room.find({ topic: item.roomName })
    if (!room) {
      console.log(`查找不到群：${item.roomName}，请检查群名是否正确`)
      return
    } else {
      console.log(`群：“${item.roomName}”设置资讯任务成功`)
      setLocalSchedule(
        time,
        async () => {
          let content = await getEveryDayRoomContent(item.sortId, item.endWord)
          console.log('新闻咨询开始发送，内容：', content)
          await delay(10000)
          await room.say(content)
        },
        name
      )
    }
  } catch (error) {
    console.log('设置群资讯定时任务失败：', error)
  }
}

/**
 * 立即发送资讯
 * @param {*} that bot对象
 * @param {*} item 任务项  { target: 'Room', event: '', message: { roomName: '', type: 'news 新闻 ||task 定时任务', contents: [] } }
 */
async function sendRoomTaskMessage(that: { Room: { find: (arg0: { topic: any }) => any } }, info: { message: any; event: string }) {
  try {
    const item = info.message
    let room = await that.Room.find({ topic: item.roomName })
    if (!room) {
      console.log(`查找不到群：${item.roomName}，请检查群名是否正确`)
      return
    } else {
      if (info.event === 'roomNews') {
        let content = await getEveryDayRoomContent(item.sortId, item.endWord)
        console.log(`群【${item.roomName}】新闻咨询开始发送，内容：`, content)
        await delay(10000)
        await room.say(content)
      } else if (info.event === 'roomTask') {
        for (let reply of item.contents) {
          console.log(`群【${item.roomName}】定时任务开始发送，内容：`, `${reply.type === 1 ? reply.content : reply.url}`)
          await delay(1000)
          await roomSay(room, '', reply)
        }
      }
    }
  } catch (error) {
    console.log('设置群资讯定时任务失败：', error)
  }
}

/**
 * 每日说定时任务设定，针对好友
 * @param {*} that bot对象
 * @param {*} item 任务项
 */
async function setEveryDayTask(that: { Contact: { find: (arg0: { alias?: any; name?: any }) => any } }, item: { date: any; alias: any; name: any; memorialDay: any; city: any; endWord: any }, name: string) {
  try {
    let time = item.date
    let contact = (await that.Contact.find({ alias: item.alias })) || (await that.Contact.find({ name: item.name })) // 获取你要发送的联系人
    if (!contact) {
      console.log(`查找不到用户昵称为'${item.name}'或备注为'${item.alias}'的用户，请检查设置用户是否正确`)
      return
    } else {
      console.log(`设置用户：“${item.name}|${item.alias}”每日说任务成功`)
      setLocalSchedule(
        time,
        async () => {
          let content = await getEveryDayContent(item.memorialDay, item.city, item.endWord)
          console.log('每日说任务开始工作,发送内容：', content)
          await delay(10000)
          await contact.say(content)
        },
        name
      )
    }
  } catch (error) {
    console.log('每日说任务设置失败')
  }
}

/**
 * 立即发送资讯
 * @param {*} that bot对象
 * @param {*} item 任务项  { target: 'Contact', event:'wechatEveryday', message: { roomName: '', type: 'news 新闻 ||task 定时任务', contents: [] } }
 */
async function sendContactTaskMessage(that: { Contact: { find: (arg0: { alias?: any; name?: any }) => any } }, info: { message: any }) {
  try {
    const item = info.message
    let contact = (await that.Contact.find({ alias: item.alias })) || (await that.Contact.find({ name: item.name })) // 获取你要发送的联系人
    if (!contact) {
      console.log(`查找不到用户昵称为'${item.name}'或备注为'${item.alias}'的用户，请检查设置用户是否正确`)
      return
    } else {
      let content = await getEveryDayContent(item.memorialDay, item.city, item.endWord)
      console.log('每日说任务开始工作,发送内容：', content)
      await delay(10000)
      await contact.say(content)
    }
  } catch (error) {
    console.log('设置群资讯定时任务失败：', error)
  }
}

/**
 * 设置定时任务
 * @param {*} that bot 对象
 * @param {*} item 定时任务项
 */
async function setScheduleTask(that: { Contact: { find: (arg0: { name: any }) => any } }, item: { isLoop: any; time: string | number | Date; subscribe: any; content: any; id: any }, name: string) {
  let time = item.isLoop ? item.time : new Date(item.time)
  setLocalSchedule(
    time,
    async () => {
      try {
        let contact = await that.Contact.find({ name: item.subscribe })
        console.log(`${item.subscribe}的专属提醒开启啦！`)
        await contact.say(item.content)
        if (!item.isLoop) {
          await updateSchedule(item.id)
        }
      } catch (error) {
        console.log('设置定时任务错误', error)
      }
    },
    name
  )
}

/**
 * 初始化提醒任务
 * @param {}} that
 */
async function initTimeSchedule(that: any) {
  cancelAllSchedule('time_tips')
  let scheduleList = await getScheduleList() // 获取定时任务
  if (scheduleList && scheduleList.length > 0) {
    for (let item of scheduleList) {
      setScheduleTask(that, item, `time_tips_${item.id}`)
    }
  }
}

/**
 * 初始化定时任务
 * @param {}} that
 */
async function initTaskLocalSchedule(that: any) {
  cancelAllSchedule('task')
  const config = await allConfig() // 获取配置信息
  const { dayTaskSchedule, roomNewsSchedule, roomTaskSchedule } = config
  if (dayTaskSchedule && dayTaskSchedule.length > 0) {
    dayTaskSchedule.forEach((item: any, index: any) => {
      setEveryDayTask(that, item, `task_day_${index}`)
    })
  }
  if (roomNewsSchedule && roomNewsSchedule.length > 0) {
    roomNewsSchedule.forEach((item: any, index: any) => {
      setEveryDayRoomSayTask(that, item, `task_day_room_${index}`)
    })
  }
  if (roomTaskSchedule && roomTaskSchedule.length > 0) {
    roomTaskSchedule.forEach((item: any, index: any) => {
      setRoomTask(that, item, `task_room_${index}`)
    })
  }
}

/**
 * 初始化小助手任务
 * @param {*} that bot对象
 * @param {*} scheduleList 提醒任务列表
 * @param {*} daySayList 每日说任务列表
 * @param {*} RoomSayList 群资讯任务列表
 */
async function initAllSchedule(that: any) {
  await initTimeSchedule(that)
  await initTaskLocalSchedule(that)
}

export { initTaskLocalSchedule, initAllSchedule, initTimeSchedule, sendRoomTaskMessage, sendContactTaskMessage }
