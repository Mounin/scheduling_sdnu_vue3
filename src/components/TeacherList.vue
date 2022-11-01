<template>
  <el-table :data="filterTeacherTable" stripe border style="width: 100%" max-height="300">
    <el-table-column prop="id" label="id" :sortable="true"/>
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="last_status" label="上次值班时间" width="120" />
    <el-table-column prop="num_weekday" label="工作日白天次数" :sortable="true" width="130" />
    <el-table-column prop="num_weekday_night" label="工作日晚上次数" :sortable="true" width="130" />
    <el-table-column prop="num_weekend" label="休息日白天次数" :sortable="true" width="130" />
    <el-table-column prop="num_weekend_night" label="休息日晚上次数" :sortable="true" width="130" />
    <el-table-column prop="cq" label="是否必须在长清湖校区" width="150" />
    <el-table-column prop="qfs" label="是否必须在千佛山校区" width="150" />
    <el-table-column label="Operations" width="150">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row); editDialogVisible = true">Edit</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row); deleteDialogVisible = true">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="editDialogVisible" title="编辑" width="30%" draggable>
    <span>
      <el-form :model="teacherEditForm" label-width="120px">
        <el-form-item label="id">
          <el-input v-model="teacherEditForm.id" :readonly=true />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="teacherEditForm.name" />
        </el-form-item>
        <el-form-item label="上次值班时间">
          <el-input v-model="teacherEditForm.last_status" />
        </el-form-item>
        <el-form-item label="工作日白天次数">
          <el-input v-model="teacherEditForm.num_weekday" type="number"/>
        </el-form-item>
        <el-form-item label="工作日晚上次数">
          <el-input v-model="teacherEditForm.num_weekday_night" type="number"/>
        </el-form-item>
        <el-form-item label="休息日白天次数">
          <el-input v-model="teacherEditForm.num_weekend" type="number"/>
        </el-form-item>
        <el-form-item label="休息日晚上次数">
          <el-input v-model="teacherEditForm.num_weekend_night" type="number"/>
        </el-form-item>
        <el-form-item label="是否必须在长清湖校区">
          <el-input v-model="teacherEditForm.cq" />
        </el-form-item>
        <el-form-item label="是否必须在千佛山校区">
          <el-input v-model="teacherEditForm.qfs" />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit(); editDialogVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="deleteDialogVisible" title="警告" width="30%" draggable>
    <span>
      您将要删除该行数据，并且不可恢复，是否确认删除？
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDelete(); deleteDialogVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import axios from 'axios'

// teavher的内容
interface Teacher {
  id: number
  name: string
  last_status: string
  num_weekday: number
  num_weekday_night: number
  num_weekend: number
  num_weekend_night: number
  cq: string
  qfs: string
}

const teachers = reactive([])

const getTeachers = () => {
  axios.get('http://127.0.0.1:5001/teachers').then(res => {
    teachers.splice(0, teachers.length)
    teachers.push(...res.data.results)
    teachers.map(teacher => {
      if(teacher.last_status == 'weekday') {
        teacher.last_status = '工作日白天'
      } else if(teacher.last_status == 'weekday_night'){
        teacher.last_status = '工作日晚上'
      } else if(teacher.last_status == 'weekend'){
        teacher.last_status = '休息日白天'
      } else if(teacher.last_status == 'weekend_night'){
        teacher.last_status = '休息日晚上'
      }
      if(teacher.cq == true) {
        teacher.cq = '是'
      } else {
        teacher.cq = '否'
      }
      if(teacher.qfs == true) {
        teacher.qfs = '是'
      } else {
        teacher.qfs = '否'
      }
    })
  })
}

// 查询
const search = ref('')
const filterTeacherTable = computed(() =>
    teachers.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

// 编辑teacher内容
let oldTeacherRow: Teacher
const teacherEditForm = reactive({
  id: 0,
  name: '',
  last_status: '',
  num_weekday: 0,
  num_weekday_night: 0,
  num_weekend: 0,
  num_weekend_night: 0,
  cq: '',
  qfs: ''
})
const handleEdit = (index: number, row: Teacher) => {
  oldTeacherRow = row
  teacherEditForm.id = oldTeacherRow.id
  teacherEditForm.name = oldTeacherRow.name
  teacherEditForm.last_status = oldTeacherRow.last_status
  teacherEditForm.num_weekday = oldTeacherRow.num_weekday
  teacherEditForm.num_weekday_night = oldTeacherRow.num_weekday_night
  teacherEditForm.num_weekend = oldTeacherRow.num_weekend
  teacherEditForm.num_weekend_night = oldTeacherRow.num_weekend_night
  teacherEditForm.cq = oldTeacherRow.cq
  teacherEditForm.qfs = oldTeacherRow.qfs
}
const editDialogVisible = ref(false)
const submitEdit = () => {
  // console.log('submitEdit', typeof teacherEditForm)
  let isEdit = false
  for(let key in teacherEditForm) {
    if(teacherEditForm[key] != oldTeacherRow[key]) {
      isEdit = true
      console.log(isEdit, typeof teacherEditForm[key], oldTeacherRow[key])
      break;
    } else {
      isEdit = false
    }
  }
  if(isEdit) {
    let postForm = new FormData()
    Object.keys(teacherEditForm).forEach( key => {
      postForm.append(key, teacherEditForm[key])
    })
    axios.post("http://127.0.0.1:5001/edit", postForm).then(res => {
      console.log('修改成功', res.data)
      getTeachers()
    }, err => {
      console.log('修改失败', err)
    })
  } else {
    console.log('未修改')
  }
}

// 删除
const deleteDialogVisible = ref(false)
let _index
let d_teacher_id
const handleDelete = (index: number, row: Teacher) => {
  console.log(index, row)
  _index = index
  d_teacher_id = row.id
}
const submitDelete = () => {
  teachers.splice(_index, 1) // 前端删除
  console.log(d_teacher_id)
  let postForm = new FormData()
  postForm.append('id', d_teacher_id)
  axios.post("http://127.0.0.1:5001/delete", postForm).then(res => {
    console.log('删除成功', res.data)
    getTeachers()
  }, err => {
    console.log('删除失败', err)
  })
}



// 页面渲染之后加载数据
onMounted(() => {
  getTeachers()
})
</script>

