<script lang="ts">
    import { DbxIndexEntry, FileType } from "./dbx_classes";

    import Image from "./Image.svelte";
    import LivePhoto from "./LivePhoto.svelte";

    export let ACCESS_TOKEN: string;
    export let event_contents: DbxIndexEntry[] = [];
    export let event_index: number;
</script>

<div>
    <h2 class="timestamps">{event_contents[0].metadata.last_modified}</h2>
    {#each event_contents as element, entry_index}
        {#if element.metadata.filetype == FileType.Image}
            {#if element.live_video_metadata}
                <LivePhoto
                    ACCESS_TOKEN="{ACCESS_TOKEN}"
                    image_entry="{element}"
                    default_data="./placeholder.png"
                    event_index="{event_index}"
                    entry_index="{entry_index}"
                />
            {:else}
                <Image
                    ACCESS_TOKEN="{ACCESS_TOKEN}"
                    image_entry="{element}"
                    default_data="./placeholder.png"
                    event_index="{event_index}"
                    entry_index="{entry_index}"
                />
            {/if}
        {:else}
            <img src="placeholder.png" alt="placeholder" />
        {/if}
    {/each}
</div>

<style>
    div {
        text-align: left;
    }
    h2.timestamps {
        color: #7cb0e0;
    }
</style>
