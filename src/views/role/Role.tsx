import React,{useEffect,useState} from 'react';
import {
    Card,
    Table,
    Button,
    Modal
} from 'antd'
import {reqGetRoles} from "../../network";
import getTime from '../../untils/getTIme/getTime';
import {IRoles} from "./role-interface";

const columns = [
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

    const title =(
        <span>
            <Button 
                style={{marginRight:"10px"}} 
                type="primary" 
                // onClick={()=>{showModalTitle("add")}}
            >
                创建角色
            </Button>
            <Button 
                type="primary" 
                // disabled = {!role._id}
                // onClick={()=>{showModalTitle("auth")}}
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
                    // selectedRowKeys:role._id,
                    // onSelect:onSelectCallback

                }}
                // onRow={onRow}
            />
            <Modal
                title="添加角色"
                visible={false}
                // onOk={roleOk}
                // onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
                >
                {/* <Add
                    getFieldDecorator={getFieldDecorator}
                /> */}
            </Modal>
            <Modal
                title="设置角色权限"
                visible={false}
                // onOk={authOk}
                // onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
                >
                {/* <Auth 
                    name={name} 
                    authList={authList}
                    onSelect={onSelect}
                    checkedKeys={checkedKeys}
                /> */}
            </Modal>
        </Card>
    )
}

export default Role;