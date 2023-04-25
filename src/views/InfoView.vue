<template>
    <div class="justify-center align-center">
        <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-toolbar-title>个人信息</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-container>
            <v-row
                justify="center"
            >
                <v-col
                    cols="12"
                    lg="6"
                    md="6"
                >
                    <v-card>
                        <v-list three-line>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>用户ID</v-list-item-title>
                                    <v-list-item-subtitle>{{$store.state.userid}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <template v-slot:default="{ active }">
                                    <v-list-item-content>
                                        <v-list-item-title>用户名</v-list-item-title>
                                        <v-list-item-subtitle>{{ $store.state.username }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-btn :input-value="active" icon>
                                            <v-icon>mdi-text-box-edit-outline</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card>   
                </v-col>
            </v-row>
        </v-container>
        
        
    </div>
</template>

<script>
export default {
    name: "InfoView",
    data: () => ({
        userid: ''
    }),
    mounted() {
        this.userid = this.$route.params.id
    }

}

</script>