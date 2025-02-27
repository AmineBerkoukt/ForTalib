import {useState, useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom"
import {useAuthStore} from "../store/useAuthStore"
import {useProfileStore} from "../store/useProfileStore"
import {usePostStore} from "../store/usePostStore"
import {useTheme} from "../contexts/ThemeContext"
import Layout from "../components/Layout"
import ProfileInfo from "../components/profile/ProfileInfo.jsx"
import Post from "../components/Post"
import LoadingScene from "../components/skeletons/LoadingScene.jsx"
import toast from "react-hot-toast"

const ProfilePage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const {authUser, isUpdatingProfile} = useAuthStore()
    const {userPosts, getUserPosts: getOwnPosts} = usePostStore()
    const {profilePosts, user, getUser, getUserPosts: getOthersPosts} = useProfileStore()
    const {isDarkMode} = useTheme()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const isOwnProfile = !id || id === authUser?._id

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError("")
            try {
                if (isOwnProfile) {
                    await getOwnPosts(authUser._id)
                } else {
                    await Promise.all([getUser(id), getOthersPosts(id)])
                }
            } catch (error) {
                setError("Failed to load profile data. Please try again later.")
                console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [id, authUser, isOwnProfile, getUser, getOwnPosts, getOthersPosts])


    const handlePostDeleted = async () => {
        try {
            if (isOwnProfile) {
                await getOwnPosts(authUser._id)
            } else {
                await getOthersPosts(id)
            }
        } catch (error) {
            console.error("Failed to refresh posts:", error)
        }
    }

    const processImages = (images) => {
        return (images || []).map((img) => (img.startsWith("http") ? img : `http://localhost:5000${img}`))
    }

    if (isLoading) {
        return (
            <Layout isDarkMode={isDarkMode}>
                <LoadingScene isDarkMode={isDarkMode}/>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout isDarkMode={isDarkMode}>
                <div
                    className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
                    <div className="text-center p-8 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </Layout>
        )
    }

    const currentUser = isOwnProfile ? authUser : user
    const postsToDisplay = isOwnProfile ? userPosts : profilePosts
    console.log(authUser)


    return (
        <Layout isDarkMode={isDarkMode}>
            <div className={`min-h-screen py-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
                <div className="container mx-auto px-4 sm:px-6">
                    <h1 className={`text-2xl sm:text-3xl font-bold mb-6 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        {isOwnProfile ? "My Profile" : `${currentUser?.firstName} ${currentUser?.lastName}'s Profile`}
                    </h1>

                    <ProfileInfo
                        user={currentUser}
                        isDarkMode={isDarkMode}
                        isUpdating={isUpdatingProfile}
                    />

                    <div className="mt-12 max-w-4xl mx-auto">
                        <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                            {isOwnProfile ? "My Posts" : `${currentUser?.firstName} ${currentUser?.lastName}'s Posts`}
                        </h2>

                        <div className="space-y-6">
                            {postsToDisplay?.length > 0 ? (
                                postsToDisplay.map((post) => (
                                    <Post
                                        key={post._id}
                                        postId={post._id}
                                        user={currentUser}
                                        title={post.title}
                                        content={post.content}
                                        images={processImages(post.images)}
                                        price={post.price}
                                        address={post.address}
                                        elevator={post.elevator}
                                        maximumCapacity={post.maximumCapacity}
                                        avgRate={post.avgRate}
                                        timestamp={post.createdAt}
                                        onDelete={handlePostDeleted}
                                    />
                                ))
                            ) : (
                                <div
                                    className={`text-center p-12 rounded-2xl shadow-md transition-all duration-300 ${
                                        isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-600"
                                    } hover:shadow-lg hover:scale-105`}
                                >
                                  {isOwnProfile ? (<p className="italic text-lg">You currently do not have any posts !</p>) : (<p className="italic text-lg">No posts available for this user</p>) }

                                  <p className="mt-2 text-sm">
                                  It seems a bit empty here :/
                                    </p>
                                    <button
                                        onClick={() => navigate("/")}
                                        className={`mt-6 px-6 py-2 rounded-full text-white transition-colors duration-300 ${
                                            isDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400"
                                        }`}
                                    >
                                        Check Latest Posts
                                    </button>
                                </div>

                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProfilePage

