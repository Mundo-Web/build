import React from "react";

const SliderSimple = React.lazy(() => import("./Sliders/SliderSimple"));
const SliderBoxed = React.lazy(() => import("./Sliders/SliderBoxed"));
const SliderSearch = React.lazy(() => import("./Sliders/SliderSearch"));
const SliderInteractive = React.lazy(() =>
    import("./Sliders/SliderInteractive")
);
const SliderBananaLab = React.lazy(() => import("./Sliders/SliderBananaLab"));
const SliderImagen = React.lazy(() => import("./Sliders/SliderImagen"));
const SliderBrandsPaani = React.lazy(() =>
    import("./Sliders/SliderBrandsPaani")
);
const SliderJustImage = React.lazy(() => import("./Sliders/SliderJustImage"));
const SliderFeaturedMakita = React.lazy(() =>
    import("./Sliders/SliderFeaturedMakita")
);
const SliderTwoColumnSwiper = React.lazy(() =>
    import("./Sliders/SliderTwoColumnSwiper")
);
const SliderPideloPe = React.lazy(() => import("./Sliders/SliderPideloPe"));
const SliderMultivet = React.lazy(() => import("./Sliders/SliderMultivet"));
const SliderIbergruas = React.lazy(() => import("./Sliders/SliderIbergruas"));
const SliderProductBannerKatya = React.lazy(() => import("./Sliders/SliderProductBannerKatya"));
const SliderFirstClass = React.lazy(() => import("./Sliders/SliderFirstClass"));

const Slider = ({ which, data, sliders, generals = [] }) => {
    const getSlider = () => {
        switch (which) {
            case "SliderSimple":
                return <SliderSimple data={data} items={sliders} />;
            case "SliderSearch":
                return <SliderSearch data={data} items={sliders} />;
            case "SliderBoxed":
                return <SliderBoxed data={data} sliders={sliders} />;
            case "SliderInteractive":
                return <SliderInteractive data={data} items={sliders} generals={generals} />;
            case "SliderBananaLab":
                return <SliderBananaLab data={data} items={sliders} />;
            case "SliderImagen":
                return <SliderImagen data={data} items={sliders} />;

            case "SliderJustImage":
                return <SliderJustImage data={data} items={sliders} />;
            case "SliderBrandsPaani":
                return <SliderBrandsPaani data={data} items={sliders} />;
            case "SliderFeaturedMakita":
                return <SliderFeaturedMakita data={data} items={sliders} />;
            case "SliderTwoColumnSwiper":
                return <SliderTwoColumnSwiper data={data} items={sliders} />;
            case "SliderPideloPe":
                return <SliderPideloPe data={data} items={sliders} />;
            case "SliderMultivet":
                return <SliderMultivet data={data} items={sliders} generals={generals} />;
            case "SliderIbergruas":
                return <SliderIbergruas data={data} items={sliders} generals={generals} />;
            case "SliderProductBannerKatya":
                return <SliderProductBannerKatya data={data} items={sliders} generals={generals} />;
            case "SliderFirstClass":
                return <SliderFirstClass data={data} sliders={sliders} />;

            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getSlider();
};

export default Slider;
