import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
    AdvertisementType,
    PaginationType,
    DataResponseType,
    AdStatusType,
} from "../../types/adsTypes";
import Ad from "../Ad";
import Pagination from "../Pagination";
import Filters from "../Filters";
import type {
    CategoryOptionType,
    FiltersStateType,
    SortFieldType,
    SortDirectionType,
} from "../../types/filtersTypes";
import MyLoader from "../MyLoader";

const DEFAULT_FILTERS: FiltersStateType = {
    statuses: [],
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    query: "",
    sortField: "createdAt",
    sortDirection: "desc",
};

export default function AdsListPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [currentAds, setCurrentAds] = useState<AdvertisementType[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [page, setPage] = useState<number>(1);
    const [pagination, setPagination] = useState<PaginationType | null>(null);

    const [categories, setCategories] = useState<CategoryOptionType[]>([]);
    const [filters, setFilters] = useState<FiltersStateType>(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] =
        useState<FiltersStateType>(DEFAULT_FILTERS);

    function buildQueryString(page: number, filters: FiltersStateType): string {
        const params = new URLSearchParams();

        params.set("page", page.toString());
        params.set("limit", "10");

        if (filters.statuses.length > 0) {
            filters.statuses.forEach((status) => {
                params.append("status", status);
            });
        }

        if (filters.categoryId != null) {
            params.set("categoryId", String(filters.categoryId));
        }

        if (filters.minPrice != null) {
            params.set("minPrice", String(filters.minPrice));
        }

        if (filters.maxPrice != null) {
            params.set("maxPrice", String(filters.maxPrice));
        }

        if (filters.query.trim()) {
            params.set("search", filters.query.trim());
        }

        params.set("sortBy", filters.sortField);
        params.set("sortOrder", filters.sortDirection);

        return params.toString();
    }

    function updateCategoriesFromAds(ads: AdvertisementType[]) {
        setCategories((prev) => {
            const categoriesMap = new Map<number, string>();
            prev.forEach((category) =>
                categoriesMap.set(category.id, category.name)
            );

            ads.forEach((ad) => {
                if (ad.categoryId != null && ad.category) {
                    categoriesMap.set(ad.categoryId, ad.category);
                }
            });

            return Array.from(categoriesMap.entries()).map(([id, name]) => ({
                id,
                name,
            }));
        });
    }

    async function fetchData(page: number, filters: FiltersStateType) {
        setLoading(true);
        setFetchError(null);

        try {
            const queryString = buildQueryString(page, filters);
            const response = await fetch(`/api/ads?${queryString}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: DataResponseType = await response.json();
            const ads: AdvertisementType[] = data.ads ?? [];
            setCurrentAds(ads);
            updateCategoriesFromAds(ads);

            const paginationData: PaginationType = data.pagination;
            if (!paginationData) {
                throw new Error("Failed to fetch pagination.");
            }
            setPagination(paginationData);
        } catch (error) {
            if (error instanceof Error) {
                setFetchError(error.message);
            } else {
                setFetchError("Unknown error.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const statusParams = params.getAll("status") as AdStatusType[];

        const categoryIdParam = params.get("categoryId");
        const minPriceParam = params.get("minPrice");
        const maxPriceParam = params.get("maxPrice");
        const searchParam = params.get("search");

        const sortFieldParam = params.get("sortBy") as SortFieldType | null;
        const sortDirectionParam = params.get("sortOrder") as
            | SortDirectionType
            | null;

        const restoredFilters: FiltersStateType = {
            ...DEFAULT_FILTERS,
            statuses: statusParams,
            categoryId: categoryIdParam ? Number(categoryIdParam) : null,
            minPrice: minPriceParam !== null ? Number(minPriceParam) : null,
            maxPrice: maxPriceParam !== null ? Number(maxPriceParam) : null,
            query: searchParam ?? "",
            sortField: sortFieldParam || "createdAt",
            sortDirection: sortDirectionParam || "desc",
        };

        setFilters(restoredFilters);
        setAppliedFilters(restoredFilters);

        const pageFromUrl = Number(params.get("page") ?? "1");
        setPage(Number.isNaN(pageFromUrl) ? 1 : pageFromUrl);
    }, []);

    useEffect(() => {
        fetchData(page, appliedFilters);
    }, [page, appliedFilters]);

    const handleFiltersChange = (next: FiltersStateType) => {
        setFilters(next);
    };

    const handleApplyFilters = () => {
        const nextPage = 1;
        setPage(nextPage);
        setAppliedFilters(filters);

        const params = new URLSearchParams();
        params.set("page", String(nextPage));
        params.set("sortBy", filters.sortField);
        params.set("sortOrder", filters.sortDirection);

        if (filters.query.trim()) {
            params.set("search", filters.query.trim());
        }
        if (filters.statuses.length > 0) {
            filters.statuses.forEach((status) => {
                params.append("status", status);
            });
        }
        if (filters.categoryId != null) {
            params.set("categoryId", String(filters.categoryId));
        }
        if (filters.minPrice != null) {
            params.set("minPrice", String(filters.minPrice));
        }
        if (filters.maxPrice != null) {
            params.set("maxPrice", String(filters.maxPrice));
        }

        navigate(
            {
                pathname: "/list",
                search: params.toString(),
            },
            { replace: true }
        );
    };

    const handleResetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        setPage(1);

        navigate(
            {
                pathname: "/list",
                search: "",
            },
            { replace: true }
        );
    };

    const currentIds = currentAds.map((ad) => ad.id);

    return (
        <>
            <Filters
                filters={filters}
                categories={categories}
                handleFiltersChange={handleFiltersChange}
                handleApplyFilters={handleApplyFilters}
                handleResetFilters={handleResetFilters}
            />

            {loading && <MyLoader />}
            {fetchError && <div>Ошибка: {fetchError}</div>}

            <Pagination pagination={pagination} setPage={setPage} />
            <div className="total-pages">
                Всего {pagination?.totalItems ?? 0} объявлений
            </div>

            <div className="ad-list">
                {!loading && !fetchError && currentAds.length === 0 && (
                    <div className="total-pages">
                        По заданным параметрам объявлений не найдено.
                    </div>
                )}

                {currentAds.map((ad, index) => (
                    <Ad
                        key={ad.id}
                        ad={ad}
                        index={index}
                        listIds={currentIds}
                    />
                ))}
            </div>

            <Pagination pagination={pagination} setPage={setPage} />
        </>
    );
}
