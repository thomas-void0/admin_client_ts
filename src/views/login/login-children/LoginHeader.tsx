import React from 'react';

import "./login-children.css";
import Logo from '../../../assets/img/logo.png'


const LoginHeader: React.FC= () => {
  return (
    <div className="login-header">
        <div>
            <img src={Logo} alt="logo"/> 
        </div>
        <span>测试管理系统</span>
    </div>
  );
}
export default LoginHeader;
