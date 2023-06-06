<!-- https://element-plus.org/en-US/component/table.html -->
<template>
  <div>
    <div>
      <NuxtLink class="text-indigo-600" to="/profile">
          Profile Page
      </NuxtLink>
    </div>
    <div>
      <NuxtLink v-if="user?.userType===IUSER_TYPE.ADMIN" class="text-indigo-600" to="/usersTable">
          User List Page
      </NuxtLink>
    </div>
    <div v-if="ruecsList" class="centeredTable">
      <el-table
        ref="tableRef"
        row-key="id"
        :data="filterTableData"
        style="width: 100%"
        max-height="700"
        border
      >
        <el-table-column>
          <template #header >
            <div class="tableTopHeader">
              <div>
                <el-button @click="resetCertificateNameFilter">reset Created At filter</el-button>
                <el-button @click="clearFilter">reset all filters</el-button>
              </div>
              <el-input v-model="search" placeholder="Type to search" style="width: 400px;"/>
            </div>
          </template>
          <el-table-column type="expand">
            <template #default="props">
              <div m="4"  class="centeredChildTable">
                <p m="t-0 b-2">Number of Users: {{ props.row.regularUsers.length }}</p>
                <h3>Users</h3>
                <el-table :data="props.row.regularUsers" row-key="id" border>
                  <el-table-column label="Id" prop="id" width="65" fixed/>
                  <el-table-column label="Name" prop="name" width="120" />
                  <el-table-column label="Email" prop="email" width="180" />
                  <el-table-column label="Status(Is Approved)" prop="isApproved"  width="160"/>
                  <el-table-column label="Blood Type" prop="bloodType"  :formatter="formatter" width="120"/>
                  <el-table-column label="Gender" prop="gender"  :formatter="formatter"  width="80"/>
                  <el-table-column label="Email Verified At" prop="emailVerifiedAt" width="180" />
                  <el-table-column label="Role Assignment Date" prop="roleAssignmentDate" width="180" />
                  <el-table-column label="Created At" prop="createdAt" width="180" />
                  <el-table-column label="Updated At" prop="updatedAt" width="180" />
                </el-table>
              </div>
            </template>
          </el-table-column>
          <!-- use this when showing tables for regular users instead of showing id -->
          <el-table-column type="index" :index="indexMethod"/>
          <el-table-column label="Id" prop="id"/>
          <el-table-column
            prop="name"
            label="Name"
            sortable
            column-key="name"
            :filters="ruecsList.map((element)=>({
              text: element.name,
              value: element.name,
            }))"
            :filter-method="filterHandler"
          >
            <template #default="scope">
              <template v-if="!scope.row.editing">
                {{ scope.row.name }}
              </template>
              <template v-else>
                <el-input v-model="scope.row.name"></el-input>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="isDeletable" label="Delete Status" width="180">
            <template #default="scope">
              <el-popover effect="light" trigger="hover" placement="top" width="auto">
                <template #default>
                  <div>{{ scope.row.isDeletable ? "Deletable" : "Resource is in use by at least a user and can't be deleted." }}</div>
                </template>
                <template #reference>
                  {{ scope.row.isDeletable ? 'Deletable' : 'Not Deletable' }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="Operations" width="180">
            <template #default="scope">
              <div class="operations">
                <el-button type="primary" @click="handleEdit(scope.$index, scope.row)"
                  >{{ scope.row.editing ? 'Save' : 'Edit' }}</el-button>
                <el-button
                  type="danger"
                  :disabled="!scope.row.isDeletable"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  Delete
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-table
        row-key="id"
        :data="newRowTable"
        style="width: 100%"
        max-height="700"
        border
      >
        <el-table-column label="Name" prop="name">
          <template #default="scope">
            <el-input v-model="scope.row.name" ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Operations" width="180">
          <template #default="scope">
            <el-button class="mt-4" style="width: 100%" @click="onAddItem(scope.$index, scope.row)"
            >Add Item</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { Timer } from '@element-plus/icons-vue';
  import type { TableColumnCtx, TableInstance } from 'element-plus'
  import { storeToRefs } from 'pinia'; 
  import { IUSER_TYPE, IUserProfile } from '~/types/user';
  import { IRuecNewRowTable, IRuecsTable } from '~/types/educationalCertificate';

  // https://dev.to/rafaelmagalhaes/authentication-in-nuxt-3-375o
  const { checkStatus, user } = storeToRefs(useAuthStore()); 

  definePageMeta({
      middleware: ['is-admin'],
      layout: false,
  });

  useHead({
      title: `securealm | Certificates With Users List`,
  });

  const emptyRow = { id: 1, name: '' };
  const rowsBeforeEditing = ref<IRuecsTable[]>([]);// it is an array since user is maybe editing multiple rows.

  const search = ref('');
  const tableRef = ref<TableInstance>();
  const ruecsList = ref<IRuecsTable[]>([]);
  const newRowTable = ref<IRuecNewRowTable[]>([]);

  // TODO: make search by regularUsers
  const filterTableData = computed(() =>
    ruecsList.value.filter(
      (data) =>
        !search.value ||
        data.name.toLowerCase().includes(search.value.toLowerCase())
    )
  );

  const indexMethod = (index: number) => {
    return index + 1;
  }

  const resetCertificateNameFilter = () => {
    tableRef.value!.clearFilter(['name'])
  }
  // TODO: improvement typing when refactor table
  const clearFilter = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    tableRef.value!.clearFilter()
  }
  const formatter = (row: IUserProfile, column: TableColumnCtx<IUserProfile>) => {
  //you can access the value of the current cell using row[column.property].
  // as an example do this return row[column.property].toUpperCase();
    if(column.property === 'gender' || column.property === 'bloodType')
      return row[column.property].name;
    return 'Formatter error :(';
  }
  const filterHandler = (
    value: string,
    row: IRuecsTable,
    column: TableColumnCtx<IRuecsTable>
  ) => {
    const property = column['property']
    return row[property] === value;
  }

  const handleEdit = async (index: number, row: IRuecsTable) => {
    row.editing = !row.editing;
    if (row.editing) {// edit is clicked
      //add to backup
      addToBackup(row);
    }
    if (!row.editing) {// Save is clicked
      if(ruecsList.value.find((el)=> row.name === el.name && row.id !== el.id)) {
        alert("The name has already been taken.");
        // use backup to restore original value
        const backup = getFromBackup(row.id);
        if(backup) {ruecsList.value.splice(index, 1, backup);}
        return;
      }
      if(row.name === "") {
        alert("The name field is required.");
        return;
      }
      await updateEducationalCertificate(
        checkStatus.value,
        {id: row.id, name: row.name, isDeletable: row.isDeletable}
      ).then((updatedEducationalCertificate)=>{
        ruecsList.value.splice(index, 1, {
            regularUsers: [],
            isEditing: false,
            ...updatedEducationalCertificate,
        });
        // remove from backup
        removeFromBackup(row.id);
      });
    }
  }

  const handleDelete = async (index: number, row: IRuecsTable) => {
    await deleteEducationalCertificate(checkStatus.value, row.id);
    ruecsList.value.splice(index, 1);
  }

  const onAddItem = async (index: number, row: IRuecNewRowTable) => {
    if(ruecsList.value.find((el)=> row.name === el.name && row.id !== el.id)) {
      alert("The name has already been taken.");
      return;
    }
    if(row.name === "") {
      alert("The name field is required.");
      return;
    }
    const createdEducationalCertificate = await createEducationalCertificate(checkStatus.value, row.name);
    
    ruecsList.value.push({
      regularUsers: [],
      isEditing: false,
      ...createdEducationalCertificate
    });
    clearAndAddNewEmptyRow();
  }

  async function getRuecs() {
    if(user.value?.userType === IUSER_TYPE.ADMIN && checkStatus.value) {
      const data  = await getRuecsList(checkStatus.value);
      console.log("ruecs.vue: data", data);
      ruecsList.value = data.map((element)=> {
        return { 
          isEditing: false,
          ...element
        }
      });
    }
  }

  getRuecs();

  // Call clearAndAddNewEmptyRow() to add a new row with a unique object reference, important!
  const clearAndAddNewEmptyRow = () => {
    if (newRowTable.value.length !== 0) {
      newRowTable.value = [];
    }
    const newRow = { ...emptyRow }; // Create a new object
    newRowTable.value.push(newRow);
  };

  clearAndAddNewEmptyRow();
  
  const addToBackup = (row: IRuecsTable) => {
    const newBackupRow = { ...row }; // Create a new object
    rowsBeforeEditing.value.push(newBackupRow);
  };

  const removeFromBackup = (id: number) => {
    const arr = rowsBeforeEditing.value.filter((el)=> el.id === id);
    rowsBeforeEditing.value = arr;
  };

  const getFromBackup = (id: number): IRuecsTable | undefined => {
    return rowsBeforeEditing.value.find((el)=>el.id === id);
  };

</script>

<style scoped>
  .centeredTable {
    width: 86%;
    margin: 0 auto;
  }
  .centeredChildTable {
    width: 91%;
    margin: 0 auto;
    padding: 1%;
    box-shadow: var(--el-box-shadow-dark);
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