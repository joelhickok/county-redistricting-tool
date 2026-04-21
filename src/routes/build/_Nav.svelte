<script>
    import {page,} from '$app/stores'
    import {base} from '$app/paths'

</script>

<ul class="nav nav-tabs card-header-tabs" style="font-size: 11pt;">
    <li class="nav-item">
        <a class="nav-link"
           class:active={$page.url.pathname === 'build'}
           href="{base}/build"
        >
            Proposal Info
        </a>
    </li>

    <li class="nav-item">
        <a class="nav-link"
           class:active={$page.url.pathname.includes('overview')}
           href="{base}/build/overview"
        >
            Overview
        </a>
    </li>

    <li class="nav-item">
        <a class="nav-link"
           class:active={$page.url.pathname.includes('detail')}
           href="{base}/build/detail"
        >
            Detail
        </a>
    </li>

    <li class="nav-item">
        <a class="nav-link"
           class:active={$page.url.pathname.includes('demographics')}
           href="{base}/build/demographics"
        >
            Demographics
        </a>
    </li>
</ul>
