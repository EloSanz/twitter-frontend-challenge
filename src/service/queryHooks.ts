import { useMutation, useQuery } from "@tanstack/react-query";
import type { PostData, SingInData, SingUpData, User } from "./index";
import { useService } from "./HttpRequestService";
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
}
export const useDeleteProfile = () => {
  const service = useService();

  return useMutation({
    mutationFn: async () => await service.deleteProfile(),
  });
}

/// Follow Unfollow
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
export const useCommentPost = () => {
  const service = useService();

  return useMutation({
    mutationFn: async (commentData: PostData) => await service.commentPost(commentData),
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
