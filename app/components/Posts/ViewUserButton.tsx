"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
  linkHref?: string;
  variant?: 'primary' | 'secondary';
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  text, 
  onClick, 
  linkHref,
  variant = 'primary'
}) => {
  const buttonColors = {
    primary: {
      bg: 'bg-purple-600',
      hoverBg: '#7c3aed', // bg-purple-700
    },
    secondary: {
      bg: 'bg-blue-600',
      hoverBg: '#2563eb', // bg-blue-700
    }
  };

  const colors = buttonColors[variant];
  
  const ButtonContent = () => (
    <motion.button
      onClick={onClick}
      className={`mt-4 px-4 py-2 ${colors.bg} text-white rounded-lg font-medium`}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: colors.hoverBg
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.button>
  );

  if (linkHref) {
    return (
      <Link href={linkHref} passHref>
        <ButtonContent />
      </Link>
    );
  }

  return <ButtonContent />;
};

export default ActionButton;