import { Card, DisplayText, Layout, Page } from "@shopify/polaris";
import InfiniteScroll from "react-infinite-scroller";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import {
  differenceInCalendarMonths,
  endOfMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { formatDate } from "../services/Utilities.service";
import { useInfiniteQuery } from "react-query";
import Photo from "../types/Photo";

// Note: start_date must be after 1995-06-16 and end_date must be before today
const currentDay = new Date();
const minStart = new Date("1995-06-16");
const totalPages = differenceInCalendarMonths(currentDay, minStart);

// Note: NASA is returning a 500 when querying on June 2021 when you include the thumb=true queryParam -- not sure why... otherwise I would like to display the Youtube video thumbnail when it's a video.

export default function Home() {
  const fetchPosts = async ({ pageParam = 0 }) => {
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

  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery("posts", fetchPosts, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.nextPage < totalPages) {
          return lastPage.nextPage;
        } else {
          return undefined;
        }
      },
    });

  return (
    <Page>
      <Head>
        <title>Spacestagram</title>
        <meta
          name="description"
          content="NASA's Astronomy Pictures of the Day"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Layout.Section>
          <DisplayText size="extraLarge">Spacestagram</DisplayText>
          <DisplayText size="medium">Astronomy pictures of the day</DisplayText>
        </Layout.Section>
        <Layout.Section>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>There was an error</p>
          ) : (
            <InfiniteScroll
              hasMore={hasNextPage}
              loadMore={fetchNextPage}
              className={styles.grid}
            >
              {data?.pages.map((page) =>
                page.results.map((photo) => (
                  <img
                    key={photo.date}
                    className={styles.img}
                    alt={photo.title}
                    src={photo.url}
                  />
                ))
              )}
            </InfiniteScroll>
          )}
        </Layout.Section>
        <Layout.Section>
          <footer className={styles.footer}>Footer</footer>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
