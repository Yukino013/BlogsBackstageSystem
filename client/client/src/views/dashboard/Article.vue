<template>
  <n-tabs v-model:value="tabValue" justify-content="start" type="line">
    <n-tab-pane name="list" tab="文章列表">
      <div
        v-for="(blog, index) in blogs"
        style="margin-bottom: 15px"
        :key="index"
      >
        <n-card :title="blog.title">
          <!-- 将html转化为文本 -->
          {{ sanitizeHTML(blog.content) }}
          <template #footer>
            <!-- 垂直居中 -->
            <n-space align="center">
              <div>发布时间：{{ blog.create_time }}</div>
              <n-button @click="toUpdate(blog)">修改</n-button>
              <n-button @click="toDelete(blog)">删除</n-button>
            </n-space>
          </template>
        </n-card>
      </div>
      <n-space>
        <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
          <div :style="`color:` + (pageNum == pageInfo.page ? 'blue' : '')">
            {{ pageNum }}
          </div>
        </div>
      </n-space>
    </n-tab-pane>

    <n-tab-pane name="add" tab="添加文章">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="addArticle.categoryId"
            :options="categoryOptions"
          />
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="addArticle.content"></rich-text-editor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="add">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>

    <n-tab-pane
      :disabled="tabValue == 'update' ? false : true"
      name="update"
      tab="修改文章"
    >
      <n-form>
        <n-form-item label="标题">
          <n-input
            v-model:value="updateArticle.title"
            placeholder="请输入标题"
          />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="updateArticle.categoryId"
            :options="categoryOptions"
          />
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="update">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router"; // 引入路由模块，用于页面跳转。  import { NMessageProvider, NNotificationProvider } from 'naive-ui'; // 引入naive-ui库，用于消息提示。  import { NCard, NForm, NFormItem, NInput, NButton, NCheckbox } from 'naive-ui'; // 引入naive-ui库，用于表单。  import { NMessage, NNotification } from 'naive-ui'; // 引入naive-ui库，用于消息提示。  import { NDialog } from 'naive-ui'; // 引入naive-ui库，用于弹出对话框。
import RichTextEditor from "../../components/RichTextEditor.vue";
("../../components/RichTextEditor.vue");
const router = useRouter(); // 创建路由实例。  const route = useRoute(); // 创建路由实例。  const admin = reactive({ // 创建一个响应式对象，用于存储管理员信息。  account: '', // 账号。  password: '', // 密码。  rember: false // 是否记住密码。  });
const route = useRoute(); // 创建路由实例。  const admin = reactive({ // 创建一个响应式对象，用于存储管理员信息。  account: '', // 账号。  password: '', // 密码。  rember: false // 是否记住密码。  });
const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");
const adminStore = AdminStore();

const addArticle = reactive({
  categoryId: "",
  title: "",
  content: "",
});

const updateArticle = reactive({
  id: 0,
  categoryId: "",
  title: "",
  content: "",
});

const tabValue = ref("list");

const categoryOptions = ref([]);

const blogs = ref([]); // 创建一个响应式对象，用于存储博客列表。

const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
});
onMounted(() => {
  loadBlogs(); //加载博客列表。
  loadCategory(); // 加载分类数据。
});

const loadCategory = async () => {
  let res = await axios.get("/category/list");
  categoryOptions.value = res.data.rows.map((item) => ({
    label: item.name,
    value: item.id,
  }));
};

const loadBlogs = async () => {
  let res = await axios.get(
    `/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
  );
  let temp_rows = res.data.data.rows;
  for (let row of temp_rows) {
    row.content += "...";
    let d = new Date(row.create_time); // 创建一个Date对象。
    row.create_time = `${d.getFullYear()}年${
      d.getMonth() + 1
    }月${d.getDate()}日`; // 格式化日期。
  }
  blogs.value = temp_rows; // 将博客列表赋值给响应式对象。
  // blogs.value = res.data.data.rows.map((item)=>({
  //   id: item.id, // 博客id。
  //   categoryId: item.category_id, // 分类id。
  //   title: item.title, // 博客标题。
  //   content: item.content, // 博客内容。
  //   createTime: item.create_time, // 创建时间。
  // }))
  pageInfo.count = res.data.data.count; // 总记录数。
  //计算出总页数
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize); // 总页数。
};

//检验文章标题是否重复

  const checkDuplicateTitle = async (title) => {
    let res = await axios.get(`/blog/checkDuplicateTitle?title=${title}`);
    if (res.data.code == 200) {
      console.log(res);
    return false // 返回false，表示标题重复。
  }else{
    return true // 返回true，表示标题可用。
  }
}

const add = async () => {
  if (!addArticle.title || !addArticle.categoryId) {
    message.error("请填写完整信息");
    return;
  }
  let response = await checkDuplicateTitle(addArticle.title); // 检查标题是否重复。
  console.log(response);
 if(response == true){
  let res;
  try {
    res = await axios.post("/blog/_token/add", addArticle);
    if (res.data.code == 200) {
      message.info(res.data.msg);
      addArticle.title = "";
      addArticle.content = "";
      addArticle.categoryId = ""; // 清空表单数据。
    } else {
      message.error(res.data.msg);
    }
    loadBlogs();
    tabValue.value = "list"; // 切换到列表页。
  } catch (error) {
    message.error("网络错误，请稍后重试");
  }
 }else{
  message.error("标题已存在，请选择一个不同的标题");
  return;
 }
  
};

const update = async () => {
  let res = await axios.put(`/blog/_token/update`, updateArticle); // 更新博客。
  if (res.data.code == 200) {
    message.info(res.data.msg);
    updateArticle.title = "";
    updateArticle.content = "";
    // updateArticle.categoryId = 0 // 清空表单数据。
  } else {
    message.error(res.data.msg);
  }
  loadBlogs(); // 重新加载博客列表。
  tabValue.value = "list"; // 切换到列表页。
};

const toPage = (pageNum) => {
  pageInfo.page = pageNum; // 设置当前页码。
  loadBlogs();
};

const toUpdate = async (blog) => {
  tabValue.value = "update";

  // let res = await axios.get(`/blog/_token/list`); // 获取博客详情。
  let res = await axios.get(`/blog/detail?id=${blog.id}`); // 获取分类列表。

  // let resCategory = await axios.get("/category/list");
  // updateArticle.categoryId = res.row
  console.log(res);
  updateArticle.id = blog.id; // 博客id。
  updateArticle.title = res.data.rows[0].title; // 博客标题。
  updateArticle.content = res.data.rows[0].content; // 博客内容。
  updateArticle.categoryId = res.data.rows[0].category_id; // 分类id。
  console.log(res);
};

const toDelete = async (blog) => {
  dialog.warning({
    title: "警告",
    content: "确定要删除吗？",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      let res = await axios.delete(`/blog/_token/delete?id=${blog.id}`);
      if (res.data.code == 200) {
        loadBlogs();
        message.info(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
    },
    onNegativeClick: () => {},
  });
};

// 将html内容转换为纯文本。
const sanitizeHTML = (html) => {
  let doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};
</script>

<style lang="scss" scoped></style>
