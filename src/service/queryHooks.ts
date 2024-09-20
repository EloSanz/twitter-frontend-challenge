import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatDTO, PostData, SingInData, SingUpData, User } from "./index";
import { useService } from "./HttpRequestService";
import { use } from "i18next";
/// my custom query hooks

/// Auth
export const useSignUp = () => {
  const service = useService();

  return useMutation({
    mutationFn: async (formData: Partial<SingUpData>) =>
      await service.signUp(formData),
  });
};

export const useSignIn = () => {
  const service = useService();

  return useMutation({
    mutationFn: async (formData: SingInData) =>
      await service.signIn(formData),
  });
};

/// User
export const useMe = () => {
  const service = useService();

  const { data, error } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => await service.me(),
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { data, error };
};
export const useGetProfile = (id: string) => {
  const service = useService();
  const { data } = useQuery<User>({
    queryKey: ['user',id],
    queryFn: async () => await service.getProfile(id),
  });

  return { data };
};
export const useDeleteProfile = () => {
  const service = useService();

  return useMutation({
    mutationFn: async () => await service.deleteProfile(),
  });
}
export const useGetRecommendedUsers = (limit: number, skip: number) => {
  const service = useService();

  const { data } = useQuery<User[]>({
    queryKey: ["recommendedUsers"],
    queryFn: async () => await service.getRecommendedUsers(limit, skip),
  });
  return { data };
}
export const useGetSearchUsers = (username: string, limit: number, skip: number) => {
  const service = useService();

  const { data } = useQuery<User[]>({
    queryKey: ["searchUsers", username],
    queryFn: async () => await service.searchUsers(username, limit, skip),
  });
  return { data };
}


/// Follow - Unfollow
export const useFollowUser = () => {
  const service = useService();

  return useMutation({
    mutationKey: ['follow'],
    mutationFn: async ({userId}:{userId: string}) => await service.followUser(userId)
  })
}
export const useUnfollowUser = () => {
  const service = useService();

  return useMutation({
    mutationKey: ['follow'],
    mutationFn: async ({ userId }: { userId: string }) => await service.unfollowUser(userId),
  });
};

/// Posts
export const useCreatePost = () => {
    const service = useService();
    
    return useMutation({
        mutationFn: async (data: PostData) => 
            await service.createPost(data),
    });
};
export const useDeletePost = () => {
  const service = useService();

  return useMutation({
    mutationFn: async (id: string) => await service.deletePost(id),
  });
};
export const useGetPaginatedPosts = (limit: number, after: string, query: string) => {
    const service = useService();
    
    const { data, error, isLoading } = useQuery({
        queryKey: ["posts", after, query],
        queryFn: async () => await service.getPaginatedPosts(limit, after, query),
        retry: false,
        refetchOnWindowFocus: false,
    });
    return { data, error, isLoading };
}
export const useGetPostById = (id: string) => {
  const service = useService();

  const { data, error, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => await service.getPostById(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
};
export const useGetPaginatedPostsFromProfile = (limit: number, after: string, id: string) => {
  const service = useService();

  const { data, error, isLoading } = useQuery({
    queryKey: ["profilePosts", after, id],
    queryFn: async () => await service.getPaginatedPostsFromProfile(limit, after, id),
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
}
export const useGetPostFromProfile = (id: string) => {
  const service = useService();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["profilePosts", id],
    queryFn: async () => await service.getPostsFromProfile(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { data, isError, isLoading };
}
/// Comments
export const useCommentPost = () => {
  const service = useService();
  return useMutation({
    mutationFn: async (commentData: PostData) => await service.commentPost(commentData),
  });
};
export const useGetCommentByPostId = (postId: string) => {
  const service = useService();

  const { data, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => await service.getCommentsByPostId(postId),
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { data, error };
}
/// Reaction
export const useCreateReaction = () => {
  const service = useService();

  return useMutation({
    mutationKey: ['reaction'],
    mutationFn: async ({ postId, type}: { postId: string, type: string}) => await service.createReaction(postId, type),
  });
};
export const useDeleteReaction = () => {
  const service = useService();

  return useMutation({
    mutationKey: ['reaction'],
    mutationFn: async ({ postId, type }: { postId: string, type: string }) => await service.deleteReaction(postId, type),
  });
}

/// Chat
export const useGetChats = (id: string) => {
  const service = useService();

  const data = useQuery<ChatDTO[]>({
    queryKey: ["chats", id],
    queryFn: async () => await service.getChat(id),
  });

  return data ;
}
export const useGetChatById = (id: string) => {
  const queryClient = useQueryClient();
  const userId = useMe().data?.id;
  const cachedChats = queryClient.getQueryData<ChatDTO[]>(["chats", userId]);
  console.log(cachedChats)
  const chat = cachedChats?.find((chat) => chat.id === id);

  return {
    data: chat,
    isLoading: !chat,
    isError: false,
    isSuccess: !!chat, 
  };
};