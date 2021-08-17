import nedb from '../lib/nedb.js'

const rdb = nedb()

async function addRoom(info: any) {
  try {
    let doc = await rdb.insert(info)
    return doc
  } catch (error) {
    console.log('插入数据错误', error)
  }
}

async function getRoom(name: any) {
  try {
    let search = await rdb.find({ name })
    return search[0]
  } catch (error) {
    console.log('查询数据错误', error)
  }
}

export { addRoom, getRoom }
