<script lang="ts">
	import { show_create_app_modal } from '../../lib/stores';
</script>

{#if $show_create_app_modal}
	<div class="fixed inset-0 flex items-center justify-center">
		<div class=" w-52 h-52" >
            <h1>Test</h1>
        </div>
	</div>
{/if}
