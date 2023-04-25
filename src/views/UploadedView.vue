<template>
    <div>
        <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-toolbar-title>{{$store.state.username}} 的作品</v-toolbar-title>
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
                        <v-card-title>
                            <div class="text-truncate" style="height: auto">
                                {{curPage[(m-1)*4+n-1].name}}
                            </div>
                        </v-card-title>
                        <v-card-actions>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon @click="deleteProject((m-1)*4+n-1)" v-bind="attrs" v-on="on">
                                        <v-icon color="green darken-2">mdi-file-document-remove</v-icon>
                                    </v-btn>
                                </template>
                                <span>删除此项目</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon @click="view((m-1)*4+n-1)" v-bind="attrs" v-on="on"> 
                                        <v-icon color="green darken-2">mdi-file-find</v-icon>
                                    </v-btn>
                                </template>
                                <span>查看3D模型</span>
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
import axios from 'axios';

export default {
    name: "UploadedView",
    data: () => ({
        page: 1,
        total: 0,
        projects: [],
        curPage: [],

        snackbar: false,
        text: ""
    }),
    async mounted() {
        this.$store.state.userid = localStorage.getItem("id");
        const response = await axios.get(`${process.env.VUE_APP_BASE_API}/uploaded`, {
            params: {
                userid: this.$store.state.userid,
            }
        });
        this.projects = response.data.projects;
        this.total = response.data.projects.length;
        this.curPage = this.projects.slice(0, 16);
    },
    methods: {
        async deleteProject(index) {
            console.log(`delete ${index}`)
            console.log(this.curPage[index])
            try {
                const response = await axios.delete(`${process.env.VUE_APP_BASE_API}/delete`, {
                    data: {
                        userId: this.$store.state.userid,
                        projectId: this.curPage[index]._id
                    }
                });
                this.text = response.data;
                this.snackbar = true;

                const getResponse = await axios.get(`${process.env.VUE_APP_BASE_API}/uploaded`, {
                    params: {
                        userid: this.$store.state.userid,
                    }   
                });
                console.log(getResponse.data);
                this.projects = getResponse.data.projects;
                this.total = getResponse.data.projects.length;
                this.page = 1;
                this.curPage = this.projects.slice(0, 16);
            } catch (err) {
                console.error(err)
            }

            
        },
        pageChange() {
            this.curPage = this.projects.slice((this.page - 1) * 16, this.page * 16)
        },
        view(index) {
            console.log(`view ${index}`)
            console.log(this.curPage[index])
            this.$router.push(`/viewer/${this.curPage[index]._id}`)
        }
    }

}

</script>