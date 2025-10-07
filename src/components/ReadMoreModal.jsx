import React from 'react';
import ReactDOM from 'react-dom';

const ReadMoreModal = ({ isOpen, onClose, post }) => {
    if (!isOpen) return null;

    const cardColor = post?.type === 'lost' ? 'border-red-500' : 'border-green-500';
    const tagColor = post?.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 relative z-10 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Post Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Type Tag */}
                    <div className="mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tagColor}`}>
                            {post?.type?.toUpperCase()}
                        </span>
                    </div>

                    {/* Image */}
                    {post?.imageUrl && (
                        <div className="mb-6">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full max-h-96 object-cover rounded-lg border"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">{post?.title}</h3>

                    {/* Full Description */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {post?.description}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t pt-4 text-sm text-gray-600">
                        <p><strong>Posted by:</strong> {post?.creatorName}</p>
                        <p><strong>Contact:</strong> {post?.contact}</p>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default ReadMoreModal;
