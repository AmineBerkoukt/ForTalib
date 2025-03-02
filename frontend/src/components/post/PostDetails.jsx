import { MapPin, DollarSign, Users, ArrowUpDown, Star } from "lucide-react"

const PostDetails = ({ price, address, elevator, maximumCapacity, rating }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <DollarSign className="w-5 h-5 text-green-500" />
        </div>
        <span className="truncate">
          <strong>Price:</strong> {price} DH
        </span>
      </div>

      <div className="flex items-center space-x-2 group relative">
        <div className="flex-shrink-0">
          <MapPin className="w-5 h-5 text-blue-500" />
        </div>
        <span className="truncate" title={address}>
          <strong>Address:</strong> {address}
        </span>
        {/* Tooltip for full address on hover */}
        <div className="absolute left-0 -top-10 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs whitespace-normal break-words">
          {address}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <ArrowUpDown className="w-5 h-5 text-gray-600" />
        </div>
        <span className="truncate">
          <strong>Elevator:</strong> {elevator ? "Yes" : "No"}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <Users className="w-5 h-5 text-purple-500" />
        </div>
        <span className="truncate">
          <strong>Max Capacity:</strong> {maximumCapacity} people
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        <span className="truncate">
          <strong>Rating:</strong> {rating.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

export default PostDetails

