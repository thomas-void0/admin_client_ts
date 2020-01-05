import React,{useEffect,useState,useRef} from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    message
} from 'antd'
import {reqGetRoles,reqAddRole} from "../../network";
import getTime from '../../untils/getTIme/getTime';
import {IRoles,IRole} from "./role-interface";
import {ColumnProps,TableEventListeners} from "antd/es/table";
import Add from "./role-children/add";
import Auth from "./role-children/auth";

const columns:ColumnProps<IRoles>[] = [
    {
        title: '分类名称',
        dataIndex: 'name',
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        render:(create_time:number)=>getTime(create_time)
    },
    {
        title: '授权时间',
        dataIndex: 'auth_time',
        render:(auth_time:number)=>(auth_time ? getTime(auth_time) : "暂未授权")
    },
    {
        title: '授权人',
        dataIndex: 'auth_name',
        render:(auth_name:string)=>(auth_name ? auth_name : "暂未授权")
    },
]

const Role:React.FC = ()=>{
    // 点击表格每一行的回调函数
    const onRow = (record: IRoles):TableEventListeners=>{
        return {
            onClick:e=>{
                setRole(record);
            }
        }
        
    }
    // 当前选中的对象
    const [role, setRole] = useState<IRole | any>({});
    // 获得角色列表
    const [roles, setRoles] = useState<IRoles[]>([]);
    useEffect(() => {
        (async()=>{
            const result = await reqGetRoles();
            const {data,status} = result.data;
            if(status === 0){
                setRoles(data);
            }
        })()
    }, [])
    //单选框选择之后的回调
    const onSelectCallback = (role:IRole)=>{
        setRole(role);
        console.log(role);
    }
    // 点击显示创建角色
    const showModalTitle = (value:string):void=>{
        value === "add" ? setaddVisable(true) : setauthVisable(true);
    }
    const [addVisable, setaddVisable] = useState<boolean>(false);
    const [authVisable, setauthVisable] = useState<boolean>(false);
    //创建角色模态框点击确定
    const roleOk = ()=>{
        // 获取表单数据，发起请求
        refBox.current.validateFields(async (err:any,values:{roleName:string})=>{
            if(!err){
                const result = await reqAddRole(values.roleName);
                const {data,status} = result.data;
                if(status === 0){
                    message.success(`角色添加成功`)
                    //更新当前的角色列表
                    const newRoles = [...roles];
                    newRoles.push(data);
                    setRoles(newRoles);
                }else{
                    message.error(`角色添加失败:${result.data.msg}`)
                }
            }
        })
        setaddVisable(false)
    }
    // 创建ref对象挂载到add组件中
    const refBox = useRef<any>(null);
    //创建另外一个ref对象挂载到auth组件中
    const authRefBox = useRef<any>(null);
    //模态框点击取消
    const handleCancel = ()=>{
        setaddVisable(false)
        setauthVisable(false)
    }
    //设置角色权限模态框点击确定
    const authOk = ()=>{
        setauthVisable(false);
        authRefBox.current.setRoleAuth(); //触发子组件发起请求

    }
    const title =(
        <span>
            <Button 
                style={{marginRight:"10px"}} 
                type="primary" 
                onClick={()=>{showModalTitle("add")}}
            >
                创建角色
            </Button>
            <Button 
                type="primary" 
                disabled = {!role._id}
                onClick={()=>{showModalTitle("auth")}}
            >
                设置角色权限
            </Button>
        </span>
    )
    return (
        <Card title={title}>
            <Table
                columns={columns}
                dataSource={roles}
                bordered
                rowKey="_id"
                pagination={{
                    defaultPageSize:3,
                    showQuickJumper:true,
                    hideOnSinglePage:true,
                }}
                rowSelection={{
                    type:"radio",
                    selectedRowKeys:role._id,
                    onSelect:onSelectCallback

                }}
                onRow={onRow}
            />
            <Modal
                title="添加角色"
                visible={addVisable}
                onOk={roleOk}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
                >
                <Add
                ref={refBox}
                />
            </Modal>
            <Modal
                title="设置角色权限"
                visible={authVisable}
                onOk={authOk}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
                >
                <Auth 
                ref={authRefBox}
                name={role.name} 
                role={role}
                setRoles={setRoles}
                roles={roles}
                />
            </Modal>
        </Card>
    )
}

export default Role;