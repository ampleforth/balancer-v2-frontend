<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { configService } from '@/services/config/config.service';

import usePoolQuery from '@/composables/queries/usePoolQuery';
import useNumbers from '@/composables/useNumbers';

import Col3Layout from '@/components/layouts/Col3Layout.vue';
import LiquidityAPRTooltip from '@/components/tooltips/LiquidityAPRTooltip.vue';
import useUserSettings from '@/composables/useUserSettings';
import useTokens from '@/composables/useTokens';

/**
 * DATA
 */
const migrationsMap = {
  aaveBoostedPool: {
    id: 'aaveBoostedPool',
    from: configService.network.pools.staBAL3,
    to: configService.network.pools.bbAaveUSD
  }
};

const currentMigration = migrationsMap.aaveBoostedPool;

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { fNum } = useNumbers();
const { currency } = useUserSettings();
const { tokens } = useTokens();

const migrateFromPoolQuery = usePoolQuery(currentMigration.from);
const migrateToPoolQuery = usePoolQuery(currentMigration.to);

/**
 * COMPUTED
 */
const migrateFromPoolLoading = computed(
  () =>
    migrateFromPoolQuery.isLoading.value || migrateFromPoolQuery.isIdle.value
);

const migrateToPoolLoading = computed(
  () => migrateToPoolQuery.isLoading.value || migrateToPoolQuery.isIdle.value
);

const isLoadingPools = computed(
  () => migrateToPoolLoading.value || migrateFromPoolLoading.value
);

const migrateFromPool = computed(() => migrateFromPoolQuery.data.value);

const migrateToPool = computed(() => migrateToPoolQuery.data.value);

/**
 * COMPOSABLES
 */
</script>

<template>
  <Col3Layout offsetGutters>
    <template #gutterLeft>
      <BalCard shadow="none">
        <div class="mb-4">
          {{ t(`migratePool.${currentMigration.id}.whyUpgrade.title`) }}
        </div>
        <div class="text-gray-400">
          {{ t(`migratePool.${currentMigration.id}.whyUpgrade.description`) }}
        </div>
      </BalCard>
    </template>

    <BalLoadingBlock v-if="isLoadingPools" class="h-64" />
    <BalCard v-else shadow="none">
      <div class="mb-1 text-gray-500 text-xs">
        {{ configService.network.chainName }}
      </div>
      <h4 class="mb-4">
        {{ t(`migratePool.${currentMigration.id}.upgradeToPool.title`) }}
      </h4>
      <div class="mb-6">
        <div class="text-gray-500">{{ t('yourBalanceInPool') }}</div>
      </div>
      <div class="rounded border p-3  flex items-center">
        <BalAsset :address="migrateFromPool.address" class="mr-2" :size="36" />
        <div>
          <div>{{ tokens[migrateFromPool.address].symbol }}</div>
          <div class="text-gray-500">
            {{ tokens[migrateFromPool.address].name }}
          </div>
        </div>
      </div>
      <div class="block flex justify-center my-5">
        <ArrowDownIcon />
      </div>
      <div class="rounded border p-3 mb-6 flex items-center">
        <BalAsset :address="migrateToPool.address" class="mr-2" :size="36" />
        <div>
          <div>{{ tokens[migrateToPool.address].symbol }}</div>
          <div class="text-gray-500">
            {{ tokens[migrateToPool.address].name }}
          </div>
        </div>
      </div>
      <BalBtn color="gradient" block>
        {{ t('previewUpgrade') }}
      </BalBtn>
    </BalCard>

    <template #gutterRight>
      <BalLoadingBlock v-if="migrateToPoolLoading" class="h-64" />
      <BalCard v-else shadow="none">
        <div class="mb-4">
          {{ t(`migratePool.${currentMigration.id}.poolStats.title`) }}
        </div>
        <div>
          <div class="mb-3">
            <div class="text-gray-400">{{ t('poolValue') }}</div>
            <div>{{ fNum(migrateToPool.totalLiquidity, currency) }}</div>
          </div>
          <div class="mb-3">
            <div class="text-gray-400">{{ t('volumeTime', ['24h']) }}</div>
            <div>{{ fNum(migrateToPool.dynamic.volume, currency) }}</div>
          </div>
          <div>
            <div class="text-gray-400">{{ t('apr') }}</div>
            <div class="flex items-center">
              {{ fNum(migrateToPool.dynamic.apr.total, 'percent') }}
              <LiquidityAPRTooltip :pool="migrateToPool" />
            </div>
          </div>
        </div>
      </BalCard>
    </template>
  </Col3Layout>
</template>
