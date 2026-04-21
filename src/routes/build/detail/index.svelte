<script>
    import {goto} from '$app/navigation'
    import {base} from '$app/paths'

    goto(`${base}/build/detail/0`)
</script>

<div class="h-100 p-5 m-5">

    <slot/>

</div>
