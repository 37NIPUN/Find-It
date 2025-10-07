import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  increment,
  deleteDoc, // Added this import
} from "firebase/firestore";

// Add a new post to Firestore
export const addPostToFirestore = async (postData) => {
  try {
    const postsCollection = collection(db, "posts");
    const docRef = await addDoc(postsCollection, {
      ...postData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

// Get all posts from Firestore
export const getAllPosts = async () => {
  try {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

// Update user's item count
export const updateUserItemCount = async (userId, type) => {
  try {
    const userRef = doc(db, "users", userId);
    const fieldToUpdate = type === "lost" ? "lostItemCount" : "foundItemCount";

    await updateDoc(userRef, {
      [fieldToUpdate]: increment(1),
    });
  } catch (error) {
    console.error("Error updating user count:", error);
    throw error;
  }
};

// Delete a post from Firestore
export const deletePostFromFirestore = async (postId, userId) => {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Update an existing post in Firestore
export const updatePostInFirestore = async (postId, updatedData) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      ...updatedData,
      updatedAt: new Date(), // Track when post was last edited
    });
    console.log("Post updated successfully");
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
