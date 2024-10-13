import {collection, addDoc, getDocs, getFirestore, Timestamp } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

const db = getFirestore();

const fetchComments = async (placeId) => {
    const querySnapshot = await getDocs(collection(db, 'comments'));
    const comments = querySnapshot.docs
        .filter(doc => doc.data().placeId === placeId)
        .map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() }));
    return comments;
};

const fetchAllComments = async () => {
    const snapshot = await db.collection('comments').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deleteComment = async (id) => {
    await db.collection('comments').doc(id).delete();
};

const saveComment = async (comment) => {
    if (comment.id) {
        await db.collection('comments').doc(user.id).update(comment);
    } else {
        await db.collection('comments').add(comment);
    }
}

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
        createdAt: Timestamp.now()
    })
};

export {
    fetchComments,
    fetchAllComments,
    deleteComment,
    postComment,
    saveComment,
};