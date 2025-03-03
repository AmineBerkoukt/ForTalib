import { MapPin, DollarSign, Users, ArrowUpDown, Star } from "lucide-react"

const PostDetails = ({ price, address, elevator, maximumCapacity, rating }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span><strong>Price:</strong> {price} DH</span>
            </div>

            <div className="col-span-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span><strong>Address:</strong> {address}</span>
            </div>

            <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-blue-500" />
                <span><strong>Elevator:</strong> {elevator ? "Yes" : "No"}</span>
            </div>

            <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span><strong>Max Capacity:</strong> {maximumCapacity} people</span>
            </div>

            <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span><strong>Rating:</strong> {rating.toFixed(1)}</span>
            </div>
        </div>
    )
}

export default PostDetails