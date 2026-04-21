<script>
    import '../styles/app.scss'
    import {detect} from 'detect-browser'
    import {onMount, onDestroy} from 'svelte'
    import Icon from 'svelte-awesome'
    import {faPlusSquare as add} from '@fortawesome/free-regular-svg-icons/faPlusSquare'
    import {faGlobe as existing} from '@fortawesome/free-solid-svg-icons/faGlobe'
    import {faUser as current} from '@fortawesome/free-solid-svg-icons/faUser'
    import {faHome as home} from '@fortawesome/free-solid-svg-icons/faHome'
    import {faQuestion as help} from '@fortawesome/free-solid-svg-icons/faQuestion'
    import {browser, building, dev, version} from '$app/environment';

    import {page,} from '$app/stores'
    import {base} from '$app/paths'
    import {goto} from '$app/navigation'
    import db from '$lib/client-database'
    import {mapState, firstTime, blockGeoJSON, planMeta} from '$lib/masterStore.svelte.js';
    import SavingOverlay from '$lib/components/SavingOverlay.svelte'
    import LeafletMap from '$lib/components/mapping/LeafletMap.svelte'
    import Chart from '$lib/components/Chart.svelte'
    import DistrictSelector from '$lib/components/DistrictSelector.svelte'
    import ModalHelp from '$lib/components/Modal.Help.svelte'


    console.log(base)
    const browserDetected = detect()

    /** @type {{children: import('svelte').Snippet}} */
    let {children} = $props();

    let loading

    let helpOpen = $derived(browser && firstTime.value)

    $effect(() => {
        (async () => {
            if (await db.exists() && planMeta.value) {
                await db.updateMeta(planMeta.value)
            }
        })()
    })

    const links = [
        {
            label: 'Home',
            href: ``,
            icon: home,
            isActive(path) {
                return path === this.href
            },
        },
        {
            label: 'Create New',
            href: `/create`,
            icon: add,
            isActive(path) {
                return path.startsWith(this.href)
            },
        },
        {
            label: 'Working Proposal',
            href: `/build`,
            icon: current,
            isActive(path) {
                return path.startsWith(this.href)
            },
        },
        {
            label: 'Existing Proposals',
            href: `/existing`,
            icon: existing,
            isActive(path) {
                return path.startsWith(this.href)
            },
        },
    ]

    onMount(async () => {
        if (!('indexedDB' in window)) {
            alert('This browser does not support  key features in this app.  Use a modern web browser.')
            return
        }

        if (browserDetected) {
            if (browserDetected.name === 'ie') {
                alert('This browser does not support  key features in this app.  Use a modern web browser.')
                return
            }
        }

        planMeta.value = await db.getMeta()

        const bootstrap = await import('bootstrap')

        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        // const tooltipList =
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })

        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
        // const dropdownList =
        dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl)
        })

        if (planMeta.value?.id && !blockGeoJSON.value.length) {
            console.log('getting old plan')
            console.log(planMeta.value?.id)
            loading = true
            blockGeoJSON.value = await db.bulkGet()
            loading = false
        }

        // if (await db.exists()) {
        // goto('/build')
        // }

        setTimeout(() => {
            document.getElementById('mapEl').focus()
        }, 300)

        // interval = setInterval(() => {
        //     document.getElementById('mapEl').focus()
        // }, 5000)
    })

    onDestroy(() => {
        // clearInterval(interval)
    })
</script>

<svelte:head>
    <title>2021 Redistricting</title>
</svelte:head>

<!--<SlideOver/>-->

<SavingOverlay/>

{#if helpOpen}
    <ModalHelp bind:open={helpOpen}>
        <div slot="title">
            Introduction and Help
        </div>
        <div>

        </div>
    </ModalHelp>
{/if}

<div class="row h-100">

    <div class="col-5 h-100 d-flex flex-column">

        <div class="btn-group w-100 mb-2">
            {#each links as link}
                <a href="{base}{link.href}"
                   class="btn btn-primary" aria-current="page"
                   class:active={link.isActive($page.url.pathname)}
                >
                    <Icon data={link.icon} scale="1.2"/>
                    <br>
                    {link.label}
                </a>
            {/each}
            <button on:click={() => firstTime.value = true}
                    class="btn btn-primary" aria-current="page"
            >
                <Icon data={help} scale="1.2"/>
                <br>
                Help
            </button>
        </div>

        <div class="card h-100 flex-grow-1 d-flex flex-column overflow-hidden pb-1">
            {@render children()}
            <!--            <pre>{JSON.stringify(browserDetected, null, 2)}</pre>-->
        </div>

    </div>

    <div class="col-7 h-100 d-flex flex-column">

        <div class="flex-shrink-1 bg-white">
            <DistrictSelector/>
        </div>

        <div id="mapWrapper"
             class="flex-grow-1" style="min-height: 200px;"
             class:working={mapState.working}
        >
            <LeafletMap/>
        </div>

        <div style="height: 220px;"
             class="d-flex flex-column flex-shrink-1 overflow-hidden">
            <Chart/>
        </div>

    </div>

</div>

<!--<style global lang="scss">-->
<!--  @import 'src/styles/app.scss';-->

<!--</style>-->
