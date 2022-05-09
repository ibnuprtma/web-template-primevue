<template>
    <Chart type="pie" :data="chartExample" :options="options"/>
    <Dialog :header="labelDialog" v-model:visible="display" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" :modal="true">
            <Message ref="message" severity="error" :closable="true" v-if="errors.length">{{errors}}</Message>
            <DataTable :value="dataTable" responsiveLayout="scroll" :loading="loading" dataKey="id" >
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Data</h5>
                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="search" placeholder="Search..." @keyup="getDataTable" />
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
    </Dialog>
</template>

<script>

import { mapGetters } from "vuex";

export default {
    data() {
        return {
			display: null,
			labelDialog:null,

            // loading
            loading: false,

            //datatables
            data: null,
            dataTable: null,
            rows: null,
            search: null,
            offset: null,
            totalItemsCount: 0,

            chartExample: {
                labels: ['User Active','User Inactive'],
                datasets: [
                    {
                        data: [300, 50],
                        backgroundColor: ["#42A5F5","#66BB6A"],
                        hoverBackgroundColor: ["#64B5F6","#81C784"]
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    },
                },
				onClick: (evt, item) => {
					let index = item[0].index;

					this.labelDialog = evt.chart.config.data.labels[index]; 
					this.display = true;
					this.getDataTable();
				}
            }
        }
    },
	mounted() {
        this.$store.commit("setErrors", {});
	},
    computed:{
        ...mapGetters(["errors"])
    },
    watch: {
        offset() {
            this.getDataTable();
        },
        rows() {
            this.getDataTable();
        },
    },
	methods: {
		getDataTable() {
			this.loading=true;

			this.axios({
                method: 'GET',
                url: process.env.VUE_APP_ROOT_API + 'salesman',
                params: {
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
	},
}
</script>