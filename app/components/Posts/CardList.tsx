"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardListProps {
  children: React.ReactNode;
}

const CardList: React.FC<CardListProps> = ({ children }) => {
  return (
    <motion.div
      className="bg-gray-800 rounded-xl shadow-lg p-6 mb-4 hover:shadow-xl transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="text-white">{children}</div>
    </motion.div>
  );
};

export default CardList;
