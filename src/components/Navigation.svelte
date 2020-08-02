<script lang="ts">
	let label: string = 'Hello, world!'
</script>

<nav>{label}</nav>

<style lang="scss">
	@import 'styles/_sassy';

	nav {
		@include flex(row);
		width: 100%;
	}
</style>
