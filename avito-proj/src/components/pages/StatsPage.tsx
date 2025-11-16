import { useEffect, useState } from "react";
import type { StatsPeriodType, StatsSummaryType, ActivityPointType, CategoriesDataType, SummaryByPeriodType } from "../../types/statsTypes";
import MyLoader from "../MyLoader";

export default function StatsPage() {
    const [period, setPeriod] = useState<StatsPeriodType>("week");

    const [summaryByPeriod, setSummaryByPeriod] = useState<SummaryByPeriodType>({
        today: null,
        week: null,
        month: null,
    });

    const [activity, setActivity] = useState<ActivityPointType[]>([]);
    const [categories, setCategories] = useState<CategoriesDataType>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchAllSummaries() {
        try {
            const [todayRes, weekRes, monthRes] = await Promise.all([
                fetch("/api/stats/summary?period=today"),
                fetch("/api/stats/summary?period=week"),
                fetch("/api/stats/summary?period=month"),
            ]);

            if (!todayRes.ok || !weekRes.ok || !monthRes.ok) {
                throw new Error("Ошибка загрузки статистики.");
            }

            const [todayData, weekData, monthData]: StatsSummaryType[] =
                await Promise.all([
                    todayRes.json(),
                    weekRes.json(),
                    monthRes.json(),
                ]);

            setSummaryByPeriod({
                today: todayData,
                week: weekData,
                month: monthData,
            });
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Неизвестная ошибка при загрузке статистики.");
            }
        }
    }

    async function fetchCharts(selectedPeriod: StatsPeriodType) {
        setLoading(true);
        setError(null);

        const query = `?period=${selectedPeriod}`;

        try {
            const [activityRes, categoriesRes] = await Promise.all([
                fetch(`/api/stats/chart/activity${query}`),
                fetch(`/api/stats/chart/categories${query}`),
            ]);

            if (!activityRes.ok || !categoriesRes.ok) {
                throw new Error("Не удалось загрузить данные графиков.");
            }

            const activityData: ActivityPointType[] = await activityRes.json();
            const categoriesData: CategoriesDataType = await categoriesRes.json();

            setActivity(activityData);
            setCategories(categoriesData);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllSummaries();
    }, []);

    useEffect(() => {
        fetchCharts(period);
    }, [period]);

    const currentSummary = summaryByPeriod[period] ?? null;

    const currentTotalReviewed = currentSummary?.totalReviewed ?? 0;

    const approvedPercent = currentSummary
        ? currentSummary.approvedPercentage.toFixed(1)
        : "0.0";
    const rejectedPercent = currentSummary
        ? currentSummary.rejectedPercentage.toFixed(1)
        : "0.0";
    const requestChangesPercent = currentSummary
        ? currentSummary.requestChangesPercentage.toFixed(1)
        : "0.0";

    const maxActivityTotal = activity.reduce((max, point) => {
        const total =
            point.approved + point.rejected + point.requestChanges;
        return total > max ? total : max;
    }, 0);

    const categoriesEntries = Object.entries(categories);
    const maxCategoryValue = categoriesEntries.reduce(
        (max, [, value]) => (value > max ? value : max),
        0
    );

    return (
        <div className="stats-page">
            <header className="stats-header">
                <h1>Статистика модератора</h1>

                <div className="stats-period-switch">
                    <button
                        type="button"
                        className={period === "today" ? "active" : ""}
                        onClick={() => setPeriod("today")}
                    >
                        Сегодня
                    </button>
                    <button
                        type="button"
                        className={period === "week" ? "active" : ""}
                        onClick={() => setPeriod("week")}
                    >
                        Неделя
                    </button>
                    <button
                        type="button"
                        className={period === "month" ? "active" : ""}
                        onClick={() => setPeriod("month")}
                    >
                        Месяц
                    </button>
                </div>
            </header>

            {loading && (
                <MyLoader />
            )}
            {error && (
                <div className="stats-message error">Ошибка: {error}</div>
            )}

            {/* Карточки общей статистики */}
            <section className="stats-cards-grid">
                <div className="stats-card">
                    <div className="stats-card-label">
                        Всего проверено (за выбранный период)
                    </div>
                    <div className="stats-card-value">
                        {currentTotalReviewed.toLocaleString("ru-RU")}
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-label">% одобренных</div>
                    <div className="stats-card-value">{approvedPercent}%</div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-label">% отклонённых</div>
                    <div className="stats-card-value">{rejectedPercent}%</div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-label">% на доработку</div>
                    <div className="stats-card-value">
                        {requestChangesPercent}%
                    </div>
                </div>
            </section>

            <section className="stats-charts-row">
                {/* Активность по дням */}
                <div className="stats-chart">
                    <h2>Активность по дням</h2>
                    {activity.length === 0 ? (
                        <p className="stats-empty">
                            Нет данных за выбранный период.
                        </p>
                    ) : (
                        <div className="activity-chart">
                            {activity.map((point) => {
                                const total =
                                    point.approved +
                                    point.rejected +
                                    point.requestChanges;

                                const rawPercent =
                                    maxActivityTotal > 0
                                        ? (total / maxActivityTotal) * 100
                                        : 0;

                                const heightPercent =
                                    total === 0
                                        ? 5
                                        : Math.min(
                                              Math.max(rawPercent, 15),
                                              100
                                          );

                                const date = new Date(point.date);
                                const label =
                                    date.toLocaleDateString("ru-RU", {
                                        day: "2-digit",
                                        month: "2-digit",
                                    });
                                const weekday = date
                                    .toLocaleDateString("ru-RU", {
                                        weekday: "short",
                                    })
                                    .replace(".", "");

                                return (
                                    <div
                                        key={point.date}
                                        className="activity-bar"
                                    >
                                        <div
                                            className="activity-bar-inner"
                                            style={{
                                                height: `${heightPercent}%`,
                                            }}
                                            title={`Одобрено: ${point.approved}\nОтклонено: ${point.rejected}\nНа доработку: ${point.requestChanges}`}
                                        />
                                        <div className="activity-bar-label">
                                            <span>{weekday}</span>
                                            <span>{label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* По категориям */}
                <div className="stats-chart">
                    <h2>По категориям</h2>
                    {categoriesEntries.length === 0 ? (
                        <p className="stats-empty">
                            Нет данных по категориям.
                        </p>
                    ) : (
                        <ul className="categories-list">
                            {categoriesEntries.map(([name, value]) => {
                                const rawPercent =
                                    maxCategoryValue > 0
                                        ? (value / maxCategoryValue) * 100
                                        : 0;
                                const widthPercent = Math.min(
                                    Math.max(rawPercent, 10),
                                    100
                                );

                                return (
                                    <li
                                        key={name}
                                        className="categories-list-item"
                                    >
                                        <div className="cat-header">
                                            <span className="cat-name">
                                                {name}
                                            </span>
                                            <span className="cat-count">
                                                {value}
                                            </span>
                                        </div>
                                        <div className="cat-bar">
                                            <div
                                                className="cat-bar-inner"
                                                style={{
                                                    width: `${widthPercent}%`,
                                                }}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
}
