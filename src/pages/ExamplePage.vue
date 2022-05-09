<template>
  <div class="grid">
		<div class="col-12">
			<div class="card">
                <Toast/>
                <Message ref="message" severity="error" :closable="true" v-if="errors.length">{{errors}}</Message>
                
                <Fieldset legend="Upload" :toggleable="true" :collapsed="true" class="mb-3">
                    <div class="p-fluid mb-3">       
                        <div class="grid">
                            <div class="lg:col-5 md:col-12 sm:col-12 align-items-center justify-content-center">
                                <h5>Intruction</h5>
                                <ol>
                                    <li>
                                        <p class="line-height-3 m-0">Intruction 1</p>
                                    </li>
                                    <li>
                                        <p class="line-height-3 m-0">Intruction 2</p>
                                    </li>
                                    <li>
                                        <p class="line-height-3 m-0">Intruction 3</p>
                                    </li>
                                    <li>
                                        <p class="line-height-3 m-0">Intruction 4</p>
                                    </li>
                                </ol>
                                <div class="line-height-3 m-0" style="color:red;">Note : follow the step by step instructions well. So the data will be uploaded</div>
                            </div>
                            
                            <div class="lg:col-1">
                                <Divider layout="vertical">
                                    <!-- <b>OR</b> -->
                                </Divider>
                            </div>

                            <div class="sm:col-12 md:col-12 lg:col-6">
                                <form>
                                <FileUpload ref="fileUpload" name="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :customUpload="true" @uploader="onUpload" :fileLimit="1" :maxFileSize="1000000">
                                  <template #empty>
                                        <p>Drag and drop files to here to upload.</p>
                                    </template>
                                </FileUpload>
                                </form>
                            </div>
                        </div>
                    </div>
                </Fieldset>

                <Fieldset legend="Add New" :toggleable="true" :collapsed="true" class="mb-3">
                    <div class="p-fluid">
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-6 lg:col-3">
                                <label for="name">Name</label>
                				<InputText id="name" v-model="forms.name" required="true" autofocus :class="{'p-invalid': submitted && !forms.name}" />
						        <small class="p-invalid" v-if="submitted && !forms.name">Name is required.</small>
                            </div>
                            <div class="field col-12 md:col-6 lg:col-3">
                                <label for="code">Salesman Code</label>
                				<InputText id="code" v-model="forms.salesmanCode" required="true" autofocus :class="{'p-invalid': submitted && !forms.salesmanCode}" />
						        <small class="p-invalid" v-if="submitted && !forms.salesmanCode">Salesman Code is required.</small>
                            </div>
                        </div>
                    </div>
                    <Button :loading="loadingAddNew" label="Save" icon="pi pi-save" class="p-button-primary" @click="saveNew"/>
                </Fieldset>
                
                <Fieldset legend="Filter" :toggleable="true" :collapsed="true" class="mb-3">
                    <div class="p-fluid">
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-6 lg:col-3">
                                <label for="period">Period</label>
                				<Calendar v-model="period" view="month" dateFormat="mm/yy" icon="pi pi-calendar" :showIcon="true"/>
                            </div>
                            <div class="field col-12 md:col-6 lg:col-3">
                                <label for="salesman">Salesman</label>
                				<Dropdown v-model="salesman_code" :options="salesman" optionLabel="text" optionValue="id" placeholder="Select a salesman" :filter="true" :showClear="true"/>
                            </div>
                        </div>
                    </div>
                    <Button :loading="loading" label="Filter" icon="pi pi-search" class="p-button-warning mr-2 my-1" @click="getDataTable" />
                    <Button :loading="loadingExcel" label="Export Excel" icon="pi pi-file-excel" class="p-button p-button-success mr-2 my-1 inline-block" @click="exportExcelCSV('xlsx')" />
                    <Button :loading="loadingCsv" label="Export CSV" icon="pi pi-file-excel" class="p-button p-button-success mr-2 my-1 inline-block" @click="exportExcelCSV('csv')" />
                </Fieldset>

                <DataTable :value="dataTable" responsiveLayout="scroll" :loading="loading" dataKey="id" >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Data</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="search" placeholder="Search..." @keyup.enter="getDataTable" />
                            </span>
                        </div>
                    </template>
                    <Column field="name" header="Name">
                        <template #body="slotProps">
                            {{slotProps.data.name}}
                        </template>
                    </Column>
                    <Column field="salesman_code" header="Salesman Code">
                        <template #body="slotProps">
                            {{slotProps.data.salesman_code}}
                        </template>
                    </Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editItem(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteItem(slotProps.data)" />
						</template>
					</Column>
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

				<Dialog v-model:visible="editItemDialog" :style="{width: '450px'}" header="Data Details" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Name</label>
						<InputText id="name" v-model.trim="item.name" required="true" autofocus :class="{'p-invalid': submitted && !item.name}" />
						<small class="p-invalid" v-if="submitted && !item.name">Name is required.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="updateItem" :loading="loadingEdit"/>
					</template>
				</Dialog>

                <Dialog v-model:visible="deleteItemDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="item">Are you sure you want to delete this data {{item.name}}?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteItemDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteItem" :loading="loadingDelete"/>
					</template>
				</Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            // loading
            loading: false,
            loadingAddNew: false,
            loadingEdit: false,
            loadingDelete: false,
            loadingExcel: false,
            loadingCsv: false,

            // upload
            file: null,
            
            // addNew
            forms: {
                name: null,
                salesmanCode: null
            },

            // edit&delete
            item: {},
			editItemDialog: false,
			deleteItemDialog: false,

            // filter
            period: new Date(),
            salesman_code: null,
            salesman: [
                {text: 'DWI W (B1 LECI)', id: 'FBB105'},
                {text: 'MOHAMAD BARLI  (BV2 LECI)', id: 'FBB205'},
                {text: 'YUSUF   (LECI NT)', id: 'NBB108'},
            ],

            //datatables
            data: null,
            dataTable: null,
            rows: null,
            search: null,
            offset: null,
            totalItemsCount: 0,

			submitted: false,
        }
    },
	mounted() {
		this.getDataTable();
        this.$store.commit("setErrors", {});
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
        ...mapGetters(["errors"]),
        period_label(){ 
            return moment(this.period, 'YYYY-MM').format('YYYY-MM'); 
        },
    },
	methods: {
        //UPLOAD
        onUpload(event) {
            this.file = event.files[0];

            let data = new FormData();
            data.append('file', this.file);

            this.axios({
                method: 'POST',
                url: process.env.VUE_APP_ROOT_API + 'salesman/import',
                data: data,
                onUploadProgress: function (e) {
                     this.$refs.fileUpload.progress = parseInt(Math.round((e.loaded * 100) / e.total));
                }.bind(this)
            })
			.then(res => {
                console.log(res);
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Data Saved', life: 3000});
                this.$store.commit("setErrors", {});
                this.$refs.fileUpload.uploadedFileCount = 0;
                this.$refs.fileUpload.progress = null;
                this.getDataTable();
			})
            .catch((err) => {
                console.log(err);
                this.$refs.fileUpload.uploadedFileCount = 0;
                this.$refs.fileUpload.progress = null;
                this.$refs.message.visible = true;
            });
        },
        // ADDNEW
		saveNew() {
            this.loadingAddNew = true;
			this.submitted = true;
            this.$toast.add({severity:'success', summary: 'Successful', detail: 'Data Saved', life: 3000});
			this.submitted = false;
            this.loadingAddNew = false;
            this.clearForms();
		},
        clearForms() {
            this.forms.name = null;
            this.forms.salesmanCode = null;
        },
        // EDIT
		editItem(item) {
			this.item = item;
			this.editItemDialog = true;
		},
		hideDialog() {
			this.editItemDialog = false;
			this.submitted = false;
		},
		updateItem() {
			this.submitted = true;
            this.$toast.add({severity:'success', summary: 'Successful', detail: 'Data Updated', life: 3000});
            this.editItemDialog = false;
			this.submitted = false;
            this.item = {};
		},
        // DELETE
        confirmDeleteItem(item) {
			this.item = item;
			this.deleteItemDialog = true;
		},
        deleteItem() {
			this.deleteItemDialog = false;
			this.item = {};

            //success
			// this.$toast.add({severity:'success', summary: 'Successful', detail: 'Data Deleted', life: 3000});

            //error
			this.$toast.add({severity:'warn', summary: 'Error', detail: 'Something When Wrong', life: 3000});
		},
        // DATATABLE
		getDataTable(){
			
			this.loading=true;

			this.axios({
                method: 'GET',
                url: process.env.VUE_APP_ROOT_API + 'salesman',
                params: {
                    "name" : this.search,
                    "per_page" : this.rows,
                    "page" : (this.offset/this.rows)+1,
                    "salesman_code" : this.salesman_code,
                    "period_label" : this.period_label,
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
        // EXPORT
        exportExcelCSV(ext){

            if(ext == 'xlsx'){
                this.loadingExcel=true;
            }else if(ext == 'csv'){
                this.loadingCsv=true;
            }

            this.axios({
                method: 'GET',
                url: process.env.VUE_APP_ROOT_API + 'salesman/export-excel-csv/download',
            	responseType: 'blob',
                params: {
                    "ext" : ext,
                    "salesman_code" : this.salesman_code,
                    "period_label" : this.period_label,
                }
            })
            .then(response => {
                let fileUrl = window.URL.createObjectURL(response.data);
                let fileLink = document.createElement('a');

                fileLink.href = fileUrl;

                fileLink.setAttribute('download', 'Salesman Export.' + ext);
                
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