<template>
  <div id="index">
    <div class="header">排班系统</div>
    <div class="input_model">
      <div class="upload_excel">
        <UploadExcel ref="uploadExcel"></UploadExcel>
      </div>
      <div class="upload_form">
        <div class="school_plan">
          <SchoolPlan ref="schoolPlan"></SchoolPlan>
        </div>
        <div class="arrange_button">
          <el-button style="width: 100%" type="primary" size="default" @click="arrange()">开始分配</el-button>
        </div>
      </div>
    </div>
    <div class="teacher_list">
      <TeacherList></TeacherList>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    data() {
      return {
        f_path: {},
        shifts: [],
        params: []
      }
    },
    methods: {
      arrange() {
        this.f_path = this.$refs.uploadExcel.f_path
        this.shifts = this.$refs.schoolPlan.shifts
        let postForm = new FormData()
        Object.keys(this.f_path).forEach( key => {
          postForm.append(key, this.f_path[key])
        })
        Object.keys(this.shifts).forEach( key => {
          postForm.append(key, this.shifts[key])
        })
        axios.post("http://127.0.0.1:5001/submit", postForm).then(res => {
          console.log('提交成功', res)
        }, err => {
          console.log('提交失败', err)
        })
      },


    }
  }
</script>

<style scoped lang="less">
  #index {
    //width: 100%;
    background: blue;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .header {
      background: red;
      display: flex;
      position: relative;
      justify-content: center;
      margin: 20px auto;
      font-size: 30px;
      font-weight: 800;
    }

    .input_model {
      background: pink;
      display: flex;
      justify-content: space-between;
      padding: 10px;
      margin: 0 20px;
      //width: 100%;
      height: 300px;

      .upload_excel {
        background: #f8f8f8;
        border-radius: 5px;
        margin-bottom: 20px;
        width: 65%;
      }

      .upload_form {
        width: 30%;
        background: palegreen;
        display: flex;
        flex-direction: column;

        .school_plan {

        }

        .arrange_button {
          margin-left: 175px;
          margin-top: -70px;
          width: 85px;
        }
      }
    }

    .teacher_list {
      background: peru;
      padding: 10px;
      display: flex;
      margin: 0 20px;
    }
  }
</style>
