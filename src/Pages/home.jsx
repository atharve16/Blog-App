import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import { useBlog } from "../context/blogContext";
import BlogCard from "./blogCard";
import Pagination from "../Components/Pagnation/pagination";
import Loading from "../Components/Utility/loading";
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  BookOpen,
  Plus,
  Sparkles,
} from "lucide-react";

const Home = ({ setCurrentPage, setBlogId }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogPage, setBlogPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [authorEmails, setAuthorEmails] = useState({});

  const { user } = useAuth();
  const { api } = useBlog();

  useEffect(() => {
    loadBlogs(blogPage);
  }, [blogPage]);

  const loadBlogs = async (page) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.getBlogs(page, 12);
      const blogsData = response.blogs;
      const emailsMap = {};

      await Promise.all(
        blogsData.map(async (blog) => {
          if (!emailsMap[blog.authorId]) {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/user/${blog.authorId}`
              );
              const data = await res.json();
              emailsMap[blog.authorId] = data.email;
            } catch (err) {
              console.error("Error fetching author email for blog:", blog.id);
            }
          }
        })
      );

      setAuthorEmails(emailsMap);
      setBlogs(blogsData);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading blogs:", error);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [blogs, searchTerm]);

  const handleView = useCallback(
    (id) => {
      setBlogId(id);
      setCurrentPage("detail");
    },
    [setBlogId, setCurrentPage]
  );

  const handleEdit = useCallback(
    (id) => {
      setBlogId(id);
      setCurrentPage("edit");
    },
    [setBlogId, setCurrentPage]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this blog?")) {
        try {
          await api.deleteBlog(id);
          await loadBlogs(blogPage);
        } catch (error) {
          console.error("Error deleting blog:", error);
          alert("Failed to delete blog. Please try again.");
        }
      }
    },
    [blogPage]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="space-y-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-2 border border-white/30">
                <span className="text-white/90 font-medium flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Welcome to the future of blogging
                </span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
              <span className="block">Discover</span>
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Amazing
              </span>
              <span className="block">Stories</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
              Join our vibrant community of storytellers, thought leaders, and
              innovators. Share your ideas and discover perspectives that will
              inspire and transform your thinking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 mt-12">
              <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <Users className="w-6 h-6 text-blue-200" />
                <span className="font-semibold">10K+ Writers</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <BookOpen className="w-6 h-6 text-purple-200" />
                <span className="font-semibold">{blogs.length}+ Articles</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <TrendingUp className="w-6 h-6 text-pink-200" />
                <span className="font-semibold">Growing Daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-16 border border-white/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-6">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for amazing articles, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg bg-white/60 backdrop-blur-sm"
              />
            </div>

            {user && (
              <button
                onClick={() => setCurrentPage("create")}
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Story</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-2xl border border-red-300 shadow mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredBlogs.map((blog, index) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={user && authorEmails[blog.authorId] === user.email}
              index={index}
            />
          ))}
        </div>

        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No stories found
            </h3>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or explore our trending topics
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <button
                  key={page}
                  onClick={() => setBlogPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    page === blogPage
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
