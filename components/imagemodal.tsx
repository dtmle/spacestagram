/* eslint-disable @next/next/no-img-element */
import { Heading, Modal, Subheading, TextContainer } from "@shopify/polaris";
import Photo from "../types/Photo";
import styles from "../styles/ImageModal.module.css";

interface Props {
  photo: Photo;
  active: boolean;
  handleChange: () => void;
  handleLike: () => void;
}

export default function ImageModal({
  photo,
  active,
  handleChange,
  handleLike,
}: Props) {
  return (
    <Modal
      large
      open={active}
      onClose={handleChange}
      title={photo.title}
      titleHidden
      primaryAction={{
        content: photo.like ? "Unlike" : "Like",
        onAction: handleLike,
      }}
    >
      <Modal.Section>
        <img
          className={styles.img}
          alt={`Photo titled ${photo.title}`}
          src={photo.url}
        />
        <TextContainer>
          <Heading>{photo.title}</Heading>
          <Subheading>{photo.date}</Subheading>
          <p>{photo.explanation}</p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
}
