<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      
    >
      <v-toolbar-title @click="toHome" style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif ">BIMViewer</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn class="mr-4" @click="toUpload" :disabled="!$store.state.login">上传</v-btn>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer app
      temporary
      right
      v-model="drawer"
      
    >
      <v-banner>
        <v-avatar class="mr-4" color="#D5D647" v-if="$store.state.login">
          <span class="white--text headline">{{$store.state.username.slice(0,1)}}</span>
        </v-avatar>
        {{$store.state.login ? $store.state.username : "未登录"}}
      </v-banner>
      <v-list v-if="$store.state.login">
        <v-list-item
          link
        ><v-list-item-content>
            <v-list-item-title @click="toInfo">修改信息</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
        ><v-list-item-content>
            <v-list-item-title @click="toUploaded">已上传</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
        ><v-list-item-content>
            <v-list-item-title @click="toFavorites">收藏</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4 my-8">
          <v-btn block @click="loginOrLogout">{{ $store.state.login ? "退出登录" : "登录" }}</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    drawer: false,
  }),

  async mounted() {
    let username = localStorage.getItem("name");
    let userid = localStorage.getItem("id");
    if(username !== null && userid !== null) {
      this.$store.state.username = username;
      this.$store.state.userid = userid
      this.$store.state.login = true;
    }
    if(this.$store.state.login) {
      const response = await axios.get(`${process.env.VUE_APP_BASE_API}/favorites`, {
        params: {
          userid: this.$store.state.userid,
        }
      });
      this.$store.state.favorites = response.data.favorites;
      for (let p of response.data.favorites) {
        // this.$store.state.favorites_ids[p._id] = true;
        this.$set(this.$store.state.favorites_ids, p._id, true);
      }
    }
  },

  methods: {
    toHome() {
      this.$router.push('/')
    },
    toInfo() {
      this.$router.push(`/info`)
    },
    toUploaded() {
      this.$router.push(`/uploaded`)
    },
    loginOrLogout() {
      if (this.$store.state.login) {
        localStorage.clear()
        this.$store.state.login = false
        this.$store.state.username = ""
        this.$store.state.userid = ""
        this.$store.state.favorites = []
        this.$store.state.favorites_ids = {}
      } 
      else {
        this.$router.push("/login")
      }
    },
    toUpload() {
      this.$router.push(`/upload`)
    },
    toViewer() {
      this.$router.push(`/viewer`)
    },
    toFavorites() {
      this.$router.push('/favorites')
    }
  }
};
</script>
