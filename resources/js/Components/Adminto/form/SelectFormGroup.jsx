import React, { useEffect, useRef } from "react"

const SelectFormGroup = ({ id, col, className, value, label, eRef, required = false, children, dropdownParent, noMargin = false, multiple = false, disabled = false, onChange = () => { },
  templateResult,
  templateSelection,
  tags = false,
  minimumResultsForSearch,
  changeWith = [null],
  hidden
}) => {

  if (!eRef) eRef = useRef()
  if (!id) id = `select-${crypto.randomUUID()}`

  useEffect(() => {
    const $element = $(eRef.current);
    
    // Initialize Select2
    $element.select2({
      dropdownParent,
      templateResult,
      templateSelection,
      tags,
      minimumResultsForSearch
    });
    
    $element.on('change', onChange);

    return () => {
      $element.off('change', onChange);
      
      // Check if Select2 is initialized before destroying
      if ($element.hasClass('select2-hidden-accessible')) {
        $element.select2('destroy');
      }
    }
  }, [...changeWith, value, disabled])

  return <div className={`form-group ${col} ${!noMargin && 'mb-2'}`} hidden={hidden}>
    <label htmlFor={id} className="mb-1 form-label">
      {label} {(label && required) && <b className="text-danger">*</b>}
    </label>
    <select ref={eRef} id={id} required={required && !hidden} className={`form-control ${className}`} style={{ width: '100%' }} disabled={disabled} multiple={multiple} value={value}>
      {children}
    </select>
  </div>
}

export default SelectFormGroup