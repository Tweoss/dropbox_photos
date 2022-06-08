<script lang="ts">
    export let ACCESS_TOKEN: string;
    import { DbxIndex, DbxImage, FileType } from "./dbx_classes";
    import Image from "./Image.svelte";

    // array of events
    // events are arrays of file names, data, and timestamps
    let image_datas: ([string, string, string] | null)[][] = [];
    let index = new DbxIndex(ACCESS_TOKEN);
    // build index
    index.build_index().then(() => {
        // collapse video and images for live photos
        index.collapse_index();
        let event_array = index.get_sorted_event_array();
        // make image_datas have arrays that are the same length as the event_array
        image_datas = [...event_array.map((event) => Array(event.length))];
        // fetch and place the image thumbnail data into image_datas
        event_array.forEach((event, i) => {
            event.forEach(([name, time], j) => {
                const entry = index.entries.get(name);
                if (entry.metadata.filetype === FileType.Image) {
                    const image = new DbxImage(entry.metadata.path);
                    image.loadThumbnail(ACCESS_TOKEN).then((data: string) => {
                        image_datas[i][j] = [entry.metadata.name, data, time];
                        // image_datas = image_datas;
                    });
                } else {
                    // handle videos
                    alert("HANDLE VIDEOS HERE");
                }
            });
        });
        console.log(image_datas);
    });
</script>

<main>
    <h1>Hello {ACCESS_TOKEN}!</h1>
    {#each image_datas as event}
        {#if event[0] != null}
            <h2>{event[0][2]}</h2>
        {/if}
        {#each event as element}
            {#if element}
                <img alt="{element[0]}" src="{element[1]}" />
            {:else}
                <img src="placeholder.png" alt="placeholder" />
                <!-- {#if index.entries.entries().next().value}
                    <h1>Test</h1>
                    <Image
                        image_entry="{index.entries.entries().next().value[1]}"
                        default_data="./placeholder.png"
                    />
                {/if} -->
            {/if}
        {/each}
    {/each}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
