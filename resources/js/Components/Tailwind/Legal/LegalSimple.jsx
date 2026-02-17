import React from "react";
import HtmlContent from "../../../Utils/HtmlContent";

const LegalSimple = ({ data, generals }) => {
    const correlative = data?.correlative || "terms_conditions";
    const content =
        generals?.find((x) => x.correlative === correlative)?.description ?? "";
    const title = data?.title || "Información Legal";

    return (
        <div
            id={data?.element_id || null}
            className="bg-white text-black py-24 md:py-32 px-primary"
        >
            <div className="container mx-auto max-w-4xl">
                {title && (
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-16 text-neutral-950">
                        {title}
                    </h1>
                )}
                <div className="prose prose-neutral max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-li:text-neutral-600 prose-headings:uppercase prose-headings:tracking-tight prose-headings:font-bold">
                    <HtmlContent html={content} />
                </div>
            </div>
        </div>
    );
};

export default LegalSimple;
