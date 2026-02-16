import React, { lazy } from "react";

const BannerSimple = lazy(() => import("./Banners/BannerSimple"));
const BannerAd = lazy(() => import("./Banners/BannerAd"));
const BannerFullWidth = lazy(() => import("./Banners/BannerFullWidth"));
const BannerFlex = lazy(() => import("./Banners/BannerFlex"));
const BannerIbergruas = lazy(() => import("./Banners/BannerIbergruas"));
const BannerPublicitario = lazy(() => import("./Banners/BannerPublicitario"));
const BannerPublicitarioPaani = lazy(
    () => import("./Banners/BannerPublicitarioPaani"),
);
const BannerPostSuscriptionPaani = lazy(
    () => import("./Banners/BannerPostSuscriptionPaani"),
);
const BannerStatic = lazy(() => import("./Banners/BannerStatic"));
const BannerStaticSecond = lazy(() => import("./Banners/BannerStaticSecond"));
const BannerSimpleSF = lazy(() => import("./Banners/BannerSimpleSF"));
const BannerSimpleD2 = lazy(() => import("./Banners/BannerSimpleD2"));
const BannerBananaLab = lazy(() => import("./Banners/BannerBananaLab"));
const BannerCTAMakita = lazy(() => import("./Banners/BannerCTAMakita"));
const BannerContactMakita = lazy(() => import("./Banners/BannerContactMakita"));
const BannerPidelo = lazy(() => import("./Banners/BannerPidelo"));
const BannerMultivet = lazy(() => import("./Banners/BannerMultivet"));
const BannerPublicitarioKatya = lazy(
    () => import("./Banners/BannerPublicitarioKatya"),
);
const BannerBlogSectionKatya = lazy(
    () => import("./Banners/BannerBlogSectionKatya"),
);
const BannerMobileApp = lazy(() => import("./Banners/BannerMobileApp"));
const BannerAboutStats = lazy(() => import("./Banners/BannerAboutStats"));
const BannerAboutStatsPanelPro = lazy(
    () => import("./Banners/BannerAboutStatsPanelPro"),
);
const BannerPremiumCampaign = lazy(
    () => import("./Banners/BannerPremiumCampaign"),
);
const BannerPremiumAtelier = lazy(
    () => import("./Banners/BannerPremiumAtelier"),
);

const Banner = ({ which, data, items, generals }) => {
    const getBanner = () => {
        switch (which) {
            case "BannerPremiumCampaign":
                return <BannerPremiumCampaign data={data} />;
            case "BannerPremiumAtelier":
                return <BannerPremiumAtelier data={data} />;
            case "BannerSimple":
                return <BannerSimple data={data} />;
            case "BannerAd":
                return <BannerAd data={data} />;
            case "BannerPublicitario":
                return <BannerPublicitario data={data} />;
            case "BannerPublicitarioKatya":
                return <BannerPublicitarioKatya data={data} />;
            case "BannerPublicitarioPaani":
                return <BannerPublicitarioPaani data={data} />;
            case "BannerPostSuscriptionPaani":
                return <BannerPostSuscriptionPaani data={data} items={items} />;
            case "BannerFullWidth":
                return <BannerFullWidth data={data} />;
            case "BannerFlex":
                return <BannerFlex data={data} />;
            case "BannerIbergruas":
                return <BannerIbergruas data={data} />;
            case "BannerStatic":
                return <BannerStatic data={data} items={items} />;
            case "BannerSimpleSF":
                return <BannerSimpleSF data={data} />;
            case "BannerSimpleD2":
                return <BannerSimpleD2 data={data} />;
            case "BannerBananaLab":
                return <BannerBananaLab data={data} />;
            case "BannerCTAMakita":
                return <BannerCTAMakita data={data} items={items} />;
            case "BannerContactMakita":
                return <BannerContactMakita data={data} />;
            case "BannerStaticSecond":
                return <BannerStaticSecond data={data} items={items} />;
            case "BannerPidelo":
                return <BannerPidelo data={data} />;
            case "BannerMultivet":
                return <BannerMultivet data={data} />;
            case "BannerBlogSectionKatya":
                return <BannerBlogSectionKatya data={data} items={items} />;
            case "BannerMobileApp":
                return (
                    <BannerMobileApp
                        data={data}
                        generals={generals}
                        items={items}
                    />
                );
            case "BannerAboutStats":
                return <BannerAboutStats data={data} items={items} />;
            case "BannerAboutStatsPanelPro":
                return <BannerAboutStatsPanelPro data={data} items={items} />;

            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getBanner();
};

export default Banner;
