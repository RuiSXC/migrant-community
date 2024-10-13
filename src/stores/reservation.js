import {collection, addDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuthStore } from '@/stores/auth';

// Firebase Firestore 数据库引用
const db = getFirestore();

// 保存数据到 Firebase Firestore
const postBooking = async (form) => {
    const user = useAuthStore().user;
    const docRef = await addDoc(collection(db, "bookings"), {
        userId: user.email,
        name: form.name,
        time: form.time,
        email: form.email,
        guests: form.guests,
        phone: form.phone,
        notes: form.notes || '',
    });
}


// 调用 Firebase Functions 发送确认邮件
const sendBookingEmail = async (form) => {
    const functions = getFunctions();
    const sendEmail = httpsCallable(functions, 'sendBookingConfirmation');
    await sendEmail({
        email: form.email,
        name: form.name,
        bookingDetails: form,
    });
}

export {
    postBooking,
    sendBookingEmail
}

