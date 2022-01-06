import { keyBy } from 'lodash';

import { configService } from '@/services/config/config.service';

import { PoolMigrationType, PoolMigration } from './types';

const riskI18nLabelPrefix = 'migratePool.previewModal.riskWarnings.risks';

export const POOL_MIGRATIONS: PoolMigration[] = [
  {
    type: PoolMigrationType.AAVE_BOOSTED_POOL,
    from: configService.network.pools.staBAL3,
    to: configService.network.pools.bbAaveUSD,
    riskI18nLabels: [
      `${riskI18nLabelPrefix}.lose-usd-peg`,
      `${riskI18nLabelPrefix}.aave-stable-exploit`
    ]
  }
];

export const POOL_MIGRATIONS_MAP = keyBy(POOL_MIGRATIONS, 'type');
