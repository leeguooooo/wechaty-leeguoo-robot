import Crypto from 'crypto'
import schedule from 'node-schedule'

/**
 * 设置定时器
 * @param {*} date 日期
 * @param {*} callback 回调
 */
//其他规则见 https://www.npmjs.com/package/node-schedule
// 规则参数讲解    *代表通配符
//
// *  *  *  *  *  *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │ |
// │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
// │ │ │ │ └───── month (1 - 12)
// │ │ │ └────────── day of month (1 - 31)
// │ │ └─────────────── hour (0 - 23)
// │ └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// 每分钟的第30秒触发： '30 * * * * *'
//
// 每小时的1分30秒触发 ：'30 1 * * * *'
//
// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
//
// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
//
// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'

function setLocalSchedule(date: string | number | Date, callback: { (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void> }, name?: string) {
  if (name) {
    schedule.scheduleJob(name, { rule: date, tz: 'Asia/Shanghai' }, callback)
  } else {
    schedule.scheduleJob({ rule: date, tz: 'Asia/Shanghai' }, callback)
  }
}

// 取消任务
function cancelLocalSchedule(name: string) {
  schedule.cancelJob(name)
}

// 取消指定任务
function cancelAllSchedule(type: string) {
  for (let i in schedule.scheduledJobs) {
    if (i.includes(type)) {
      cancelLocalSchedule(i)
    }
  }
}

/**
 * 延时函数
 * @param {*} ms 毫秒
 */
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * MD5加密
 * @return {string}
 */
function MD5(str: any): string {
  return Crypto.createHash('md5').update(str).digest('hex')
}

/**
 * 判断日期时间格式是否正确
 * @param {*} str 日期
 * @returns {boolean}
 */
function isRealDate(str: any) {
  var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/
  var r = str.match(reg)
  if (r == null) return false
  r[2] = r[2] - 1
  var d = new Date(r[1], r[2], r[3], r[4], r[5])
  if (d.getFullYear() != r[1]) return false
  if (d.getMonth() != r[2]) return false
  if (d.getDate() != r[3]) return false
  if (d.getHours() != r[4]) return false
  if (d.getMinutes() != r[5]) return false
  return true
}

/**
 * 设置提醒内容解析
 * @param {*} keywordArray 分词后内容
 * @param name
 */
function contentDistinguish(keywordArray: any, name: any) {
  let scheduleObj: any = {}
  let today = getToday()
  scheduleObj.setter = name // 设置定时任务的用户
  scheduleObj.subscribe = keywordArray[1] === '我' ? name : keywordArray[1] // 定时任务接收者
  if (keywordArray[2] === '每天') {
    // 判断是否属于循环任务
    console.log('已设置每日定时任务')
    scheduleObj.isLoop = true
    if (keywordArray[3].includes(':') || keywordArray[3].includes('：')) {
      let time = keywordArray[3].replace('：', ':')
      scheduleObj.time = convertTime(time)
    } else {
      scheduleObj.time = ''
    }
    scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`
  } else if (keywordArray[2] && keywordArray[2].includes('-')) {
    console.log('已设置指定日期时间任务')
    scheduleObj.isLoop = false
    scheduleObj.time = keywordArray[2] + ' ' + keywordArray[3].replace('：', ':')
    scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`
  } else {
    console.log('已设置当天任务')
    scheduleObj.isLoop = false
    scheduleObj.time = today + keywordArray[2].replace('：', ':')
    scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[3].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[3].replace('我', '你')}`
  }
  return scheduleObj
}

/**
 * 获取今天日期
 * @returns 2019-7-19
 */
function getToday() {
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return year + '-' + month + '-' + day + ' '
}

/**
 * 转换定时日期格式
 * @param {*} time
 * @returns 0 12 15 * * * 每天下午3点12分
 */
function convertTime(time: string) {
  let array = time.split(':')
  return '0 ' + array[1] + ' ' + array[0] + ' * * *'
}

export { delay, MD5, setLocalSchedule, cancelAllSchedule, isRealDate, contentDistinguish }
