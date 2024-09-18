import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useGetPostFromProfile } from "../service/queryHooks";
import { updateProfileFeed } from "../redux/user";

export const useGetProfilePosts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.user.userPosts)
  const id = useParams().id;
  const {data, isError, isLoading} = useGetPostFromProfile(id!)

  const handleFeedUpdate = async () => {
    dispatch(updateProfileFeed(data));
  }

  useEffect(() => {
    if(!id || data === undefined) return;

    handleFeedUpdate()
  }, [id, data]);

  return { posts, loading: isLoading, error: isError };
};
