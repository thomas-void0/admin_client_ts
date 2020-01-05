import React,{
    useState,
    useImperativeHandle,
    forwardRef,
    Ref,
} from 'react'
import { Form,Input,Tree, message} from 'antd';
import menuList from "../../../config/initMenu";
import {IRole,IRoles} from "../role-interface";
import {reqGetAuth} from "../../../network";
import ramInfo from "../../../untils/ramInfo/ramInfo";

const Item = Form.Item;
const {TreeNode} = Tree;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}

interface IProps{
    name:string,
    role:IRole,
    ref:Ref<IRef>,
    setRoles:(value:IRoles[])=>void,
    roles:IRoles[]
}

interface IRef{
    setRoleAuth:()=>void
}

//定义初始化树状图菜单的配置接口
interface IMenuList{
    title:string,
    key:string,
    icon:string,
    isPublic?:boolean,
    children?:IMenuList[]
}

const Auth:React.FC<IProps>=forwardRef(({name,role,setRoles,roles},ref)=>{
    // 初始化权限树状图
    const initAuthList = (menuList:IMenuList[]):JSX.Element[]=>{
        return menuList.reduce((pre:JSX.Element[],item:IMenuList)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                  {item.children ? initAuthList(item.children) : null}
                </TreeNode>                
            )
            return pre
        },[])
    }
    const [authList] = useState<JSX.Element[]>(initAuthList(menuList));
    // 选择回调
    const [menus, setmenus] = useState<string[]>(role.menus);
 
    const onSelect = (checkedKeys:any)=>{
        setmenus(checkedKeys);
    }
    // 赋予权限请求
    useImperativeHandle(ref,()=>({
        setRoleAuth:async ()=>{
            const _id = role._id;
            const auth_name = ramInfo.user.username;
            const auth_time = Date.now();
            const result = await reqGetAuth({_id,menus,auth_name,auth_time});
            const {data,status} = result.data;
            if(status === 0) {
                message.success(`角色赋予权限成功`);
                //更行当前角色列表
                const newRoles =  [...roles].filter((item:IRoles | any)=>{
                    item._id === data._id &&  Object.keys(data).forEach((key:string)=>item[key] = data[key])
                    return item;
                })
                setRoles(newRoles);
            }else{
                message.error(`角色赋予权限失败:${result.data.msg}`);
            }
        }
    }))
    return (
        <div>
            <Form {...formItemLayout}>
                <Item label="角色名称：">
                    <Input
                        disabled
                        value={name}
                    />
                </Item>
            </Form>   
        <Tree
            checkable
            defaultExpandAll={true}
            onCheck={onSelect}
            checkedKeys={menus}
        >
          {authList}
        </Tree>         
        </div>

    )
})
export default Auth;