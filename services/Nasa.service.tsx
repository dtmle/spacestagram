import {
  differenceInCalendarMonths,
  endOfMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import Photo from "../types/Photo";
import { formatDate } from "./Utilities.service";

// Note: start_date must be after 1995-06-16 and end_date must be before today
const currentDay = new Date();
const minStart = new Date("1995-06-16");
const totalPages = differenceInCalendarMonths(currentDay, minStart);

export const fetchPosts = async ({ pageParam = 0 }) => {
  const start = startOfMonth(currentDay);
  const formattedStart =
    pageParam === 0
      ? formatDate(start)
      : formatDate(subMonths(start, pageParam));
  const formattedEnd =
    pageParam === 0
      ? formatDate(currentDay)
      : formatDate(endOfMonth(subMonths(currentDay, pageParam)));

  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_API_KEY}&start_date=${formattedStart}&end_date=${formattedEnd}`
  );

  const results: Array<Photo> = await response.json();
  const filteredResults = results
    .filter((photo) => {
      if (photo.media_type === "video") {
        return false;
      } else {
        return true;
      }
    })
    .sort((a, b) => {
      return +new Date(b.date) - +new Date(a.date);
    });
  return { results: filteredResults, nextPage: pageParam + 1, totalPages };
};
