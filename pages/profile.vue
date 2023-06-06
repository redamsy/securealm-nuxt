<script setup lang="ts">
    import { storeToRefs } from 'pinia'; 
    import { useAuthStore } from '~/stores/useAuth';
    import { ICHECK_STATUS } from '~/types/auth';
    import { IUSER_TYPE } from '~/types/user';
    const router = useRouter();
    const { logUserOut, setUser } = useAuthStore();
    // make checkStatus state reactive with storeToRefs
    // https://dev.to/rafaelmagalhaes/authentication-in-nuxt-3-375o
    const { user, checkStatus } = storeToRefs(useAuthStore()); 

    definePageMeta({
        middleware: ['auth'],
        layout: false,
    });

    useHead({
        title: `securealm | ${user?.value?.name} - Profile`,
    });
    
    const dialogVisible = ref(false);
    const ruecDialogVisible = ref(false);
    const handleToggle = (v: boolean) => {
        // Handle the confirm action
        dialogVisible.value = v
    }
    const handleToggleRuec = (v: boolean) => {
        // Handle the confirm action
        ruecDialogVisible.value = v
    }

    async function verifyEmail() {
        await sendEmailVerification(checkStatus.value);
        const userProfile = await getCurrentUserProfile(checkStatus.value);
        console.log("profile: userProfile", userProfile);
        setUser(userProfile);
    }

    async function logout() {
        await logUserOut();
        if (checkStatus.value !== ICHECK_STATUS.VALID) {
            router.push('/login');
        }
    }
</script>

<template>
    <div>
        <div>
            <NuxtLink v-if="user?.userType===IUSER_TYPE.ADMIN" class="text-indigo-600" to="/usersTable">
                Users List Page
            </NuxtLink>
        </div>
        <div>
            <NuxtLink v-if="user?.userType===IUSER_TYPE.ADMIN" class="text-indigo-600" to="/ruecs">
                Certificates With Users Page
            </NuxtLink>
        </div>
        <section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
            <!-- <Avatar />
            <UserInfo />
            <Sessions /> -->
            <!-- <a href="/api/auth/logout" class="bg-gray-400 rounded py-2 px-3 text-white"> Logout </a> -->
            <h1>Your info</h1>
            <div v-if="user">
                <div class="bg-blue-600 text-white text-[13px] p-2">
                    <ul>
                        <li>Name: {{ user.name }}</li>
                        <li>Email: {{ user.email }}</li>
                        <li>Email verification At: {{ user.emailVerifiedAt || 'False' }}</li>
                        <li>Role Assignment Date: {{ user.roleAssignmentDate || 'False' }}</li>
                        <li>Created At: {{ user.createdAt || 'False' }}</li>
                        <li>Approved: {{ user.isApproved }}</li>
                        <li>Role: {{ user.userType }}</li>
                        <li>Blood Type: {{ user.bloodType.name }}</li>
                        <li>Gender: {{ user.gender.name }}</li>
                    </ul>
                    <div v-if="user.educationalCertificates">
                        <h2>Certificates: {{ user.educationalCertificates.length }}</h2>
                        <ul v-for="educationalCertificate in user.educationalCertificates" :key="educationalCertificate.id">
                            <li>Name: {{ educationalCertificate.name }}</li>
                        </ul>
                        <div v-if="user.educationalCertificates.length === 0">No certificates found</div>
                    </div>
                </div>
            </div>
            <div>
                <button
                    @click="logout"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Logout
                </button>
            </div>
            <div v-if="!user?.emailVerifiedAt">
                <button
                    @click="verifyEmail"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Verify Email
                </button>
            </div>
                <el-button text @click="handleToggle(true)">
                    click to open the edit info Dialog
                </el-button>
                <UserProfileDialog :dialog-visible="dialogVisible" @toggle="handleToggle"/>
            <div v-if="user?.userType === IUSER_TYPE.REGULAR_USER">
                <el-button text @click="handleToggleRuec(true)">
                    click to open the Ruec Dialog
                </el-button>
                <UserEducationalCertificatesDialog :dialog-visible="ruecDialogVisible" @toggle="handleToggleRuec"/>
            </div>
        </section>
    </div>
</template>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>