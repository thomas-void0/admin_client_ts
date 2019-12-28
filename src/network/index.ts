import Ajax from './ajax';
import jsonp from 'jsonp';
import {message} from 'antd';
import {IPWeather} from '../types/request-types';

/*登陆请求*/ 
export const reqLogin =(username:string,password:string):Promise<any>=>{
    return Ajax("/login",{username,password},"POST")
}

/*请求分类数据*/ 
export const reqCategorys = (parentId:string):Promise<any>=>{
    return Ajax("/manage/category/list",{parentId},"GET");
}

/*修改分类数据*/ 
export const reqCategoryUpdate = (categoryId:string,categoryName:string):Promise<any>=>{
    return Ajax("/manage/category/update",{categoryId,categoryName},"POST");
}

/*添加分类*/
export const reqCategoryAdd = (parentId:string,categoryName:string):Promise<any>=>{
    return Ajax("/manage/category/add",{parentId,categoryName},"POST")
}

/*天气api的jsonp请求*/ 
export const reqWeather = (city:string):Promise<IPWeather>=>{
    const url:string =`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    return new Promise((resolve,reject)=>{
        jsonp(url,{},(err,data)=>{
            if(!err && data.status === "success"){
                const {dayPictureUrl,weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl,weather})
            }else{
                message.error("获取天气信息失败"); //直接在这里处理错误
            }
        })
    })
}