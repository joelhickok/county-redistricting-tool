<script>
    import {planMeta} from '$lib/masterStore.svelte.js'

    let dateFormat = 'MM/dd/yyyy h:mm a'

</script>

{#if planMeta.value}
   <div class="mt-3">
       <div class="row">
           <div class="col-sm col-md-5 col-lg-6">
               <strong>Proposal Name</strong><br>
               (required)
           </div>
           <div class="col-sm col-md-7 col-lg-6">
               <input class="form-control form-control-sm bg-white"
                      class:is-invalid={!planMeta.value.name}
                      bind:value={planMeta.value.name}
                      placeholder="Enter your proposal name"/>
               <!--{#if !$planMeta.name}-->
               <!--                    <div class="text-danger small">-->
               <!--                        Please name your proposal.-->
               <!--                    </div>-->
               <!--                {/if}-->
           </div>
       </div>

       <div class="row mt-3">
           <div class="col-sm col-md-5 col-lg-6">
               <strong>Proposal Description</strong><br>
               (recommended)
           </div>
           <div class="col-sm col-md-7 col-lg-6">
                <textarea rows="4" class="form-control form-control-sm bg-white"
                          bind:value={planMeta.value.description}
                          placeholder="Describe your proposal..."></textarea>
           </div>
       </div>

   </div>
{/if}
