async function onError(error: { message: string }) {
  console.log('错误', error)
  console.log(
    error.message
      .replace(/\ +/g, '')
      .replace(/[\r\n]/g, '')
      .replace('Error:type(){returnthis._type;}', '')
  )
}
export default onError
