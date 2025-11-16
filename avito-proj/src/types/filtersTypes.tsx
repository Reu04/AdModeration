import type { AdStatusType } from "./adsTypes";

export type SortFieldType = "createdAt" | "price" | "priority";

export type SortDirectionType = "asc" | "desc";

export type CategoryOptionType = {
    id: number;
    name: string;
};

export type FiltersStateType = {
    statuses: AdStatusType[];
    categoryId: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    query: string;
    sortField: SortFieldType;
    sortDirection: SortDirectionType;
};

export type FiltersPropsType = {
    filters: FiltersStateType;
    categories: CategoryOptionType[];
    handleFiltersChange: (next: FiltersStateType) => void;
    handleApplyFilters: () => void;
    handleResetFilters: () => void;
};
