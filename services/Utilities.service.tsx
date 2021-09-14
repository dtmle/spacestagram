import { startOfMonth, format } from "date-fns";

const date_format = "yyyy-MM-dd";

export const formatDate = (date: Date): String => {
  return format(date, date_format);
};
