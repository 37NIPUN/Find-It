import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { auth } from '../firebase';
import { deletePostFromFirestore } from '../services/firestoreService';
import DeleteConfirmModal from './DeleteConfirmModal';
import ReadMoreModal from './ReadMoreModal';
import EditPostModal from './EditPostModal';
import useModalStore from '../store';

const PostCard = ({ post }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReadMoreModal, setShowReadMoreModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const refreshPosts = useModalStore(state => state.refreshPosts);

    const cardColor = post.type === 'lost' ? 'border-red-500' : 'border-green-500';
    const tagColor = post.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

    // Format the date
    const timeAgo = formatDistanceToNow(post.createdAt?.toDate() || new Date(), { addSuffix: true });

    // Check if current user owns this post
    const isOwner = auth.currentUser?.uid === post.creatorUid;

    // Check if description is long (more than 100 characters)
    const isLongDescription = post.description && post.description.length > 100;
    const truncatedDescription = isLongDescription
        ? post.description.substring(0, 100) + '...'
        : post.description;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePostFromFirestore(post.id, auth.currentUser.uid);
            if (refreshPosts) {
                refreshPosts(); // Refresh the posts list
            }
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className={`border-2 ${cardColor} rounded-lg p-4 shadow-lg bg-white relative`}>
                {/* Owner Action Buttons - Edit and Delete */}
                {isOwner && (
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                        {/* Edit Button */}
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                            title="Edit Post"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                            title="Delete Post"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                )}

                {/* Image */}
                <div className="mb-4">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setShowReadMoreModal(true)}
                    />
                </div>

                {/* Type Tag and Date */}
                <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tagColor}`}>
                        {post.type.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{timeAgo}</span>
                        {post.updatedAt && (
                            <span className="text-blue-500" title="This post has been edited">
                                • Edited
                            </span>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 truncate">{post.title}</h3>

                {/* Description */}
                <div className="text-gray-700 text-sm mb-3">
                    <p className="leading-relaxed">{truncatedDescription}</p>
                    {isLongDescription && (
                        <button
                            onClick={() => setShowReadMoreModal(true)}
                            className="text-blue-500 hover:text-blue-700 font-medium mt-1 inline-block"
                        >
                            Read More
                        </button>
                    )}
                </div>

                {/* Contact Info */}
                <div className="text-xs text-gray-600 border-t pt-2 mt-2 pb-12">
                    <p><strong>Posted by:</strong> {post.creatorName}</p>
                    <p><strong>Contact:</strong> {post.contact}</p>
                </div>
            </div>

            {/* Edit Post Modal */}
            <EditPostModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                post={post}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                postTitle={post.title}
            />

            {/* Read More Modal */}
            <ReadMoreModal
                isOpen={showReadMoreModal}
                onClose={() => setShowReadMoreModal(false)}
                post={post}
            />
        </>
    );
};

export default PostCard;
