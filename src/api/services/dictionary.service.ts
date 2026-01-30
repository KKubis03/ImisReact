import axiosClient from "../axiosClient";

export interface DayOfWeek {
  dayOfTheWeek: number;
  dayOfTheWeekLabel: string;
}

export const DictionaryService = {
  getDaysOfWeek: () =>
    axiosClient.get<DayOfWeek[]>("/Dictionary/days-of-week"),
};
