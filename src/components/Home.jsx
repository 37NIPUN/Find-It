import React, { useEffect } from 'react';
import useModalStore from '../store';
import PostCard from './PostCard';

const Home = () => {
  const { posts, loading, fetchPosts } = useModalStore();

  useEffect(() => {
    fetchPosts(); // Fetch posts when component mounts
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Item Feed</h1>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No items reported yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
