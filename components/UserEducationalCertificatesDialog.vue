
<template>
    <client-only>
      <el-dialog
        v-model="localDialogVisible"
        title="Edit Certificates Form."
        width="30%"
        :before-close="handleClose"
        align-center
      >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">Edit Certificates.</h4>
        </div>
      </template>
        <div>
          <div v-if="user" class="ruec-wrap">
            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              status-icon
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="Certificates" prop="ids">
                <el-select v-model="ruleForm.ids" placeholder="Certificates" :multipleLimit=4 multiple>
                  <el-option
                    v-for="option in educationalCertificatesList"
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
import { IEducationalCertificate } from '~/types/educationalCertificate';
  import { IGENDER_TYPE, IGender } from '~/types/gender';

  import { IUSER_TYPE, IUserProfile, IEditUserForm } from '~/types/user';

  const { logUserOut, setUser } = useAuthStore();
  // make checkStatus state reactive with storeToRefs
  // https://dev.to/rafaelmagalhaes/authentication-in-nuxt-3-375o
  const { user, checkStatus } = storeToRefs(useAuthStore()); 

  console.log("UserEducationalCertificatesDialog: user", user.value);

  const ruleFormRef = ref<FormInstance>();
  const educationalCertificatesList = ref<IEducationalCertificate[]>([]);

  const ruleForm = reactive(user.value && user.value.educationalCertificates && user.value.educationalCertificates?.length > 0 ? {
    ids: user.value.educationalCertificates.map((el)=> el.id),
  } : {
    ids: [],
  })

  const rules = reactive<FormRules>({
    ids: [{ type: 'array', trigger: 'blur' }],
  })

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl || !user.value) return;
    formEl.validate(async(valid) => {
      if (valid && user.value) {

        const res = await updateRuecBatch(checkStatus.value, ruleForm.ids);

        if(res) {
          const {educationalCertificates, ...rest} = user.value;
          const updatedUser: IUserProfile = {
            ...rest,
            educationalCertificates: res.educationalCertificates,
          }    
  console.log("UserEducationalCertificatesDialog: updatedUser", updatedUser);
   
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


  async function getEducationalCertificates() {
    if(checkStatus.value) {
      const data  = await getEducationalCertificatesList(checkStatus.value);
      educationalCertificatesList.value = data.map((element)=> {
        return { 
          isEditing: false,
          ...element
        }
      });
    }
  }

  getEducationalCertificates();

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
.ruec-wrap {
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