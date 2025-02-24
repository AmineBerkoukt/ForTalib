import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Evaluate from '../models/Evaluate.js';
import Favorise from '../models/Favorise.js';
import Message from '../models/Message.js';
import Request from '../models/Request.js';
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();
const seedDatabase = async () => {
    await connectDB();

    await User.deleteMany({});
    await Post.deleteMany({});
    await Evaluate.deleteMany({});
    await Favorise.deleteMany({});
    await Message.deleteMany({});
    await Request.deleteMany({});

    const hashedPassword = await bcrypt.hash('password', 10);

    const users = [
        { firstName: 'Admin', lastName: 'User', email: 'admin@example.com',
            password: hashedPassword, cin: 'AA000000', phoneNumber: '0600000000',
            address: 'Tanger, Maroc', role: 'admin',
            profilePhoto: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { firstName: 'Iman', lastName: 'Metni', email: 'iman.metni@example.com',
            password: hashedPassword, cin: 'BB111111', phoneNumber: '0601234567',
            address: 'Casablanca, Maroc', role: 'house_owner',
            profilePhoto: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { firstName: 'Mehdi', lastName: 'Toufik', email: 'mehdi.toufik@example.com',
            password: hashedPassword, cin: 'CC222222', phoneNumber: '0609876544',
            address: 'Rabat, Maroc', role: 'student',
            profilePhoto: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { firstName: 'Amina', lastName: 'El Idrissi', email: 'amina.elidrissi@example.com',
            password: hashedPassword, cin: 'GG333333', phoneNumber: '0601112233',
            address: 'Marrakech, Maroc', role: 'student',
            profilePhoto: 'https://randomuser.me/api/portraits/women/4.jpg' },
        { firstName: 'Sarah', lastName: 'Benali', email: 'sarah.benali@example.com',
            password: hashedPassword, cin: 'BB111111', phoneNumber: '0611234599',
            address: 'Tanger, Maroc', role: 'house_owner',
            profilePhoto: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { firstName: 'Issam', lastName: 'Slimani', email: 'issam.slimani@example.com',
            password: hashedPassword, cin: 'HH222222', phoneNumber: '0609876543',
            address: 'Tanger, Maroc', role: 'student',
            profilePhoto: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { firstName: 'Amira', lastName: 'Gharbaoui', email: 'amira.gharbaoui@example.com',
            password: hashedPassword, cin: 'DD333333', phoneNumber: '0601112234',
            address: 'Tanger, Maroc', role: 'student',
            profilePhoto: 'https://randomuser.me/api/portraits/women/7.jpg' },
        { firstName: 'Omar', lastName: 'Lahlou', email: 'omar.lahlou@example.com',
            password: hashedPassword, cin: 'EE444444', phoneNumber: '06055556666',
            address: 'Tanger, Maroc', role: 'house_owner',
            profilePhoto: 'https://randomuser.me/api/portraits/men/8.jpg' }
    ];

    const createdUsers = await User.insertMany(users);

    const posts = [
        { userId: createdUsers[1]._id, title: 'Studio Moderne à Casablanca',
            description: 'Studio bien équipé proche du tramway.',
            images: [
                'https://source.unsplash.com/600x400/?apartment,casablanca',
                'https://source.unsplash.com/600x400/?modern-room'
            ],
            price: 3000, address: 'Maarif, Casablanca', elevator: true, maximumCapacity: 2, avgRate: 1 },
        { userId: createdUsers[2]._id, title: 'Chambre Étudiante à Rabat',
            description: 'Petite chambre cosy proche de l’université.',
            images: [
                'https://source.unsplash.com/600x400/?room,rabat',
                'https://source.unsplash.com/600x400/?student-living',
                'https://source.unsplash.com/600x400/?bedroom'
            ],
            price: 1500, address: 'Agdal, Rabat', elevator: false, maximumCapacity: 1 , avgRate: 2},
        { userId: createdUsers[1]._id, title: 'Appartement lumineux à Irfan 1',
            description: 'Bel appartement avec grandes fenêtres et vue dégagée, parfait pour une colocation.',
            images: [
                'https://source.unsplash.com/600x400/?living-room',
                'https://source.unsplash.com/600x400/?interior',
                'https://source.unsplash.com/600x400/?kitchen',
                'https://source.unsplash.com/600x400/?balcony'
            ],
            price: 4800, address: 'Irfan 1', elevator: true, maximumCapacity: 4 , avgRate: 3},

        { userId: createdUsers[4]._id, title: 'Studio neuf à Al Boughaz',
            description: 'Studio entièrement rénové, idéal pour un étudiant ou un jeune professionnel.',
            images: [
                'https://source.unsplash.com/600x400/?small-apartment',
                'https://source.unsplash.com/600x400/?minimalist-room'
            ],
            price: 2900, address: 'Al Boughaz', elevator: false, maximumCapacity: 1 , avgRate: 4},

        { userId: createdUsers[3]._id, title: 'Appartement meublé à Mesnana',
            description: 'Appartement de 80m² entièrement meublé avec cuisine équipée et balcon.',
            images: [
                'https://source.unsplash.com/600x400/?furnished-apartment',
                'https://source.unsplash.com/600x400/?sofa',
                'https://source.unsplash.com/600x400/?bathroom'
            ],
            price: 5500, address: 'Mesnana', elevator: true, maximumCapacity: 3 , avgRate: 5},

        { userId: createdUsers[6]._id, title: 'Chambre étudiante à Epsilon',
            description: 'Chambre privée dans un grand appartement partagé, proche des transports.',
            images: [
                'https://source.unsplash.com/600x400/?student-room',
                'https://source.unsplash.com/600x400/?workspace',
                'https://source.unsplash.com/600x400/?library'
            ],
            price: 1900, address: 'Epsilon', elevator: false, maximumCapacity: 1 , avgRate: 1},

        { userId: createdUsers[4]._id, title: 'Appartement haut standing à Complexe Hassani',
            description: 'Grand appartement avec 3 chambres, vue sur la mer et parking privé.',
            images: [
                'https://source.unsplash.com/600x400/?luxury-apartment',
                'https://source.unsplash.com/600x400/?seaview',
                'https://source.unsplash.com/600x400/?bedroom',
                'https://source.unsplash.com/600x400/?balcony',
                'https://source.unsplash.com/600x400/?dining-room'
            ],
            price: 7000, address: 'Complexe Hassani', elevator: true, maximumCapacity: 5 , avgRate: 2},

        { userId: createdUsers[5]._id, title: 'Studio bien situé à Irfan 2',
            description: 'Studio confortable proche des commerces et universités.',
            images: [
                'https://source.unsplash.com/600x400/?small-room',
                'https://source.unsplash.com/600x400/?apartment-view'
            ],
            price: 3100, address: 'Irfan 2', elevator: false, maximumCapacity: 1 , avgRate: 3},

        { userId: createdUsers[6]._id, title: 'Appartement familial à Mesnana',
            description: 'Appartement spacieux avec trois chambres, idéal pour une famille.',
            images: [
                'https://source.unsplash.com/600x400/?home',
                'https://source.unsplash.com/600x400/?family-living',
                'https://source.unsplash.com/600x400/?garden',
                'https://source.unsplash.com/600x400/?kids-room'
            ],
            price: 5800, address: 'Mesnana', elevator: true, maximumCapacity: 4 , avgRate: 5},

        { userId: createdUsers[2]._id, title: 'Chambre avec terrasse à Epsilon',
            description: 'Chambre dans une colocation avec une grande terrasse partagée.',
            images: [
                'https://source.unsplash.com/600x400/?terrace',
                'https://source.unsplash.com/600x400/?city-view'
            ],
            price: 2200, address: 'Epsilon', elevator: false, maximumCapacity: 1 , avgRate: 4}
    ];

    const createdPosts = await Post.insertMany(posts);

    const evaluations = [];
    for (let i = 0; i < 30; i++) {
        evaluations.push({
            userId: createdUsers[i % createdUsers.length]._id,  // Correction ici
            postId: createdPosts[i % createdPosts.length]._id,  // Correction ici
            rate: Math.floor(Math.random() * 5) + 1
        });
    }
    await Evaluate.insertMany(evaluations);

    const favorites = [];
    for (let i = 0; i < 30; i++) {
        favorites.push({
            userId: createdUsers[i % createdUsers.length]._id,  // Correction ici
            postId: createdPosts[(i + 5) % createdPosts.length]._id  // Correction ici
        });
    }
    await Favorise.insertMany(favorites);

    const messages = [];
    for (let i = 0; i < 50; i++) {
        messages.push({
            senderId: createdUsers[i % createdUsers.length]._id,  // Correction ici
            receiverId: createdUsers[(i + 1) % createdUsers.length]._id,  // Correction ici
            text: `Bonjour, je suis intéressé par votre logement !`
        });
    }
    await Message.insertMany(messages);

    const requests = [];
    for (let i = 0; i < 10; i++) {
        requests.push({
            userId: createdUsers[i % createdUsers.length]._id,  // Correction ici
            status: ['pending', 'accepted', 'rejected'][i % 3],
            treatedAt: i % 3 === 1 ? new Date() : null
        });
    }
    await Request.insertMany(requests);


    console.log('Database seeded successfully with meaningful dataset!');
};

seedDatabase().catch(error => console.error(error));
