<script lang="ts">
  import { getInternalPreferences } from "$ctx/internal-preferences.svelte";
  import { Button } from "bits-ui";
  import { toast } from "svelte-sonner";

  const internalPreferences = getInternalPreferences();

  function dissmissFn() {
    toast.dismiss("survey-notice");
    toast.info("You can find the survey on the home page if you change your mind.", { position: "bottom-center" });
    internalPreferences.skycryptSurvey.dismissedAt = new Date();
  }

  function actionFn() {
    window.open("https://forms.gle/wUSHhr8EACviaQVq8", "_blank");
    toast.dismiss("survey-notice");
    toast.success("Thank you for taking the time to fill out our survey!", { position: "bottom-center" });
    internalPreferences.skycryptSurvey.confirmedAt = new Date();
  }

  $effect(() => {
    if (!internalPreferences.skycryptSurvey.surveyName) internalPreferences.skycryptSurvey.surveyName = "general-survey-2026-03-18";
    if (!internalPreferences.skycryptSurvey.surveyVersion) internalPreferences.skycryptSurvey.surveyVersion = new Date("2026-03-18").getTime();
  });
</script>

<div class="p-4 text-text">
  <h2 class="text-lg font-bold">SkyCrypt Survey</h2>
  <p class="mt-2 text-sm">Please take a moment to fill out our survey and let us know what you think.</p>

  <p class="mt-2 text-sm">Your feedback is actually really helpful in improving the site.</p>
  <Button.Root onclick={actionFn} class="mt-4 inline-flex items-center rounded bg-skillbar px-4 py-2 text-sm font-medium text-text text-shadow-sm hover:bg-hover">Take the Survey</Button.Root>

  <Button.Root onclick={dissmissFn} class="mt-4 inline-flex items-center rounded px-4 py-2 text-sm font-medium text-text text-shadow-sm hover:bg-text/30">Dismiss</Button.Root>
</div>
