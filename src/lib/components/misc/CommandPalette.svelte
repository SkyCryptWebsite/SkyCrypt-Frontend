<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { getInternalState } from "$ctx";
  import { searchUser } from "$lib/shared/api/skycrypt-api.remote";
  import { flyAndScale } from "$lib/shared/utils";
  import CircleAlert from "@lucide/svelte/icons/circle-alert";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Search from "@lucide/svelte/icons/search";
  import { isHttpError } from "@sveltejs/kit";
  import { Button, Command, computeCommandScore, Dialog } from "bits-ui";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { schema } from "../../../routes/schema";
  import CommandSearchGroup from "./CommandSearchGroup.svelte";
  import CommandSettingsGroup from "./CommandSettingsGroup.svelte";

  let { ign = "", loading = $bindable(false) } = $props();

  let commandInput = $state<HTMLElement>(null!);
  let commandValue = $state("");
  let searchQuery = $state<string>("");
  let submittedSearchLoading = $state(false);
  let submittedSearchError = $state<string>();

  const searchQueryValidated = $derived(schema.safeParse({ query: searchQuery }));
  const internalState = getInternalState();

  function getErrorMessage(err: unknown) {
    const httpError = err as { body?: unknown };

    if (isHttpError(err) && typeof httpError.body === "object" && httpError.body !== null && "message" in httpError.body && typeof httpError.body.message === "string") {
      return httpError.body.message;
    }

    return "Something went wrong";
  }

  function resetSearchState() {
    commandValue = "";
    searchQuery = "";
    submittedSearchLoading = false;
    submittedSearchError = undefined;
  }

  function customFilter(commandValue: string, search: string, commandKeywords?: string[]): number {
    const score = computeCommandScore(commandValue, search, commandKeywords);
    if (commandValue === "search" || commandValue === "actions") {
      return 0.98;
    }
    return score;
  }

  function setCommandOpen(open: boolean) {
    internalState.openCommand = open;
    if (!open) {
      resetSearchState();
    }
  }

  function closeCommand() {
    setCommandOpen(false);
  }

  async function submitSearch() {
    if (!searchQueryValidated.success) return;

    const username = searchQuery.trim();
    if (!username) return;

    submittedSearchLoading = true;
    submittedSearchError = undefined;

    try {
      const response = await searchUser({ username });
      closeCommand();
      await goto(resolve("/stats/[ign]", { ign: response.username ?? "" }));
    } catch (err) {
      submittedSearchError = getErrorMessage(err);
    } finally {
      submittedSearchLoading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (commandValue && commandValue !== "search") return;
    const k = e.key.toLowerCase();
    if (k === "enter" || k === "search") {
      e.preventDefault();
      void submitSearch();
    }
  }
</script>

<Dialog.Root bind:open={() => internalState.openCommand, setCommandOpen}>
  <Dialog.Portal>
    <Dialog.Overlay forceMount class="fixed inset-0 z-40 glass glass-bg-background-lore">
      {#snippet child({ props, open })}
        {#if open}
          <div {...props} transition:fade={{ duration: 150, easing: cubicOut }}></div>
        {/if}
      {/snippet}
    </Dialog.Overlay>
    <Dialog.Content
      forceMount
      class="fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg font-icomoon select-text glass"
      onOpenAutoFocus={(e) => {
        e.preventDefault();
        commandInput?.focus();
      }}>
      {#snippet child({ props, open })}
        {#if open}
          <div {...props} transition:flyAndScale>
            <div class="relative flex h-full w-4/5 items-center justify-start overflow-clip rounded-[1.125rem] bg-background/20 @[38rem]:w-full">
              <input type="search" required class="hidden" bind:value={searchQuery} />
            </div>
            <Command.Root bind:value={commandValue} class="flex h-full w-full flex-col divide-y divide-icon/30 self-start overflow-hidden rounded-lg" filter={customFilter}>
              <div class="flex h-12 items-center">
                <Button.Root
                  type="button"
                  class="flex aspect-square h-full items-center justify-center text-text"
                  onclick={() => {
                    void submitSearch();
                  }}>
                  {#if !searchQueryValidated.success && searchQuery.length > 0}
                    <CircleAlert class="size-4" />
                  {:else if submittedSearchLoading || loading}
                    <LoaderCircle class="size-4 animate-spin" />
                  {:else}
                    <Search class="size-4" />
                  {/if}
                </Button.Root>
                <Command.Input class="inline-flex h-12 w-full truncate rounded-tl-lg rounded-tr-lg pr-4 text-base text-text transition-colors ease-out placeholder:text-text/50 focus:ring-0 focus:outline-hidden" placeholder="Search for something..." type="search" required bind:value={searchQuery} bind:ref={commandInput} onkeydown={handleKeydown} />
              </div>

              <Command.List class="max-h-120 overflow-x-hidden overflow-y-auto px-2 pb-2">
                <Command.Viewport>
                  <Command.Empty class="text-muted-foreground flex w-full items-center justify-center pt-8 pb-6 text-sm">
                    {#if submittedSearchError}
                      {submittedSearchError}
                    {:else}
                      Press Enter to search
                    {/if}
                  </Command.Empty>

                  <CommandSearchGroup {ign} />

                  {#if searchQuery.length}
                    <Command.Separator class="bg-foreground/5 h-px w-full" />
                    <Command.Group>
                      <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Actions</Command.GroupHeading>
                      <Command.GroupItems>
                        <Command.Item
                          value="search"
                          class="flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none standard:data-selected:bg-background-grey performance:data-selected:bg-background-lore"
                          keywords={[searchQuery, "search", "find", "profile"]}
                          onSelect={() => {
                            void submitSearch();
                          }}>
                          {#if submittedSearchLoading || loading}
                            <LoaderCircle class="size-4 animate-spin" />
                          {:else}
                            <Search class="size-4 text-text" />
                          {/if}

                          {#if submittedSearchError}
                            {submittedSearchError}
                          {:else}
                            Search for {searchQuery}
                          {/if}
                        </Command.Item>
                      </Command.GroupItems>
                    </Command.Group>
                  {/if}

                  <Command.Separator class="bg-foreground/5 h-px w-full" />

                  <CommandSettingsGroup {closeCommand} />
                </Command.Viewport>
              </Command.List>
            </Command.Root>
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
