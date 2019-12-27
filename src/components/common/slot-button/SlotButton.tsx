import React from 'react';
import "./slot-button.css";

const SlotButton:React.FC<any> = props=> {
    return (
        <button {...props} className="btn">{props.children}</button>
    )
}
export default SlotButton