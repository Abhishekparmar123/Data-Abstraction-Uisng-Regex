import React, {useState} from 'react'
import Switch from "react-switch";


function SwitchComponent({checked, setChecked, text}) {
    return (
        <div className='is-flex is-justify-content-end my-5'>
            <label className='is-flex is-align-items-center'>
                <span className='mr-3'>{text}</span>
                <Switch 
                    onChange={(e) => setChecked(e)} 
                    checked={checked} 
                    uncheckedIcon={false}
                    height={20}
                    width={40}
                />
            </label>
        </div>
    )
}

export default SwitchComponent