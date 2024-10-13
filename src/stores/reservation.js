import { collection, addDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

// Firebase Firestore 数据库引用
const db = getFirestore();

// 保存数据到 Firebase Firestore
const postBooking = async (form) => {
    const user = useAuthStore().user;
    console.log(user.email);
    const docRef = await addDoc(collection(db, "bookings"), {
        userId: user.email,
        name: form.name,
        time: form.time,
        email: form.email,
        guests: form.guests,
        phone: form.phone,
        notes: form.notes || '',
        createdAt: Timestamp.now()
    });
}

const fetchBookings = async () => {
    const snapshot = await db.collection('bookings').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deleteBooking = async (id) => {
    await db.collection('bookings').doc(id).delete();
};

const saveBooking = async (booking) => {
    if (booking.id) {
        await db.collection('bookings').doc(booking.id).update(booking);
    } else {
        await db.collection('bookings').add(booking);
    }
};

export { postBooking, fetchBookings, deleteBooking, saveBooking };

