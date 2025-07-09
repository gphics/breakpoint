import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function PasswordInputComponent({ name, required = true, inputClass = "", minLength = 6, placeholder = "", Icon = null, value = "", onChangeHandler = null }) {
    const [isPassword, setIsPassword] = useState(true)
    return (
        <div className="basic-input-holder">
            <label htmlFor={name}>{name}</label>
            <section>
                {/* Deciding what and how the input element is rendered base on the existence of onChangeHandler function */}
                {onChangeHandler ? <input minLength={minLength} onChange={onChangeHandler} value={value} name={name} type={isPassword ? "password" : "text"} /> :
                    <input placeholder={placeholder} minLength={minLength} className={inputClass} required={required} name={name} type={isPassword ? "password" : "text"} />}
                {isPassword ? <FaEyeSlash className="input-icon" onClick={(e) => setIsPassword(false)} /> : <FaEye onClick={(e) => setIsPassword(true)} className="input-icon" />}
            </section>
        </div>
    )
}

export default PasswordInputComponent