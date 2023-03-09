import request from '@/utils/request'
const api_name = '/learning/video'

export default {
  // 获取视频信息
  getVideoInfo(videoSourceId) {
    return request({
      url: `${api_name}/${videoSourceId}`,
      method: 'get'
    })
  },
  // 添加视频
  addVideo(vidoeForm) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: vidoeForm
    })
  },
  // 更新小节
  updateVideo(vidoeForm) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: vidoeForm
    })
  },
  // 获取小节视频播放凭证
  getPlayAuth(vid) {
    return request({
      url: `${api_name}/playAuth/${vid}`,
      method: 'get'
    })
  }

}
