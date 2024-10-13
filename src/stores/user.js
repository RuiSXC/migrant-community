import { collection, getFirestore, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore"; 

const db = getFirestore();

const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, 'users'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const saveUser = async (user) => {
    if (user.id) {
        const userDoc = doc(db, 'users', user.id);
        await updateDoc(userDoc, user);
    } else {
        addDoc(collection(db, 'users'), user);
    }
}

const deleteUser = async (id) => {
    console.log(id)
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
};

export {fetchUsers, saveUser, deleteUser}
