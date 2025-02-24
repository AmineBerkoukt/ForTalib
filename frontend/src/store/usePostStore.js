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

    // Fetch all posts
    getPosts: async () => {
        try {
            const res = await api.get("/posts");
            set({ posts: res.data }); // Set posts state
            console.log("usePostStore.getPosts res", res.data);
        } catch (error) {
            console.log("usePostStore.getPosts err", error.message);
        }
    },

    getPostsFilter: async (priceFilter, rateFilter) => {
        try {
            const res = await api.get(`/posts/filter?priceFilter=${priceFilter}&rateFilter=${rateFilter}`);
            set({ posts: res.data });
            console.log("Filter ", res.data);
        } catch (error) {
            console.log("usePostStore.getPostsFilter err", error.message);
        }
    },

    getPostsForUser: async (userId) => {
        try {
            const res = await api.get(`/postsFor?userId=${userId}`);
            set({ profilePosts: res.data }); // Set posts state
            console.log("usePostStore.getPostsForUser res", res.data);
        } catch (error) {
            console.log("usePostStore.getPostsForUser err", error.message);
        }
    },

    // Fetch a post by ID (empty for now)
    getPostById: async (postId) => {
        try {
            const res = await api.get(`/posts/post/${postId}`);
            console.log("usePostStore.getPostById res", res.data);
            return res.data;
        } catch (error) {
            console.log("usePostStore.getPostById err", error.message);
        }
    },

    // Create a post
    createPost: async (postData) => {
        try {
            // Create a new FormData instance
            const formData = new FormData();

            // Append text fields
            formData.append('title', postData.title);
            formData.append('description', postData.description);
            formData.append('price', postData.price);
            formData.append('address', postData.address);
            formData.append('elevator', postData.elevator);
            formData.append('maximumCapacity', postData.maximumCapacity);

            // Append each image file
            if (postData.images && postData.images.length > 0) {
                postData.images.forEach((image, index) => {
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

            // Refetch posts
            get().getPosts();

            return res.data;
        } catch (error) {
            console.error("usePostStore.createPost err", error.message);
            toast.error('Post was NOT created!');
            throw error;
        }
    },

    deletePost : async (postId , isInHome, userId) => {
        try {
            console.info("isInHome : " , isInHome);
            console.info("UserId : " , userId);
            const res = await api.delete(`posts/post?id=${postId}`);

            console.log("usePostStore.deletePost res", res.data);
            if (isInHome) {
                get().getPosts();
            } else{
                const { getUserPosts } = useProfileStore.getState();
                await getUserPosts(userId);
            }

            return res.data;
        } catch (error) {
            console.error("usePostStore.deletePost err", error.message);
        }
    },


    getUserPosts: async (userId) => {
        try {
            const res = await api.get(`/posts/postsFor?userId=${userId}`);
            set({ userPosts: res.data }); // Set posts state
            console.log("usePostStore.userPosts res", res.data);
        } catch (error) {
            console.log("usePostStore.getPosts err", error.message);
        }
    },

    updatePost: async (postId, newPostData) => {
        try {

            const res = await api.patch(`/posts/post/${postId}`, newPostData);

            const { posts } = get();

            // Update the state with the updated post
            set({
                posts: posts.map((post) => (post._id === postId ? res.data : post)),
            });

            console.log("usePostStore.updatePost res", res.data);
            toast.success("Post Updated successfully!");

            // Refetch posts to ensure consistency
            await get().getPosts();

            return res.data;
        } catch (error) {
            console.error("usePostStore.updatePost error:", error);
            toast.error("Failed to update the post. Please try again.");
        }
    },

    // Evaluate a post (empty for now)
    evaluatePost: async () => {
        try {
            // Logic for evaluating post goes here
        } catch (error) {
            console.log("usePostStore.evaluatePost err", error.message);
        }
    },

    // Fetch top five posts
    getTopFive: async () => {
        try {
            const res = await api.get("/posts/topRated");
            set({ topFivePosts: res.data });
        } catch (error) {
            console.log("usePostStore.getTopFive error : ", error.message);
        }
    },

    // Access the current state (optional)
    getState: () => {
        const state = get(); // Get the current state
        console.info("usePostStore state", state); // Log the state
        return state;
    },

    ratePost: async (postId, rate) => {
        try {
            const response = await api.post(`/rate/${postId}`, { rate: Number(rate) });
            return response.data;
        } catch (error) {
            console.log("Error in saving post in the store", error.message);
        }
    },



    savePost: async ( postId ) => {
        try {
            console.log('Save post Post id : ' , postId )
            const response = await api.post(`/saved/${postId}`);
            console.log("usePostStore.savepost : ", response.data)

        }catch (error) {
            console.log("Error in saving post in the store " , error.message);
        }
    },

    unsavePost: async ( postId ) => {
        try {
            console.log('Remove Post Post id : ' , postId )
            const response = await api.delete(`/saved/${postId}`);
            console.log("usePostStore.unsavepost : ", response.data)
        }catch (error) {
            console.log("Error in saving post in the store " , error.message);
        }
    },
}));
