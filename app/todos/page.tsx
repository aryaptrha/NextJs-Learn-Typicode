"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ActionButton from "../components/Posts/ViewUserButton";
import TodoCard from "../components/Todos/TodoCard";

const base_url = "https://jsonplaceholder.typicode.com/todos";

interface TodoData {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const Todos = () => {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage] = useState(10);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(base_url);
        const data: TodoData[] = await response.json();
        setTodos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Filter todos based on status
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  // Get current todos
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const FilterButton = ({ value, label }: { value: "all" | "completed" | "pending", label: string }) => (
    <motion.button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filter === value 
          ? "bg-blue-600 text-white" 
          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
      }`}
      onClick={() => {
        setFilter(value);
        setCurrentPage(1); // Reset to first page when changing filter
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Todos</h1>
        <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
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

      {/* Filter buttons */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FilterButton value="all" label="All" />
        <FilterButton value="completed" label="Completed" />
        <FilterButton value="pending" label="Pending" />
        
        <motion.div className="ml-auto text-white flex items-center">
          {filter !== "all" && (
            <span className="mr-2">
              Showing {filter === "completed" ? "completed" : "pending"} todos:
              <span className="ml-2 px-2 py-1 bg-blue-600 rounded-lg text-sm font-medium">
                {filteredTodos.length}
              </span>
            </span>
          )}
        </motion.div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {currentTodos.length > 0 ? (
              currentTodos.map((todo) => (
                <motion.div key={todo.id} variants={item}>
                  <TodoCard
                    id={todo.id}
                    userId={todo.userId}
                    title={todo.title}
                    completed={todo.completed}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="bg-gray-800 rounded-lg p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-white text-lg">No todos found matching your filter.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setFilter("all")}
                >
                  Show All Todos
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Pagination */}
          {currentTodos.length > 0 && (
            <motion.div 
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="inline-flex items-center bg-gray-800 rounded-lg overflow-hidden">
                <motion.button 
                  className={`px-4 py-2 text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  whileHover={currentPage !== 1 ? { backgroundColor: "#2563eb" } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  Prev
                </motion.button>
                
                {pageNumbers.map(number => (
                  <motion.button
                    key={number}
                    className={`px-4 py-2 text-white ${currentPage === number ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    onClick={() => setCurrentPage(number)}
                    whileHover={currentPage !== number ? { backgroundColor: "#4B5563" } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    {number}
                  </motion.button>
                ))}
                
                <motion.button 
                  className={`px-4 py-2 text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  whileHover={currentPage !== totalPages ? { backgroundColor: "#2563eb" } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {currentTodos.length > 0 && (
            <motion.div 
              className="text-center mt-4 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Page {currentPage} of {totalPages}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Todos;