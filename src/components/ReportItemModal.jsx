import React, { useState } from 'react';
import { auth } from '../firebase';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import { addPostToFirestore, updateUserItemCount } from '../services/firestoreService';
import useModalStore from '../store';

const ReportItemModal = ({ isOpen, onClose, reportType }) => {
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [contact, setContact] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get refresh function from store
    const refreshPosts = useModalStore((state) => state.refreshPosts);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage({
                file: e.target.files[0],
                previewUrl: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handlePost = async () => {
        if (!image || !description.trim() || !title.trim()) {
            setError('Please provide title, image, and description.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Starting upload...');
            console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
            console.log('Upload Preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            // 1. Upload image to Cloudinary
            console.log('Uploading to Cloudinary...');
            const imageUrl = await uploadImageToCloudinary(image.file);
            console.log('Cloudinary URL:', imageUrl);

            // 2. Create post data
            const postData = {
                type: reportType,
                title: title.trim(),
                description: description.trim(),
                contact: contact.trim() || auth.currentUser.email,
                imageUrl: imageUrl,
                creatorUid: auth.currentUser.uid,
                creatorName: auth.currentUser.displayName || auth.currentUser.email,
                creatorEmail: auth.currentUser.email,
            };

            console.log('Post data:', postData);

            // 3. Add post to Firestore
            console.log('Adding to Firestore...');
            await addPostToFirestore(postData);
            console.log('Added to Firestore successfully');

            // 4. Update user's item count
            await updateUserItemCount(auth.currentUser.uid, reportType);
            console.log('Updated user count');

            // 5. Trigger refresh of posts
            if (refreshPosts) {
                refreshPosts();
            }

            // 6. Reset and close modal
            setImage(null);
            setDescription('');
            setTitle('');
            setContact('');
            onClose();
        } catch (err) {
            console.error('Detailed error:', err);
            setError(`Failed to create post: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-2xl max-w-lg w-full mx-4 relative z-10">
                <h2 className="text-xl font-bold mb-4">
                    Report {reportType === 'lost' ? 'Lost' : 'Found'} Item
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., iPhone 13, Blue Wallet, etc."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image *
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    {image && (
                        <div className="mt-2">
                            <img
                                src={image.previewUrl}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-md border"
                            />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={`Describe the item, where you ${reportType} it, and how to contact you...`}
                        rows={4}
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
                        onClick={handlePost}
                        className={`px-4 py-2 text-white rounded-md transition ${reportType === 'lost'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Creating Post...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportItemModal;
