<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

    onMount(()=>{
            if(browser){
                    const token = localStorage.getItem("auth_token") ?? ""
                    if(token===""){
                            goto("/")
                        }
                }
        })
</script>

<h1>Welcome to your console boiii</h1>
