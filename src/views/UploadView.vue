<template>
    <div>
        <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-toolbar-title>上传</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-form
            v-model="valid" 
            ref="form"
        >
            <v-container>
                <v-row
                    justify="center"
                >
                    <v-col
                        cols="6"
                        align="center"
                    >
                        <v-text-field v-model="projectName" label="项目名称" :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row
                    justify="center"    
                >
                    <v-col
                        cols="6"
                        align="center"
                    >
                        <v-file-input v-model="projectFile" label="选择项目文件" :rules="nameRules"></v-file-input>
                    </v-col>
                </v-row>
                <v-row
                    justify="center"
                >
                    <v-col
                        cols="6"
                        align="center"
                    >
                        <v-file-input v-model="gltfFile" label="选择gltf文件" :rules="nameRules"></v-file-input>
                    </v-col>
                </v-row>
                <v-row
                    justify="center"
                >
                    <v-col
                        cols="6"
                        align="center"
                    >
                        <v-file-input v-model="imgFile" label="选择封面图片" :rules="nameRules"></v-file-input>
                    </v-col>
                </v-row>
                <v-row
                    justify="center"
                >
                    <v-col
                        cols="6"
                        align="center"
                    >
                        <v-btn @click="submit" :disabled="!$store.state.login">提交</v-btn>
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

    export default {
        name: "UploadView",
        data: () => ({
            projectName: "",
            nameRules: [
                v => !!v || '项目名是必须的',
            ],
            projectFile: null,
            gltfFile: null,
            imgFile: null,
            valid: false,
            snackbar: false,
            text: "",
            uploaded: false
        }),
        methods: {
            submit() {
                if (this.uploaded) {
                    this.text = "请刷新页面后重新上传";
                    this.snackbar = true;
                    return;
                }
                if (this.$refs.form.validate()) {
                    const formData1 = new FormData()
                    const formData2 = new FormData()
                    const formData3 = new FormData()
                    formData1.append('file', this.projectFile)
                    formData2.append('file', this.gltfFile)
                    formData3.append('file', this.imgFile)
                    const upload1 = axios.post(`${process.env.VUE_APP_BASE_API}/uploadProjectFile`, formData1)
                    const upload2 = axios.post(`${process.env.VUE_APP_BASE_API}/uploadGltfFile`, formData2)
                    const upload3 = axios.post(`${process.env.VUE_APP_BASE_API}/uploadImgFile`, formData3)
                    Promise.all([upload1, upload2, upload3]).then(responses => {
                        const file = responses[0].data.filename;
                        const gltf = responses[1].data.filename;
                        const img = responses[2].data.filename;
                        axios.post(`${process.env.VUE_APP_BASE_API}/addNewProject`, {
                            userid: this.$store.state.userid,
                            name: this.projectName,
                            file,
                            gltf,
                            img,
                        })
                        .then(response => {
                            console.log(response.data);
                            this.text = response.data;
                            this.snackbar = true;
                            this.uploaded = true
                        })
                        .catch(error => {
                            console.error(error);
                        })
                    }).catch(error => {
                        console.log(error);
                    })

                }
            }
        },
    }
</script>