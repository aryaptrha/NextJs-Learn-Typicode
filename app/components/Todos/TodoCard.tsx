"use client";

import React from "react";
import { motion } from "framer-motion";
import ActionButton from "../Posts/ViewUserButton";
import Link from "next/link";

interface TodoCardProps {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

const TodoCard: React.FC<TodoCardProps> = ({ id, userId, title, completed }) => {
  return (
    <motion.div
      className={`bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 ${
        completed ? "border-green-500" : "border-yellow-500"
      }`}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="mr-4">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            completed ? "bg-green-500" : "bg-yellow-500"
          }`}>
            {completed ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className={`text-white font-medium ${completed ? "line-through opacity-70" : ""}`}>
            {title}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">User ID: {userId}</span>
            <span className="text-sm text-gray-400">Todo #{id}</span>
          </div>
        </div>
        <div className="ml-4 flex space-x-2">
          <ActionButton
            text="View User"
            variant="secondary"
            onClick={() => alert(`Viewing user ${userId}`)}
          />
          <ActionButton
            text="Details"
            variant="primary"
            linkHref={`/todos/${id}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TodoCard;