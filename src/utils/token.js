// 此文件->封装三个方法->专门用来操作token的
const key = 'geek-itheima'
// 设置token
export const setToken = (token) => {
  return localStorage.setItem(key, token)
}

// 获取token
export const getToken = () => localStorage.getItem(key)

// 删除token
export const delToken = () => localStorage.removeItem(key)
