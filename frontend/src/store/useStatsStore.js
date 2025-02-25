import { create } from "zustand";
import api from "../utils/api.js";

export const useStatsStore = create((set) => ({
    totalUsers: 0,

    totalPosts: 0,
    loading: true,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null }); // Mettre à jour l'état de chargement
        try {
            // Récupérer les utilisateurs
            const usersResponse = await api.get("/users"); // Remplacer par le bon endpoint
            const users = usersResponse.data;

            // Récupérer les posts
            const postsResponse = await api.get("/posts"); // Remplacer par le bon endpoint
            const posts = postsResponse.data;

            // Compter les utilisateurs avec le rôle "house_owner"

            // Calculer le pourcentage des house owners

            // Mettre à jour l'état du store
            set({
                totalUsers: users.length,
                totalPosts: posts.length,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.message || "Échec de récupération des statistiques",
                loading: false,
            });
        }
    },
}));
