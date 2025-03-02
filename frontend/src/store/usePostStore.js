import {create} from "zustand";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import {useProfileStore} from "./useProfileStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const usePostStore = create((set, get) => ({
        posts: [],
        topFivePosts: [],
        userPosts: [],
        profilePosts: [],
        postToEditId: null,
        isLoading: false,

        setPostToEditId: (postId) => set({postToEditId: postId}),

        setLoading: (loading) => set({isLoading: loading}),

        getPosts: async () => {
            get().setLoading(true);
            try {
                const res = await api.get("/posts");
                set({posts: res.data});
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
                set({posts: res.data});
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
                set({profilePosts: res.data});
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

                set((state) => ({posts: [...state.posts, res.data]}));

                toast.success('Post created successfully!');

                get().getPosts();
                get().getTopFive();

                return res.data;
            } catch (error) {
                if (error.status === 429) {
                    toast.error(error.response.data.error);
                }
                console.error("Unexpected error:", error.message);
                toast.error("An unexpected error occurred.");
            } finally {
                get().setLoading(false);
            }
        },


        deletePost: async (postId, isInHome, userId) => {
            get().setLoading(true);
            try {
                const res = await api.delete(`posts/post?id=${postId}`);
                if (isInHome) {
                    get().getPosts();
                    get().getTopFive();
                } else {
                    const {getUserPosts} = useProfileStore.getState();
                    await getUserPosts(userId);
                }
                return res.data;
            } catch (error) {
                console.error("usePostStore.deletePost err", error.message);
            } finally {
                get().setLoading(false);
            }
        }
        ,

        getUserPosts: async (userId) => {
            get().setLoading(true);
            try {
                const res = await api.get(`/posts/postsFor?userId=${userId}`);
                set({userPosts: res.data});
            } catch (error) {
                console.log("usePostStore.getUserPosts err", error.message);
            } finally {
                get().setLoading(false);
            }
        },

        updatePost:
            async (postId, newPostData) => {
                get().setLoading(true);
                try {
                    const res = await api.patch(`/posts/post/${postId}`, newPostData);

                    const {posts} = get();
                    set({
                        posts: posts.map((post) => (post._id === postId ? res.data : post)),
                    });

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

        getTopFive:
            async () => {
                get().setLoading(true);
                try {
                    const res = await api.get("/posts/topRated");
                    set({topFivePosts: res.data});
                } catch (error) {
                    console.log("usePostStore.getTopFive error : ", error.message);
                } finally {
                    get().setLoading(false);
                }
            },

        ratePost:
            async (postId, rate) => {
                get().setLoading(true);
                try {
                    const response = await api.post(`/rate/${postId}`, {rate: Number(rate)});
                    return response.data;
                } catch (error) {
                    console.log("Error in saving post in the store", error.message);
                } finally {
                    get().setLoading(false);
                }
            },

        savePost:
            async (postId) => {
                get().setLoading(true);
                try {
                    const response = await api.post(`/saved/${postId}`);
                } catch (error) {
                    console.log("Error in saving post in the store ", error.message);
                } finally {
                    get().setLoading(false);
                }
            },

        unsavePost:
            async (postId) => {
                get().setLoading(true);
                try {
                    const response = await api.delete(`/saved/${postId}`);
                } catch (error) {
                    console.log("Error in saving post in the store ", error.message);
                } finally {
                    get().setLoading(false);
                }
            },
    }))
;