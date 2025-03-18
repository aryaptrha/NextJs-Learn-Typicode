"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const base_url = "https://jsonplaceholder.typicode.com/albums";
const photos_url = "https://jsonplaceholder.typicode.com/photos?albumId=";

interface AlbumData {
  userId: number;
  id: number;
  title: string;
}

interface PhotoData {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const Albums = () => {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(base_url);
        const data: AlbumData[] = await response.json();
        setAlbums(data.slice(0, 10)); // Limit to 10 albums for better UX
        setLoading(false);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const fetchPhotos = async (albumId: number) => {
    setPhotoLoading(true);
    setSelectedAlbum(albumId);
    
    try {
      const response = await fetch(`${photos_url}${albumId}`);
      const data: PhotoData[] = await response.json();
      setPhotos(data.slice(0, 12)); // Limit to 12 photos for better UX
      setPhotoLoading(false);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setPhotoLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-pink-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Albums</h1>
        <div className="h-1 w-24 bg-pink-500 mx-auto rounded-full"></div>
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full lg:w-1/3"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Select an Album</h2>
            {albums.map((album) => (
              <motion.div
                key={album.id}
                variants={item}
                className={`mb-3 p-4 rounded-lg cursor-pointer transition-all ${
                  selectedAlbum === album.id 
                    ? "bg-pink-600 shadow-lg" 
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => fetchPhotos(album.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-lg font-medium text-white capitalize">{album.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-pink-200">Album #{album.id}</span>
                  <span className="text-sm text-pink-200">User #{album.userId}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="w-full lg:w-2/3">
            {selectedAlbum ? (
              <>
                <motion.h2 
                  className="text-2xl font-semibold text-white mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Photos from Album #{selectedAlbum}
                </motion.h2>
                
                {photoLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                  </div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {photos.map((photo) => (
                      <motion.div
                        key={photo.id}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                        variants={item}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                        }}
                      >
                        <div className="relative h-40 w-full bg-gray-700">
                          <Image 
                            src={photo.thumbnailUrl} 
                            alt={photo.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm text-white line-clamp-2">{photo.title}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div 
                className="h-64 flex items-center justify-center bg-gray-800/50 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-lg text-white/70">Select an album to view photos</p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Albums;