import type { PostData, SingInData, SingUpData } from "./index";
import axios from "axios";
import { S3Service } from "./S3Service";

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
const url =
  process.env.REACT_APP_API_URL || "http://localhost:8081/api";

  export const useService = () => {
    const service = useHttpRequestService();
    return service;
  };

const httpRequestService = {

  signUp: async (data: Partial<SingUpData>) => {
      const res = await axios.post(`${url}/auth/signup`, data);
      if (res.status === 201) {
        localStorage.setItem("token", `Bearer ${res.data.token}`);
        return true
      }
  },
  
  signIn: async (data: SingInData) => {
    const res = await axios.post(`${url}/auth/login`, data);
    if (res.status === 200) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  
  createPost: async (data: PostData) => {
    const res = await axios.post(`${url}/post`, data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 201) {
      const { upload } = S3Service;
      for (const imageUrl of res.data.images) {
        const index: number = res.data.images.indexOf(imageUrl);
        await upload(data.images![index], imageUrl);
      }
      return res.data;
    }
  },
  commentPost: async (data: PostData) => {
  
    const res = await axios.post(`${url}/comment/${data.parentId}`, {
      postId: data.parentId,
      content: data.content, 
    });
  
    if (res.status === 201) {
      const comment = res.data.comment;
      return comment;
    }
  },
  getPaginatedPosts: async (limit: number, after: string, query: string) => {
    const res = await axios.get(`${url}/post/${query}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getPosts: async (query: string) => {
    const res = await axios.get(`${url}/post/${query}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getRecommendedUsers: async (limit: number, skip: number) => {
    const res = await axios.get(`${url}/user`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      params: {
        limit,
        skip,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  me: async () => {
    const res = await axios.get(`${url}/user/me`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getPostById: async (id: string) => {
    const res = await axios.get(`${url}/post/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  createReaction: async (postId: string, reaction: string) => {
    console.log('sending reaction')
    const res = await axios.post(
      `${url}/reaction/${postId}`,
      { type: reaction },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status === 201) {
      return res.data;
    }
  },
  deleteReaction: async (postId: string, type: string) => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.delete(`${url}/reaction/${postId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: {
          type,
          userId,
        },
      });
      
      if (res.status === 204) {
        console.log('Reaction deleted successfully');
        return true;
      }
    } catch (error) {
      console.error('Error deleting reaction:', error);
      return false; 
    }
  },
  
  followUser: async (userId: string) => {
    console.log('********************')
    const res = await axios.post(
      `${url}/follow/follow/${userId}`,
      {},{
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status === 200) {
      return res.data;
    }
  },
  unfollowUser: async (userId: string) => {
    console.log('********************')
    const res = await axios.post(
      `${url}/follow/unfollow/${userId}`,
      {},{
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      const cancelToken = axios.CancelToken.source();

      const response = await axios.get(`${url}/user/search`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          username,
          limit,
          skip,
        },
        cancelToken: cancelToken.token,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (!axios.isCancel(error)) console.log(error);
    }
  },

  getProfile: async (id: string) => {
    const res = await axios.get(`${url}/user/profile/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  
  getPaginatedPostsFromProfile: async (
    limit: number,
    after: string,
    id: string
  ) => {
    const res = await axios.get(`${url}/post/by_user/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      params: {
        limit,
        after,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },
  getPostsFromProfile: async (id: string) => {
  try {
    const res = await axios.get(`${url}/post/by_user/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
      // El perfil es privado o no se encontraron posts, no mostrar nada en consola
      console.log("Perfil privado o no se encontraron posts");
      return null;  // Aquí retornas un valor controlado
    }

    // Si es otro error, lo manejas y lo lanzas si es necesario
    console.error("Error al obtener los posts:", error);
    throw error; // Solo propagas otros errores que no sean 404
  }
  },
  isLogged: async () => {
    const res = await axios.get(`${url}/user/me`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return res.status === 200;
  },

  getProfileView: async (id: string) => {
    const res = await axios.get(`${url}/user/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },

  deleteProfile: async () => {
    const res = await axios.delete(`${url}/user/me`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 204) {
      localStorage.removeItem("token");
    }
  },

  getChats: async (id: string) => {
    const res = await axios.get(`${url}/chat/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },

  getMutualFollows: async () => {
    const res = await axios.get(`${url}/follow/mutual`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },

  createChat: async (id: string) => {
    const res = await axios.post(
      `${url}/chat`,
      {
        users: [id],
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    if (res.status === 201) {
      return res.data;
    }
  },

  getChat: async (id: string) => {
    const res = await axios.get(`${url}/chat/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },

  deletePost: async (id: string) => {
    await axios.delete(`${url}/post/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  },

  getPaginatedCommentsByPostId: async (
    id: string,
    limit: number,
    after: string
  ) => {
    const res = await axios.get(`${url}/post/comment/by_post/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getCommentsByPostId: async (id: string) => {
    const res = await axios.get(`${url}/comment/by_postId/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
};

const useHttpRequestService = () => httpRequestService;

class HttpService {
  service = httpRequestService;
}

export { useHttpRequestService, HttpService };
