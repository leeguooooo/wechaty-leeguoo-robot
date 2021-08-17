// const { setQrCode } = require('../proxy/aibotk')

/**
 * 登出事件
 */
async function onLogout(user: any) {
  // await setQrCode('qrcode', '6')
  console.log(`用户${user}已登出`)
}

export default onLogout
