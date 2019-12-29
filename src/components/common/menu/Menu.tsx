import React,{useEffect,useState,useMemo} from 'react'
import logo from '../../../assets/img/logo.png';
import {Menu,Icon} from 'antd';
// import ramInfo from '../../../untils/ramInfo/ramInfo';
import menuList from '../../../config/initMenu';
import {Link} from 'react-router-dom';
import {IInfo,IHistory} from "../../../types";
import "./menu.css";

const { SubMenu } = Menu;

const MenuUI:React.FC<IHistory>=({history})=>{

    /*获取当前的路由地址*/ 
    let {pathname} = history.location;

    /*如果用户直接输入根目录地址进行访问，那么定义比对的路由地址为/home,否则会导致默认菜单选择不正确*/ 
    const nowPathname = pathname === "/" ? "/home" : pathname;

    /*定义一个默认的状态值，用于存储初始化的菜单列表*/
    const [initDom,setInitDom] = useState<null | JSX.Element>(null);

    /*设置2个state状态值，一个是菜单展开的key，一个是菜单选中的key*/ 
    const [openKey,setOpenKey] = useState<string>("");
    const [selectKey,setSelectKey] = useState<string>("");

    /*useMemo在渲染期间就会执行.在这里调用我们的函数获取当前需要选中的菜单项*/
    useMemo(() => {
        return (():void=>{
            menuList.forEach((item:IInfo)=>{
                if(item.children instanceof Array){
                    const cItem = item.children.find(c=>nowPathname.indexOf(c.key) !== -1);
                    if(cItem){
                        /*设置菜单的key*/ 
                        setOpenKey(item.key);
                        setSelectKey(cItem.key);
                    }
                }else{
                    (nowPathname.indexOf(item.key) !== -1) &&  setSelectKey(item.key);
                }
            })
        })()
    },[nowPathname]);

    /*模板渲染完成后，初始化菜单*/
    useEffect(() => {
        const initMenu = ((list:any)=>{
            return list.reduce((pre:JSX.Element[],item:IInfo):JSX.Element[]=>{
                if(!item.children){
                    pre.push(
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>                        
                            </Link>
                        </Menu.Item>
                    )
                }else{
                    pre.push(
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {initMenu(item.children)}
                    </SubMenu>
                    )
    
                }
                return pre;
            },[])
        })
        setInitDom(initMenu(menuList));
    }, [])

    return (
        <div>
            <div className="nav-title">
                <img src={logo} alt="logo"/>
                <h1>测试后台</h1>
            </div>
            <div>
                <Menu
                    defaultSelectedKeys={[selectKey]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {initDom}
                </Menu>                
            </div>
        </div>
    )
}
export default MenuUI