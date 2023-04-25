<template>
  <div>
    <v-toolbar flat>
      <v-spacer></v-spacer>
      <v-toolbar-title>最新上传</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-container>
      <v-row
        align="center"
        justify="center"
        v-for="m in 4"
        :key="m"
      >
        <v-col
          align-self="center"
          v-for="n in 4"
          :key="n"
          cols="12"
          md="6"
          lg="3"
        >
          <v-card v-if="(m-1)*4+n <= curPage.length">
            <v-img aspect-ratio="1.7778" alt="封面图片" :src="`http://47.94.44.160:3000/static/imgFiles/${curPage[(m-1)*4+n-1].img}`"></v-img>
            <v-card-title >
              <div class="text-truncate" style="height: auto">
                {{curPage[(m-1)*4+n-1].name}}
              </div>
            </v-card-title>
            <v-card-actions>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon @click="view((m-1)*4+n-1)" v-bind="attrs" v-on="on"> 
                            <v-icon color="green darken-2">mdi-file-find</v-icon>
                        </v-btn>
                    </template>
                    <span>查看3D模型</span>
                </v-tooltip>
                <v-tooltip bottom >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn :disabled="!$store.state.login" v-if="(!curPage[(m-1)*4+n-1]._id in $store.state.favorites_ids) || !$store.state.favorites_ids[curPage[(m-1)*4+n-1]._id]" icon @click="setFavorite((m-1)*4+n-1)" v-bind="attrs" v-on="on"> 
                            <v-icon color="red darken-2" >mdi-heart-plus-outline</v-icon>
                        </v-btn>
                        <v-btn :disabled="!$store.state.login" v-else icon @click="removeFavorite((m-1)*4+n-1)" v-bind="attrs" v-on="on"> 
                            <v-icon color="red darken-2" >mdi-heart-remove</v-icon>
                        </v-btn>
                    </template>
                    <span v-if="(!curPage[(m-1)*4+n-1]._id in $store.state.favorites_ids) || !$store.state.favorites_ids[curPage[(m-1)*4+n-1]._id]">收藏</span>
                    <span v-else>取消收藏</span>
                </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-pagination
      v-model="page"
      :length="Math.ceil(total/16)"
      @next="pageChange"
      @previous="pageChange"
      @input="pageChange"
    ></v-pagination>
  </div>
</template>

<script>
import axios from "axios"
export default {
    name: "HomeView",
    data: () => ({
      page: 1,
      total: 0,
      curPage: [],
    }),
    methods: {
      view(index) {
        console.log(`view ${index}`)
        console.log(this.curPage[index])
        this.$router.push(`/viewer/${this.curPage[index]._id}`)
      },
      async pageChange() {
        const response = await axios.get(`${process.env.VUE_APP_BASE_API}/projects`, {
          params: {
            page: this.page,
            pageSize: 16
          }
        });
        this.total = response.data.total;
        this.curPage = response.data.projects;
      },
      async setFavorite(index) {
        try {
          await axios.post(`${process.env.VUE_APP_BASE_API}/setFavorite`, {
            userId: this.$store.state.userid,
            projectId: this.curPage[index]._id
          })
          this.$store.state.favorites.push(this.curPage[index])
          // this.$store.state.favorites_ids[this.curPage[index]._id] = true;
          this.$set(this.$store.state.favorites_ids, this.curPage[index]._id, true);
        } catch (error) {
          console.error(error)
        }
      },
      async removeFavorite(index) {
        try {
          await axios.delete(`${process.env.VUE_APP_BASE_API}/removeFavorite`, {
              data: {
                  userId: this.$store.state.userid,
                  projectId: this.curPage[index]._id
              }
          });
          
          this.$store.state.favorites = this.$store.state.favorites.filter(p => p._id !== this.curPage[index]._id);
          // this.$store.state.favorites_ids[this.curPage[index]._id] = false;
          this.$set(this.$store.state.favorites_ids, this.curPage[index]._id, false);
        } catch (err) {
            console.error(err)
        }
      }
    },
    async mounted() {
      this.$store.state.userid = localStorage.getItem("id");

      const response = await axios.get(`${process.env.VUE_APP_BASE_API}/projects`, {
        params: {
          page: this.page,
          pageSize: 16
        }
      });
      this.total = response.data.total;
      this.curPage = response.data.projects;
    },
}

</script>