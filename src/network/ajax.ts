import axios from 'axios';
import {message} from "antd";

/*定义默认参数的接口，对参数类型进行约束*/
interface IDefault{
    timeout:number
}

/*配置默认的参数*/
const defaultValue:IDefault = {
    timeout:5000,/*设置延迟时间*/
}
/*新建axios实例*/
const instane = axios.create(
    defaultValue
);

/*
@url:传入的请求地址
@data:传入的请求参数
@type:请求的类型POST/GET
*/ 
export default (url:string,data?:any,type:string="GET")=>{
    return new Promise((resolve,reject)=>{
        let reqData = null;
        if(type === "GET"){
            reqData = instane.get(url,{params:data});
        }else{
            reqData = instane.post(url,data);
        }
        /*处理axios响应的数据*/ 
        reqData.then(res=>{
            resolve(res);
        }).catch(err=>{
            /*响应出错，直接提示*/
            message.error("数据请求出错:",err)
        })

    })
}



