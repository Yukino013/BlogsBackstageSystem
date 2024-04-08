<template>
    <div class="main-panel">
      <div class="menus">
        <div v-for="(menu,index) in menus" @click="toPage(menu)" :key="index">
            {{ menu.name }}
        </div>
      </div>
      <div style="padding:20px;width: 100%;">
        <router-view></router-view>
      </div> 
    </div>  
    <div class="title">后台管理系统</div>
</template>

<script setup>
import {AdminStore} from '../../stores/AdminStore'
import {ref, reactive, inject} from 'vue';
import {useRouter,useRoute} from 'vue-router' // 引入路由模块，用于页面跳转。  import { NMessageProvider, NNotificationProvider } from 'naive-ui'; // 引入naive-ui库，用于消息提示。  import { NCard, NForm, NFormItem, NInput, NButton, NCheckbox } from 'naive-ui'; // 引入naive-ui库，用于表单。  import { NMessage, NNotification } from 'naive-ui'; // 引入naive-ui库，用于消息提示。  import { NDialog } from 'naive-ui'; // 引入naive-ui库，用于弹出对话框。


const router = useRouter(); // 创建路由实例。  const route = useRoute(); // 创建路由实例。  const admin = reactive({ // 创建一个响应式对象，用于存储管理员信息。  account: '', // 账号。  password: '', // 密码。  rember: false // 是否记住密码。  });
const route = useRoute(); // 创建路由实例。  const admin = reactive({ // 创建一个响应式对象，用于存储管理员信息。  account: '', // 账号。  password: '', // 密码。  rember: false // 是否记住密码。  });
const axios = inject('axios');
const adminStore = AdminStore();



let menus = [
    {name:"文章管理",href:"/dashboard/article"},
    {name:"分类管理",href:"/dashboard/category"},
    {name:"个人管理",href:"/dashboard/person"}, 
    {name:"退出",href:"/dashboard/logout"},
    ]


const toPage = (menu) => {
    if(menu.href == "/dashboard/logout"){
        router.push("/login")
    }else {
        router.push(menu.href)  // 跳转到指定的路由。
    }
}
</script>

<style lang="scss" scoped>
    .main-panel{
        display: flex;
        color: #64676a;
        max-width: 1500px;
    }
    .menus{
        padding: 20px 0;
        box-sizing: border-box;
        line-height: 55px;
        text-align: center;
        width: 180px;
        height: 95vh;
        border-right: 1px solid #dadada;

        div{
            cursor: pointer;
            border-bottom: 1px solid #dadada;
            &:hover{
                color: #fd760e;
            }
        }
    }
</style>