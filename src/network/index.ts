import Ajax from './ajax';
import jsonp from 'jsonp';
import {message} from 'antd';
import {IPWeather} from '../types/request-types';
import {IProduct} from "../types"

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

//更新商品的状态，上架/下架
export const reqUpdateStatus = (productId:string,status:number):Promise<any>=>{
    return Ajax("/manage/product/updateStatus",{productId,status},"POST")
}

/*添加分类*/
export const reqCategoryAdd = (parentId:string,categoryName:string):Promise<any>=>{
    return Ajax("/manage/category/add",{parentId,categoryName},"POST")
}

/*请求商品数据*/ 
export const reqProducts =(pageNum:number,pageSize:number):Promise<any>=>{
    return Ajax("/manage/product/list",{pageNum,pageSize},"GET")
}

/*搜索商品分页列表*/
export const reqSearchProducts = (pageNum:number,pageSize:number,searchName:string,searchType:string):Promise<any>=>{
    return Ajax("/manage/product/search",{pageNum,pageSize,[searchType]:searchName},"GET")
}

/*根据id获取分类*/
export const reqGetCategory = (categoryId:string):Promise<any>=>{
    return Ajax("/manage/category/info",{categoryId},"GET")
}

//删除图片
export const reqDeleteImg = (name:string):Promise<any> =>{
    return Ajax('/manage/img/delete',{name},"POST");
}

//添加商品
export const reqAddOrUpdateProduct = (product:IProduct)=>{
    return Ajax("/manage/product/"+(product._id ? "update" : "add"),product,"POST")
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