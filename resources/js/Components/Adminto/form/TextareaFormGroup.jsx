import React from "react"

const TextareaFormGroup = ({ col, label, eRef, placeholder, required = false, rows = 3, value, onChange = () => {}, hidden = false }) => {
  return <div className={`form-group ${col} mb-2`} hidden={hidden}>
    <label htmlFor='' className="mb-1 form-label">
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <textarea
      ref={eRef}
      className='form-control'
      placeholder={placeholder}
      required={required && !hidden}
      rows={rows}
      value={value}
      style={{ minHeight: 120, maxHeight: 220, resize: 'vertical', overflow: 'auto' }}
      onChange={onChange}
    />
  </div>
}

export default TextareaFormGroup