<template>
  <div class="card">
    <Button variant="outline">Click me</Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { useCounter } from '@/hooks/use-counter'
import { lucide } from 'lucide-vue-next'
</script>
