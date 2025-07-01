import { useState, useCallback } from "react";
import {
  Calendar,
  Edit,
  Trash2,
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";

const BlogCard = ({ blog, onView, onEdit, onDelete, canEdit, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  }, []);

  const getReadTime = useCallback((content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }, []);

  const gradients = [
    "from-pink-400 to-purple-600",
    "from-blue-400 to-cyan-600",
    "from-green-400 to-blue-600",
    "from-purple-400 to-pink-600",
    "from-yellow-400 to-orange-600",
    "from-indigo-400 to-purple-600",
  ];

  const cardGradient = gradients[index % gradients.length];

  return (
    <article
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`}
      ></div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

      <div className="relative p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${cardGradient} text-white shadow-lg`}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </span>
            <span className="text-xs text-gray-500 flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3 mr-1" />
              {getReadTime(blog.content)}
            </span>
          </div>
          {isHovered && (
            <div className="animate-pulse">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 leading-tight">
          {blog.title}
        </h3>

        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-base">
          {blog.content.substring(0, 150)}...
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 bg-gradient-to-r ${cardGradient} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white`}
            >
              {blog.authorName?.charAt(0) || "A"}
            </div>
            <div>
              <span className="font-semibold text-gray-800 text-sm">
                {blog.authorName || "Anonymous"}
              </span>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(blog.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 hover:text-red-500 transition-all duration-300 hover:scale-110 ${
                isLiked ? "text-red-500" : ""
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-current" : ""
                } transition-all duration-300`}
              />
              <span className="font-medium">{isLiked ? 1 : 0}</span>
            </button>
            <span className="flex items-center space-x-1 text-gray-400">
              <MessageCircle className="w-5 h-5" />
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {canEdit && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(blog.id)}
                  className="p-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(blog.id)}
                  className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={() => onView(blog.id)}
              className={`flex items-center space-x-2 bg-gradient-to-r ${cardGradient} text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm`}
            >
              <span>Read</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
