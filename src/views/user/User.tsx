import React,{useEffect,useState,useRef} from 'react'
import {
    Card,
    Table,
    Modal,
    Icon,
    Button,
    message
} from 'antd';
import SlotButton from '../../components/common/slot-button/SlotButton';
import {reqGetUser,reqDeleteUser,reqAddUser,reqUpdateUser} from "../../network";
import getTime from "../../untils/getTIme/getTime";
import {IUserInfo,IData,IRoles} from "./user-interface";
import Add from "./Add";
import {IAddUser} from "../../types/request-types";

const User:React.FC<any>=()=>{
    const [userInfo, setUserInfo] = useState<IUserInfo[]>([]);
    const [rolesNames, setRolesNames] = useState<any>();
    //请求到初始化的数据
    const [roles, setRoles] = useState<IRoles[]>([]);
    useEffect(()=>{
        (async()=>{
            const result = await reqGetUser();
            const data:IData = result.data;
            if(data.status === 0){
                const {users,roles} = data.data;
                const rolesNames = roles.reduce((pre:any,role:any)=>{
                    pre[role._id] = role.name //给每一个对应的角色id对应上名字
                    return pre
                },{}) 
                setRoles(roles);
                setRolesNames(rolesNames);
                setUserInfo(users)
            }
        })()
    },[])

    const [user_id, setUser_id] = useState<string>("");
    const delUserModal = (user:IUserInfo)=>{
        setDelVisible(true);
        setUser_id(user._id);
    }

    // 修改用户信息
    const [addVisible, setAddVisible] = useState<boolean>(false);
    const [initValue, setInitValue] = useState<IAddUser | {}>({});
    const [_id, set_id] = useState<string>("");
    const updateUserModal = (user:IUserInfo):void=>{
        setFlag("update");
        setInitValue(user);
        set_id(user._id);
        setAddVisible(true);
    }
    // 创建一个ref对象调用add组件中的请求方法
    const addRefBox = useRef<any>(null);
    const handleOk =()=>{
        //收集表单数据，发起添加请求:
        addRefBox.current.validateFields( async (err:any,values:any)=>{
            if(!err){
                const {
                    username,
                    email,
                    password,
                    phone,
                    role_id,
                }=values;
                let result:any;
                if(flag === "add"){
                    result = await reqAddUser({username,email,password,phone,role_id})                
                }else{ //更新
                    result = await reqUpdateUser({_id,username,email,phone,role_id})
                }
                const {data,status} = result.data;
                const info  = flag === "add" ? "添加" : "修改";
                if(status === 0){
                    message.success(`用户${info}成功`);
                    addRefBox.current.resetFields();//清空输入框
                    let nowAlluserInfo:IUserInfo[] = [...userInfo];
                    if(flag === "add"){
                        nowAlluserInfo.push(data);
                    }else{
                        nowAlluserInfo = [...userInfo].filter((cItem:IUserInfo | any)=>{
                            if(cItem._id ===data._id){
                                Object.keys(cItem).forEach((key:string)=>{ //将对应键值对进行更新
                                    cItem[key] = data[key];
                                })
                            }
                            return cItem
                        });
                    }
                    setUserInfo(nowAlluserInfo); //更新用户数组
                }else{
                    message.error(`用户${info}失败`);
                }
            }
        })
        setAddVisible(false);
    }

    // 增加用户
    const [flag, setFlag] = useState<string>("");
    const addUser = ()=>{
        setFlag("add");
        setAddVisible(true);
    } 

    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '电话',
            dataIndex: 'phone',
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            render:(create_time:any)=>getTime(create_time)
        },
        {
            title: '角色',
            dataIndex: 'role_id', 
            render:(role_id:string)=>rolesNames[role_id] //根据id获取角色名字
    
        },
        {
            title: '操作',
            render:(user:IUserInfo)=>{
                return(
                    <span>
                        <SlotButton 
                            onClick={()=>{updateUserModal(user)}} 
                            style={{marginRight:"10px"}}
                        >
                            修改
                        </SlotButton>
                        <SlotButton onClick={()=>{delUserModal(user)}}>删除</SlotButton>                    
                    </span>
                )
            }
        },
    ]
    const title = (<Button onClick={addUser} type="primary" >增加用户</Button>)

    // 删除用户
    const [delVisible, setDelVisible] = useState<boolean>(false);
    const delUser =async ()=>{
        const result = await reqDeleteUser(user_id);
        if(result.data.status === 0){
            message.success(`删除角色成功`);
            //重新设置数据，刷新页面。
            setUserInfo(userInfo.filter((item:IUserInfo)=>item._id !== user_id));
        }
        setDelVisible(false);
    }
    const handleCancel = ():void=>{
        setAddVisible(false);
        setDelVisible(false);
    }
    return (
        <Card title={title}>
            <Table
                columns={columns}
                dataSource={userInfo}
                bordered
                rowKey="_id"
                pagination={{
                    defaultPageSize:3,
                    showQuickJumper:true,
                    hideOnSinglePage:true,
                }}
            />
            <Modal
                title="添加角色"
                visible={addVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
                >
                <Add 
                roles={roles}
                ref={addRefBox}
                initValue={initValue}
                flag = {flag}
                />
            </Modal>
            <Modal
                title="删除角色"
                visible={delVisible}
                onOk={delUser}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
                >
                
                <Icon 
                    style={{ fontSize: '24px', color: 'orange',marginRight:"10px" }}
                    type="question-circle"
                ></Icon>
                <span>是否要删除角色?</span>
            </Modal>
        </Card>
    )
}
export default User;