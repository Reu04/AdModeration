export type AdStatusType = "all" | "pending" | "approved" | "rejected" | "draft";

export type AdPriorityType = "normal" | "urgent";

export type SellerType = {
    id: number,
    name: string,
    rating: string,
    totalAds: number,
    registeredAt: string,
}

export type ActionType = "approved" | "rejected" | "requestChanges";

export type ModerationHistoryType = {
    id: number,
    moderatorId: number,
    moderatorName: string,
    action: ActionType,
    reason:	string,
    comment:	string,
    timestamp:	string,
}

export type AdvertisementType = {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    categoryId: number;
    status: AdStatusType;
    priority: AdPriorityType;
    createdAt: string;
    updatedAt: string;
    images: string[];
    seller: SellerType,
    characteristics: string,
    moderationHistory: ModerationHistoryType[],
}

export type AdPropsType = {
    ad: AdvertisementType;
};

export type PaginationType = {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,
}

export type DataResponseType = {
    ads: AdvertisementType[],
    pagination: PaginationType,
}

export type PaginationPropsType = {
    pagination: null | PaginationType,
    setPage: (page: number | ((page: number) => number)) => void, // теперь можно передать и число, и колбэк
}

export type AdPhotoSliderProps = {
    images?: string[];
    title: string;
};