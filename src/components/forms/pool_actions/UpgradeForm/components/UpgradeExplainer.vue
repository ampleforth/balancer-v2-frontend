<script setup lang="ts">
import { PoolMigrationInfo } from '@/components/forms/pool_actions/UpgradeForm/types';

type Props = {
  poolMigrationInfo: PoolMigrationInfo;
};

/**
 * PROPS
 */
const props = defineProps<Props>();
</script>

<template>
  <BalCard noPad shadow="none">
    <div class="p-4 w-full border-b dark:border-gray-900">
      <h6>
        {{ $t(`migratePool.${props.poolMigrationInfo.type}.whyUpgrade.title`) }}
      </h6>
    </div>
    <div class="-mt-2 p-4">
      <div class="text-gray-500 dark:text-gray-400">
        {{
          $t(
            `migratePool.${props.poolMigrationInfo.type}.whyUpgrade.description`
          )
        }}
      </div>
    </div>
  </BalCard>
</template>
