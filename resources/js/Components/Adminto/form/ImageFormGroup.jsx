import React, { useEffect, useRef, useState } from "react"

const ImageFormGroup = ({ id, col, label, eRef, required = false, onChange = () => { }, aspect = '21/9', hidden = false, name }) => {

  if (!id) id = `ck-${crypto.randomUUID()}`
  if (!eRef) eRef = useRef()
  if (!name) name = id

  const imageRef = useRef()
  const [hasImage, setHasImage] = useState(false)
  const [deleteFlag, setDeleteFlag] = useState(false)

  const onImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = await File.toURL(file)
      imageRef.current.src = url
      setHasImage(true)
      setDeleteFlag(false) // Reset delete flag when new image is selected
    }
    onChange(e)
  }

  const onImageDelete = () => {
    imageRef.current.src = '/api/cover/thumbnail/null'
    eRef.current.value = ''
    setHasImage(false)
    setDeleteFlag(true)
  
    // Trigger onChange to notify parent component
    onChange({ target: { files: [] } })
  }

  // Expose functions to parent component
  const getDeleteFlag = () => deleteFlag
  const resetDeleteFlag = () => setDeleteFlag(false)

  useEffect(() => {
    eRef.image = imageRef.current
    eRef.getDeleteFlag = getDeleteFlag
    eRef.resetDeleteFlag = resetDeleteFlag
  
    // Check if image has a valid source on mount
    const checkImageSrc = () => {
      const src = imageRef.current?.src
      setHasImage(src && src !== '/api/cover/thumbnail/null' && !src.includes('null'))
    }
    checkImageSrc()
  }, [deleteFlag])

  return <div className={`form-group ${col} mb-2`} hidden={hidden}>
    <label htmlFor={id} className="form-label">
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <div style={{ position: 'relative', width: '100%' }}>
      <label htmlFor={id} style={{ width: '100%' }}>
        <img ref={imageRef} className="d-block border" src="" onError={e => e.target.src = '/api/cover/thumbnail/null'} onLoad={() => {
          const src = imageRef.current?.src
          setHasImage(src && src !== '/api/cover/thumbnail/null' && !src.includes('null'))
        }} style={{
          width: '100%',
          borderRadius: '4px',
          cursor: 'pointer',
          aspectRatio: aspect,
          objectFit: 'cover',
          objectPosition: 'center',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,.125)'
        }} />
      </label>
      {hasImage && (
        <button
          type="button"
          onClick={onImageDelete}
          className="btn btn-danger btn-sm"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px',
            zIndex: 10
          }}
          title="Eliminar imagen"
        >
          <i className="fa fa-trash"></i>
        </button>
      )}
    </div>
    <input ref={eRef} id={id} type="file" src="" alt="" hidden accept="image/*" onChange={onImageChange} />
  </div>
}

export default ImageFormGroup