// 封装本地存储的方法
// 到时候要修改存储方法的时候，就在这里修改就可以了
export const setStroage = (key, value) => localStorage.setItem(key, value)

export const getStorage = (key) => localStorage.getItem(key)

export const removeStorage = (key) => localStorage.removeItem(key)
