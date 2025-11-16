import type { AdvertisementType } from "./adsTypes";

export type ModerationActionType  = "approve" | "reject" | "request-changes";

export type ModerationReasonType =
  | "Запрещенный товар"
  | "Неверная категория"
  | "Некорректное описание"
  | "Проблемы с фото"
  | "Подозрение на мошенничество"
  | "Другое"; 

export type ModerationActionResponseType = {
    message: string;
    ad: AdvertisementType;
}

export type ListNavStateType = {
    listIds?: number[];
    currentIndex?: number;
};