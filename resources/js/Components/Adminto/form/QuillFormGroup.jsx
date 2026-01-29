import React, { useEffect, useRef } from "react"

const QuillFormGroup = ({ col, label, eRef, value, required = false, rows = 3, theme = 'snow', height = '100px', onChange = () => {} }) => {
  const quillRef = useRef()
  if (!eRef) eRef = useRef()

  useEffect(() => {
    const quill = new Quill(quillRef.current, { theme, modules: { toolbar: [[{ font: [] }, { size: [] }], ["bold", "italic", "underline", "strike"], [{ color: [] }, { background: [] }], [{ script: "super" }, { script: "sub" }], [{ header: [!1, 1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["direction", { align: [] }], ["link", "image", "video"], ["clean"]] } })

    quill.on('text-change', () => {
      const html = quill.root.innerHTML
      eRef.current.value = html
      onChange(html)
    });

    eRef.editor = quill
    quill.root.innerHTML = value ?? ''

    // --- HACK: Forzar tooltip de link a no salir del viewport ---
    // Observa el DOM para detectar el tooltip de Quill
    const observer = new MutationObserver(() => {
      const tooltip = document.querySelector('.ql-tooltip.ql-editing');
      if (tooltip) {
        // Obtener dimensiones del viewport
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const rect = tooltip.getBoundingClientRect();
        let top = rect.top, left = rect.left;
        let changed = false;
        // Si se sale por arriba
        if (rect.top < 0) { top = 10; changed = true; }
        // Si se sale por abajo
        if (rect.bottom > vh) { top = vh - rect.height - 10; changed = true; }
        // Si se sale por la izquierda
        if (rect.left < 0) { left = 10; changed = true; }
        // Si se sale por la derecha
        if (rect.right > vw) { left = vw - rect.width - 10; changed = true; }
        if (changed) {
          tooltip.style.position = 'fixed';
          tooltip.style.top = `${top}px`;
          tooltip.style.left = `${left}px`;
          tooltip.style.transform = 'none';
          tooltip.style.zIndex = 9999;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Cleanup
    return () => observer.disconnect();
  }, [])

  return <div className={`form-group ${col} mb-2`} style={{ height: 'max-content' }}>
    <label htmlFor='' className="mb-1">
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <div ref={quillRef} style={{ minHeight: height, fieldSizing: 'content', maxHeight: `calc(${height}*3)`, overflowY: 'auto' }}></div>
    <input ref={eRef} type="hidden" required={required} rows={rows} />
  </div>
}

export default QuillFormGroup