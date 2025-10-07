import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';


// A simple user icon
const UserIcon = () => (
    <svg
        className="w-24 h-24 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
        ></path>
    </svg>
);


const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    // Add state for counts
    const [lostCount, setLostCount] = useState(0);
    const [foundCount, setFoundCount] = useState(0);

    // --- THIS IS THE UPDATED PART ---
    useEffect(() => {
        const fetchUserProfile = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUserProfile(userData);
                    // Set counts directly from the user document fields
                    setLostCount(userData.lostItemCount || 0);
                    setFoundCount(userData.foundItemCount || 0);
                } else {
                    console.log("No such user document!");
                }
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, []); // This effect runs once when the component mounts

    if (loading) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    if (!userProfile) {
        return <div className="p-8 text-center">Could not load profile.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col items-center">
                    <UserIcon />
                    <h1 className="text-3xl font-bold mt-4">{userProfile.name}</h1>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <p className="text-gray-500 mt-1">Student ID: {userProfile.studentId}</p>
                </div>

                {/* Report Counts Section */}
                <div className="mt-6 flex justify-around text-center border-t border-b py-4">
                    <div>
                        <p className="text-2xl font-bold text-red-500">{lostCount}</p>
                        <p className="text-sm text-gray-500">Items Lost</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-500">{foundCount}</p>
                        <p className="text-sm text-gray-500">Items Found</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
                    <div className="space-y-3">
                        <p><strong>Full Name:</strong> {userProfile.name}</p>
                        <p><strong>Email Address:</strong> {userProfile.email}</p>
                        <p><strong>Student ID:</strong> {userProfile.studentId}</p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
