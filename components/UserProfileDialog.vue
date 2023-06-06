
<template>
    <client-only>
      <el-dialog
        v-model="localDialogVisible"
        title="Edit Profile Form."
        width="30%"
        :before-close="handleClose"
        align-center
      >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">Edit Profile Info.</h4>
        </div>
      </template>
        <div>
          <div v-if="user" class="user-profile">
            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              status-icon
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="Name" prop="name">
                <el-input v-model="ruleForm.name" autocomplete="off" placeholder="Name"/>
              </el-form-item>
              <el-form-item label="Email" prop="email">
                <el-input v-model="ruleForm.email" autocomplete="off" placeholder="Email"/>
              </el-form-item>
              <el-form-item label="Gender" prop="gender">
                <el-select v-model="ruleForm.genderId" placeholder="Gender">
                  <el-option
                    v-for="option in gendersList"
                    :key="option.id"
                    :label="option.name"
                    :value="option.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Blood Type" prop="bloodType">
                <el-select v-model="ruleForm.bloodTypeId" placeholder="Blood Type">
                  <el-option
                    v-for="option in bloodTypesList"
                    :key="option.id"
                    :label="option.name"
                    :value="option.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="success" @click="submitForm(ruleFormRef)"
            >Submit</el-button>
            <el-button type="primary" @click="resetForm(ruleFormRef)">Reset</el-button>
            <el-button @click="() => {resetForm(ruleFormRef) ; setIsOpened(false); return; }">Cancel</el-button>
          </span>
        </template>
      </el-dialog>
    </client-only>
</template>

<script lang="ts" setup>
  import type { FormInstance, FormRules } from 'element-plus'
import { el } from 'element-plus/es/locale';

  import { storeToRefs } from 'pinia';
import { rule } from 'postcss';
  import { IBLOOD_TYPE_ENUM, IBloodType } from '~/types/bloodType';
  import { IGENDER_TYPE, IGender } from '~/types/gender';

  import { IUSER_TYPE, IUserProfile, IEditUserForm } from '~/types/user';

  const { logUserOut, setUser } = useAuthStore();
  // make checkStatus state reactive with storeToRefs
  // https://dev.to/rafaelmagalhaes/authentication-in-nuxt-3-375o
  const { user, checkStatus } = storeToRefs(useAuthStore()); 

  console.log("UserProfileDialog: user", user.value);

  const ruleFormRef = ref<FormInstance>();
  const gendersList = ref<IGender[]>([]);
  const bloodTypesList = ref<IBloodType[]>([]);

  const ruleForm = reactive<IEditUserForm>(user.value ? {
    name: user.value.name,
    email: user.value.email,
    genderId: user.value.gender.id,
    bloodTypeId: user.value.bloodType.id,
  } : {
    name: '',
    email: '',
    genderId: 1,
    bloodTypeId: 1,
  })

  const rules = reactive<FormRules>({
    name: [{ type: 'string', trigger: 'blur', min: 3, max: 225, required: true }],
    email: [{ type: 'email', trigger: 'blur', min: 3, max: 225, required: true, options: { first: true } }],
    genderId: [{ type: 'string', trigger: 'blur', min: 3, max: 225, required: true }],
    bloodTypeId: [{ type: 'string', trigger: 'blur', min: 3, max: 225, required: true }],
  })

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl || !user.value) return;
    formEl.validate(async(valid) => {
      if (valid && user.value) {

        const res = await updateUserProfileInformation(checkStatus.value, ruleForm);

        const gName = gendersList.value.find((el)=>el.id === ruleForm.genderId)?.name;
        const bName = bloodTypesList.value.find((el)=>el.id === ruleForm.bloodTypeId)?.name;
      
        if(res === '' && gName && bName) {
          const updatedUser: IUserProfile = {
            name: ruleForm.name,
            email: ruleForm.email,
            gender: {id: ruleForm.genderId, name: gName},
            bloodType: {id: ruleForm.bloodTypeId, name: bName},
            id: user.value.id,
            isApproved: user.value.isApproved,
            emailVerifiedAt: user.value.emailVerifiedAt,
            userType: user.value.userType,
            educationalCertificates: user.value.educationalCertificates,
            roleAssignmentDate: user.value.roleAssignmentDate,
            createdAt: user.value.createdAt,
            updatedAt: user.value.updatedAt
          }    
   
          setUser(updatedUser);
          ElMessageBox.alert('successful').then(() => {
            setIsOpened(false);
            return;
          }).catch(() => {
            setIsOpened(false);
            return;
          });
        }
      } else {
        console.log('error submit!');
        return false
      }
    })
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }


  async function getGenders() {
    if(checkStatus.value) {
      const data  = await getGendersList(checkStatus.value);
      gendersList.value = data.map((element)=> {
        return { 
          isEditing: false,
          ...element
        }
      });
    }
  }

  async function getBloodTypes() {
    if(checkStatus.value) {
      const data  = await getBloodTypesList(checkStatus.value);
      bloodTypesList.value = data.map((element)=> {
        return { 
          isEditing: false,
          ...element
        }
      });
    }
  }

  getGenders();
  getBloodTypes();

  // start .... open and close dialog logic
  const props = defineProps({
    dialogVisible: {
      type: Boolean as PropType<boolean>, 
      required: true,
      validator(value: unknown): boolean {
        return true
      }
    },
  });

  console.log('props.dialogVisible', props.dialogVisible)

  const localDialogVisible = ref(props.dialogVisible);

  watch(
    () => props.dialogVisible,
    (newValue) => {
      localDialogVisible.value = newValue
    }
  )
  const emit = defineEmits(['toggle']);
  
  function setIsOpened(v: boolean) {
    localDialogVisible.value = v;
    emit('toggle', v);
  }

  const handleClose = (done: () => void) => {
    setIsOpened(false);
    done();
  }
  //end....
</script>
<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.dialog-footer button {
  margin-right: 5px;
}
.user-profile {
  max-width: 100%;
  margin: 0 auto;
}

.el-form-item__label {
  font-weight: bold;
}

.el-form-item__content {
  margin-bottom: 10px;
}

.el-input,
.el-select,
.el-switch {
  width: 100%;
  padding: 5px;
}

.el-button {
  padding: 10px 20px;
}
</style>