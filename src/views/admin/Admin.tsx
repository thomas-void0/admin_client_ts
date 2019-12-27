import React from 'react';
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
import ramInfo from '../../untils/ramInfo/ramInfo';


const {Footer, Sider, Content } = Layout;


/*定义当前的路由地址接口*/ 
interface IProps{
    history:any
}

const Admin: React.FC<IProps> = ({history}) => {
    /*用户进来的时候做一个检测，如果没有登陆就跳转到登陆页面*/ 
    const user = ramInfo.user || "";
    if(JSON.stringify(user) === "{}" || user === ""){
        /*信息为空，说明没有登陆*/
        history.replace("/login");
    }

    return (
        <Layout style={{minHeight:"100%"}}>
            <Sider style={{width:"256px"}}>
            <MenuUI 
                history={history} 
            />
            </Sider>
            <Layout>
            <Head  
                history={history}
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
            <Footer style={{backgroundColor:"white",textAlign:"center",fontSize:"24px",color:"#1890ff"}}>Hello TypeScript!</Footer>
        </Layout>
  </Layout>
  );
}

export default Admin;