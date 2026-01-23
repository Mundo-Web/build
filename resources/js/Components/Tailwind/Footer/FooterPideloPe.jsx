
import React, { useRef, useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Global from "../../../Utils/Global";
import HtmlContent from "../../../Utils/HtmlContent";
import { X } from "lucide-react";

const FooterPideloPe = ({ pages, generals, data }) => {
    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef()

    const [modalOpen, setModalOpen] = useState(null);
    const [saving, setSaving] = useState()

    const policyItems = {
        'terms_conditions': 'Términos y condiciones',
        'privacy_policy': 'Políticas de privacidad',
        // 'delivery_policy': 'Políticas de envío',
        'saleback_policy': 'Políticas de devolucion y cambio'
    }

    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);


    const onEmailSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        const request = {
            email: emailRef.current.value
        }
        const result = await subscriptionsRest.save(request);
        setSaving(false)

        if (!result) return

        Swal.fire({
            title: '¡Éxito!',
            text: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
            icon: 'success',
            confirmButtonText: 'Ok'
        })

        emailRef.current.value = null
    }
    return (
        <footer id={data?.element_id || null} className="bg-accent text-white py-12  text-sm font-font-secondary">
            <div className="px-primary mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Menu Columns */}
                <div className="grid grid-cols-3 col-span-3 gap-8  justify-between mr-6">
                    {/* Logo Column */}
                    <div>
                        <div className="h-14 aspect-[13/4] ">

                            <div
                                className="h-full w-full bg-white"
                                style={{
                                    maskImage: `url(/assets/resources/logo.png)`,
                                    maskSize: "contain",
                                    maskPosition: "center",
                                    maskRepeat: "no-repeat",

                                }}
                            />
                        </div>
                    </div>

                    {/* Menu Column */}
                    <div>
                        <h3 className="customtext-primary font-bold mb-6 text-base">Menú</h3>
                        <ul className="space-y-3 text-white">

                            {pages.map((page, index) => (
                                page.menuable && ( // Simplified conditional rendering
                                    <li key={index} >
                                        <a href={page.path} className="hover:customtext-primary hover:font-semibold text-sm cursor-pointer transition-all duration-300  ">
                                            {page.name}
                                        </a>
                                    </li>
                                )
                            ))}

                        </ul>
                    </div>

                    {/* Policies Column */}
                    <div>
                        <h3 className="customtext-primary font-bold mb-6 text-base">Políticas</h3>
                        <ul className="space-y-3 text-white">
                            <li>
                                <a onClick={() => openModal(0)} className="cursor-pointer hover:customtext-primary hover:font-bold transition-all duration-300">
                                    Políticas de privacidad
                                </a>
                            </li>
                            <li>
                                <a onClick={() => openModal(1)} className="cursor-pointer hover:customtext-primary hover:font-bold transition-all duration-300">
                                    Términos y Conduiciones
                                </a>
                            </li>


                        </ul>
                    </div>
                </div>

                {/* Newsletter Column */}
                <div className="col-span-1">
                    <h3 className="customtext-primary font-bold mb-4 text-base ">Métodos de Pago</h3>
                    <div className="grid grid-cols-5 gap-2">

                        <img src="https://s3-alpha-sig.figma.com/img/6b06/b592/2bfbe9e551355e16109bfae809afde18?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Xzx~-Mx5MJ4WfO9RcCYhiZUjsPki2fkG5StPAJGHr8b0yzQ~fL5Zo3NCxYZB46SW1Y~FKxQsA2Mz5I1sYunn13RIH87ENf5~NkARocP94L2PmPHUDamFTekqWKS0vG70xWY7OnhMKUoB8Aa7y19-2NpZXsCQNUCeOwnuj9a60rfTyBfCOdZWSFSEWK023xbSfyxGTqEOFk43~w7ifqEa17Hzx4hgJ0f8dULV9~LDh1Sa6VyVbaJKKsR77TOmOFUBUxc0y5OLLaIXQ2SYqP~SePfKT7pvbEZlhvoy4aHaGpCERtMtIOD7H4Rc-MKew~nymAASFc-4W8VvswOoqxGiDQ__" />
                        <img src="https://s3-alpha-sig.figma.com/img/6161/b9f3/c60c969420a7415557f6a886637a9637?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TNwvvwuOD8lPAgjXj1FyAZ0lDsAOlRwrFPB1li9G7c8uJjWQPnU-p3Ac7gupw9zVnJhrTQGHCxSU9TW4d9aqBeCUnoM3wuj0sJ2ZB98NluqPmtAZq9HUYvRMK34iSGBw82mgj-V3Kfm7wRbsP3KidlECrFSrdz4kGmRM8hqG3Kwx~gWof5IjJs9o7aMRT1-czV43bMUiydkFHDEXlqYiBp~4sZo3Ton6HebeUg5J3PYzgNYD~tD6tllsKYVGceCshG~gsXrvXsrCxbPaXk4rPBNBInWSSA93eY6U6a6rguIhiw347lqelT1GrO7BlmT7~G-iTrfS81uN5O09N6UyNg__" />

                        <img src="https://s3-alpha-sig.figma.com/img/c567/443f/f94d32f52ca17f564b80e1d5ef2bda01?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Kjzi7Z~mz04vN6u3nlEshht2zY7qpTMmmOXzOyv13aACP1jKOEcPEXKhc6AMCPa1BzMfvV8opeEPGgjaflzlfDwEULZgc-HkIgju6A2xMfXY4YoE6HzckfL5R4LdHxHf-UKJihbU6QK24gFZkgmO41XQI7W3bgdaUf-oyq2-fl3DuYtcZ18AI-r7jTbSQx91LU~CasVZlxAIsYVmEuLDcjGNlnPeIMXxRELLkmkQIvbO8zWdSWiXh4PtNLj5~7xj3-MUMrsKHggwIGkMca0VYFu0QWpfT-Bb3NTvKPnhxAipwbeXqR7f9cjDEsGsDwiGXEVAJ6~7YbgEr3tJEx0IPQ__" />
                        <img src="https://s3-alpha-sig.figma.com/img/b985/013f/55b2a737d4d566d683c3847dfd46a409?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IeOm2umn3FfcbttdQC0rBfzmzwfnREEmwzufdLnLXml8ORt2zz2KgneTbxyw1qbkMlEQdxSvH953Htk2By0i--VyaYF-dhF6381aXtQtFGN0xEueFnHAbrzVznXyOsM0-tbRZ1ezhKRvA2keBWtAT5sEbJCmy-yeHGodt4p2DgEWaMeVdQakMVOIXFVlCq90gfocm-L6Fp~Q14b742byz-HQqjVsw-R5WH0uxF3H8GbE3QPAME7wVGz0nEmA7P8LfyK6BKqylIzaSBoDvVruVTsUaZn6KuQDsJcSrGAYOpxi~oc5H-4l2~8HD8FTviq4WjP~NZ0QwoZGA4IvqTTTiA__" />
                        <img src="https://s3-alpha-sig.figma.com/img/a3e9/7bad/7d22f88ae26842169be72d85d7646477?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=d6NDEEra2r4P5VFgrOdaoBgx9hneYiIBGVHlD0Dxn1FCxAIpRXLI4WR6A33Nx8F3mXjn-td70RBKKiGiEcMNpxBihvIYlnZPiJ0Oodx0nQMQoROb-qAGiZCTPYmraTIF839ZnaPW3IZuGTIdQWCUNHr49J05naB4hghZ4dpgEem1~r-Lprr1u27bKtlD9zof1VuBVNPGv-FdoFwKcHqut7xE6j5DnOAwyDJHNwvviNjXh11FUyVrN4xlXyFlm3h~KO4Z15HAP-6BDkq69uC861bBw3HLsFWqAd0qqkdvxwwZu8qZR~KCcedW18SafG2sGgJE~aTCdtbZO6uxtfWW6A__" />
                        <img src="https://s3-alpha-sig.figma.com/img/bb55/fe31/59fe9c4af420d42951f1a04c77140397?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=n63NuSHH~P1aZwrvI03hbXhavAmPPEk6X-wC3CGRVu2SnbU5jQGyGmcvhk1DRIX3xg64ZnSqCezJ6~sr2oAI4MiC7V1sQf2zxtQBoGwmvNRkH-gNtinadc4ar8HMItVVwL7C-YcR~kTEc79XaY9KIY~uwMxjHF16ye-ietCT611xuTSiv2cak~at41DAbXbt6W1ewZ-8ADRChznzIJgc6G7KJn6W9kTeh2QL1ZK0E8Bul6KzjmQR5MQIrY0x6BdUh9ISeM-g60sj1V3lYcUUVdTrlebYUkp46afWyiChtnEvh2~ypKd5cpkAMlSCFP5qj3hF2gpLyAI5OTTiWDo6Ng__" />
                        <img src="https://s3-alpha-sig.figma.com/img/a4fd/614c/547d0670b015c28e068058dd156d0978?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YrnlvCxHdK3Iuz5sPjHeurE5uFrhN0NxV-hRfO058sFOvETluwg4beOLMzHfxN1JDTUXkBucuwuKS5UnaGkP85wSE~mq7nC0AW191dhNUU00f4VvWyUyVS-cOqrCzeONDAy99R-AzFst0mJTqicmxWMuayEsR3auctUUw779Lq16a7YebB4fMSrpOoJamXTchZgXP49u25rcc65fmnK9ln6u4mI10bPsUaEWoPBIDhk2o7bDDViQ2zXNQMNl51S1YG7zlYtm1xInQzhx~BWNW86Fh6k0H46iIZKbb-KSumsbXAh3eaPXsA9H7V2WcwHDEwQ4tBT3grsqoVI6YcKd6w__" />
                        <img src="https://s3-alpha-sig.figma.com/img/0c1a/c5c3/aeb10e9870dd2db5a310f09b100fb07c?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eAVkDqbfNFLr-Io~2y4OYztfIaQqAHhVRdAxsA8lZ0xaQdH~UiucoBM3Nk8PJNVzl0m92YAyDq0Ul3rnqY9DTkXZAvhzsdUmh9ylguTjKyv6TNNaG~P1TzcQVzeKBB6DqcriLiOS1V~1FA-Bd3Ov-sc32bXUMYHKXiWAgITlCwojCRPcl9uFtQ2tXHvXt~JCwM5quNXFRVbDMqAY9~1FWsIJ~-5HViQKgDcwra5pK1D5-wGFdgmo1tGsMJzGuOZrowhXSt7ZY0QAaaOxzlZ5MqGIC8c3KXjQmm5A46C96freAMmlsMgvWjHMr0XlncgQA5rZ~Wdu~V1LIaiyxheW0Q__" />
                        <img src="https://s3-alpha-sig.figma.com/img/d55e/48e0/5341ede46004a263872af12363ff91fd?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=gblT6cccBLZjVwZBQM6pe1Cy6vMEgw1eKovVo6OGSASYwlF6MBtBuzS94t9ML3Tz3ezIY20kdBlNemUEEnVwaf5UpdC0l9GjgXP09uLHLu57LkPOAKQvXnYcCAJvGedpSE3rNQ0bU9lzuOekcRWdO~d9FME2Z6DNjIjNX3xexZvtPfXboWxhwhhyjDIww-zoe5uub1cZPWKVtbeFq6s~YWc1HGbsXsv6efN9XrZQlUYrS-NlPI1Ty8w2VNzKPTXDsLiGyu4Tg8Pg6BFbD3lDWeHxX8kOvV~Y84XqZ6RX1djfIXoLv1bxQ5AbcVSjrVACcV9pihUUq5HmGzHEfIz9Ow__" />
                        <img src="https://s3-alpha-sig.figma.com/img/2842/3876/19f15aed0a1613a403d1e3d329b3ff3d?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=lxETnFrCUhCbbPtc9ZDi6wTZKF1a16AVN9i3dhmf6JeElovNYoVo0Y4XRjWOwqzWgLWpnA~t29a0tlwn60rmqBAzvOty1iZ6~fD3REdDxNmUdUxahF6HRbpcMP5J3KE0ttuSuRfPAN4KHyHo5AkrE7lGFwjyBiOzn2cHWhXL27XTkTd2Gy6nNlElkSIZKxPo3YTd5mfkbZ07qS~r0NT7DXL1U-ND3pKHGiEqQjNL8XjVxqFueq8iMA05~lZsxYvlBbxypOFW5kb-T-nPNqZycW2L1A9P-vNFXsp6EPttplvOARPpetXFg~xqSl~urLOMPYjDZVHwz5QsGvnhSkf~UQ__" />


                    </div>


                </div>
            </div>
            {Object.keys(policyItems).map((key, index) => {

                const title = policyItems[key]
                const content = generals.find(x => x.correlative == key)?.description ?? '';
                return <ReactModal
                    key={index}
                    isOpen={modalOpen === index}
                    onRequestClose={closeModal}
                    contentLabel={title}
                    className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl my-8"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                >
                    <button onClick={closeModal} className="float-right text-red-500 hover:text-red-700 transition-all duration-300 ">
                        <X width="2rem" strokeWidth="4px" />
                    </button>
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    <HtmlContent className='prose' html={content} />
                </ReactModal>
            })}
        </footer>
    )
}
export default FooterPideloPe;