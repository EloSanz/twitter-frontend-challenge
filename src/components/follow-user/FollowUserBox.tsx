import  { useContext, useEffect, useState } from "react";
import Button from "../button/Button";
import UserDataBox from "../user-data-box/UserDataBox";
import { useTranslation } from "react-i18next";
import { ButtonType } from "../button/StyledButton";
import { useGetMe } from "../../redux/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useFollowUser, useUnfollowUser } from "../../service/queryHooks";
import { ToastContext } from "../toast/FallbackToast";
import { Author } from "../../service";
import { BoxContainer } from "./FollowUserBoxStyled";
import { ToastType } from "../toast/Toast";

interface FollowUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
}

const FollowUserBox = ({
  profilePicture,
  name,
  username,
  id,
}: FollowUserBoxProps) => {  const { t } = useTranslation();
const { mutateAsync: followUser } = useFollowUser();
const { mutateAsync: unfollowUser } = useUnfollowUser();
const [isFollowing, setIsFollowing] = useState(false);
const [error, setError] = useState<Error | null>(null);

const [successMessage, setSuccessMessage] = useState<string | null>(null);


const user = useGetMe();
const queryClient = useQueryClient();
const Toast = useContext(ToastContext);

useEffect(() => {
  setIsFollowing(user?.following.some((author: Author) => author.id === id));
}, []);

const handleFollow = async () => {
  if (isFollowing) {
    await unfollowUser(
      { userId: id },
      {
        onError: (e: Error) => {
          setError(e);
        },
        onSuccess: async () => {
          setIsFollowing(false);
          setSuccessMessage(t('Unfollow success'));
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user'] }),
            queryClient.invalidateQueries({ queryKey: ['posts'] }),
          ]);
        },
      }
    );
  } else {
    await followUser(
      { userId: id },
      {
        onError: (e) => {
          setError(e);
        },
        onSuccess: async () => {
          setIsFollowing(true);
          setSuccessMessage(t('Follow success'));
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user'] }),
            queryClient.invalidateQueries({ queryKey: ['posts'] }),
          ]);
        },
      }
    );
  }
};

  return (
    <>
      {Toast && successMessage && (
        <Toast.Toast message={successMessage} type={ToastType.SUCCESS} show={true} />
      )}
      {Toast && error && <Toast.FallbackToast error={error}></Toast.FallbackToast>}
      {!error  && !isFollowing && (
        <BoxContainer>
          <UserDataBox id={id} name={name!} profilePicture={profilePicture!} username={username!} />
          <Button
            text={isFollowing ? t('buttons.unfollow') : t('buttons.follow')}
            buttonType={isFollowing ? ButtonType.DELETE : ButtonType.FOLLOW}
            size={'SMALL'}
            onClick={handleFollow}
          />
        </BoxContainer>
      )}
    </>
  );
};

export default FollowUserBox;
