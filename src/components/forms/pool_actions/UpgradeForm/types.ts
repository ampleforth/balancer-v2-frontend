export enum PoolMigrationType {
  AAVE_BOOSTED_POOL = 'aaveBoostedPool'
}

export type PoolMigration = {
  type: PoolMigrationType;
  from: string;
  to: string;
  riskI18nLabels?: string[];
};
