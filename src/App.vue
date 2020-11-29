<template>
  <section>
    <h3 class="text-center mt-5 text-2xl">!OwnClipboard!</h3>
  </section>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    if (chrome && chrome.storage) {
      chrome.storage.sync.set({app: "OwnClipboard"}, function () {
        console.log('color is ' + item);
      })
    }
  }
}
</script>