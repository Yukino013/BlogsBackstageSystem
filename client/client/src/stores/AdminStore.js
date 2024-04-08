import {defineStore} from 'pinia'

export const AdminStore = defineStore('admin', {
    state:() =>{
        return{
            id:0,
            account: '', // 用户名或账号
            token: '', // 用户登录凭证，如token、session等
        }
    },
    actions:{},
    getters:{},  
})