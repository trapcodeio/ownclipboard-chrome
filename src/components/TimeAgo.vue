<template>
  <span>{{ computedTime }}</span>
</template>

<script>
import * as timeago from 'timeago.js';

export default {
  name: 'TimeAgo',
  props: ['date'],
  computed: {
    computedTime() {
      return timeago.format(this.date);
    }
  }
}
</script>