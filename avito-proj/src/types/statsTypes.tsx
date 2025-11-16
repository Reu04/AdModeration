export type StatsPeriodType = "today" | "week" | "month";

export type StatsSummaryType = {
    totalReviewed: number;
    totalReviewedToday: number;
    totalReviewedThisWeek: number;
    totalReviewedThisMonth: number;
    approvedPercentage: number;
    rejectedPercentage: number;
    requestChangesPercentage: number;
    averageReviewTime: number;
};

export type ActivityPointType = {
    date: string;
    approved: number;
    rejected: number;
    requestChanges: number;
};

export type CategoriesDataType = Record<string, number>;

export type SummaryByPeriodType = {
    today: StatsSummaryType | null;
    week: StatsSummaryType | null;
    month: StatsSummaryType | null;
};