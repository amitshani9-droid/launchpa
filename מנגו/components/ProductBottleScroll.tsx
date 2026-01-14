'use client';
import { useRef, useEffect, useState } from 'react';
import { useScroll, useMotionValueEvent, motion } from 'framer-motion';
import { Product } from '@/data/products';
import ProductTextOverlays from './ProductTextOverlays';

interface Props {
    product: Product;
}

export default function ProductBottleScroll({ product }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Load images
    useEffect(() => {
        const loadImages = async () => {
            // Clear previous
            setImages([]);

            const loadedImages: HTMLImageElement[] = [];
            const promises = [];

            for (let i = 1; i <= 120; i++) {
                const img = new Image();
                img.src = `${product.folderPath}/${i}.webp`;
                const promise = new Promise<void>((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.warn(`Failed to load image: ${img.src}`);
                        resolve();
                    }
                });
                promises.push(promise);
                loadedImages.push(img);
            }

            await Promise.all(promises);
            setImages(loadedImages);
        };
        loadImages();
    }, [product.folderPath]);

    // Render logic
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = images[index];
        if (!img || !img.complete || img.naturalHeight === 0) return;

        // Resize for retina/high-DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Contain logic
        const cw = rect.width;
        const ch = rect.height;
        const iw = img.width;
        const ih = img.height;

        const scale = Math.min(cw / iw, ch / ih);
        const x = (cw - iw * scale) / 2;
        const y = (ch - ih * scale) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, iw * scale, ih * scale);
    };

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const frameIndex = Math.min(
            119,
            Math.floor(latest * 119)
        );
        requestAnimationFrame(() => renderFrame(frameIndex));
    });

    // Initial render when images ready
    useEffect(() => {
        if (images.length > 0) renderFrame(0);
    }, [images]);

    return (
        <div ref={containerRef} className="h-[500vh] relative">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Canvas Layer */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain" />

                {/* Text Layer */}
                <ProductTextOverlays product={product} scrollYProgress={scrollYProgress} />
            </div>
        </div>
    );
}
