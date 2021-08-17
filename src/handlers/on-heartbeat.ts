// const { sendHeartBeat } = require('../proxy/aibotk')

async function onHeartBeat(str: any) {
  if (!str) {
    console.log('dead')
  }
  if (str.type === 'scan') {
    console.log('scan')
  }
}

export default onHeartBeat
