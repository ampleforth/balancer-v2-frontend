<script setup lang="ts">
import { PoolMigrationType } from '@/components/forms/pool_actions/UpgradeForm/types';
import { POOL_MIGRATIONS_MAP } from '@/components/forms/pool_actions/UpgradeForm/constants';

import UpgradeForm from '@/components/forms/pool_actions/UpgradeForm/UpgradeForm.vue';

const selectedPoolMigration =
  POOL_MIGRATIONS_MAP[PoolMigrationType.AAVE_BOOSTED_POOL];
</script>

<template>
  <UpgradeForm :poolMigration="selectedPoolMigration" />
</template>
