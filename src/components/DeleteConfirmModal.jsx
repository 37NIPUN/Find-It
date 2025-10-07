import React from 'react';
import ReactDOM from 'react-dom';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, postTitle }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-2xl max-w-md w-full mx-4 relative z-10">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>

                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete the post "{postTitle}"? This action cannot be undone.
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default DeleteConfirmModal;
