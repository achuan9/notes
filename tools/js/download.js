// 提交表单下载文件
export default (url, data, method = 'post') => {
  return new Promise((resolve, reject) => {
    const form = document.createElement('form')
    form.setAttribute('action', url)
    form.setAttribute('method', method)
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const dataInput = document.createElement('input')
        dataInput.setAttribute('type', 'hidden')
        dataInput.setAttribute('name', key)
        dataInput.setAttribute('value', data[key])
        form.appendChild(dataInput)
      }
    }
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
    resolve()
  })
}
