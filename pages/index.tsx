/* eslint-disable @next/next/no-img-element */
import Photo from "../types/Photo";
import { DisplayText, Layout, Page, Spinner } from "@shopify/polaris";
import InfiniteScroll from "react-infinite-scroller";
import Head from "next/head";
import { useInfiniteQuery } from "react-query";
import { fetchPosts } from "../services/Nasa.service";
import { useCallback, useState } from "react";
import styles from "../styles/Home.module.css";
import ImageModal from "../components/ImageModal";

// Note: NASA is returning a 500 when querying on June 2021 when you include the thumb=true queryParam -- not sure why... otherwise I would like to display the Youtube video thumbnail when it's a video.

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<null | Photo>(null);
  const [modalActive, setModalActive] = useState(false);

  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery("posts", fetchPosts, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.nextPage < lastPage.totalPages) {
          return lastPage.nextPage;
        } else {
          return undefined;
        }
      },
    });

  const handleModalChange = useCallback(
    () => setModalActive(!modalActive),
    [modalActive]
  );

  const handleLike = () => {
    const currentPhoto = Object.assign({}, selectedPhoto);
    currentPhoto!.like = !currentPhoto.like;
    setSelectedPhoto(currentPhoto);
  };

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    setModalActive(true);
  };

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
      {selectedPhoto && (
        <ImageModal
          photo={selectedPhoto}
          active={modalActive}
          handleChange={handleModalChange}
          handleLike={handleLike}
        />
      )}
      <Layout>
        <Layout.Section oneHalf>
          <DisplayText size="extraLarge">Spacestagram</DisplayText>
          <DisplayText size="medium">Astronomy pictures of the day</DisplayText>
        </Layout.Section>
        <Layout.Section>
          {isLoading ? (
            <div className={styles.span_all}>
              <Spinner accessibilityLabel="Loading more images" size="large" />
            </div>
          ) : isError ? (
            <p>Uh-oh! There was an error. Please try again later.</p>
          ) : (
            <InfiniteScroll
              hasMore={hasNextPage}
              loadMore={() => fetchNextPage()}
              className={styles.grid}
              loader={
                <div className={styles.span_all}>
                  <Spinner
                    accessibilityLabel="Loading more images"
                    size="large"
                  />
                </div>
              }
            >
              {data?.pages.map((page) =>
                page.results.map((photo) => (
                  <figure
                    key={photo.date}
                    className={styles.img__container}
                    onClick={() => openModal(photo)}
                  >
                    <img
                      className={styles.img}
                      alt={photo.title}
                      src={photo.url}
                    />
                    <figcaption>
                      <DisplayText size="medium">{photo.date}</DisplayText>
                    </figcaption>
                  </figure>
                ))
              )}
            </InfiniteScroll>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
