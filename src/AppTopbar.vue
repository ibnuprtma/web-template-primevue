<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" />
			<span> {{ appsName }} </span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li v-show="user">
				<h5 class="mt-2 pt-1"> {{ user ? 'Hi,' + user.name : ''}}</h5>
			</li>
			<li>
				<a @click="logout" class="p-link layout-topbar-button">
					<i class="pi pi-sign-out"></i>
					<span>Logout</span>
				</a>
			</li>
		</ul>
	</div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";

export default {
	data() {
		return {		
			appsName: process.env.VUE_APP_APPS_NAME,
		}
	},
	mounted() {
		if (localStorage.getItem("authToken")) {
			this.getUserData();
		}
	},
	computed: {
		...mapGetters("auth", ["user"]),
		
		darkTheme() {
			return this.$appState.darkTheme;
		},
	},
    methods: {
		...mapActions("auth", ["sendLogoutRequest", "getUserData"]),

		logout() {
			this.sendLogoutRequest();
			this.$router.push("/login");
    	},

        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },

		onTopbarMenuToggle(event) {
            this.$emit('topbar-menu-toggle', event);
        },
		
		topbarImage() {
			return this.$appState.darkTheme ?  'favicon.png' : 'favicon.png';
		},
    },
}
</script>