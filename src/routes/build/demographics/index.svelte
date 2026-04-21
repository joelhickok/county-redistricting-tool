<script>
    import {summaryStatistics,} from '$lib/masterStore.svelte'
</script>

<div class="position-relative flex-grow-1 h-100 d-flex flex-column overflow-x-hidden overflow-y-auto">

    <div class="flex-grow-1 d-flex flex-column">

        <table class="table table-sm table-bordered">

            <thead>
            <tr>
                <td></td>
                {#each [1, 2, 3, 4, 5] as key}
                    <th class="secondary-{key} text-secondary-{key}">
                        Dist. {key}
                    </th>
                {/each}
            </tr>
            </thead>

            <tbody>
            <tr>
                <th class="text-right align-middle">Population</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].population}<br>
<!--                        <b>{summaryStatistics.value[key].IncorporatedTotalPerc}%</b>-->
                    </td>
                {/each}
            </tr>
            <tr style="border-bottom: 2px dashed darkgrey !important;">
                <th class="text-right align-middle">Incorporated</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].IncorporatedTotal}<br>
                        <b>{summaryStatistics.value[key].IncorporatedTotalPerc}%</b>
                    </td>
                {/each}
            </tr>
            <tr>
                <th class="text-right align-middle">Voting Age 18+</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].votingAge}<br>
                        <b>{summaryStatistics.value[key].votingAgePerc}%</b>
                    </td>
                {/each}
            </tr>
            <tr>
                <th class="text-right align-middle">Hispanic</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].hispanic}<br>
                        <b>{summaryStatistics.value[key].hispanicPerc}%</b>
                    </td>
                {/each}
            </tr>
            <tr>
                <th class="text-right align-middle">White</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].whiteOnly}<br>
                        <b>{summaryStatistics.value[key].whiteOnlyPerc}%</b>
                    </td>
                {/each}
            </tr>
            <tr>
                <th class="text-right align-middle">Black</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].black}<br>
                        <b>{summaryStatistics.value[key].blackPerc}%</b>
                    </td>
                {/each}
            </tr>
            <tr>
                <th class="text-right align-middle">Native American</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].indian}<br>
                        <b>{summaryStatistics.value[key].indianPerc}%</b>
                    </td>
                {/each}
            </tr>
            <tr>
                <th class="text-right align-middle">Asian</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].asian}<br>
                        <b>{summaryStatistics.value[key].asianPerc}%</b>
                    </td>
                {/each}
            </tr>
            <tr>
                <th class="text-right align-middle">Islander</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].islander}<br>
                        <b>{summaryStatistics.value[key].islanderPerc}%</b>
                    </td>
                {/each}
            </tr>
            <tr>
                <th class="text-right align-middle">Other</th>
                {#each [1, 2, 3, 4, 5] as key}
                    <td class="body-{key} text-{key}">
                        {summaryStatistics.value[key].other}<br>
                        <b>{summaryStatistics.value[key].otherPerc}%</b>
                    </td>
                {/each}
            </tr>
            </tbody>

        </table>

        <div class="alert alert-warning text-center">
            All demographics are based on voting age population, except Incorporated.
        </div>
    </div>

</div>

<slot/>

<style>
    tr > th, td {
        text-align: center;
    }

    th:first-child {
        max-width: 85px;
        text-align: right;
        padding-right: 10px;
    }
</style>
