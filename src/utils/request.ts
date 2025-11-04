//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { useAuthStore } from  '@/store/store'
import { useTokenStore } from '@/store/token'//token存储
// @ts-ignore
import JSONBig from 'json-bigint';
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = '/v1';
const timeout = 3000; //设置请求超时时间
// 创建axios实例时同时设置baseURL和timeout
const instance = axios.create({
    baseURL: baseURL,
    timeout: timeout,
    headers: {
        'Content-Type': 'application/json' // ← 这样就全局设置了
      }
  });
//导入router
import router from '@/router';

//添加响应拦截器
instance.interceptors.response.use(//返回数据后触发
    result=>{
        if(result.data.success === true){
            return result.data;
        }
        // alert(result.msg?result.msg:'服务异常'+result.msg);
        // ElMessage.error(result.response.data.message??'后台服务异常');
        
        return Promise.reject(result.data);//异步的状态转化成失败的状态
    },
    err=>{
        console.log('请求错误:', err);
        //判断错误的状态码
        if(err.response.success === false){
            //
            const authStore = useAuthStore()
            authStore.clearCredentials() // 清除 Basic Auth 
            const tokenStore = useTokenStore()
            tokenStore.removeToken() // 清除 token

            ElMessage.error('认证失败，请重新登录')
            //跳转到登录页面
            router.push('/login');
        }else if(err.response.status === 403){
            ElMessage.error('没有权限');
        }else if(err.response.status === 301){
            ElMessage.error('重定向');
            router.push('/login');
        }
        else{
            ElMessage.error('请求失败: '+err.response.data.message);   
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

//添加请求拦截器
instance.interceptors.request.use(//请求前触发
    config=>{//请求前的拦截
        //获取token
        // const authStore = useAuthStore()
        // const authHeader = authStore.getAuthHeader(); // 调用 getAuthHeader 方法
        console.log('请求拦截器触发');
        const tokenStore = useTokenStore()
        const token = tokenStore.getToken();
        const authHeader = token ? `Bearer ${token}` : null;
        // console.log('authHeader:', authHeader);
        console.log(instance.defaults.headers);
        if (authHeader) {
            config.headers.Authorization = authHeader; // 设置请求头
        }
        //  输出日志，检查 Authorization 是否正确**
        // console.log('请求头:', config.headers);
        return config;
    },
    err=>{
        return Promise.reject(err);
    }
)
export default instance;