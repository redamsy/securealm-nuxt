<script setup lang="ts">
    import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
    import { useAuthStore } from '~/stores/useAuth'; // import the auth store we just created
import { ICHECK_STATUS } from '~/types/auth';

    const router = useRouter();
    const { loginUser } = useAuthStore(); // use authenticateUser action from  auth store

    // make isAuthenticated state reactive with storeToRefs
    // https://dev.to/rafaelmagalhaes/authentication-in-nuxt-3-375o
    const { checkStatus, errors } = storeToRefs(useAuthStore());

    console.log("login.vue: errors", errors.value)
    console.log("login.vue: checkStatus", checkStatus.value)

    const user = ref({
        email: 'red@gmail.com', 
        password: 'password',
    });
    const loading = ref(false);

    definePageMeta({
        middleware: ['guest'],
        layout: false,
    });
    useHead({
        title: 'securealm | Login',
    });

    async function loginHandler() {
        loading.value = true;
        await loginUser(user.value);
        loading.value = false;
        console.log("register.vue: checkStatus", checkStatus.value)
        if (checkStatus.value === ICHECK_STATUS.VALID) {
            router.push('/profile');
        }
    }
</script>

<template>
    <section class="flex flex-col items-center justify-center h-96 gap-4">
        <form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Login to your account</h1>

            <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                <p v-for="(error, index) in errors" :key="index">
                    {{ error.field }}:
                    <span v-if="error.fieldErrors">
                        <span v-for="(fieldError, index) in error.fieldErrors" :key="index">{{ fieldError }}</span>
                    </span>
                </p>
            </div>

            <input v-model="user.email" type="email" placeholder="Type your email" required />
            <input v-model="user.password" type="password" placeholder="Type your password" required />
            <div class="flex justify-between gap-4">
                <NuxtLink class="text-indigo-600" to="/register">Don't have an account? Register now</NuxtLink>
                <button
                    :disabled="loading"
                    type="submit"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Login
                </button>
            </div>
        </form>
    </section>
</template>