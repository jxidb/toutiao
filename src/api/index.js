import requests from '@/api/axios.js'
import { getStorage } from '@/utils/storage.js'
// 获取所有频道
export const reqGetAllChannelsApi = () => {
  return requests({
    url: '/channels',
    method: 'GET'
  })
}

// 登录接口
export const reqLogin = (data) => {
  return requests({
    url: '/authorizations',
    method: 'POST',
    data

  })
}

// 刷新token接口
export const reqRefreshToken = () => {
  return requests({
    url: '/authorizations',
    method: 'PUT',
    headers: {
      // 调用这个接口，给请求头带一个Authorization字段
      Authorization: 'Bearer ' + getStorage('refresh_token')
    }

  })
}

// 获取用户所选频道
export const reqgetUserChannels = () => {
  return requests({
    url: 'user/channels'

  })
}

// 获取文章列表
export const reqgetArticles = (params) => {
  return requests({
    url: '/articles',

    params // params里面的数据，axios会拼接在url中?的后面， 这种叫查询字符串

  })
}

// 文章不感兴趣接口
export const reqdisLike = (data) => {
  return requests({
    url: '/article/dislikes',
    method: 'POST',
    data

  })
}

//  文章反馈垃圾内容接口
export const reqReport = ({ artId, type, remark = '如果选择其他问题，直接在逻辑页面弹出一个提示输入框，然后将值传到这里' }) => {
  return requests({
    url: '/article/reports',
    method: 'POST',

    data: {
      target: artId,
      type,
      remark
    }
  })
}

// 更新覆盖频道
export const reqSetChannels = ({ channels }) => {
  return requests({
    url: '/user/channels',
    method: 'PUT',
    data: {
      channels // 用户已选的整个频道数组
    }
  })
}

// 搜索联想建议接口
export const reqSuggest = (params) => {
  return requests({
    url: '/suggestion',
    method: 'GET',
    params
  })
}

// 搜索结果接口
export const reqSearch = ({ page = 1, perPage = 10, q }) => {
  return requests({
    url: '/search',
    method: 'GET',
    params: {
      page,
      perPage,
      q
    }
  })
}

// 获取文章列表接口
export const reqGetArticleList = (data) => {
  return requests({
    url: '/articles',
    method: 'GET',
    data
  })
}

// 文章内容接口
export const reqArticlesContent = ({ id }) => {
  return requests({
    url: `/articles/${id}`,
    method: 'GET'
  })
}

// 关注作者接口
export const reqFollow = ({ id }) => {
  return requests({
    url: '/user/followings',
    data: {
      target: id
    },
    method: 'POST'
  })
}

// 取关作者接口
export const reqDisFollow = ({ id }) => {
  return requests({
    url: `/user/followings/${id}`,
    method: 'DELETE'
  })
}

// 文章点赞接口
export const reqContentLike = ({ id }) => {
  return requests({
    url: '/article/likings',
    method: 'POST',
    data: {
      target: id
    }
  })
}

// 文章取消点赞接口
export const reqContentUnLike = ({ id }) => {
  return requests({
    url: `/article/likings/${id}`,
    method: 'DELETE'
  })
}

// 获取文章评论接口
export const reqComment = ({ type = 'a', source, offset = null, limit }) => {
  return requests({
    url: '/comments',
    method: 'GET',
    params: {
      type,
      source,
      offset,
      limit
    }
  })
}

// 评论点赞接口
export const reqCommentLike = ({ id }) => {
  return requests({
    url: '/comment/likings',
    method: 'POST',
    data: {
      target: id
    }
  })
}

// 取消评论点赞接口
export const reqCommentUnLike = ({ id }) => {
  return requests({
    url: `/comment/likings/${id}`,
    method: 'DELETE'
  })
}

// target是评论的目标id可以为文章id或评论的id
// content评论的内容
// artid是文章id对评论回复需要此参数值, 代表所属文章id, 对文章评论无需此参数
export const reqAddComments = ({ target, content, artid = null }) => {
//  axios中，data请求体传参，如果值为null是不会忽略的
// 也会把参数名和值携带给后台（只有params遇到null才会忽略）
  const obj = {
    target,
    content
  }
  // 判断：如果artid不为null，则代表的是对评论进行回复
  if (artid !== null) {
    obj.artid = artid
  }
  return requests({
    url: '/comments',
    method: 'POST',
    data: obj
  })
}
// 获取用户基本信息接口
export const reqGetUser = () => {
  return requests({
    url: '/user',
    method: 'GET'
  })
}

// 用户资料个人简介接口
export const reqUserEdit = () => {
  return requests({
    url: '/user/profile',
    method: 'GET'
  })
}
// 更新用户头像的接口
export const reqUserPhoto = (fd) => {
  return requests({
    url: '/user/photo',
    method: 'PATCH',
    data: fd // 这个fd是一会外面传进来的一个new ForData()对象
    // Content-Type:application/json，是axios携带的，前提：data请求体是一个对象，axios会自动转换成json字符串传给后台
    // Content-Type:multipart/form-data，是浏览器携带，前提：data请求体必须是一个formdata类型对象
  })
}
// 更新用户资料接口 （传递哪个参数就修改哪个参数）
export const reqUpdataUserEdit = (data) => {
  return requests({
    url: '/user/profile',
    method: 'PATCH',
    data
  })
}
