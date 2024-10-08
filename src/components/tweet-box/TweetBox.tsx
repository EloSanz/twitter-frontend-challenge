import { ChangeEvent, useContext, useState } from "react";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import { setLastPost } from "../../redux/user";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import { BackArrowIcon } from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import { useTranslation } from "react-i18next";
import { ButtonType } from "../button/StyledButton";
import { StyledTweetBoxContainer } from "./TweetBoxContainer";
import { StyledContainer } from "../common/Container";
import { StyledButtonContainer } from "./ButtonContainer";
import { useDispatch } from "react-redux";
import { PostData } from "../../service";
import {
  useCommentPost,
  useCreatePost,
} from "../../service/queryHooks";
import { useGetMe } from "../../redux/hooks";
import { ToastContext } from "../toast/FallbackToast";
import { useQueryClient } from "@tanstack/react-query";
import { ToastType } from "../toast/Toast";

interface TweetBoxProps {
  parentId?: string;
  close?: () => void;
  mobile?: boolean;
}

const TweetBox = ({ parentId, close, mobile }: TweetBoxProps) => {
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: commentPost } = useCommentPost();

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useGetMe();
  const queryClient = useQueryClient();

  ///
  const [error, setError] = useState<Error | null>(null);
  const ToastCtx = useContext(ToastContext);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const handleSubmit = async () => {
    let data: PostData = {
      content,
      images,
    };
    if (parentId === undefined) {
      await createPost(data, {
        onError: (e) => {
          setError(e);
        },
        onSuccess: async () => {
          dispatch(setLastPost(""));
          queryClient.invalidateQueries({
            queryKey: ["posts"],
          });
        },
      });
    } else {
      data = { ...data, parentId };
      await commentPost(data, {
        onError: (e) => {
          setError(e);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["posts"],
          });
        },
      });
    }

    setContent("");
    setImages([]);
    setImagesPreview([]);
    close && close();
  };
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((i, idx) => idx !== index);
    const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
    setImages(newImages);
    setImagesPreview(newImagesPreview);
  };

  const handleAddImage = (newImages: File[]) => {
    setImages(newImages);
    const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
    setImagesPreview(newImagesPreview);
  };

  return (
    <>
      {ToastCtx && (
        <ToastCtx.Toast
          message="Error creating tweet"
          type={ToastType.ALERT}
          show={error !== null}
        ></ToastCtx.Toast>
      )}
      <StyledTweetBoxContainer>
        {mobile && (
          <StyledContainer
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <BackArrowIcon onClick={close} />
            <Button
              text={"Tweet"}
              buttonType={ButtonType.DEFAULT}
              size={"SMALL"}
              onClick={handleSubmit}
              disabled={content.length === 0}
            />
          </StyledContainer>
        )}
        <StyledContainer style={{ width: "100%" }}>
          <TweetInput
            onChange={handleChange}
            maxLength={240}
            placeholder={t("placeholder.tweet")}
            value={content}
            src={user?.profilePicture}
          />
          <StyledContainer padding={"0 0 0 10%"}>
            <ImageContainer
              editable
              images={imagesPreview}
              removeFunction={handleRemoveImage}
            />
          </StyledContainer>
          <StyledButtonContainer>
            <ImageInput setImages={handleAddImage} parentId={parentId} />
            {!mobile && (
              <Button
                text={"Tweet"}
                buttonType={ButtonType.DEFAULT}
                size={"SMALL"}
                onClick={handleSubmit}
                disabled={
                  content.length <= 0 ||
                  content.length > 240 ||
                  images.length > 4 ||
                  images.length < 0
                }
              />
            )}
          </StyledButtonContainer>
        </StyledContainer>
      </StyledTweetBoxContainer>
    </>
  );
};

export default TweetBox;
