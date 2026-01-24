import React from "react";

const FooterSimple = React.lazy(() => import("./Footer/FooterSimple"));
const FooterSimpleCallToAction = React.lazy(() =>
    import("./Footer/FooterSimpleCallToAction")
);
const FooterCallToAction = React.lazy(() =>
    import("./Footer/FooterCallToAction")
);
const FooterPaani = React.lazy(() => import("./Footer/FooterPaani"));
const FooterB = React.lazy(() => import("./Footer/FooterB"));
const FooterTermsCTASocials = React.lazy(() => import("./Footer/FooterTermsCTASocials"));
const FooterSalaFabulosa = React.lazy(() => import("./Footer/FooterSalaFabulosa"));
const Footer2Den1 = React.lazy(() => import("./Footer/Footer2Den1"));
const FooterBananaLab = React.lazy(() => import("./Footer/FooterBananaLab"));
const FooterPideloPe = React.lazy(() => import("./Footer/FooterPideloPe"));
const FooterMakita = React.lazy(() => import("./Footer/FooterMakita"));
const FooterDental = React.lazy(() => import("./Footer/FooterDental"));
const FooterIbergruas = React.lazy(() => import("./Footer/FooterIbergruas"));
const FooterHuaillys = React.lazy(() => import("./Footer/FooterHuaillys"));
const FooterFirstClass = React.lazy(() => import("./Footer/FooterFirstClass"));
const FooterLaPetaca = React.lazy(() => import("./Footer/FooterLaPetaca"));
const FooterPanelPro = React.lazy(() => import("./Footer/FooterPanelPro"));
const FooterHostinfinity = React.lazy(() => import("./Footer/FooterHostinfinity"));

const Footer = ({ data, which, items, pages, generals, contacts, stores }) => {
    const getFooter = () => {
        switch (which) {
            case "FooterSimpleCallToAction":
                return (
                    <FooterSimpleCallToAction
                        socials={items}
                        pages={pages}
                        generals={generals}
                    />
                );
            case "FooterCallToAction":
                return (
                    <FooterCallToAction
                        socials={items}
                        pages={pages}
                        generals={generals}
                    />
                );
            case "FooterSimple":
                return (
                    <FooterSimple
                        socials={items}
                        pages={pages}
                        generals={generals}
                    />
                );
            case "FooterB":
                return (
                    <FooterB
                        socials={items}
                        pages={pages}
                        generals={generals}
                        data={data}
                    />
                );
                case "FooterPaani":
                return (
                    <FooterPaani
                    data={data}
                        socials={items}
                        pages={pages}
                        generals={generals}
                    />
                );
            case "FooterTermsCTASocials":
                return (
                    <FooterTermsCTASocials
                    data={data}
                        socials={items}
                        pages={pages}
                        generals={generals}
                    />
                );
            case "FooterSalaFabulosa":
                return (
                    <FooterSalaFabulosa
                    data={data}
                        socials={items}
                        pages={pages}
                        generals={generals}
                        contacts={contacts}
                    />
                );
            case "Footer2Den1":
                return (
                    <Footer2Den1
                        socials={items}
                        pages={pages}
                        generals={generals}
                        contacts={contacts}
                        stores={stores}
                    />
                );
            case "FooterPideloPe":
                return (
                    <FooterPideloPe
                        socials={items}
                        pages={pages}
                        generals={generals}
                    />
                );
            case "FooterBananaLab":
                return (
                    <FooterBananaLab
                        socials={items}
                        pages={pages}
                        generals={generals}
                        contacts={contacts}
                    />
                );
            case "FooterMakita":
                return (
                    <FooterMakita
                        socials={items}
                        pages={pages}
                        generals={generals}
                    />
                );
            case "FooterDental":
                return (
                  <FooterDental
                        socials={items}
                        pages={pages}
                        generals={generals}
                        data={data}
                    />
                );
            case "FooterHuaillys":
                return (
                    <FooterHuaillys
                        socials={items}
                        pages={pages}
                        generals={generals}
                        data={data}
                    />
                );
            case "FooterFirstClass":
                return (
                    <FooterFirstClass
                        socials={items}
                        pages={pages}
                        generals={generals}
                        data={data}
                    />
                );
            case "FooterIbergruas":
                return (
                    <FooterIbergruas
                        socials={items}
                        pages={pages}
                        generals={generals}
                        data={data}
                    />
                );
            case "FooterLaPetaca":
                return (
                    <FooterLaPetaca
                        items={items}
                        pages={pages}
                        generals={generals}
                        data={data}
                    />
                );
            case "FooterPanelPro":
                return (
                    <FooterPanelPro
                        socials={items}
                        pages={pages}
                        generals={generals}
                        data={data}
                    />
                );
            case "FooterHostinfinity":
                return (
                    <FooterHostinfinity
                        socials={items}
                        pages={pages}
                        generals={generals}
                        data={data}
                    />
                );
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getFooter();
};

export default Footer;
