import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import ramInfo from "./untils/ramInfo/ramInfo";
import localInfo from "./untils/localInfo/localInfo";

/*第一次进来将浏览器中的存储的用户信息存储到内存中*/
const info = localInfo.getLocalData();
ramInfo.user = info;

ReactDOM.render(<App />, document.getElementById('root'));


