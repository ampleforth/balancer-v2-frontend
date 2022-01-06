<script setup lang="ts">
import { computed, ref } from 'vue';
// import { useI18n } from 'vue-i18n';

import { FullPool } from '@/services/balancer/subgraph/types';

import Risks from './components/Risks.vue';

import { PoolMigration } from '../../types';

/**
 * TYPES
 */
type Props = {
  poolMigration: PoolMigration;
  fromPool: FullPool;
  toPool: FullPool;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

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
// const { t } = useI18n();

/**
 * COMPUTED
 */
const title = computed(() =>
  upgradeConfirmed.value ? 'Preview confirmed' : 'Upgrade preview'
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

    <Risks
      v-if="props.poolMigration.riskI18nLabels != null"
      :poolMigration="props.poolMigration"
    />
  </BalModal>
</template>
