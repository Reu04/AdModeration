import {
    STATUS_LABELS,
    PRIORITY_LABELS,
    MODERATION_REASONS,
} from "../../variables";

import type { AdvertisementType } from "../../types/adsTypes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type {
    ModerationActionResponseType,
    ModerationActionType,
    ModerationReasonType,
    ListNavStateType,
} from "../../types/moderationsTypes";
import AdPhotoSlider from "../AdPhotoSlider";
import MyLoader from "../MyLoader";
import BaselineArrowBack from "../svg-icons/BaselineArrowBack";
import BaselineArrowForward from "../svg-icons/BaselineArrowForward";

export default function AdPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const navState = (location.state as ListNavStateType) || {};
    const listIds = navState.listIds ?? [];
    const currentIndex = navState.currentIndex ?? 0;
    const hasListContext = listIds.length > 0;

    const [ad, setAd] = useState<AdvertisementType | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [actionLoading, setActionLoading] = useState(false);
    const [reason, setReason] = useState<ModerationReasonType | "">("");
    const [comment, setComment] = useState("");

    async function fetchAd(adId: string) {
        setLoading(true);
        setFetchError(null);

        try {
            const response = await fetch(`/api/ads/${adId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAd(data);
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
        if (id) {
            fetchAd(id);
            setReason("");
            setComment("");
            setActionLoading(false);
        }
    }, [id]);

    const handleBackToList = () => {
        navigate({
            pathname: "/list"
        });
    };

    const handlePrevAd = () => {
        if (!hasListContext || currentIndex <= 0) return;

        const prevIndex = currentIndex - 1;
        const prevId = listIds[prevIndex];

        navigate(
            {
                pathname: `/item/${prevId}`,
                search: location.search,
            },
            {
                replace: true,
                state: { listIds, currentIndex: prevIndex },
            }
        );
    };

    const handleNextAd = () => {
        if (!hasListContext || currentIndex >= listIds.length - 1) return;

        const nextIndex = currentIndex + 1;
        const nextId = listIds[nextIndex];

        navigate(
            {
                pathname: `/item/${nextId}`,
                search: location.search,
            },
            {
                replace: true,
                state: { listIds, currentIndex: nextIndex },
            }
        );
    };

    async function postModerationAction(endpoint: ModerationActionType) {
        if (!id) return;

        if ((endpoint === "reject" || endpoint === "request-changes") && !reason) {
            alert("Пожалуйста, выберите причину.");
            return;
        }

        setActionLoading(true);
        try {
            let url = `/api/ads/${id}`;
            let options: RequestInit = { method: "POST" };

            if (endpoint === "approve") {
                url += "/approve";
            } else if (endpoint === "reject") {
                url += "/reject";
                options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reason, comment }),
                };
            } else if (endpoint === "request-changes") {
                url += "/request-changes";
                options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reason, comment }),
                };
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ModerationActionResponseType = await response.json();
            setAd(data.ad);
            setReason("");
            setComment("");
        } catch (error) {
            if (error instanceof Error) {
                setFetchError(error.message);
            } else {
                setFetchError("Unknown error.");
            }
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return <MyLoader />;
    }

    if (fetchError) {
        return <div className="error-message">Ошибка: {fetchError}</div>;
    }

    if (!ad) {
        return <div className="error-message">Объявление не найдено.</div>;
    }

    const statusLabel = STATUS_LABELS[ad.status];
    const priorityLabel = PRIORITY_LABELS[ad.priority];
    const createdDate = new Date(ad.createdAt).toLocaleString("ru-RU");
    const seller = ad.seller;
    const moderationHistory = ad.moderationHistory ?? [];

    return (
        <div className="ad-page">
            <div className="ad-page-nav">
                <button
                    type="button"
                    className="back-button"
                    onClick={handleBackToList}
                >
                    <BaselineArrowBack className="back-button-icon" />
                    <span>Назад к списку</span>
                </button>

                <div className="ad-page-nav-arrows">
                    <button
                        type="button"
                        onClick={handlePrevAd}
                        disabled={!hasListContext || currentIndex <= 0}
                    >
                        <BaselineArrowBack className="nav-arrow-icon" />
                        <span>Предыдущее</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleNextAd}
                        disabled={
                            !hasListContext ||
                            currentIndex >= listIds.length - 1
                        }
                    >
                        <span>Следующее</span>
                        <BaselineArrowForward className="nav-arrow-icon" />
                    </button>
                </div>

            </div>

            <header className="ad-page-header">
                <h1 className="ad-page-title">{ad.title}</h1>

                <div className="ad-page-tags">
                    <span className={`ad-status ${ad.status}`}>
                        {statusLabel}
                    </span>
                    <span className={`ad-priority ${ad.priority}`}>
                        {priorityLabel}
                    </span>
                    <span className="ad-page-created">
                        Создано: {createdDate}
                    </span>
                </div>
            </header>

            <div className="ad-page-main">
                <section className="ad-page-gallery">
                    <AdPhotoSlider images={ad.images} title={ad.title} />

                    <div className="ad-page-seller">
                        <h3>Продавец</h3>
                        {seller ? (
                            <div className="seller-card">
                                <div className="seller-name">{seller.name}</div>
                                <div className="seller-rating">
                                    Рейтинг: {seller.rating}
                                </div>
                                <div className="seller-total-ads">
                                    Объявлений: {seller.totalAds}
                                </div>
                                <div className="seller-registered">
                                    На сайте с{" "}
                                    {new Date(
                                        seller.registeredAt
                                    ).toLocaleDateString("ru-RU")}
                                </div>
                            </div>
                        ) : (
                            <div>Нет данных о продавце</div>
                        )}
                    </div>
                </section>

                <section className="ad-page-info">
                    <div className="ad-page-price">{ad.price} ₽</div>
                    <div className="ad-page-category">
                        Категория: {ad.category}
                    </div>

                    <h2>Описание</h2>
                    <p className="ad-page-description">{ad.description}</p>

                    {ad.characteristics && (
                        <>
                            <h3>Характеристики</h3>
                            <table className="ad-page-characteristics">
                                <tbody>
                                    {Object.entries(ad.characteristics).map(
                                        ([key, value]) => (
                                            <tr key={key}>
                                                <td className="char-key">
                                                    {key}
                                                </td>
                                                <td className="char-value">
                                                    {value}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </section>

                <aside className="ad-page-sidebar">
                    <div className="moderation-panel">
                        <h3>Решение модератора</h3>

                        <div className="moderation-buttons">
                            <button
                                type="button"
                                className="btn-approve"
                                onClick={() => postModerationAction("approve")}
                                disabled={actionLoading}
                            >
                                Одобрить
                            </button>

                            <button
                                type="button"
                                className="btn-reject"
                                onClick={() => postModerationAction("reject")}
                                disabled={actionLoading}
                            >
                                Отклонить
                            </button>

                            <button
                                type="button"
                                className="btn-request-changes"
                                onClick={() =>
                                    postModerationAction("request-changes")
                                }
                                disabled={actionLoading}
                            >
                                Вернуть на доработку
                            </button>
                        </div>

                        <div className="moderation-reason">
                            <p>
                                Причина (обязательно для отклонения и
                                доработки):
                            </p>
                            <div className="reason-templates">
                                {MODERATION_REASONS.map((r) => (
                                    <label key={r}>
                                        <input
                                            type="radio"
                                            name="moderation-reason"
                                            value={r}
                                            checked={reason === r}
                                            onChange={() => setReason(r)}
                                        />
                                        <span>{r}</span>
                                    </label>
                                ))}
                            </div>

                            <textarea
                                className="moderation-comment"
                                placeholder="Комментарий модератора..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>
                </aside>
            </div>

            <section className="ad-page-history">
                <h3>История модерации</h3>
                {moderationHistory.length === 0 ? (
                    <div>Пока нет действий модерации.</div>
                ) : (
                    <ul className="history-list">
                        {moderationHistory.map((entry) => (
                            <li key={entry.id} className="history-item">
                                <div className="history-main">
                                    <span className="history-action">
                                        {entry.action === "approved" &&
                                            "Одобрено"}
                                        {entry.action === "rejected" &&
                                            "Отклонено"}
                                        {entry.action === "requestChanges" &&
                                            "Запрос изменений"}
                                    </span>
                                    <span className="history-moderator">
                                        Модератор: {entry.moderatorName}
                                    </span>
                                    <span className="history-date">
                                        {new Date(
                                            entry.timestamp
                                        ).toLocaleString("ru-RU")}
                                    </span>
                                </div>

                                {(entry.reason || entry.comment) && (
                                    <div className="history-comment">
                                        {entry.reason && (
                                            <div>Причина: {entry.reason}</div>
                                        )}
                                        {entry.comment && (
                                            <div>
                                                Комментарий: {entry.comment}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
