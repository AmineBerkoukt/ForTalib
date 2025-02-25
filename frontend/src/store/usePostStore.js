import { create } from "zustand";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { useProfileStore } from "./useProfileStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const usePostStore = create((set, get) => ({
    posts: [],
    topFivePosts: [],
    userPosts: [],
    profilePosts: [],
    isLoading: false,

    setLoading: (loading) => set({ isLoading: loading }),

    getPosts: async () => {
        get().setLoading(true);
        try {
            const res = await api.get("/posts");
            set({ posts: res.data });
            console.log("usePostStore.getPosts res", res.data);
        } catch (error) {
            console.log("usePostStore.getPosts err", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    getPostsFilter: async (priceFilter, rateFilter) => {
        get().setLoading(true);
        try {
            const res = await api.get(`/posts/filter?priceFilter=${priceFilter}&rateFilter=${rateFilter}`);
            set({ posts: res.data });
            console.log("Filter ", res.data);
        } catch (error) {
            console.log("usePostStore.getPostsFilter err", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    getPostsForUser: async (userId) => {
        get().setLoading(true);
        try {
            const res = await api.get(`/postsFor?userId=${userId}`);
            set({ profilePosts: res.data });
            console.log("usePostStore.getPostsForUser res", res.data);
        } catch (error) {
            console.log("usePostStore.getPostsForUser err", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    getPostById: async (postId) => {
        get().setLoading(true);
        try {
            const res = await api.get(`/posts/post/${postId}`);
            console.log("usePostStore.getPostById res", res.data);
            return res.data;
        } catch (error) {
            console.log("usePostStore.getPostById err", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    createPost: async (postData) => {
        get().setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', postData.title);
            formData.append('description', postData.description);
            formData.append('price', postData.price);
            formData.append('address', postData.address);
            formData.append('elevator', postData.elevator);
            formData.append('maximumCapacity', postData.maximumCapacity);

            if (postData.images && postData.images.length > 0) {
                postData.images.forEach((image) => {
                    formData.append('images', image);
                });
            }

            const apiConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const res = await api.post(BASE_URL + "/posts/create", formData, apiConfig);

            const { posts } = get();
            set({ posts: [...posts, res.data] });

            console.log("usePostStore.createPost res", res.data);
            toast.success('Post Created successfully!');

            get().getPosts();
            get().getTopFive();

            return res.data;
        } catch (error) {
            console.error("usePostStore.createPost err", error.message);
            toast.error('Post was NOT created!');
            throw error;
        } finally {
            get().setLoading(false);
        }
    },

    deletePost: async (postId, isInHome, userId) => {
        get().setLoading(true);
        try {
            const res = await api.delete(`posts/post?id=${postId}`);
            console.log("usePostStore.deletePost res", res.data);
            if (isInHome) {
                get().getPosts();
                get().getTopFive();
            } else {
                const { getUserPosts } = useProfileStore.getState();
                await getUserPosts(userId);
            }
            return res.data;
        } catch (error) {
            console.error("usePostStore.deletePost err", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    getUserPosts: async (userId) => {
        get().setLoading(true);
        try {
            const res = await api.get(`/posts/postsFor?userId=${userId}`);
            set({ userPosts: res.data });
            console.log("usePostStore.userPosts res", res.data);
        } catch (error) {
            console.log("usePostStore.getUserPosts err", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    updatePost: async (postId, newPostData) => {
        get().setLoading(true);
        try {
            const res = await api.patch(`/posts/post/${postId}`, newPostData);

            const { posts } = get();
            set({
                posts: posts.map((post) => (post._id === postId ? res.data : post)),
            });

            console.log("usePostStore.updatePost res", res.data);
            toast.success("Post Updated successfully!");

            await get().getPosts();

            return res.data;
        } catch (error) {
            console.error("usePostStore.updatePost error:", error);
            toast.error("Failed to update the post. Please try again.");
        } finally {
            get().setLoading(false);
        }
    },

    getTopFive: async () => {
        get().setLoading(true);
        try {
            const res = await api.get("/posts/topRated");
            set({ topFivePosts: res.data });
        } catch (error) {
            console.log("usePostStore.getTopFive error : ", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    ratePost: async (postId, rate) => {
        get().setLoading(true);
        try {
            const response = await api.post(`/rate/${postId}`, { rate: Number(rate) });
            return response.data;
        } catch (error) {
            console.log("Error in saving post in the store", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    savePost: async (postId) => {
        get().setLoading(true);
        try {
            console.log('Save post Post id : ', postId);
            const response = await api.post(`/saved/${postId}`);
            console.log("usePostStore.savepost : ", response.data);
        } catch (error) {
            console.log("Error in saving post in the store ", error.message);
        } finally {
            get().setLoading(false);
        }
    },

    unsavePost: async (postId) => {
        get().setLoading(true);
        try {
            console.log('Remove Post Post id : ', postId);
            const response = await api.delete(`/saved/${postId}`);
            console.log("usePostStore.unsavepost : ", response.data);
        } catch (error) {
            console.log("Error in saving post in the store ", error.message);
        } finally {
            get().setLoading(false);
        }
    },
}));
