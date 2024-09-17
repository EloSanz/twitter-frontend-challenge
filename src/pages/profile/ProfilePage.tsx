import React, { useEffect, useState } from "react";
import ProfileInfo from "./ProfileInfo";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import { useTranslation } from "react-i18next";
import { Author, User } from "../../service";
import { ButtonType } from "../../components/button/StyledButton";
import Button from "../../components/button/Button";
import ProfileFeed from "../../components/feed/ProfileFeed";
import { StyledContainer } from "../../components/common/Container";
import { StyledH5 } from "../../components/common/text";
import { useGetMe } from "../../redux/hooks";
import {
  useDeleteProfile,
  useFollowUser,
  useGetProfile,
  useUnfollowUser,
} from "../../service/queryHooks";
import { useQueryClient } from "@tanstack/react-query";

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [following, setFollowing] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalValues, setModalValues] = useState({
    text: "",
    title: "",
    type: ButtonType.DEFAULT,
    buttonText: "",
  });

  const user = useGetMe();
  const id = useParams().id;
  const { data } = useGetProfile(id!);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  /// Query hooks
  const { mutateAsync: deleteProfile } = useDeleteProfile();
  const { mutateAsync: unfollowUser } = useUnfollowUser();
  const { mutateAsync: followUser } = useFollowUser();
  
  const handleButtonType = (): { component: ButtonType; text: string } => {
    if (profile?.id === user?.id) return { component: ButtonType.DELETE, text: t("buttons.delete") };
    if (following) return { component: ButtonType.OUTLINED, text: t("buttons.unfollow") };
    return { component: ButtonType.FOLLOW, text: t("buttons.follow") };
  };

  const handleSubmit = async () => {
    if (profile?.id === user?.id) {
      await deleteProfile();
      localStorage.removeItem("token");
      navigate("/sign-in");
    } else {
      await unfollowUser(
        { userId: profile!.id },
        {
          onSuccess: async () => {
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ["user"],
              }),
              queryClient.invalidateQueries({
                queryKey: ["posts"],
              }),
            ]);
            setFollowing(false);
            setShowModal(false);
          },
        }
      );
    }
  };


  const handleButtonAction = async () => {
    if (profile?.id === user?.id) {
      setShowModal(true);
      setModalValues({
        title: t("modal-title.delete-account"),
        text: t("modal-content.delete-account"),
        type: ButtonType.DELETE,
        buttonText: t("buttons.delete"),
      });
    } else {
      if (following) {
        setShowModal(true);
        setModalValues({
          text: t("modal-content.unfollow"),
          title: `${t("modal-title.unfollow")} @${profile?.username}?`,
          type: ButtonType.FOLLOW,
          buttonText: t("buttons.unfollow"),
        });
      } else {
        await followUser(
          { userId: profile!.id },
          {
            onSuccess: async () => {
              setFollowing(true);
              await Promise.all([
                queryClient.invalidateQueries({
                  queryKey: ["user"],
                }),
                queryClient.invalidateQueries({
                  queryKey: ["posts"],
                }),
              ]);
            },
            onError: (error) => {
              console.error(error);
            },
          }
        );
      }
    }
  };

  const getProfileData = async () => {
    if (data === undefined) return;
    setProfile(data);
    if (user) {
      const isFollowing = data.followers?.find(
        (follower: Author) => follower.id === user.id
      );
      if (isFollowing) setFollowing(true);
      else setFollowing(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [id, data, setFollowing]);

  if (!id) return null;

  return (
    <>
      <StyledContainer
        maxHeight={"100vh"}
        borderRight={"1px solid #ebeef0"}
        maxWidth={"600px"}
      >
        {profile && (
          <>
            <StyledContainer
              borderBottom={"1px solid #ebeef0"}
              maxHeight={"212px"}
              padding={"16px"}
            >
              <StyledContainer
                alignItems={"center"}
                padding={"24px 0 0 0"}
                flexDirection={"row"}
              >
                <ProfileInfo
                  name={profile!.name!}
                  username={profile!.username}
                  profilePicture={profile!.profilePicture}
                />
                <Button
                  buttonType={handleButtonType().component}
                  size={"100px"}
                  onClick={handleButtonAction}
                  text={handleButtonType().text}
                />
              </StyledContainer>
            </StyledContainer>
            <StyledContainer width={"100%"}>
              {profile.followers ? (
                <ProfileFeed />
              ) : (
                <StyledH5>Private account</StyledH5>
              )}
            </StyledContainer>
            <Modal
              show={showModal}
              text={modalValues.text}
              title={modalValues.title}
              acceptButton={
                <Button
                  buttonType={modalValues.type}
                  text={modalValues.buttonText}
                  size={"MEDIUM"}
                  onClick={handleSubmit}
                />
              }
              onClose={() => {
                setShowModal(false);
              }}
            />
          </>
        )}
      </StyledContainer>
    </>
  );
};

export default ProfilePage;
