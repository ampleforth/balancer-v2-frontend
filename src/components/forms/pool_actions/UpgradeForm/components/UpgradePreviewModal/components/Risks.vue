<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { PoolMigrationInfo } from '../../../types';
/**
 * TYPES
 */
type Props = {
  poolMigrationInfo: PoolMigrationInfo;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { t } = useI18n();
</script>

<template>
  <BalAlert
    type="warning"
    :title="t('migratePool.previewModal.riskWarnings.title')"
    block
    class="mb-4"
  >
    <ul>
      <li
        v-for="i18nLabel in props.poolMigrationInfo.riskI18nLabels"
        :key="i18nLabel"
      >
        {{ t(i18nLabel) }}
      </li>
    </ul>
  </BalAlert>
</template>
