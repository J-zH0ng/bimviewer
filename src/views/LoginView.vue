<template>
  <div>
    <v-toolbar flat>
      <v-spacer></v-spacer>
      <v-toolbar-title>登录注册</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-form v-model="valid" ref="form">
      <v-container>
        <v-row
          justify="center"
        >
          <v-col
            cols="12"
            md="6"
            lg="4"
          >
            <v-text-field
              v-model="name"
              :rules="nameRules"
              :counter="10"
              label="姓名"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row
          justify="center"
        >
          <v-col
            cols="12"
            md="6"
            lg="4"
          >
            <v-text-field
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              label="密码"
              hint="最少8个字符"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row
          justify="center"
          
        >
          <v-col
            align="center"
            cols="6"
            lg="3"
          >
            <div class="d-flex justify-space-between">
              <v-btn @click="login">登录</v-btn>
              <v-btn @click="register">注册</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-snackbar
      v-model="snackbar"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios"
// @ is an alias to /src
export default {
  name: 'LoginView',
  data: () => ({
    valid: false,
    name: '',
    nameRules: [
      v => !!v || '用户名是必须的',
      v => v.length <= 10 || '用户名长度必须小于10',
    ],
    password: '',
    passwordRules: [
      v => !!v || '密码是必须的',
      v => v.length >= 8 || '密码长度必须>=8',
    ],
    showPassword: false,
    text: "",
    snackbar: false,
    registed: false
  }),
  methods: {
    login() {
      if (this.$refs.form.validate() && !this.$store.state.login) {
        axios.post(`${process.env.VUE_APP_BASE_API}/login`, { username: this.name, password: this.password })
        .then(response => {
          console.log(response.data);
          let { message, data } = response.data;
          this.$store.state.userid = data;
          this.$store.state.username = this.name;
          this.$store.state.login = true;

          axios.get(`${process.env.VUE_APP_BASE_API}/favorites`, {
            params: {
              userid: this.$store.state.userid,
            }
          }).then(res => {
            this.$store.state.favorites = res.data.favorites;
            for (let p of res.data.favorites) {
              // this.$store.favorites_ids[p._id] = true;
              this.$set(this.$store.state.favorites_ids, p._id, true);
            }
            localStorage.setItem("name", this.name);
            localStorage.setItem("id", data);
            this.text = message;
            this.snackbar = true;
            this.$router.push('/');
          })
        })
        .catch(error => {
          console.error(error.response.data);
          this.text = error.response.data;
          this.snackbar = true;
        });
      }
    },
    register() {
      if (this.$refs.form.validate() && !this.registed) {
        axios.post(`${process.env.VUE_APP_BASE_API}/register`, { username: this.name, password: this.password })
        .then(response => {
          console.log(response.data);
          this.text = response.data;
          this.snackbar = true;
          this.registed = true;
        })
        .catch(error => {
          console.error(error.response.data);
          this.text = error.response.data;
          this.snackbar = true;
        });
      }
    }
  }
}
</script>
