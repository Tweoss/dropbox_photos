<script lang="ts">
    import { DbxIndexEntry, FileType } from "./dbx_classes";

    import Image from "./Image.svelte";
    import LivePhoto from "./LivePhoto.svelte";

    export let ACCESS_TOKEN: string;
    export let event_contents: DbxIndexEntry[] = [];
    export let event_index: number;

    const timestamp = () => {
        let first = new Date(event_contents[0].metadata.time_taken);
        let last = new Date(
            event_contents[event_contents.length - 1].metadata.time_taken
        );
        first.setTime(first.getTime() + first.getTimezoneOffset() * 60 * 1000);
        last.setTime(last.getTime() + last.getTimezoneOffset() * 60 * 1000);
        // if same timestamp or just a single element
        if (
            event_contents.length == 1 ||
            event_contents[0].metadata.time_taken ==
                event_contents[event_contents.length - 1].metadata.time_taken
        ) {
            return (
                first.toLocaleDateString("en-US", {
                    dateStyle: "full",
                }) +
                ", " +
                first.getHours().toString().padStart(2, "0") +
                ":" +
                first.getMinutes().toString().padStart(2, "0")
            );
        }
        // if same day
        if (
            first.getDate() == last.getDate() &&
            first.getMonth() == last.getMonth() &&
            first.getFullYear() == last.getFullYear()
        ) {
            return `${first.toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
                hour12: false,
            })}-${last.getHours().toString().padStart(2, "0")}:${last
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
        }
        // default
        return `${first.toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "short",
            hour12: false,
        })}—${last.toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "short",
            hour12: false,
        })}`;
    };
</script>

<div>
    <h2 class="timestamps">{timestamp()}</h2>
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
