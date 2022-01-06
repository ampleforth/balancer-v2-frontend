<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { configService } from '@/services/config/config.service';
import PoolCalculator from '@/services/pool/calculator/calculator.sevice';
import { FullPool } from '@/services/balancer/subgraph/types';

import usePoolQuery from '@/composables/queries/usePoolQuery';
import useNumbers from '@/composables/useNumbers';
import useUserSettings from '@/composables/useUserSettings';
import useTokens from '@/composables/useTokens';

import Col3Layout from '@/components/layouts/Col3Layout.vue';
import LiquidityAPRTooltip from '@/components/tooltips/LiquidityAPRTooltip.vue';
import TradeSettingsPopover, {
  TradeSettingsContext
} from '@/components/popovers/TradeSettingsPopover.vue';
import UpgradePreviewModal from '@/components/forms/pool_actions/UpgradeForm/components/UpgradePreviewModal/UpgradePreviewModal.vue';

import { PoolMigration } from '@/components/forms/pool_actions/UpgradeForm/types';

import { bnum } from '@/lib/utils';

type Props = {
  poolMigration: PoolMigration;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * DATA
 */

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { fNum, toFiat } = useNumbers();
const { currency } = useUserSettings();
const { tokens, balanceFor, balances } = useTokens();
const fromPoolTokenExpanded = ref(false);
const toPoolTokenExpanded = ref(false);
const showPreview = ref(false);

const migrateFromPoolQuery = usePoolQuery(props.poolMigration.from);
const migrateToPoolQuery = usePoolQuery(props.poolMigration.to);

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

const migrateFromPool = computed<FullPool | undefined>(
  () => migrateFromPoolQuery.data.value
);

const migrateToPool = computed<FullPool | undefined>(
  () => migrateToPoolQuery.data.value
);

const fromPoolFiatTotal = computed(() => {
  if (migrateFromPoolLoading.value || migrateFromPool.value == null) {
    return '-';
  }

  const poolCalculator = new PoolCalculator(
    migrateFromPool as Ref<FullPool>,
    tokens,
    balances,
    'exit',
    ref(false)
  );

  const { receive } = poolCalculator.propAmountsGiven(
    balanceFor(migrateFromPool.value.address),
    0,
    'send'
  );

  const fiatValue = migrateFromPool.value.tokenAddresses
    .map((address, i) => toFiat(receive[i], address))
    .reduce((total, value) =>
      bnum(total)
        .plus(value)
        .toString()
    );
  return fNum(fiatValue, currency.value);
});

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
            {{ t(`migratePool.${props.poolMigration.type}.whyUpgrade.title`) }}
          </h6>
        </div>
        <div class="-mt-2 p-4">
          <div class="text-gray-500 dark:text-gray-400">
            {{
              t(
                `migratePool.${props.poolMigration.type}.whyUpgrade.description`
              )
            }}
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
              {{
                t(`migratePool.${props.poolMigration.type}.upgradeToPool.title`)
              }}
            </h4>
            <TradeSettingsPopover :context="TradeSettingsContext.invest" />
          </div>
        </div>
      </template>
      <div class="mb-6">
        <div class="text-gray-500">{{ t('yourBalanceInPool') }}</div>
        <div class="font-semibold">{{ fromPoolFiatTotal }}</div>
      </div>
      <div class="rounded border dark:border-gray-900 p-3 mb-6">
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
      <div class="rounded border dark:border-gray-900 p-3 mb-6">
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
      <BalBtn color="gradient" block @click="showPreview = true">
        {{ t('previewUpgrade') }}
      </BalBtn>
    </BalCard>

    <template #gutterRight>
      <BalLoadingBlock v-if="migrateToPoolLoading" class="h-64" />
      <BalCard v-else noPad shadow="none">
        <div class="p-4 w-full border-b dark:border-gray-900">
          <h6>
            {{ t(`migratePool.${props.poolMigration.type}.poolStats.title`) }}
          </h6>
        </div>
        <div class="-mt-2 p-4">
          <div class="mb-3">
            <div class="text-gray-500 dark:text-gray-400">
              {{ t('poolValue') }}
            </div>
            <div class="font-semibold">
              {{ fNum(migrateToPool.totalLiquidity, currency) }}
            </div>
          </div>
          <div class="mb-3">
            <div class="text-gray-500 dark:text-gray-400">
              {{ t('volumeTime', ['24h']) }}
            </div>
            <div class="font-semibold">
              {{ fNum(migrateToPool.dynamic.volume, currency) }}
            </div>
          </div>
          <div>
            <div class="text-gray-500 dark:text-gray-400">{{ t('apr') }}</div>
            <div class="flex items-center font-semibold">
              {{ fNum(migrateToPool.dynamic.apr.total, 'percent') }}
              <LiquidityAPRTooltip :pool="migrateToPool" />
            </div>
          </div>
        </div>
      </BalCard>
    </template>
  </Col3Layout>
  <teleport to="#modal">
    <UpgradePreviewModal
      v-if="showPreview"
      :migrateFromPool="migrateFromPool"
      :migrateToPool="migrateToPool"
      :poolMigration="props.poolMigration"
      @close="showPreview = false"
    />
  </teleport>
</template>
