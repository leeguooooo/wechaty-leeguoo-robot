import nedb from '../lib/nedb'

const db = nedb()

async function addUser(info: any) {
  try {
    return await db.insert(info)
  } catch (error) {
    console.log('插入数据错误', error)
  }
}

async function getUser() {
  try {
    const search = await db.find({})
    return search[0]
  } catch (error) {
    console.log('查询数据错误', error)
  }
}

export { addUser, getUser }
