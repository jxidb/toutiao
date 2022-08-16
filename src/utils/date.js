import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 到指定时间需要的插件
import 'dayjs/locale/zh' // 集成中文

/**
 * .....多久之前
 * @param {*} 之前的时间
 * @returns 系统时间到之前指定时间的距离值
 */
// 返回多久之气那
export const timeAgo = (targetTime) => {
  // 格式化时间
  dayjs.extend(relativeTime)
  dayjs.locale('zh')
  const a = dayjs() // 系统时间
  const b = dayjs(targetTime) // 传递进来的目标时间
  return a.to(b) // 返回多久之前...   表示a到b过了多久
}

// 时间格式化 将时间格式化为2000-05-03这种
export const format = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}
