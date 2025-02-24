import { create } from "zustand";
import api from "../utils/api.js";

export const useStatsStore = create((set) => ({
    totalUsers: 0,
    houseOwners: 0,
    houseOwnersPercentage: 0,
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
            const houseOwners = users.filter(user => user.role === "house_owner");

            // Calculer le pourcentage des house owners
            const houseOwnersPercentage = (houseOwners.length / users.length) * 100;

            // Mettre à jour l'état du store
            set({
                totalUsers: users.length,
                houseOwners: houseOwners.length,
                houseOwnersPercentage: houseOwnersPercentage.toFixed(2), // Arrondi à 2 décimales
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
