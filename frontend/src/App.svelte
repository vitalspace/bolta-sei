<script lang="ts">
  import Index from "#pages/Index.svelte";
  import { Route, Router } from "svelte5-router";
  import ToastNotification from "#components/ui/ToastNotification.svelte";
</script>

<Router>
  <Route path="/" component={Index} />
</Router>

<!-- Global Toast Notifications -->
<ToastNotification />

