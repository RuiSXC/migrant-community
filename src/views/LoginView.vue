<template>
    <section class="bg-ligh py-3 py-md-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                    <div class="card border border-light-subtle rounded-3 shadow-sm">
                        <div class="card-body p-3 p-md-4 p-xl-5">
                            <!-- todo: logo
                            <div class="text-center mb-3">
                                <a href="#!">
                                    <img src="#" alt="BootstrapBrain Logo" width="175" height="57">
                                </a>
                            </div> -->
                            <h2 class="fs-6 fw-normal text-center text-secondary mb-4">Login to your account</h2>
                            <form @submit.prevent="login">
                                <div class="row gy-2 overflow-hidden">
                                    <div class="col-12">
                                        <div class="form-floating mb-3">
                                            <input type="email" v-model="email" class="form-control" name="email"
                                                id="email" placeholder="name@example.com" required>
                                            <label for="email" class="form-label">Email</label>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-floating mb-3">
                                            <input type="password" v-model="password" class="form-control"
                                                name="password" id="password" value="" placeholder="Password" required>
                                            <label for="password" class="form-label">Password</label>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="d-grid my-3">
                                            <button class="btn btn-primary btn-lg" type="submit">Log in</button>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <p class="m-0 text-secondary text-center">
                                            Don't have an account?
                                            <RouterLink :to="{ name: 'register' }"
                                                class="link-primary text-decoration-none">Sign up</RouterLink>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                <div v-if="errorMessage" class="alert alert-danger mt-3">
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </section>
</template>


<script setup>
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebaseConfig"
import { validateEmail, validatePassword } from "@/utils/validation"

const router = useRouter()
const email = ref("")
const password = ref("")
const errorMessage = ref("")

watch([email, password], () => errorMessage.value = "")

const login = () => {
    errorMessage.value = ""

    errorMessage.value = validateEmail(email.value)
    if (errorMessage.value) return
    errorMessage.value = validatePassword(password.value)
    if (errorMessage.value) return

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async ({ user }) => {
            // 从 Firestore 获取用户的角色
            const db = getFirestore()
            const docRef = doc(db, "users", user.uid)
            const userDoc = await getDoc(docRef)
            if (!userDoc.exists()) {
                throw new Error("Error: Cannot get user data. Please try again or contact the administrator.")
            }
            const userData = userDoc.data()
            localStorage.setItem('user', JSON.stringify(userData))
            router.push("/")
        }).catch(error => errorMessage.value = error.message)
}
</script>