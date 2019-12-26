import React from 'react';
import LoginHeader from './login-children/LoginHeader';
import "./login-children/login-children.css";
import { Form, Icon, Input, Button,message } from 'antd';
import {reqLogin} from '../../network'
import ramInfo from '../../untils/ramInfo/ramInfo';
import localInfo from '../../untils/localInfo/localInfo';

/*表单收集的数据*/ 
interface FormValue{
  readonly  username:string,
  readonly  password:string
}

/*发送登陆请求后返回的数据*/
interface IData{
  data?:object, /*数据对象*/
  status:number, /*状态值*/
  msg?:string /*出现错误后，返回的报错信息*/
}

/*表单的props接口*/
interface IProps{
  form:any,
  history:any,
}

const Login:React.FC<IProps> = ({history,form}) => {
    const {replace} = history;
    /*先进行检测，如果内存中已经存在了这个登陆信息，就跳转到首页*/ 
    if(ramInfo.user && JSON.stringify(ramInfo.user) !== "{}"){
      replace("/");
    }
    /*表单提交数据*/
    const handleSubmit = (e:any):void => {
      e.preventDefault();
      form.validateFields(async (err:any, values:FormValue) => {
          if (!err) {
              /*发起登陆请求*/ 
              const {username,password} = values;
              const result:any = await reqLogin(username,password);
              const reqData:IData = result.data;
              if(reqData.status === 0){
                  /*将获取到的信息存储到内存文件中，方便我们在其他地方进行复用*/ 
                  ramInfo.user = reqData.data;
                  /*将登陆成功后的数据存储到浏览器内存中，方便我们做免登录*/ 
                  localInfo.saveLocalInfo(reqData.data);
                  message.success("登陆成功");
                  /*路由跳转到首页*/ 
                  replace("/");
              }else{
                  message.error("登陆失败:"+reqData.msg);
              }
          }
      });
  };

  /*密码验证*/
  const checkPassWord = (rule:null,value:string,callback:any):void=>{
      if(!value){
        callback("密码不能为空")
      }else if(value.length > 12){
        callback("密码的长度不能大于12")
      }else if(value.length < 4){
        callback("密码的长度不能小于4")
      }else if(!/^[a-zA-Z0-9]+$/.test(value)){
        callback("密码必须为大写或小写字母或者数字组成")
      }else{
        callback()
      }
  }
  const { getFieldDecorator } =form;
  return (
    <div className="login" >
        <LoginHeader/>
        <div className="login-box">
          <div className="form">
          <div className="form-box">
          <h1>用户登录</h1>
          <Form onSubmit={handleSubmit} className="login-form">
              <Form.Item>
              {getFieldDecorator('username', {
                  rules: [
                      {required: true,whitespace:true,message: '账号不能为空或者空格!' },
                      {max:12,message:"账号的长度小于等于12"},
                      {min:4,message:"账号的长度大于等于4"},
                      {pattern:/^[a-zA-Z0-9]+$/,message:"账号的必须为大写或者小写字母以及数字"}
                  ],
              })(
                  <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                  />,
              )}
              </Form.Item>
              <Form.Item>
                  {getFieldDecorator('password', {
                      rules: [
                          { validator:checkPassWord}
                      ],
                  })(
                      <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Password"
                      />,
                  )}
              </Form.Item>
              <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                  登陆
              </Button>
          </Form.Item>
      </Form>
      </div>
    </div>
    </div>
    </div>
  )
};

export default Form.create()(Login);