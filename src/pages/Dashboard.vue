<template>
	<div class="grid">
		<div class="col-12 lg:col-12 xl:col-12">
			<div class="surface-section px-4 py-8 md:px-6 lg:px-8">
				<div class="text-700 text-center">
					<div class="text-blue-600 font-bold mb-3">&nbsp;SELAMAT DATANG DI</div>
					<div class="text-900 font-bold text-5xl mb-3">Web Report - {{appsName}}</div>
				</div>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div class="card ">
				<h5>Chart</h5>
				<ExampleChart/>
			</div>
		</div>
	</div>
</template>

<script>
import ExampleChart from '../components/dashboard/ExampleChart.vue';

export default {
	components: {
		'ExampleChart': ExampleChart,
	},
	data() {
		return {		
			appsName: process.env.VUE_APP_APPS_NAME,
		}
	},
}
</script>
