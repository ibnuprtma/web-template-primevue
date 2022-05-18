<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <img src="favicon.png" alt="Web Report" class="mb-5" style="width:81px;">
            </div>
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                         <p style="color: red;" v-if="errors.error">Whoops! Something went wrong. <br> These credentials do not match our records.</p>
                        <div class="text-900 text-3xl font-medium mb-3">Selamat Datang</div>
                        <span class="text-600 font-medium">Silahkan login terlebih dahulu untuk melanjutkan</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto">
                        <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
                        <InputText id="username" required="true" v-model="forms.username" type="text" class="w-full mb-3" placeholder="Username" style="padding:1rem;" :class="{'p-invalid': errors.username}"/>
                        <p style="color: red;" v-if="errors.username">{{ errors.username[0] }}</p>

                        <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password" :feedback="false" v-model="forms.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem" :class="{'p-invalid': errors.password}"></Password>
                        <p style="color: red;" v-if="errors.password">{{ errors.password[0] }}</p>
                
                        <Button label="Masuk" :loading="loading" @click="login" class="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";

export default {
    data() {
        return {
            forms: {
                username: null,
                password: null
            },
            loading: false,
        }
    },
    mounted() {
        this.$store.commit("setErrors", {});
    },
    computed: {
        ...mapGetters(["errors"])
    },
    methods: {
        ...mapActions("auth", ["sendLoginRequest"]),

        login: function() {
            this.loading = true;
            this.sendLoginRequest(this.forms)
                .then(() => {
                    this.loading = false;
                    this.$router.push({ name: "dashboard" });
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped>
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}
</style>