<script>
    export let titleFontSize = 12
    export let statFontSize = 12
</script>

<div class="text-center d-flex align-items-center">
    <div style="font-size: {titleFontSize}pt !important;">
        <slot name="title"></slot>
    </div>
    <div style="font-size: {statFontSize}pt !important;">
        <slot></slot>
    </div>
</div>

<style>
    /*.stat:not(:last-child) {*/
    /*    border-right: 1px dashed ghostwhite;*/
    /*}*/
</style>
