import React,{useState,useEffect,useMemo} from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import { Layout } from 'antd';
import MenuUI from '../../components/common/menu/Menu';
import Head from '../../components/common/header/Header';
import Home from '../home/Home';
import Category from '../category/Category';
import Product from '../product/Product';
import Bar from '../charts/Bar';
import Line from '../charts/Line';
import Pie from '../charts/Pie';
import Role from '../role/Role';
import User from '../user/User';
import NotFound from '../../components/no-found/NoFound';
import menuList from '../../config/initMenu';
import ramInfo from '../../untils/ramInfo/ramInfo';

const {Footer, Sider, Content } = Layout;


/*定义当前的路由地址接口*/ 
interface IProps{
    location:any,
    history:any
}

/*定义传入的菜单列表参数*/ 
interface IInfo{
    title:string,
    key:string,
    icon:string,
    isPublic?:boolean,
    children?:any
}

const Admin: React.FC<IProps> = ({location,history}) => {
    /*用户进来的时候做一个检测，如果没有登陆就跳转到登陆页面*/ 
    const user = ramInfo.user || "";
    if(JSON.stringify(user) === "{}" || user === ""){
        /*信息为空，说明没有登陆*/
        history.replace("/login");
    }

    /*设置2个state状态值，一个是菜单展开的key，一个是菜单选中的key*/ 
    const [openKey,setOpenKey] = useState<string>("");
    const [selectKey,setSelectKey] = useState<string>("");

    /*设置需要在头部显示的标题*/ 
    const [navTitle,setNavTitle] = useState<string>("");

    /*获取当前的路由地址*/ 
    const {pathname} = location;

    /*返回默认打开的菜单key和现实的标题内容*/ 
    const openKeysAndNavTitle = (init:boolean):void=>{
        menuList.forEach((item:IInfo)=>{
            if(item.children instanceof Array){
                const cItem = item.children.find(c=>c.key.indexOf(pathname) !== -1);
                if(cItem && init===true){
                    /*设置菜单的key*/ 
                    setOpenKey(item.key);
                    setSelectKey(cItem.key);
                    /*设置需要显示的标题*/ 
                    setNavTitle(cItem.title);

                }else if(cItem && init===false){
                    /*如果传入的是false，就只取得当前需要显示的标题*/ 
                    setNavTitle(cItem.title);
                }
            }else{
                if(item.key.indexOf(pathname) !== -1 && init === true){
                    setSelectKey(item.key);
                    /*设置需要显示的标题*/ 
                    setNavTitle(item.title);

                }else if(item.key.indexOf(pathname) !== -1 && init === false){
                    /*如果传入的是false，就只取得当前需要显示的标题*/ 
                    setNavTitle(item.title);
                }
            }

        })
    }

    /*useMemo在渲染期间就会执行.在这里调用我们的函数获取当前需要选中的菜单项*/
    useMemo(() => openKeysAndNavTitle(true),[setOpenKey,setSelectKey]);

    /*更改当前显示的标题内容*/ 
    useEffect(()=>{
        openKeysAndNavTitle(false);
    })

    return (
        <Layout style={{minHeight:"100%"}}>
            <Sider style={{width:"256px"}}>
            <MenuUI 
                openKey={openKey} 
                selectKey={selectKey} 
            />
            </Sider>
            <Layout>
            <Head  
                history={history}
                navTitle={navTitle}
            />
            <Content style={{margin:"20px",backgroundColor:"#fff"}}>
                <Switch>
                    <Redirect from='/' to='/home' exact/>
                    <Route path="/home" exact component={Home}/>
                    <Route path="/products/category" component={Category}/>
                    <Route path="/products/product" component={Product}/>
                    <Route path="/role" component={Role}/>
                    <Route path="/user" component={User}/>
                    <Route path="/charts/line" component={Line}/>
                    <Route path="/charts/bar" component={Bar}/>
                    <Route path="/charts/pie" component={Pie}/>
                    <Route component={NotFound}/>
                </Switch>
            </Content>
            <Footer style={{backgroundColor:"white",textAlign:"center",fontSize:"24px",color:"#1890ff"}}>Are you ok?</Footer>
        </Layout>
  </Layout>
  );
}

export default Admin;