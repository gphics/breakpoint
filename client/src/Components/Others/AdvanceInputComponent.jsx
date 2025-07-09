

function AdvanceInputComponent({ name, onChangeHandler, value, type = "text", Icon = null }) {
  /**
   * This component supports value props and also monitor value change events
   * This component can either use icon or not
   */
  return (
    <div className="advance-input-component">
      <label htmlFor={name}>{name}</label>
      <section>
        <input onChange={onChangeHandler} name={name} value={value} type={type} />
        {Icon ? <Icon className="input-icon" /> : <></>}
      </section>

    </div>
  )
}

export default AdvanceInputComponent