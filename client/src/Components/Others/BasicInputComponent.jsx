

function BasicInputComponent({ inputClass, type, name, Icon = null, required = true, placeholder = "" }) {
    return (
        <div className="basic-input-holder">
            <label htmlFor={name}>{name}</label>
            <section>
                <input placeholder={placeholder} className={inputClass} required={required} name={name} type={type} />
                {Icon && <Icon className="input-icon" />}
            </section>
        </div>
    )
}

export default BasicInputComponent