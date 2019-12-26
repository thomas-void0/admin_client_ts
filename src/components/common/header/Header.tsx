import React,{useState,useEffect,useMemo} from 'react';
import {reqWeather} from '../../../network/index';
import getTime from '../../../untils/getTIme/getTime';
import {Modal} from 'antd';
import ramInfo from '../../../untils/ramInfo/ramInfo';
import localInfo from "../../../untils/localInfo/localInfo";
import "./header.css";

const { confirm } = Modal;

interface IProps{
    navTitle:string,
    history:any
}

const Header:React.FC<IProps>=({history,navTitle})=>{
    const user = ramInfo.user || {username:""};
    /*点击退出按钮的时候执行的回调函数*/ 
    const showConfirm = ():void=>{
        confirm({
            title: '是否要退出?',
            okText: '退出',
            cancelText: '取消',
            onOk() {
            //清除掉内存中缓存的账号密码
            localInfo.removeLocalData();
            ramInfo.user = null;
            history.replace("/login");
            },
            onCancel() {},
        });
    }
    /*获取天气数据的图片和天气情况*/ 
    const [dayPictureUrl,setDayPictureUrl] = useState<string>("");
    const [weather,setWeather] = useState<string>("");
    /*设置显示时间*/ 
    const [time,setTime] = useState<string>("");

    /*得到天气数据*/ 
    const getWeatherInfo = async ()=>{
        const result = await reqWeather("成都");
        const {dayPictureUrl,weather} = result;
        setDayPictureUrl(dayPictureUrl);
        setWeather(weather);
    }

    /*请求得到天气数据*/ 
    useMemo(() => getWeatherInfo(), [dayPictureUrl,weather])

    /*当组件渲染完毕后，调用定时器，以及请求天气数据*/ 
    useEffect(()=>{
        const timerId = setInterval(()=>{
            getTimeNow()
        },1000)
        return ()=>{
            clearInterval(timerId);
        }

    },[])

    /*获取当前时间*/ 
    const getTimeNow = ()=>{
        const nowTime:string = getTime(Date.now());
        setTime(nowTime);
    }

    /*渲染的时候，执行一次时间缓存，防止刚进入时。没有显示时间*/
    useMemo(() => getTimeNow(), [time]);

    return (
        <div className="header">
            <div className="head-top">
                <span>欢迎,{user.username}</span>
                <button onClick={showConfirm}>退出</button>
            </div>
            <div className="head-bottom">
                <p>{navTitle}</p>
                <div>
                    <span>北京时间：{time}</span>
                    <span><img src={dayPictureUrl} alt="img"/></span>
                    <span>{weather}</span>
                </div>
            </div>
        </div>
    )
}
export default Header