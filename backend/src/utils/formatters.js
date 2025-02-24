export function formatPostsResponse(posts) {
    if (!posts || posts.length === 0) {
        return "Désolé, je n'ai trouvé aucun logement correspondant à vos critères.";
    }

    let response = "Voici les logements disponibles :\n\n";

    posts.forEach((post, index) => {
        response += `${index + 1}. 🏠 Logement à ${post.address}\n`;
        response += `   💰 Prix: ${Math.round(post.price)} Dhs\n`;
        response += `   👥 Capacité: ${post.maximumCapacity} personnes\n`;
        response += `   🛗 Ascenseur: ${post.elevator ? 'Oui' : 'Non'}\n`;
        response += `   📞 Contact: ${post.userId.firstName} ${post.userId.lastName}\n\n`;
    });
    console.log("response (formatter) : ",response)
    return response;
}

