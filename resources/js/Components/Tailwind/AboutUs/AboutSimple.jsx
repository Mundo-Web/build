import { motion } from "framer-motion";
import { Award, ListChecks, Headphones, Shield } from "lucide-react";

export default function AboutSimple({ data, filteredData }) {
    const { aboutuses, webdetail, strengths } = filteredData;
    const webAboutTitle = webdetail?.find(
        (item) => item.name === "title" && item.page === "about"
    );
    const sectionOne = aboutuses?.find(
        (item) => item.correlative === "section-1-about"
    );
    const sectionTwo = aboutuses?.find(
        (item) => item.correlative === "section-2-about"
    );
    const sectionThree = aboutuses?.find(
        (item) => item.correlative === "section-3-about"
    );
    const sectionFour = aboutuses?.find(
        (item) => item.correlative === "section-4-about"
    );

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <main id={data?.element_id || null} className="min-h-screen bg-white">
            {/* Hero Section */}
            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="px-4 md:px-8 2xl:px-0 2xl:max-w-7xl mx-auto py-8 md:py-16"
            >
                <motion.div variants={fadeInUp} className="text-center">
                    <span className="customtext-primary font-bold inline-block">
                        {webAboutTitle?.description}
                    </span>
                    <h1 className="mt-4 text-3xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto customtext-neutral-dark leading-tight">
                        {sectionOne?.title}
                    </h1>
                    <div
                        className="mt-6 customtext-neutral-light max-w-3xl mx-auto text-base md:text-lg prose"
                        dangerouslySetInnerHTML={{
                            __html: sectionOne?.description,
                        }}
                    />
                </motion.div>
                <motion.div 
                    variants={fadeInUp}
                    className="mt-8 md:mt-12 max-w-5xl mx-auto rounded-2xl overflow-hidden"
                >
                    <img
                        src={`/storage/images/aboutus/${sectionOne?.image}`}
                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        alt={sectionOne?.title}
                        className="w-full h-[300px] md:h-[400px] object-cover"
                    />
                </motion.div>
            </motion.section>

            {/* Why Trust Us Section */}
            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="px-4 md:px-8 2xl:px-0 2xl:max-w-7xl mx-auto py-12 md:py-16 bg-[#F7F9FB]"
            >
                <motion.h2 
                    variants={fadeInUp}
                    className="text-2xl md:text-[40px] font-bold customtext-neutral-dark text-center md:text-left"
                >
                    {sectionTwo?.title}
                </motion.h2>
                <motion.div 
                    variants={fadeInUp}
                    className="mt-8 md:mt-12 grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                >
                    {strengths?.map(
                        (item, index) =>
                            item.visible &&
                            item.status && (
                                <FeatureCard
                                    key={index}
                                    icon={item.image}
                                    title={item.name}
                                    description={item.description}
                                    delay={index * 0.2}
                                />
                            )
                    )}
                </motion.div>
            </motion.section>

            {/* Trust Section */}
            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="px-4 py-12 md:py-16 md:px-6 lg:px-8"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <img
                            src={`/storage/images/aboutus/${sectionThree?.image}`}
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            alt={sectionOne?.title}
                            className="w-full h-[300px] md:h-auto object-cover rounded-2xl"
                        />
                        <div className="space-y-4 md:space-y-6">
                            <h2 className="text-2xl md:text-4xl font-bold customtext-neutral-dark">
                                {sectionThree?.title}
                            </h2>
                            <div
                                className="customtext-neutral-light text-base md:text-lg prose"
                                dangerouslySetInnerHTML={{
                                    __html: sectionThree?.description,
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Future Section */}
            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="px-4 py-12 md:py-16 md:px-6 lg:px-8 bg-gray-50"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="space-y-4 md:space-y-6 order-2 md:order-1">
                            <h2 className="text-2xl md:text-4xl font-bold customtext-neutral-dark">
                                {sectionFour?.title}
                            </h2>
                            <div
                                className="customtext-neutral-light text-base md:text-lg prose"
                                dangerouslySetInnerHTML={{
                                    __html: sectionFour?.description,
                                }}
                            />
                        </div>
                        <img
                            src={`/storage/images/aboutus/${sectionFour?.image}`}
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            alt={sectionOne?.title}
                            className="w-full h-[300px] md:h-auto object-cover rounded-2xl order-1 md:order-2"
                        />
                    </motion.div>
                </div>
            </motion.section>
        </main>
    );
}

function FeatureCard({ icon, title, description, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group p-6 hover:bg-white rounded-xl hover:shadow-md transition-all duration-300"
        >
            <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary mb-4 p-2"
            >
                <img
                    src={`/storage/images/strength/${icon}`}
                    onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                    alt=""
                    className="w-full h-auto object-cover grayscale brightness-0 invert"
                />
            </motion.div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
            <p className="customtext-neutral-light text-sm md:text-base">{description}</p>
        </motion.div>
    );
}
