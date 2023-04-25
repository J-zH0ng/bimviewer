<template>
    <div>
        <v-alert
            :value="alert"
            type="error"
            dismissible
            @input="alert = false"
        >
            项目可能已经被作者删除，如有需要请联系作者
        </v-alert>
        <v-toolbar flat>
            <v-toolbar-title>{{projectName}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom class="mr-6">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="downloadProject" v-bind="attrs" v-on="on"> 
                        <v-icon>mdi-file-download-outline</v-icon>
                    </v-btn>
                </template>
                <span>下载工程文件</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="downloadGltf" v-bind="attrs" v-on="on"> 
                        <v-icon>mdi-cube-outline</v-icon>
                    </v-btn>
                </template>
                <span>下载gltf文件</span>
            </v-tooltip>
        </v-toolbar>
        <div id="scene-container"></div>
        
    </div>
</template>
  
<script>
    import axios from 'axios';
    import { World } from '../World/World';

    async function main(path) {
        // Get a reference to the container element
        const container = document.querySelector('#scene-container');

        // create a new world
        const world = new World(container);
    
        

        // complete async tasks
        await world.init(path);
    
        // start the animation loop
        world.start();
    }
    
    export default {
        name: "ViewerView",
        data: () => ({
            projectName: "",
            projectFile: "",
            projectGltf: "",
            alert: false
        }),
        async mounted() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BASE_API}/project`, {
                    params: {
                        id: this.$route.params.id
                    }
                });
                this.projectFile = response.data.file;
                this.projectGltf = response.data.gltf;
                this.projectName = response.data.name;

                const path =  `http://47.94.44.160:3000/static/gltfFiles/${this.projectGltf}`;

                console.log(path);

                main(path)
            } catch (error) {
                console.error(error);
                this.alert = true;
            }
            
        },
        methods: {
            downloadProject() {
                fetch(`http://47.94.44.160:3000/static/projectFiles/${this.projectFile}`)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    const parts = this.projectFile.split('.');
                    const extension = parts[parts.length - 1];
                    a.download = `${this.projectName}.${extension}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('下载文件时发生错误', error));
            },
            downloadGltf() {
                fetch(`http://47.94.44.160:3000/static/gltfFiles/${this.projectGltf}`)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    const parts = this.projectGltf.split('.');
                    const extension = parts[parts.length - 1];
                    a.download = `${this.projectName}.${extension}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('下载文件时发生错误', error));
            }
        }
    }
    
    
</script>

<style scoped>
#scene-container {
    /* tell our scene container to take up the full page */
    position: absolute;
    width: 100%;
    height: 100%;

    /*
        Set the container's background color to the same as the scene's
        background to prevent flashing on load
    */
    background-color: skyblue;
}
</style>