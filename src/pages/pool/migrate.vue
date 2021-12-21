<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { configService } from '@/services/config/config.service';

import usePoolQuery from '@/composables/queries/usePoolQuery';
import useNumbers from '@/composables/useNumbers';

import Col3Layout from '@/components/layouts/Col3Layout.vue';
import LiquidityAPRTooltip from '@/components/tooltips/LiquidityAPRTooltip.vue';
import TradeSettingsPopover, {
  TradeSettingsContext
} from '@/components/popovers/TradeSettingsPopover.vue';

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
const fromPoolTokenExpanded = ref(false);
const toPoolTokenExpanded = ref(false);

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

const migrateFromPoolTokenInfo = computed(() =>
  migrateFromPool.value != null
    ? tokens.value[migrateFromPool.value.address]
    : null
);

const migrateToPoolTokenInfo = computed(() =>
  migrateToPool.value != null ? tokens.value[migrateToPool.value.address] : null
);
</script>

<template>
  <Col3Layout offsetGutters>
    <template #gutterLeft>
      <BalCard noPad shadow="none">
        <div class="p-4 w-full border-b dark:border-gray-900">
          <h6>
            {{ t(`migratePool.${currentMigration.id}.whyUpgrade.title`) }}
          </h6>
        </div>
        <div class="-mt-2 p-4">
          <div class="text-gray-500 dark:text-gray-400">
            {{ t(`migratePool.${currentMigration.id}.whyUpgrade.description`) }}
          </div>
        </div>
      </BalCard>
    </template>

    <BalLoadingBlock
      v-if="
        isLoadingPools ||
          migrateFromPoolTokenInfo == null ||
          migrateToPoolTokenInfo == null
      "
      class="h-96"
    />
    <BalCard v-else shadow="xl" exposeOverflow noBorder>
      <template #header>
        <div class="w-full">
          <div class="text-xs text-gray-500 leading-none">
            {{ configService.network.chainName }}
          </div>
          <div class="flex items-center justify-between">
            <h4>
              {{ t(`migratePool.${currentMigration.id}.upgradeToPool.title`) }}
            </h4>
            <TradeSettingsPopover :context="TradeSettingsContext.invest" />
          </div>
        </div>
      </template>
      <div class="mb-6">
        <div class="text-gray-500">{{ t('yourBalanceInPool') }}</div>
      </div>
      <div class="rounded border p-3 mb-6">
        <BalBreakdown
          :items="migrateFromPool.tokenAddresses"
          class="w-full cursor-pointer select-none"
          offsetClassOverrides="mt-4 ml-3"
          initVertBarClassOverrides="h-6 -mt-6"
          size="lg"
          :hideItems="!fromPoolTokenExpanded"
          @click="fromPoolTokenExpanded = !fromPoolTokenExpanded"
        >
          <div class="flex items-center">
            <BalAsset
              :address="migrateFromPool.address"
              class="mr-2"
              :size="36"
            />
            <div>
              <div>{{ migrateFromPoolTokenInfo.symbol }}</div>
              <div class="text-gray-500">
                {{ migrateFromPoolTokenInfo.name }}
              </div>
            </div>
          </div>
          <template #item="{ item: address }">
            <div
              class="ml-2 rounded border bg-gray-50 px-2 py-1 inline-flex items-center"
            >
              <BalAsset :address="address" class="mr-2" />
              {{ tokens[address].symbol }}
            </div>
          </template>
        </BalBreakdown>
      </div>
      <div class="block flex justify-center my-5">
        <ArrowDownIcon />
      </div>
      <div class="rounded border p-3 mb-6">
        <BalBreakdown
          :items="migrateToPool.tokenAddresses"
          class="w-full cursor-pointer select-none"
          offsetClassOverrides="mt-4 ml-3"
          initVertBarClassOverrides="h-6 -mt-6"
          size="lg"
          :hideItems="!toPoolTokenExpanded"
          @click="toPoolTokenExpanded = !toPoolTokenExpanded"
        >
          <div class="flex items-center">
            <BalAsset
              :address="migrateToPool.address"
              class="mr-2"
              :size="36"
            />
            <div>
              <div>{{ migrateToPoolTokenInfo.symbol }}</div>
              <div class="text-gray-500">
                {{ migrateToPoolTokenInfo.name }}
              </div>
            </div>
          </div>
          <template #item="{ item: address }">
            <div
              class="ml-2 rounded border bg-gray-50 px-2 py-1 inline-flex items-center"
            >
              <BalAsset :address="address" class="mr-2" />
              {{ tokens[address].symbol }}
            </div>
          </template>
        </BalBreakdown>
      </div>
      <BalBtn color="gradient" block>
        {{ t('previewUpgrade') }}
      </BalBtn>
    </BalCard>

    <template #gutterRight>
      <BalLoadingBlock v-if="migrateToPoolLoading" class="h-64" />
      <BalCard v-else noPad shadow="none">
        <div class="p-4 w-full border-b dark:border-gray-900">
          <h6>
            {{ t(`migratePool.${currentMigration.id}.poolStats.title`) }}
          </h6>
        </div>
        <div class="-mt-2 p-4">
          <div class="mb-3">
            <div class="text-gray-500 dark:text-gray-400">
              {{ t('poolValue') }}
            </div>
            <div>{{ fNum(migrateToPool.totalLiquidity, currency) }}</div>
          </div>
          <div class="mb-3">
            <div class="text-gray-500 dark:text-gray-400">
              {{ t('volumeTime', ['24h']) }}
            </div>
            <div>{{ fNum(migrateToPool.dynamic.volume, currency) }}</div>
          </div>
          <div>
            <div class="text-gray-500 dark:text-gray-400">{{ t('apr') }}</div>
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
