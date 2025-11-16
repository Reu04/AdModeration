import type { AdStatusType } from "../types/adsTypes";
import type { FiltersPropsType, SortDirectionType, SortFieldType } from "../types/filtersTypes";
import type { ChangeEvent } from "react";

export default function Filters({
    filters,
    categories,
    handleFiltersChange,
    handleApplyFilters,
    handleResetFilters,
}: FiltersPropsType) {
    const {
        statuses,
        categoryId,
        minPrice,
        maxPrice,
        query,
        sortField,
        sortDirection,
    } = filters;

    const handleStatusesChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions).map(
            option => option.value as AdStatusType
        );

        if (selected.includes("all")) {
            handleFiltersChange({
                ...filters,
                statuses: [],
            });
            return;
        }

        handleFiltersChange({
            ...filters,
            statuses: selected,
        });
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        handleFiltersChange({
            ...filters,
            categoryId: value === "all" ? null : Number(value),
        });
    };

    const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        handleFiltersChange({
            ...filters,
            minPrice: value === "" ? null : Number(value),
        });
    };

    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        handleFiltersChange({
            ...filters,
            maxPrice: value === "" ? null : Number(value),
        });
    };

    const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiltersChange({
            ...filters,
            query: e.target.value,
        });
    };

    const handleSortFieldChange = (e: ChangeEvent<HTMLSelectElement>) => {
        handleFiltersChange({
            ...filters,
            sortField: e.target.value as SortFieldType,
        });
    };

    const handleSortDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        handleFiltersChange({
            ...filters,
            sortDirection: e.target.value as SortDirectionType,
        });
    };

    const statusesValue: (AdStatusType | "all")[] =
        statuses.length ? statuses : ["all"];

    const categoryValue = categoryId === null ? "all" : String(categoryId);

    return (
        <div className="filter-wrapper">

            {/* Статусы: множественный выбор */}
            <div className="filter-status">
                <select
                    multiple
                    className={`status-select ${statuses.length ? "select-has-value" : ""}`}
                    value={statusesValue}
                    onChange={handleStatusesChange}
                >
                    <option value="all">Все статусы</option>
                    <option value="pending">На модерации</option>
                    <option value="approved">Одобрено</option>
                    <option value="rejected">Отклонено</option>
                    <option value="draft">Черновик</option>
                </select>
            </div>

            {/* Категория */}
            <div className="filter-category">
                <select
                    className={`category-select ${categoryId !== null ? "select-has-value" : ""}`}
                    value={categoryValue}
                    onChange={handleCategoryChange}
                >
                    <option value="all">Все категории</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Диапазон цен */}
            <div className="filter-price">
                <input
                    type="number"
                    className="min-price-input"
                    placeholder="От"
                    value={minPrice ?? ""}
                    onChange={handleMinPriceChange}
                />
                <span className="price-separator">—</span>
                <input
                    type="number"
                    className="max-price-input"
                    placeholder="До"
                    value={maxPrice ?? ""}
                    onChange={handleMaxPriceChange}
                />
            </div>

            {/* Поиск по названию */}
            <div className="filter-search-input">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Введите название..."
                    value={query}
                    onChange={handleQueryChange}
                />
            </div>

            {/* Сортировка */}
            <div className="filter-sort">
                <select
                    className="sort-field-select"
                    value={sortField}
                    onChange={handleSortFieldChange}
                >
                    <option value="createdAt">По дате</option>
                    <option value="price">По цене</option>
                    <option value="priority">По приоритету</option>
                </select>

                <select
                    className="sort-direction-select"
                    value={sortDirection}
                    onChange={handleSortDirectionChange}
                >
                    <option value="desc">По убыв.</option>
                    <option value="asc">По возраст.</option>
                </select>
            </div>

            <button
                type="button"
                className="search-button"
                onClick={handleApplyFilters}
            >
                Поиск
            </button>
            <button
                type="button"
                className="reset-button"
                onClick={handleResetFilters}
            >
                Сброс
            </button>
        </div>
    );
}
