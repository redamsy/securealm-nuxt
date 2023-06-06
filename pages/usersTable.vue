<!-- https://element-plus.org/en-US/component/table.html -->
<template>
  <div>
    <div>
      <NuxtLink class="text-indigo-600" to="/profile">
          Profile Page
      </NuxtLink>
    </div>
    <div>
      <NuxtLink v-if="user?.userType===IUSER_TYPE.ADMIN" class="text-indigo-600" to="/ruecs">
          Certificates With Users Page
      </NuxtLink>
    </div>
    <div v-if="usersList" class="centeredTable">
      <div class="tableTopHeader">
        <div>
          <el-button @click="resetDateFilter">reset Created At filter</el-button>
          <el-button @click="clearFilter">reset all filters</el-button>
        </div>
        <el-input v-model="search" placeholder="Type to search" style="width: 400px;"/>
      </div>
      <el-table
        ref="tableRef"
        row-key="id"
        :data="filterTableData"
        style="width: 100%"
        max-height="700"
      >
        <!-- use this when showing tables for regular users instead of showing id -->
        <el-table-column type="index" :index="indexMethod" fixed/>
        <el-table-column label="Id" prop="id" width="65" sortable fixed/>
        <el-table-column label="Name" prop="name" width="250"/>
        <el-table-column label="Email" prop="email" width="250"/>
        <el-table-column prop="gender" label="Gender" width="80" :formatter="formatter" />
        <el-table-column prop="bloodType" label="Blood Type" width="120" :formatter="formatter" />
        <!-- start------------------------------------------------ -->
        <el-table-column
          prop="userType"
          label="Role"
          width="150"
          :filters="userTypeTableOption"
          :filter-method="filterUserType"
          filter-placement="bottom-end"
          fixed
        >
          <template #default="scope">
            <template v-if="!scope.row.editing">
              <el-tag
                :type="scope.row.userType === IUSER_TYPE.ADMIN ? '' : (scope.row.userType === IUSER_TYPE.REGULAR_USER ? 'success' : 'warning')"
                disable-transitions
                >{{ scope.row.userType }}</el-tag
              >
            </template>
            <template v-else>
              <el-select v-model="scope.row.userType">
                <el-option
                  v-for="option in userTypeTableOption"
                  :key="option.value"
                  :label="option.text"
                  :value="option.value"
                ></el-option>
              </el-select>
            </template>
          </template>
        </el-table-column>
        <!-- end------------------------------------------------ -->
        <!-- start------------------------------------------------ -->
        <el-table-column prop="isApproved" label="Approval Status" width="240" fixed>
          <template #default="scope">
            <template v-if="!scope.row.editing">
              {{ scope.row.isApproved ? 'Approved' : 'Not Approved' }}
            </template>
            <template v-else>
              <el-switch v-model="scope.row.isApproved" active-text="Approved" inactive-text="Not Approved"></el-switch>
            </template>
          </template>
        </el-table-column>
        <!-- end------------------------------------------------ -->
          <!-- use this in certificates/gender/bloodtype tables -->
        <!-- <el-table-column prop="name" label="Name">
          <template #default="scope">
            <template v-if="!scope.row.editing">
              {{ scope.row.name }}
            </template>
            <template v-else>
              <el-input v-model="scope.row.name"></el-input>
            </template>
          </template>
        </el-table-column> -->
        <el-table-column label="Role Assignment Date" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.roleAssignmentDate }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Email Verified At" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.emailVerifiedAt || `Not Verified` }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- TODO: get all users creation dates and ...7ek rasak -->
        <el-table-column
          prop="createdAt"
          label="Created At"
          width="180"
          column-key="createdAt"
          :filters="[
            { text: '2016-05-01', value: '2016-05-01' },
            { text: '2016-05-02', value: '2016-05-02' },
            { text: '2016-05-03', value: '2016-05-03' },
            { text: '2016-05-04', value: '2016-05-04' },
          ]"
          :filter-method="filterHandler"
        >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Updated At" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.updatedAt }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Operations" fixed="right" width="100">
          <template #default="scope">
            <div class="operations">
              <el-button type="primary" @click="handleEdit(scope.$index, scope.row)"
              >{{ scope.row.editing ? 'Save' : 'Edit' }}</el-button>
            </div>
          </template>
        </el-table-column>
        <!-- use this in certificates/gender/bloodtype tables -->
        <!-- <el-table-column label="Operations">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- use this in certificates/gender/bloodtype tables -->
      <!-- <el-button class="mt-4" style="width: 100%" @click="onAddItem"
        >Add Item</el-button> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { Timer } from '@element-plus/icons-vue';
  import dayjs from 'dayjs';
  import type { TableColumnCtx, TableInstance } from 'element-plus'
  import { storeToRefs } from 'pinia'; 
  import { IUSER_TYPE, IUsersTable } from '~/types/user';

  // https://dev.to/rafaelmagalhaes/authentication-in-nuxt-3-375o
  const { checkStatus, user } = storeToRefs(useAuthStore()); 

  definePageMeta({
      middleware: ['is-admin'],
      layout: false,
  });

  useHead({
      title: `securealm | Users List`,
  });

  const search = ref('');

  const filterTableData = computed(() =>
    usersList.value.filter(
      (data) =>
        !search.value ||
        data.name.toLowerCase().includes(search.value.toLowerCase())
    )
  );

  const indexMethod = (index: number) => {
    return index + 1;
  }

  const tableRef = ref<TableInstance>();

  const resetDateFilter = () => {
    tableRef.value!.clearFilter(['createdAt'])
  }
  // TODO: improvement typing when refactor table
  const clearFilter = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    tableRef.value!.clearFilter()
  }
  const formatter = (row: IUsersTable, column: TableColumnCtx<IUsersTable>) => {
  //you can access the value of the current cell using row[column.property].
  // as an example do this return row[column.property].toUpperCase();
    if(column.property === 'gender' || column.property === 'bloodType')
      return row[column.property].name;
    return 'Formatter error :(';
  }
  const filterUserType = (value: string, row: IUsersTable) => {
    return row.userType === value
  }
  const filterHandler = (
    value: string,
    row: IUsersTable,
    column: TableColumnCtx<IUsersTable>
  ) => {
    const property = column['property']
    return row[property] === value
  }

  const handleEdit = async (index: number, row: IUsersTable) => {
    row.editing = !row.editing;
    if (!row.editing) {
      // if user has role, dont change it
      if(row.userType !== IUSER_TYPE.NONE) {
        if(row.userType !== usersList.value.find((el) => el.id === row.id)?.userType) {
          alert("User already has role, consider, registering user with different email with new the role");
          return;
        }
      }
      // if user has role, dont set to NONE
      if(usersList.value.find((el) => el.id === row.id)?.userType !== IUSER_TYPE.NONE && row.userType === IUSER_TYPE.NONE) {
        alert("User already has role, consider deactivating user, set approval to false");
        return;
      }
      // Handle save logic here
      await setUserTypeAndApproval(checkStatus.value, row.id, row.userType, row.isApproved);
    }
  }

  // const now = new Date()

  // const onAddItem = () => {
  //   now.setDate(now.getDate() + 1)
  //   tableData.value.push({
  //     date: dayjs(now).format('YYYY-MM-DD'),
  //     name: 'Tom',
  //     state: 'California',
  //     city: 'Los Angeles',
  //     address: 'No. 189, Grove St, Los Angeles',
  //     zip: 'CA 90036',
  //     tag: 'Office',
  //   })
  // }

  const usersList = ref<IUsersTable[]>([]);

  async function getUsers() {
    if(user.value?.userType === IUSER_TYPE.ADMIN && checkStatus.value) {
      const data = await getUsersList(checkStatus.value);
      console.log("user.vue: getUsers: data", data);
      usersList.value = data.map((element)=> {
        return { isEditing: false, ...element}
      });
    }
  }

  getUsers();
  
  const userTypeTableOption = [
    { text: 'Admin', value: IUSER_TYPE.ADMIN },
    { text: 'Regular User', value: IUSER_TYPE.REGULAR_USER },
    { text: 'None', value: IUSER_TYPE.NONE },
  ]
</script>

<style scoped>
  .centeredTable {
    width: 87%;
    margin: 0 auto;
  }
  .tableTopHeader{
    display:flex;
    justify-content: space-between;
  }
  .operations{
    display:flex;
    justify-content: center;
  }
</style>