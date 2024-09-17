import  { useEffect, useState } from "react";
import Button from "../button/Button";
import { useHttpRequestService } from "../../service/HttpRequestService";
import UserDataBox from "../user-data-box/UserDataBox";
import { useTranslation } from "react-i18next";
import { ButtonType } from "../button/StyledButton";
import { Author, User } from "../../service";
import { BoxContainer } from './FollowUserBoxStyled';

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
}: FollowUserBoxProps) => {
  const { t } = useTranslation();
  const service = useHttpRequestService();
  const [user, setUser] = useState<User>();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const r = await handleGetUser();
        setUser(r);

        setIsFollowing(
          r.following && r.following.some((f: Author) => f.id === id)
        );
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleGetUser = async () => {
    const me = await service.me();
    return me;
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await service.unfollowUser(id);
      } else {
        await service.followUser(id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error during follow/unfollow:", error);
    }
  };

  return (
    <BoxContainer>
      <UserDataBox
        id={id}
        name={name!}
        profilePicture={profilePicture!}
        username={username!}
      />
      <Button
        text={isFollowing ? t("buttons.unfollow") : t("buttons.follow")}
        buttonType={isFollowing ? ButtonType.DELETE : ButtonType.FOLLOW}
        size={"SMALL"}
        onClick={handleFollow}
      />
    </BoxContainer>
  );
};

export default FollowUserBox;
