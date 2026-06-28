import React, { Suspense } from "react"
import Header from "./Header";
import Footer from "./Footer";
import TopBar from "./TopBar";

// Componente de carga para usar con Suspense
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const Base = ({ children, summary, socials, generals }) => {
  return <>

    <TopBar socials={socials} />


    <Header socials={socials} generals={generals} />

    <main className="overflow-hidden min-h-[360px]">

      {children}

    </main>

    <Footer summary={summary} socials={socials} generals={generals} />

  </>
}

export default Base
