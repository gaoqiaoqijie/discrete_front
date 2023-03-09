import request from '@/utils/request'
const api_name = '/learning/user-course'

export default {

  // 查询员工是否参与了指定课程的学习
  isStudyCourse(courseId, userId) {
    return request({
      url: `${api_name}/study/${courseId}`,
      method: 'get',
      params: { userId }
    })
  },

  // 查询我参与的课程
  getMyJoinCourse(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get'
    })
  }

}
