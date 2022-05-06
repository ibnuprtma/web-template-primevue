<template>
  <div class="grid">
		<div class="col-12">
			<div class="card">
                <Toast/>
                
                <Fieldset legend="Filter" :toggleable="true" class="mb-3">
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
                    <Button label="Filter" icon="pi pi-search" class="p-button-warning" :loading="loading" @click="getDataTable"></Button>
                </Fieldset>

				<Toolbar class="mb-4">
					<template v-slot:start>

					</template>
					<template v-slot:end>
                        <a class="p-button p-button-success mr-2 inline-block" :href="this.urlExport" @click="generateUrlParamsExport()" target="_blank">
                            Export Excel
                        </a>
                        <a class="p-button p-button-success" :href="this.urlExport" @click="generateUrlParamsExport()" target="_blank">
                            Export CSV
                        </a>
					</template>
				</Toolbar>

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
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="updateItem" />
					</template>
				</Dialog>

                <Dialog v-model:visible="deleteItemDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="item">Are you sure you want to delete</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteItemDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteItem" />
					</template>
				</Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    data() {
        return {
            period: new Date(),

            //salesmen_dropdown
            salesman_code: null,
            salesman: [
                {text: 'DWI W (B1 LECI)', id: 'FBB105'},
                {text: 'MOHAMAD BARLI  (BV2 LECI)', id: 'FBB205'},
                {text: 'YUSUF   (LECI NT)', id: 'NBB108'},
            ],

            //datatables
            loading: false,
            data: null,
            dataTable: null,
            rows: null,
            search: null,
            offset: null,
            totalItemsCount: 0,

            //exports
            filterParams:null,
            urlExport: null,

            item: {},
			editItemDialog: false,
			deleteItemDialog: false,


			submitted: false,
            
        }
    },
	mounted() {
		this.getDataTable();
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
        period_label(){ 
            return moment(this.period, 'YYYY-MM').format('YYYY-MM'); 
        },
    },
	methods: {
        getUrl(params) {

            const queryParams = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
            return queryParams;

        },
        generateUrlParamsExport() {

            this.filterParams= {
                "salesman_code" : this.salesman_code,
                "period_label" : this.period_label,
            };

            this.urlExport = process.env.VUE_APP_ROOT_API + 'salesman/export/download?' +  this.getUrl(this.filterParams);

        },
		getDataTable(){
			
			this.loading=true;

			this.axios({
                method: 'GET',
                url: process.env.VUE_APP_ROOT_API + 'salesman',
                params: {
                    "salesman_code" : this.salesman_code,
                    "period_label" : this.period_label,
                    "name" : this.search,
                    "per_page" : this.rows,
                    "page" : (this.offset/this.rows)+1,
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
        //edit
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
        //delete
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
	}
}
</script>