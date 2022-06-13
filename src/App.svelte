<script lang="ts">
    import { DbxIndex, DbxIndexEntry } from "./dbx_classes";
    import Event from "./Event.svelte";
    import Button from "./Button.svelte";
    import { store } from "./store.js";
    import { get } from "svelte/store";

    // array of events
    // events are arrays of index entries
    let events_entries: (DbxIndexEntry | null)[][] = [];
    let index = new DbxIndex();
    index
        // check that the token in the index is valid
        .valid_token_set(window.location.href)
        // if not valid, redirect to dropbox authentication
        .then((result) =>
            result ? 0 : index.redirect_to_auth(window.location)
        )
        .then(() => {
            console.log(index);
            // build index
            index.build_index().then(() => {
                // collapse video and images for live photos
                index.collapse_index();
                events_entries = index.get_sorted_event_array();
            });
        });
</script>

<svelte:window
    on:keydown="{(e) =>
        store.set(index.handle_keydown(e, get(store), events_entries))}"
/>

<main>
    <!-- font-awesome icons -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <h1>🐟 Photos 🐈</h1>
    <Button />
    {#each events_entries as event, event_index}
        <Event
            ACCESS_TOKEN="{index.access_token}"
            event_contents="{event}"
            event_index="{event_index}"
        />
    {/each}
    {#if $store.file_info}
        <div>
            <p>HI</p>
        </div>
    {/if}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    :global(body) {
        background-color: #202020;
    }
</style>
