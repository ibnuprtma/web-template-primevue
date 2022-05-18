<template>
  <div class="grid">
		<div class="col-12">
			<div class="card">
                <Toast/>
                <Message ref="message" severity="error" :closable="true" v-if="errors.length">{{errors}}</Message>

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
                    <Column field="salesman_code" header="Salesman Kode" :sortable="true">
                        <template #body="slotProps">
                            {{slotProps.data.salesman_code}}
                        </template>
                    </Column>
                    <Column field="salesman_name" header="Salesman Nama">
                        <template #body="slotProps">
                            {{slotProps.data.salesman_name}}
                        </template>
                    </Column>
                    <Column field="salesman_parent_code" header="Salesman Parent">
                        <template #body="slotProps">
                            {{slotProps.data.salesman_parent_code}}
                        </template>
                    </Column>
                    <Column field="supervisor_code" header="Supervisor Kode">
                        <template #body="slotProps">
                            {{slotProps.data.supervisor_code}}
                        </template>
                    </Column>
                    <Column field="supervisor_name" header="Supervisor Nama">
                        <template #body="slotProps">
                            {{slotProps.data.supervisor_name}}
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
            loadingExcel: false,
            loadingCsv: false,

            //datatables
            data: null,
            dataTable: null,
            rows: null,
            search: null,
            offset: null,
            field: null,
            sort: null,
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
    },
	methods: {
        // DATATABLE
		getDataTable(){
			
			this.loading=true;

			this.axios({
                method: 'GET',
                url: process.env.VUE_APP_ROOT_API + 'web/salesman',
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
                url: process.env.VUE_APP_ROOT_API + 'web/salesman/export-excel-csv/download',
            	responseType: 'blob',
                params: {
                    "ext" : ext,
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