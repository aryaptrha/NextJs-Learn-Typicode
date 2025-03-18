/* eslint-disable no-use-before-define */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TodoData {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

const TodoDetail = () => {
  const params = useParams<{ id: string }>();
  const todoId = params.id;

  const [todo, setTodo] = useState<TodoData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTodos, setUserTodos] = useState<TodoData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch todo
        const todoResponse = await fetch(
          `https://jsonplaceholder.typicode.com/todos/${todoId}`
        );
        const todoData: TodoData = await todoResponse.json();
        setTodo(todoData);

        // Fetch user
        const userResponse = await fetch(
          `https://jsonplaceholder.typicode.com/users/${todoData.userId}`
        );
        const userData: UserData = await userResponse.json();
        setUser(userData);

        // Fetch other todos from same user
        const userTodosResponse = await fetch(
          `https://jsonplaceholder.typicode.com/users/${todoData.userId}/todos`
        );
        const userTodosData: TodoData[] = await userTodosResponse.json();
        setUserTodos(
          userTodosData.filter((t) => t.id !== todoData.id).slice(0, 5)
        ); // Exclude current todo and limit to 5

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (todoId) {
      fetchData();
    }
  }, [todoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 md:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 md:p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-4">Todo not found</h2>
        <Link href="/todos" passHref>
          <motion.button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Todos
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 md:p-8">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link href="/todos" passHref>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Todos
          </motion.button>
        </Link>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status indicator */}
          <div
            className={`absolute right-0 top-0 w-20 h-20 ${
              todo.completed ? "bg-green-500" : "bg-yellow-500"
            }`}
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          ></div>

          <div className="flex items-center mb-6">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                todo.completed ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {todo.completed ? (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              )}
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-semibold rounded-full mb-2">
                Todo #{todo.id}
              </span>
              <h1 className="text-2xl font-bold text-white">{todo.title}</h1>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Status</h2>
            <div className="flex items-center p-4 bg-gray-700 rounded-lg">
              <div
                className={`w-3 h-3 rounded-full ${
                  todo.completed ? "bg-green-500" : "bg-yellow-500"
                } mr-3`}
              ></div>
              <span className="text-white">
                {todo.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* User information */}
        {user && (
          <motion.div
            className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Assigned to
            </h2>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {user.name}
                  </h3>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{user.phone}</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm">Website</p>
                  <p className="text-white">{user.website}</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm">Company</p>
                  <p className="text-white">{user.company.name}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other todos from the same user */}
        {userTodos.length > 0 && (
          <motion.div
            className="bg-gray-800 rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Other todos from this user
            </h2>
            <div className="space-y-3">
              {userTodos.map((otherTodo) => (
                <Link href={`/todos/${otherTodo.id}`} key={otherTodo.id}>
                  <motion.div
                    className={`p-4 rounded-lg border-l-4 ${
                      otherTodo.completed
                        ? "border-green-500 bg-gray-700/50"
                        : "border-yellow-500 bg-gray-700/50"
                    } hover:bg-gray-700 transition-colors cursor-pointer`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          otherTodo.completed ? "bg-green-500" : "bg-yellow-500"
                        } mr-3`}
                      ></div>
                      <h3
                        className={`text-white ${
                          otherTodo.completed ? "line-through opacity-70" : ""
                        }`}
                      >
                        {otherTodo.title}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link href={`/users/${todo.userId}`} passHref>
                <motion.button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Todos From This User
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TodoDetail;
