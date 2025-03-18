"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PostData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const PostDetail = () => {
  const params = useParams();
  const postId = params.id;
  
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch post
        const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        const postData = await postResponse.json();
        setPost(postData);
        
        // Fetch comments
        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
        
        // Fetch user
        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`);
        const userData = await userResponse.json();
        setUser(userData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-4 md:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-4 md:p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-4">Post not found</h2>
        <Link href="/posts" passHref>
          <motion.button
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Posts
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-4 md:p-8">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link href="/posts" passHref>
          <motion.button
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Posts
          </motion.button>
        </Link>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 bg-purple-600 text-xs font-semibold rounded-full mb-4">
            Post #{post.id}
          </span>
          <h1 className="text-3xl font-bold text-white mb-4 capitalize">{post.title}</h1>
          
          {user && (
            <div className="flex items-center mb-6">
              <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
                {user.name.charAt(0)}
              </div>
              <div className="ml-4">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          )}
          
          <p className="text-gray-300 text-lg leading-relaxed mb-8">{post.body}</p>
          
          {user && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white font-medium mb-2">Author Info</h3>
              <p className="text-gray-300"><span className="text-gray-400">Company:</span> {user.company?.name}</p>
              <p className="text-gray-300"><span className="text-gray-400">Website:</span> {user.website}</p>
              <p className="text-gray-300"><span className="text-gray-400">Location:</span> {user.address?.city}</p>
            </div>
          )}
        </motion.div>
        
        {/* Comments section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Comments ({comments.length})</h2>
          
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className="bg-gray-800 rounded-lg p-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
            >
              <div className="flex items-start mb-2">
                <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  {comment.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">{comment.name}</h3>
                  <p className="text-gray-400 text-sm">{comment.email}</p>
                </div>
              </div>
              <p className="text-gray-300">{comment.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PostDetail;