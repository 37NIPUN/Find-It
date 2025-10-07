import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { auth } from '../firebase';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import { updatePostInFirestore } from '../services/firestoreService';
import useModalStore from '../store';

const EditPostModal = ({ isOpen, onClose, post }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const refreshPosts = useModalStore(state => state.refreshPosts);

    // Pre-populate form with existing post data
    useEffect(() => {
        if (post && isOpen) {
            setTitle(post.title || '');
            setDescription(post.description || '');
            setContact(post.contact || '');
            setImage(null); // Reset image selection
            setError('');
        }
    }, [post, isOpen]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage({
                file: e.target.files[0],
                previewUrl: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleUpdate = async () => {
        if (!title.trim() || !description.trim()) {
            setError('Please provide both title and description.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let imageUrl = post.imageUrl; // Keep existing image by default

            // Only upload new image if user selected one
            if (image && image.file) {
                console.log('Uploading new image to Cloudinary...');
                imageUrl = await uploadImageToCloudinary(image.file);
                console.log('New image uploaded:', imageUrl);
            }

            // Create updated post data
            const updatedData = {
                title: title.trim(),
                description: description.trim(),
                contact: contact.trim() || auth.currentUser.email,
                imageUrl: imageUrl,
            };

            console.log('Updating post in Firestore...');
            await updatePostInFirestore(post.id, updatedData);
            console.log('Post updated successfully');

            // Refresh posts list
            if (refreshPosts) {
                refreshPosts();
            }

            // Reset and close modal
            setImage(null);
            setTitle('');
            setDescription('');
            setContact('');
            onClose();
        } catch (err) {
            console.error('Error updating post:', err);
            setError(`Failed to update post: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-2xl max-w-lg w-full mx-4 relative z-10 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Post</h2>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., iPhone 13, Blue Wallet, etc."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                </div>

                {/* Current Image Display */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                    <img
                        src={post?.imageUrl}
                        alt="Current post"
                        className="w-32 h-32 object-cover rounded-md border mb-2"
                    />
                </div>

                {/* New Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Change Image (Optional)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    {/* New Image Preview */}
                    {image && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1">New Image Preview:</p>
                            <img
                                src={image.previewUrl}
                                alt="New preview"
                                className="w-32 h-32 object-cover rounded-md border"
                            />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Update the description..."
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={loading}
                    />
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Info (Optional)
                    </label>
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Phone number or additional contact info"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Leave blank to use your email: {auth.currentUser?.email}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Post'}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default EditPostModal;
