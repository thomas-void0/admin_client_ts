import React,{useState,useEffect,useMemo} from 'react';
import {reqWeather} from '../../../network/index';
import getTime from '../../../untils/getTIme/getTime';
import {Modal} from 'antd';
import ramInfo from '../../../untils/ramInfo/ramInfo';
import localInfo from "../../../untils/localInfo/localInfo";
import menuList from '../../../config/initMenu';
import {IInfo,IHistory} from '../../../types';
import "./header.css";

const { confirm } = Modal;

const Header:React.FC<IHistory>=({history})=>{
    /*获取当前的路由地址*/ 
    const {pathname} = history.location;
    /*读取ramInfo中的用户信息*/
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
    /*设置需要在头部显示的标题*/ 
    const [navTitle,setNavTitle] = useState<string>("");
    /*设置显示时间*/ 
    const [time,setTime] = useState<string>(getTime(Date.now()));

    /*得到天气数据*/ 
    const getWeatherInfo = async ()=>{
        const result = await reqWeather("成都");
        const {dayPictureUrl,weather} = result;
        setDayPictureUrl(dayPictureUrl);
        setWeather(weather);
    }

    /*当组件渲染完毕后，调用定时器，以及请求天气数据*/ 
    useEffect(()=>{
        const timerId = setInterval(()=>{
            const nowTime:string = getTime(Date.now());
            setTime(nowTime);
        },1000)
        /*请求得到天气数据*/ 
        getWeatherInfo()
        return ()=>{
            /*组件卸载，清除定时器*/
            clearInterval(timerId);
        }
    },[])

    /*更改当前显示的标题内容,只有当pathname改变时，usememo才执行*/ 
    useMemo(()=>{
        return (():void=>{
            menuList.forEach((item:IInfo)=>{
                if(item.children instanceof Array){
                    const cItem = item.children.find(c=>c.key.indexOf(pathname) !== -1);
                    /*设置需要显示的标题*/ 
                    cItem && setNavTitle(cItem.title);
                }else{
                    /*设置需要显示的标题*/ 
                    (item.key.indexOf(pathname) !== -1) && setNavTitle(item.title);
                }
    
            })
        })()
    },[pathname])

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