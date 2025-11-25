import { useState } from "react"
import General from "../../../Utils/General"
import JobApplicationModal from "../Modals/JobApplicationModal"

const TopBarCopyright = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const copyright = General.get('copyright') ?? ''
  const content = copyright.replace(/\{\{([^}]+)\}\}/g, (match, code) => {
    try {
      return eval(code);
    } catch (error) {
      console.error('Error evaluating code:', error);
      return match;
    }
  });

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <>
      <div className={` text-sm font-medium py-3  text-center px-primary flex justify-between items-center  flex-wrap ${data?.class_container || "bg-white customtext-neutral-light"} `}>
        <p>{content}   <span className="italic">  Powered by  <a href="https://www.mundoweb.pe" target="_blank" rel="noopener noreferrer">MundoWeb</a></span></p>

        {data?.showJobApplicationButton && (<button
          onClick={openModal}
          className="text-sm font-paragraph font-medium hover:underline transition-all duration-300 cursor-pointer"
        >
          Trabaja con nosotros
        </button>)}
      </div>

      <JobApplicationModal isOpen={modalOpen} onClose={closeModal} />
    </>
  )
}

export default TopBarCopyright