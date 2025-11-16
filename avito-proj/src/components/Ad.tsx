import { useNavigate } from "react-router-dom";
import type { AdvertisementType } from "../types/adsTypes";
import {
    PLACEHOLDER_IMAGE,
    STATUS_LABELS,
    PRIORITY_LABELS,
} from "../variables";

import AdPhotoSlider from "./AdPhotoSlider";

type AdPropsType = {
    ad: AdvertisementType;
    index: number;
    listIds: number[];
};

export default function Ad({ ad, index, listIds }: AdPropsType) {
    const images = ad.images?.length ? ad.images : [PLACEHOLDER_IMAGE];

    const navigate = useNavigate();

    const statusLabel = STATUS_LABELS[ad.status];
    const priorityLabel = PRIORITY_LABELS[ad.priority];
    const createdDate = new Date(ad.createdAt).toLocaleDateString("ru-RU");

    const handleOpen = () => {
        navigate(
            {
                pathname: `/item/${ad.id}`,
            },
            {
                state: {
                    listIds,
                    currentIndex: index,
                },
            }
        );
    };

    return (
        <div className="ad-wrapper">
            <AdPhotoSlider images={images} title={ad.title} />

            <div className="ad-description">
                <div className="ad-name">{ad.title}</div>
                <div className="ad-price">{ad.price} ₽</div>
                <div className="ad-category">{ad.category}</div>
                <div className="ad-date">{createdDate}</div>

                <div className="ad-meta">
                    <span className={`ad-status ${ad.status}`}>
                        {statusLabel}
                    </span>
                    <span className={`ad-priority ${ad.priority}`}>
                        {priorityLabel}
                    </span>
                </div>
            </div>

            <button
                className="ad-button"
                type="button"
                onClick={handleOpen}
            >
                Открыть
            </button>
        </div>
    );
}
