import type { AdStatusType, AdPriorityType } from "./types/adsTypes";

export const STATUS_LABELS: Record<AdStatusType, string> = {
    all: "Все статусы",
    pending: "На модерации",
    approved: "Одобрено",
    rejected: "Отклонено",
    draft: "Черновик",
};

export const PRIORITY_LABELS: Record<AdPriorityType, string> = {
    normal: "Обычный",
    urgent: "Срочный",
};

export const PLACEHOLDER_IMAGE = "../../public/placeholder.png";

export const MODERATION_ACTION_LABELS: Record<string, string> = {
    approved: "Одобрено",
    rejected: "Отклонено",
    requestChanges: "Запрос изменений",
};

export const MODERATION_REASONS = [
    "Запрещенный товар",
    "Неверная категория",
    "Некорректное описание",
    "Проблемы с фото",
    "Подозрение на мошенничество",
    "Другое",
] as const;