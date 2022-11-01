<template>
  <el-tabs v-model="activeName" class="demo-tabs" :stretch=true @click="handleClick">
    <el-tab-pane label="千佛山校区" name="first">
      <span style="font-size: 14px; display: flex; justify-content: center; margin-bottom: 10px; margin-top: -30px">千佛山校区人员安排</span>
      <el-row v-for="item in qfs_shifts" style="margin-bottom: 5px">
        <span style="margin-right: 5px; font-size: 14px">{{ item.time }}</span>
        <el-input type="number" label="test" v-model="item.num" style="width: 100px" :min="0" @change="handleChange" />
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="长清湖校区" name="second">
      <span style="font-size: 14px; display: flex; justify-content: center; margin-bottom: 10px; margin-top: -30px">长清湖校区人员安排</span>
      <el-row v-for="item in cq_shifts" style="margin-bottom: 5px">
        <span style="margin-right: 5px; font-size: 14px">{{ item.time }}</span>
        <el-input type="number" label="test" v-model="item.num" style="width: 100px" :min="0" @change="handleChange" />
      </el-row>
    </el-tab-pane>
    <el-button type="primary" size="default" @click="onsubmit()">提交</el-button>
    <el-button size="default" @click="resetForm()">清空</el-button>
  </el-tabs>
</template>
<script>
  import { ref } from 'vue';
  import axios from "axios";
  import { ElMessage } from 'element-plus'
  export default {
    data() {
      return {
        activeName: 'first',
        shifts: [],
        qfs_shifts: [{
            time: '工作日白天值班人数',
            num: ref(0)
          }, {
            time: '工作日晚上值班人数',
            num: ref(0)
          }, {
            time: '休息日白天值班人数',
            num: ref(0)
          }, {
            time: '休息日晚上值班人数',
            num: ref(0)
          }],
        cq_shifts: [{
          time: '工作日白天值班人数',
          num: ref(0)
        }, {
          time: '工作日晚上值班人数',
          num: ref(0)
        }, {
          time: '休息日白天值班人数',
          num: ref(0)
        }, {
          time: '休息日晚上值班人数',
          num: ref(0)
        }],
      }
    },
    methods: {
      handleClick(event) {
        console.log(event)
      },

      handleChange(value) {
        console.log('change', this.qfs_shifts[0].num)
      },

      onsubmit() {
        let num_qfs = false
        this.qfs_shifts.map(shift => {
          if (shift.num !== 0) {
            num_qfs = true
          }
        })
        let num_cq = false
        this.cq_shifts.map(shift => {
          if (shift.num !== 0) {
            num_qfs = true
          }
        })
        if (num_qfs || num_cq) {  // 如果都为0，则提示重新填写
          let form = {
            qfs_num_weekday: this.qfs_shifts[0].num,
            qfs_num_weekday_night: this.qfs_shifts[1].num,
            qfs_num_weekend: this.qfs_shifts[2].num,
            qfs_num_weekend_night: this.qfs_shifts[3].num,
            cq_num_weekday: this.cq_shifts[0].num,
            cq_num_weekday_night: this.cq_shifts[1].num,
            cq_num_weekend: this.cq_shifts[2].num,
            cq_num_weekend_night: this.cq_shifts[3].num,
          }
          let postForm = new FormData()
          Object.keys(form).forEach( key => {
            postForm.append(key, form[key])
          })
          axios.post("http://127.0.0.1:5001/number", postForm).then(res => {
            console.log('提交成功', res.data)
            this.shifts = res.data
          }, err => {
            console.log('提交失败', err)
          })
        } else {
          ElMessage({
            showClose: true,
            message: '请输入人数.',
            type: 'warning',
          })
        }
      },

      resetForm() {
        this.qfs_shifts.map(shift => {
          shift.num = 0
        })

        this.cq_shifts.map(shift => {
          shift.num = 0
        })
        this.shifts = []
      }
    }
  }
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>