import Qrterminal from 'qrcode-terminal'

/**
 * 扫描登录，显示二维码
 */
async function onScan(qrcode: any, status: any) {
  Qrterminal.generate(qrcode)
  // console.log('扫描状态', status)
  // const qrImgUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
  // console.log(qrImgUrl)
}

export default onScan
