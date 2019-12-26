import Ajax from './ajax';
import jsonp from 'jsonp';
import {message} from 'antd';

/*登陆请求*/ 
export const reqLogin = (username:string,password:string)=>{
    return Ajax("/login",{username,password},"POST")
}

interface IPWeather{
    dayPictureUrl:string,
    weather:string
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