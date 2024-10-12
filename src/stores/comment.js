import {collection, addDoc, getDocs, getFirestore } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

const db = getFirestore();

const fetchComments = async (placeId) => {
    const querySnapshot = await getDocs(collection(db, 'comments'));
    const comments = querySnapshot.docs
        .filter(doc => doc.data().placeId === placeId)
        .map(doc => ({ id: doc.id, ...doc.data() }));
    return comments;
};

/** 
 * Submit a new comment. 
 * @param placeId: number
 * @param rating: number
 * @param content: string
 */
const postComment = async (placeId, rating, comment) => {
    if (!placeId || !rating || !comment) {
        throw new Error("Please provide a rating and a comment.");
    }

    const user = useAuthStore().user;
    await addDoc(collection(db, 'comments'), {
        placeId: placeId,
        userId: user.email, // Example user ID, replace with actual user ID
        rating: Number(rating),
        content: comment,
        createdAt: new Date()
    })
};

export {
    fetchComments,
    postComment
};