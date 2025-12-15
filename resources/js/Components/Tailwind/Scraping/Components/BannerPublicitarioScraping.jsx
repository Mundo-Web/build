import { Tag } from "lucide-react";


const BannerPublicitarioScraping = ({ data }) => {

    return (
        <div className=" px-primary mx-auto py-16 font-paragraph">
            <div className=" flex  justify-between gap-8  w-full  rounded-3xl h-[500px] bg-secondary ">
                <div className="relative w-6/12">
                    <div className="h-full relative  overflow-hidden ">

                        <img
                            src={`https://s3-alpha-sig.figma.com/img/a1a4/fc97/f4f2f2dc204ab530357887c3d37f7e6f?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=padrSWqtv7ut5eKyYBXmCEKlT0ivqp-oZ8OnokiqJ0ijMsU15rSRYicAx2mXZGGUvDg6ziXTJgRd60-ob~RQ9WHe7yJo1zQwyHfbA5sRA1537J04ISiL5cxvdPO~jGbiSrSnMlgg7GYNtWmga~RrNvnb1LZ3anv9GwN5A2-vwwZFUIZlfBLJuFN1WdKPjWpr5Fps9Tw4GwLkW8LSdYv-sJNky9RigxNkrE9Xfaaes8V~rrmPpxlEvsvA5tzedzmQnCEWmMuL15lRxm4kf9s0t0nK5v20jsIW-zf8~MZuyTNAdfP8ctF2fuavbO6eNqjBe3Lvuvq4csgsQaCpVo8Mqg__`}
                            className="w-auto h-[700px] ml-4 -top-36 object-cover absolute"
                        />
                        {/* Left side - Image */}
                    </div>

                    <img
                        src={`https://i.ibb.co/YB5fMptF/Imagen1.png`}
                        className="w-auto right-0 h-[400px] object-cover -top-8 absolute scale-110 "
                    />
                </div>
                <div className="flex w-6/12 flex-col md:flex-row items-center justify-between h-full gap-8 ">

                    {/* Right side - Content */}
                    <div className="  text-white z-10 ">

                        <h1 className="text-[64px]  font-bold mb-4 customtext-neutral-dark ">¡Compra en <span className="customtext-primary">USA</span> desde tu casa!</h1>
                        <p className="text-sm mb-8 customtext-neutral-light">
                            ¡Date prisa, oferta solo por tiempo limitado!
                        </p>


                    </div>
                </div>


            </div>
        </div>

    )
}
export default BannerPublicitarioScraping;