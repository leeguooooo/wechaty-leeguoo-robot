import {updateContactInfo, updateRoomInfo} from '../common/index'
import { delay } from '../lib/index'
import { getUser } from '../common/userDb'

/**
 * 准备好的事件
 */
async function onReady() {
  const userInfo = await getUser()
  console.log(`所有数据准备完毕`, userInfo)
  // await updateContactInfo(this)
  // await delay(5000)
  // await updateRoomInfo(this)
}

export default onReady
