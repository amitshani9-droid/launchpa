'use client';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Product } from '@/data/products';

interface Props {
    product: Product;
    scrollYProgress: MotionValue<number>;
}

export default function ProductTextOverlays({ product, scrollYProgress }: Props) {
    // Section 1: Intro (0 - 0.2)
    const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    // Section 2: Features (0.2 - 0.4)
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45], [0, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.4], [50, -50]);

    // Section 3: Benefits (0.45 - 0.7)
    const opacity3 = useTransform(scrollYProgress, [0.45, 0.55, 0.7], [0, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.45, 0.7], [50, -50]);

    // Section 4: Pure (0.7 - 0.9)
    const opacity4 = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);
    const y4 = useTransform(scrollYProgress, [0.7, 0.9], [50, 0]);

    return (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center items-center text-center p-4">
            {/* Section 1 */}
            <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-x-0 mx-auto max-w-4xl">
                <h2 className="text-6xl md:text-9xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-xl">{product.section1.title}</h2>
                <p className="text-2xl md:text-4xl text-white/90 font-light">{product.section1.subtitle}</p>
            </motion.div>

            {/* Section 2 */}
            <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-x-0 mx-auto max-w-4xl">
                <h2 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-xl">{product.section2.title}</h2>
                <p className="text-xl md:text-3xl text-white/90 font-light leading-relaxed">{product.section2.subtitle}</p>
            </motion.div>

            {/* Section 3 */}
            <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-x-0 mx-auto max-w-4xl">
                <h2 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-xl">{product.section3.title}</h2>
                <p className="text-xl md:text-3xl text-white/90 font-light leading-relaxed">{product.section3.subtitle}</p>
            </motion.div>

            {/* Section 4 */}
            <motion.div style={{ opacity: opacity4, y: y4 }} className="absolute inset-x-0 mx-auto max-w-4xl">
                <h2 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-xl">{product.section4.title}</h2>
                <p className="text-xl md:text-3xl text-white/90 font-light">{product.section4.subtitle}</p>
            </motion.div>
        </div>
    );
}
