async function onRoomleave(room: { topic: () => any }, leaverList: any[], remover: any, date: any) {
  const nameList = leaverList.map((c: { name: () => any }) => c.name()).join(',')
  console.log(`Room ${await room.topic()} lost member ${nameList}, the remover is: ${remover}`)
}

export default onRoomleave
