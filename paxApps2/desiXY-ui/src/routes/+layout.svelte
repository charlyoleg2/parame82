<script lang="ts">
	import { strDesiNames, repoToHomepage } from '$lib/general';
	import { base } from '$app/paths';
	import { version_details } from 'geometrix';
	import desiPackage from '../../package.json';
	import topPackage from '../../../../package.json';
	import versionJson from '$lib/versions.json';

	const detailed_versions = version_details(desiPackage);
	const desiNames = strDesiNames(topPackage.paxApps.libs);
	const versionNames = Object.keys(versionJson);
	type tVersions = Record<string, string>;
	const versionJson2 = versionJson as tVersions;
</script>

<header>
	<h1>Welcome to DesiXY-UI for {desiNames}</h1>
	<h6>
		Display the designs of <a href={topPackage.homepage}>{topPackage.name}</a>
		powered by the framework
		<a href="https://charlyoleg2.github.io/parametrix/">parametrix</a>.
	</h6>
	<nav>
		<a href="{base}/">index: list of designs</a>
	</nav>
</header>
<main>
	<slot />
</main>
<footer>
	<article>
		<h3>{topPackage.name}</h3>
		<code>
			<a href={repoToHomepage(topPackage.repository.url)}>{topPackage.name}</a> version {topPackage.version}<br
			/>
			{#each versionNames as oneN}
				{oneN} : {versionJson2[oneN]}<br />
			{/each}
		</code>
	</article>
	<article>
		<h3>desiXY-ui</h3>
		<a href="https://github.com/charlyoleg2/parame_paxApps">desiXY-ui</a>, the generic User
		Inteface built with
		<a href="https://www.npmjs.com/package/geometrix">geometrix</a> and
		<a href="https://www.npmjs.com/package/geomui">geomui</a>.<br />
		<code>
			{#each detailed_versions as dversion}
				{dversion}<br />
			{/each}
		</code>
	</article>
</footer>

<style lang="scss">
	@use '$lib/gen_colors.scss';

	:global(body) {
		font-family: 'Lucida Console', 'Monaco', 'Verdana';
		margin: 0;
		padding: 0;
		background-color: gen_colors.$colorBg;
	}
	h1 {
		color: gen_colors.$colorTitle;
		margin: 1rem;
		margin-bottom: 0.2rem;
	}
	h3 {
		margin: 1rem;
		margin-bottom: 0.2rem;
	}
	h6 {
		margin: 1rem;
		margin-top: 0.2rem;
	}
	nav {
		margin: 1rem;
	}
	nav > a {
		display: inline-block;
		color: black;
		background-color: GhostWhite;
		text-decoration: none;
		padding-left: 0.3rem;
		padding-right: 0.3rem;
		border-style: solid;
		border-width: 0.2rem;
		border-radius: 0.6rem;
		border-color: Brown;
		margin-top: 0.1rem;
		margin-left: 0.1rem;
	}
	nav > a:hover {
		background-color: yellow;
	}
	main {
		background-color: GhostWhite;
		min-height: 70vh;
		padding-top: 2rem;
		padding-bottom: 3rem;
	}
	footer {
		margin: 1rem;
		margin-top: 5rem;
		margin-bottom: 5rem;
		background-color: var(--colorBg2);
	}
</style>
