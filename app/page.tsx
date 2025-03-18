"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center mb-12"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <h1 className="text-5xl font-bold text-white mb-4">Welcome to Next.js Demo</h1>
        <p className="text-xl text-purple-200 max-w-2xl mx-auto">
          A simple demonstration of Next.js with animated UI components and card design.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <NavCard 
          href="/posts"
          title="Posts"
          description="Browse our collection of posts fetched from an API with beautiful animations."
          icon="/file.svg"
          bgColor="from-purple-600 to-indigo-700"
        />
        
        <NavCard 
          href="/albums"
          title="Albums"
          description="View our albums section with elegantly designed UI components."
          icon="/window.svg" 
          bgColor="from-pink-500 to-rose-600"
        />

        <NavCard 
          href="/todos"
          title="Todos"
          description="Manage your tasks with an interactive todo manager with filtering capabilities."
          icon="/globe.svg" 
          bgColor="from-blue-600 to-sky-600"
        />
      </motion.div>
    </motion.div>
  );
}

interface NavCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
}

const NavCard: React.FC<NavCardProps> = ({ href, title, description, icon, bgColor }) => {
  return (
    <Link href={href} passHref>
      <motion.div
        className={`bg-gradient-to-r ${bgColor} rounded-xl p-6 shadow-lg cursor-pointer h-full flex flex-col`}
        whileHover={{ 
          scale: 1.03,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-white/20 p-3 rounded-lg mr-4">
            <Image src={icon} alt={title} width={24} height={24} className="invert" />
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-white/80 mb-4">{description}</p>
        <div className="mt-auto flex items-center">
          <span className="text-white font-medium">Explore</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-2 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </motion.div>
    </Link>
  );
};