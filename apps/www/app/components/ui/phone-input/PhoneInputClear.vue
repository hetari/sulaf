<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { InputGroupButton } from '@/components/ui/input-group'
import { usePhoneInputContext } from './context'
import { phoneInputClearVariants } from './index'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { value, onClear, disabled, variant } = usePhoneInputContext()
</script>

<template>
  <InputGroupButton
    v-if="value"
    type="button"
    variant="ghost"
    size="icon-sm"
    :disabled="disabled"
    aria-label="Clear phone number"
    data-slot="phone-input-clear"
    :class="cn(phoneInputClearVariants({ variant }), props.class)"
    @click="onClear"
  >
    <X class="size-4" />
  </InputGroupButton>
</template>
