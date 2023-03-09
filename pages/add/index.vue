<template>
  <div>
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" style="width:70%;margin: 0 auto;margin-bottom: 80px;" process-status="wait" align-center>
      <el-step title="填写课程基本信息" icon="el-icon-edit"/>
      <el-step title="创建课程大纲上传课程视频" icon="el-icon-upload"/>
      <el-step title="确认信息并发布" icon="el-icon-circle-check"/>
    </el-steps>
    <el-form label-width="120px" style="margin: 0 auto; width:60%; ">
      <!-- 课程封面-->
      <el-form-item label="课程封面" >
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/oss/file/upload'"
          class="avatar-uploader">
          <el-image :src="courseInfo.cover" class="avatar" alt="点击更换" style="width: 480px; height: 360px"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title"/>
      </el-form-item>

      <el-form-item label="课程课时">
        <el-input-number v-model="courseInfo.lessonNum" :min="1" :max="100" />
      </el-form-item>

      <el-form-item label="课程简介">
        <el-input
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="courseInfo.description"
          type="textarea"
          placeholder="请输入内容"/>
          <!-- <tinymce :height="300" v-model="courseInfo.description"/> -->
      </el-form-item>

      <el-form-item style="text-align: center;">
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
//  import * as category from '@/api/learning/category.js'
//  import * as teacher from '@/api/learning/teacher.js'
import course from '@/api/learning/courseCtr.js'
import request from '@/utils/request'

export default {
  data() {
    return {
      courseInfo: {
        id: '',
        cover: '',
        title: '',
        categoryId: '',
        categoryParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: ''
      },
      BASE_API: '',
      saveBtnDisabled: false
    }
  },
  created() {
    this.init()
    // 赋值默认封面
    this.courseInfo.cover = 'http://hsunnyc.oss-cn-beijing.aliyuncs.com/cover/cover.png'
    this.BASE_API = request.defaults.baseURL
  },
  methods: {
    // 初始化课程信息，课程分类信息，讲师信息
    init() {
      console.log('init')
      //  当地址中有课程id时为修改，此时应先获取课程信息
      if (this.$route.params && this.$route.params.id) {
        console.log(this.$route.params.id)
        course.getCourseInfo(this.$route.params.id)
          .then(response => {
            this.courseInfo = response.data.data.course
          })
      }
    },
    // 课程封面上传成功后的方法
    handleAvatarSuccess(res) {
      this.courseInfo.cover = res.data.url
    },
    // 课程封面上传之前检测格式
    beforeAvatarUpload(file) {
      const isJPGorPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJPGorPng) {
        this.$message.error('上传图片的格式只能为jpg或者png！')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片的大小不能超过 2MB!')
      }
      return isLt2M && isJPGorPng
    },
    saveData() {
      course.addCourse(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ name: 'add-chapter', params: { id: response.data.data.courseId }})
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    // 更新方法
    updateData() {
      course.updateCourse(this.courseInfo)
        .then(response => {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.$router.push({ name: 'add-chapter', params: { id: this.courseInfo.id }})
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
    },
    // 点击下一步按钮执行保存或更新
    saveOrUpdate() {
      if (this.$route.params && this.$route.params.id) {
        this.courseInfo.id = this.$route.params.id
        this.updateData()
      } else {
        this.saveData()
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 20px;
}
</style>
