import React,{useEffect,useState} from 'react'
import logo from '../../../assets/img/logo.png';
import {Menu,Icon} from 'antd';
// import ramInfo from '../../../untils/ramInfo/ramInfo';
import menuList from '../../../config/initMenu';
import {Link} from 'react-router-dom';
import "./menu.css";

const { SubMenu } = Menu;

/*定义传入的菜单列表参数*/ 
interface IInfo{
    title:string,
    key:string,
    icon:string,
    isPublic?:boolean,
    children?:any
}

/*获取父级传入的菜单选中值*/ 
interface IProps{
    openKey:string,
    selectKey:string
}


const MenuUI:React.FC<IProps>=({openKey,selectKey})=>{

    /*定义一个默认的状态值，用于存储初始化的菜单列表*/
    const [initDom,setInitDom] = useState<null | JSX.Element>(null);

    /*根据传入的菜单信息初始化列表菜单*/
    const initMenu = (list:any)=>{
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
    }

    /*模板渲染完成后，初始化菜单*/
    useEffect(() => {
        const init = initMenu(menuList);
        setInitDom(init);
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