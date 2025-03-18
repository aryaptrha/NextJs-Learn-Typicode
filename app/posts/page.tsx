"use client";

import { useEffect, useState } from "react";
import CardList from "../components/Posts/CardList";
import ActionButton from "../components/Posts/ViewUserButton";
import { motion } from "framer-motion";
import Link from "next/link";

const base_url = "https://jsonplaceholder.typicode.com/posts";

interface PostData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(base_url);
        const data: PostData[] = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Posts</h1>
        <div className="h-1 w-24 bg-purple-500 mx-auto rounded-full"></div>
      </motion.div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link href="/" passHref>
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
            Back to Home
          </motion.button>
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentPosts.map((post) => (
              <motion.div key={post.id}>
                <CardList>
                  <span className="inline-block px-2 py-1 bg-purple-600 text-xs font-semibold rounded-full mb-2">
                    Post #{post.id}
                  </span>
                  <h2 className="text-xl font-semibold capitalize mb-3">{post.title}</h2>
                  <p className="text-gray-300 mb-4">{post.body.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-400">User ID: {post.userId}</span>
                    <div className="flex space-x-2">
                      <ActionButton 
                        text="View User" 
                        onClick={() => alert(`Viewing User ${post.userId}`)}
                        variant="secondary"
                      />
                      <ActionButton 
                        text="Read Post" 
                        linkHref={`/posts/${post.id}`}
                        variant="primary"
                      />
                    </div>
                  </div>
                </CardList>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-gray-800 rounded-lg overflow-hidden">
              <motion.button 
                className={`px-4 py-2 text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'}`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                whileHover={currentPage !== 1 ? { backgroundColor: "#9333ea" } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
              >
                Prev
              </motion.button>
              
              {pageNumbers.map(number => (
                <motion.button
                  key={number}
                  className={`px-4 py-2 text-white ${currentPage === number ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                  onClick={() => setCurrentPage(number)}
                  whileHover={currentPage !== number ? { backgroundColor: "#4B5563" } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  {number}
                </motion.button>
              ))}
              
              <motion.button 
                className={`px-4 py-2 text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'}`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                whileHover={currentPage !== totalPages ? { backgroundColor: "#9333ea" } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center mt-4 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Page {currentPage} of {totalPages}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Posts;