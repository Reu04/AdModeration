import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "../variables";
import type { AdPhotoSliderProps } from "../types/adsTypes";

import BaselineArrowBack from "./svg-icons/BaselineArrowBack";
import BaselineArrowForward from "./svg-icons/BaselineArrowForward";

export default function AdPhotoSlider({ images, title }: AdPhotoSliderProps) {
    const baseSlides = images?.length ? images : [PLACEHOLDER_IMAGE];

    // Гарантируем минимум 3 кадра
    const slides =
        baseSlides.length >= 3
            ? baseSlides
            : [
                  ...baseSlides,
                  ...Array(3 - baseSlides.length).fill(PLACEHOLDER_IMAGE),
              ];

    const [index, setIndex] = useState(0);

    const prevImage = () => {
        setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
    };

    const nextImage = () => {
        setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
    };

    return (
        <div className="ad-photo-slider">
            <button
                type="button"
                className="slider-btn prev"
                onClick={prevImage}
                aria-label="Предыдущее изображение"
            >
                <BaselineArrowBack className="slider-btn-icon" />
            </button>

            <img
                className="ad-photo"
                src={slides[index]}
                alt={title}
            />

            <button
                type="button"
                className="slider-btn next"
                onClick={nextImage}
                aria-label="Следующее изображение"
            >
                <BaselineArrowForward className="slider-btn-icon" />
            </button>
        </div>
    );
}
