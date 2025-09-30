import React from "react"

const ContactSimple = React.lazy(() => import('./Contact/ContactSimple'))
const ContactGrid = React.lazy(() => import('./Contact/ContactGrid'))
const ContactAko = React.lazy(() => import('./Contact/ContactAko'))
const ContactKatya = React.lazy(() => import('./Contact/ContactKatya'))
const ThankContact = React.lazy(() => import('./Contact/ThankContact'))
const Contact = ({ which, data, contacts, setContact,generals=[] }) => {
  const getContact = () => {
    switch (which) {
      case 'ContactSimple':
        return <ContactSimple data={data} contacts={contacts} setContact={setContact} />
      case 'ContactGrid':
        return <ContactGrid data={data} contacts={contacts} setContact={setContact} />
      case 'ContactAko':
        return <ContactAko data={data} contacts={contacts} setContact={setContact} />
      case 'ContactKatya':
        return <ContactKatya data={data} contacts={contacts} setContact={setContact} generals={generals} />
      case 'ThankContact':
        return <ThankContact data={data}  />
        default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getContact()
}

export default Contact