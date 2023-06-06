<script setup lang="ts">
    import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
    import { useAuthStore } from '~/stores/useAuth'; // import the auth store we just created
    import { ICHECK_STATUS } from '~/types/auth';

    const router = useRouter();
    const { registerUser } = useAuthStore(); // use authenticateUser action from  auth store

    // make isAuthenticated state reactive with storeToRefs
    // https://dev.to/rafaelmagalhaes/authentication-in-nuxt-3-375o
    const { checkStatus, errors } = storeToRefs(useAuthStore());

    console.log("register.vue: errors", errors.value)
    console.log("register.vue: checkStatus", checkStatus.value)

    const user = ref({
        name: 'red', 
        email: 'red@gmail.com',
        genderId: 1,
        bloodTypeId: 1,
        password: 'password',
        confirmPassword: 'password',
    });
    const loading = ref(false);
    const isNeedToVerify = ref(false);

    definePageMeta({
        middleware: ['guest'],
        layout: false,
    });
    useHead({
        title: 'securealm | Register',
    });

    async function registerHandler() {
    console.log("register.vue: checkStatus", checkStatus.value)
        loading.value = true;
        await registerUser(user.value);
        loading.value = false;

        // user.email.value = '';
        // user.name.value = '';
        // user.genderId.value = '';
        // user.bloodTypeId.value = '';
        // user.password.value = '';
        // user.confirmPassword.value = '';

        // if (false) {
        //     isNeedToVerify.value = true;
        //     return;
        // }
    }
</script>

<template>
    <section class="flex flex-col items-center justify-center h-96 gap-4">
        <form @submit.prevent="registerHandler" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Create an account</h1>

            <div v-if="isNeedToVerify" class="bg-green-500 text-white p-2">
                Your account has been created. Please check your email to verify your account.
            </div>

            <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                <p v-for="(error, index) in errors" :key="index">
                    {{ error.field }}:
                    <span v-if="error.fieldErrors">
                        <span v-for="(fieldError, index) in error.fieldErrors" :key="index">{{ fieldError }}</span>
                    </span>
                </p>
            </div>

            <input v-model="user.email" type="email" placeholder="Type your email" required />
            <input v-model="user.name" type="text" placeholder="Type your name" required />
            <input v-model="user.genderId" type="number" placeholder="Select your gender" required />
            <input v-model="user.bloodTypeId" type="number" placeholder="Select your blood type" required />
            <input
                v-model="user.password"
                type="password"
                autocomplete="new-password"
                placeholder="Type your password"
                required
            />
            <input
                v-model="user.confirmPassword"
                type="password"
                autocomplete="confirm-password"
                placeholder="Confirm your password"
                required
            />
            <div class="flex justify-between gap-4">
                <NuxtLink class="text-indigo-600" to="/login">Already have an account?</NuxtLink>
                <button
                    type="submit"
                    :disabled="loading"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Register
                </button>
            </div>
        </form>
    </section>
</template>