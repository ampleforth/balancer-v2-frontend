<script setup lang="ts">
import { computed, ref } from 'vue';
// Types
import { FullPool } from '@/services/balancer/subgraph/types';
// Composables
import { useI18n } from 'vue-i18n';
// Components

/**
 * TYPES
 */
type Props = {
  migrateFromPool: FullPool;
  migrateToPool: FullPool;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

/**
 * STATE
 */
const upgradeConfirmed = ref(false);

/**
 * COMPOSABLES
 */
const { t } = useI18n();

/**
 * COMPUTED
 */
const title = computed((): string =>
  upgradeConfirmed.value ? 'Preview upgrade' : 'Upgrade confirmed'
);

/**
 * METHODS
 */

function handleClose(): void {
  emit('close');
}
</script>

<template>
  <BalModal show :fireworks="upgradeConfirmed" @close="handleClose">
    <template v-slot:header>
      <div class="flex items-center">
        <BalCircle
          v-if="upgradeConfirmed"
          size="8"
          color="green"
          class="text-white mr-2"
        >
          <BalIcon name="check" />
        </BalCircle>
        <h4>
          {{ title }}
        </h4>
      </div>
    </template>

    <div>Hello world</div>
  </BalModal>
</template>
