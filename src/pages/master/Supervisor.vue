<template>
  <div class="grid">
		<div class="col-12">
			<div class="card">
                <Toast/>
                <Message ref="message" severity="error" :closable="true" v-if="errors.length">{{errors}}</Message>
                
                <Fieldset legend="Tambah Baru" :toggleable="true" :collapsed="true" class="mb-3">
                    <div class="p-fluid">
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-6 lg:col-3">
                                <label for="name">Nama</label>
                				<InputText id="name" v-model="forms.name" required="true" autofocus :class="{'p-invalid': errorAdd.name}" />
						        <small class="p-invalid" style="color:red" v-if="errorAdd.name">{{errorAdd.name[0]}}</small>
                            </div>
                            <div class="field col-12 md:col-6 lg:col-3">
                                <label for="code">Supervisor Kode</label>
                				<InputText id="code" v-model="forms.supervisor_code" required="true" autofocus :class="{'p-invalid': errorAdd.supervisor_code}" />
						        <small class="p-invalid" style="color:red" v-if="errorAdd.supervisor_code">{{errorAdd.supervisor_code[0]}}</small>
                            </div>
                        </div>
                    </div>
                    <Button :loading="loadingAddNew" label="Simpan" icon="pi pi-save" class="p-button-primary" @click="saveNew"/>
                </Fieldset>

                <DataTable :value="dataTable" responsiveLayout="scroll" :loading="loading" dataKey="id" @sort="onSort($event)" >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<div>
							<Button :loading="loadingExcel" label="Export Excel" icon="pi pi-file-excel" class="p-button p-button-success mr-2 my-1 inline-block" @click="exportExcelCSV('xlsx')" />
							<Button :loading="loadingCsv" label="Export CSV" icon="pi pi-file-excel" class="p-button p-button-success mr-2 my-1 inline-block" @click="exportExcelCSV('csv')" />
                            </div>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="search" placeholder="Cari..." @keyup.enter="getDataTable" />
                            </span>
                        </div>
                    </template>
                    <Column field="supervisor_code" header="Supervisor Kode" :sortable="true">
                        <template #body="slotProps">
                            {{slotProps.data.supervisor_code}}
                        </template>
                    </Column>
                    <Column field="name" header="Supervisor Nama" :sortable="true">
                        <template #body="slotProps">
                            {{slotProps.data.name}}
                        </template>
                    </Column>
					<!-- <Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editItem(slotProps.data)" />
						</template>
					</Column> -->
                    <template #empty>
                        No data found.
                    </template>
                    <template #loading>
                        Loading data. Please wait.
                    </template>
                    <template #footer>
                        In total there are {{totalItemsCount ? totalItemsCount : 0 }} data.
                    </template>
                </DataTable>

                <Paginator v-model:rows="rows" v-model:first="offset" :totalRecords="totalItemsCount" :rowsPerPageOptions="[10,20,30]">
                    <template>
                        {{totalItemsCount}}
                    </template>
                </Paginator>

				<Dialog v-model:visible="editItemDialog" :style="{width: '450px'}" :closable="false" header="Data Detail" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Nama</label>
						<InputText id="name" v-model.trim="item.name" required="true" autofocus :class="{'p-invalid': errorEdit.name}" />
						<small class="p-invalid" style="color:red" v-if="errorEdit.name">{{errorEdit.name[0]}}</small>
					</div>
					<div class="field">
						<label for="name">Supervisor Kode</label>
						<InputText id="supervisor_code" v-model.trim="item.supervisor_code" required="true" autofocus :class="{'p-invalid': errorEdit.supervisor_code}" />
						<small class="p-invalid" style="color:red" v-if="errorEdit.supervisor_code">{{errorEdit.supervisor_code[0]}}</small>
					</div>
					<template #footer>
						<Button label="Batal" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Simpan" icon="pi pi-check" class="p-button-text" @click="updateItem" :loading="loadingEdit"/>
					</template>
				</Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            // loading
            loading: false,
            loadingAddNew: false,
            loadingEdit: false,
            loadingExcel: false,
            loadingCsv: false,
            
            // addNew
            forms: {
                name: null,
                supervisor_code: null,
                password: 'secret',
            },

            // edit
            item: {},
			editItemDialog: false,

            //datatables
            data: null,
            dataTable: null,
            rows: null,
            search: null,
            offset: null,
            field: null,
            sort: null,
            totalItemsCount: 0,
        }
    },
	mounted() {
		this.getDataTable();
        this.$store.commit("setErrors", {});
        this.$store.commit("setErrorAdd", {});
        this.$store.commit("setErrorEdit", {});
	},
    watch: {
        offset() {
            this.getDataTable();
        },
        rows() {
            this.getDataTable();
        },
    },
    computed:{
        ...mapGetters(["errors","errorEdit","errorAdd"]),
    },
	methods: {
        // ADDNEW
		saveNew() {
            this.loadingAddNew = true;
            
            this.axios({
                method: 'POST',
                url: process.env.VUE_APP_ROOT_API + 'web/supervisor',
                data: this.forms
            })
			.then(res => {
                this.loadingAddNew = false;
                if(res){
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Data Berhasil Disimpan', life: 3000});
                    this.$store.commit("setErrors", {});
                    this.$store.commit("setErrorAdd", {});
                    this.clearForms();
                    this.getDataTable();
                }
			})
            .catch((err) => {
                console.log(err);
                this.loadingAddNew = false;
                this.$store.commit("setErrorAdd", err.response.data.data);
			});
		},
        clearForms() {
            this.forms.name = null;
            this.forms.supervisor_code = null;
        },
        // EDIT
		editItem(item) {
			this.item = item;
			this.editItemDialog = true;
		},
		hideDialog() {
			this.editItemDialog = false;
            this.$store.commit("setErrors", {});
            this.$store.commit("setErrorEdit", {});
		},
		updateItem() {
            this.loadingEdit = true;
            var item = this.item;
            
            this.axios({
                method: 'POST',
                url: process.env.VUE_APP_ROOT_API + 'web/supervisor',
                data: {
                    "name" : item.name,
                    "supervisor_code" : item.supervisor_code,
                    "password" : 'secret',
                },
            })
			.then(res => {
                this.loadingEdit = false;
                if(res){
                    this.$store.commit("setErrors", {});
                    this.$store.commit("setErrorEdit", {});
                    this.item = {};
                    this.hideDialog();
                    this.getDataTable();
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Data Berhasil Disimpan', life: 3000});
                }
			})
            .catch((err) => {
                console.log(err);
                this.loadingEdit = false;
                this.$store.commit("setErrorEdit", err.response.data.data);
			});
		},
        // DATATABLE
		getDataTable(){
			
			this.loading=true;

			this.axios({
                method: 'GET',
                url: process.env.VUE_APP_ROOT_API + 'web/supervisor',
                params: {
                    "search" : this.search,
                    "per_page" : this.rows,
                    "page" : (this.offset/this.rows)+1,
                    "field" : this.field,
                    "sort" : this.sort,
                }
            })
			.then(res => {
				this.data = res.data.data;
				this.dataTable = res.data.data.data;
                this.totalItemsCount = res.data.data.total;
                this.rows = parseInt(res.data.data.per_page);
				this.loading=false;
			})
            .catch((err) => {
                console.log(err);
            });
		},
        onSort(event) {
            this.field = event.sortField;
            this.sort = event.sortOrder == '1' ? 'ASC' : 'DESC';
            this.getDataTable();
        },
        // EXPORT
        exportExcelCSV(ext){

            if(ext == 'xlsx'){
                this.loadingExcel=true;
            }else if(ext == 'csv'){
                this.loadingCsv=true;
            }

            this.axios({
                method: 'GET',
                url: process.env.VUE_APP_ROOT_API + 'web/supervisor/export-excel-csv/download',
            	responseType: 'blob',
                params: {
                    "ext" : ext,
                }
            })
            .then(response => {
                let fileUrl = window.URL.createObjectURL(response.data);
                let fileLink = document.createElement('a');

                fileLink.href = fileUrl;

                fileLink.setAttribute('download', 'Supervisor Export.' + ext);
                
                document.body.appendChild(fileLink)

                fileLink.click();
               
                if(ext == 'xlsx'){
                    this.loadingExcel=false;
                }else if(ext == 'csv'){
                    this.loadingCsv=false;
                }

            })
            .catch((err) => {
                console.log(err);
               
                if(ext == 'xlsx'){
                    this.loadingExcel=false;
                }else if(ext == 'csv'){
                    this.loadingCsv=false;
                }
            });
        },
	}
}
</script>