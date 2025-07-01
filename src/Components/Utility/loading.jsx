// Loading Component
const Loading = () => (
  <div className="flex flex-col justify-center items-center py-20 min-h-[400px]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse"></div>
    </div>
    <div className="mt-6 flex items-center space-x-1">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
    <p className="mt-4 text-gray-600 font-medium">Loading amazing content...</p>
  </div>
);

export default Loading;
