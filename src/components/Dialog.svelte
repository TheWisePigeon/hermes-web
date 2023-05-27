<script lang="ts">
	import { show_dialog } from '../lib/stores';
    function close_dialog(){
            show_dialog.update(()=>false)
        }
</script>

{#if $show_dialog}
	<div class="fixed inset-0 flex items-center justify-center">
		<div
			class={` w-52 h-52 transform ${ $show_dialog?'':'scale-0' } transition-all duration-300 rounded-lg shadow-lg p-4`}
		>
			<h1>You are not authenticated. Do so via the authentication form down below and get access to Hermes!</h1>
            <button on:click={close_dialog}>
                <h1>Ok</h1>
            </button>
		</div>
	</div>
{/if}
