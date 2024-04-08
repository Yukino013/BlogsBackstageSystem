<template>
  <div>
    <n-button @click="showAddModal = true">添加</n-button>

    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categoryList" :key="index">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <n-space>
              <!-- 将修改界面展开并得到要更新的分类的id -->
              <n-button @click="showUpdateModal = true,updateCategory.id = category.id,updateCategory.name = category.name">修改</n-button>
              <!-- 将要删除的分类传去 -->
              <n-button @click="deleteCategory(category)">删除</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>

    <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
      <template #header>
        <div>添加分类</div>
        <div>
          <n-input
            v-model:value="addCategory.name"
            type="text"
            placeholder="请输入名称"
          />
        </div>
      </template>
      <template #action>
        <n-button @click="add">提交</n-button>
      </template>
    </n-modal>

    <template>
      <n-modal v-model:show="showUpdateModal">
        <n-card
          style="width: 600px"
          title="修改分类"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <template #header-extra></template>
          <n-input
            v-model:value="updateCategory.name"
            type="text"
            placeholder="请输入修改后的名称"
          />
          <template #footer>
            <n-button @click="update">确认修改</n-button>
          </template>
        </n-card>
      </n-modal>
    </template>
  </div>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router"; // 引入路由模块，用于页面跳转。  import { NMessageProvider, NNotificationProvider } from 'naive-ui'; // 引入naive-ui库，用于消息提示。  import { NCard, NForm, NFormItem, NInput, NButton, NCheckbox } from 'naive-ui'; // 引入naive-ui库，用于表单。  import { NMessage, NNotification } from 'naive-ui'; // 引入naive-ui库，用于消息提示。  import { NDialog } from 'naive-ui'; // 引入naive-ui库，用于弹出对话框。

const router = useRouter(); // 创建路由实例。  const route = useRoute(); // 创建路由实例。  const admin = reactive({ // 创建一个响应式对象，用于存储管理员信息。  account: '', // 账号。  password: '', // 密码。  rember: false // 是否记住密码。  });
const route = useRoute(); // 创建路由实例。  const admin = reactive({ // 创建一个响应式对象，用于存储管理员信息。  account: '', // 账号。  password: '', // 密码。  rember: false // 是否记住密码。  });
const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");
const adminStore = AdminStore();
const categoryList = ref([]); // 创建一个响应式数组，用于存储分类列表。
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const addCategory = reactive({
  name: "",
});
const updateCategory = reactive({
  id:0,
  name: "",
});

// 挂载时执行一次，用于获取分类数据。
onMounted(() => {
  loadDatas();
});

  // 获取分类数据并打印分类数据。
const loadDatas = async () => {
  let res = await axios.get("/category/list"); // 获取分类数据。
  categoryList.value = res.data.rows;
};

// 添加分类
const add = async () => {
  let res = await axios.post(
    "/category/_token/add",
    { name: addCategory.name },
  );
  if (res.data.code == 200) {
    showAddModal.value = false;
    //重新获取分类数据
    loadDatas();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
};

// 修改分类
const update = async () => {
  let res = await axios.put("/category/_token/update", {
    id:updateCategory.id,
    name: updateCategory.name,
  });
  if (res.data.code == 200) {
    //关闭修改界面
    showUpdateModal.value = false;
    loadDatas();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
};


// 删除分类
const deleteCategory = async (category) => {
  //对删除添加警告对话框 这里用到了dialog
  dialog.warning({
    title: "警告",
    content: "确定要删除吗？",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      //  删除分类及删除它关联的文章
        let res = await axios.delete(
          `/category/_token/delete?id=${category.id}`
        );
        let blogres = await axios.get(
          `/category/_token/deleteCategory?categoryId=${category.id}`
        )
        if (res.data.code == 200 &&blogres.data.code == 200) {
          loadDatas();
          message.info(res.data.msg);
        } else {
          message.error(res.data.msg);
        }
      },
    onNegativeClick: () => {
    },
  });
};


</script>

<style lang="scss" scoped></style>
