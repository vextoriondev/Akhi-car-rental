import * as migration_20261126_081612_initial from './20261126_081612_initial';

export const migrations = [
  {
    up: migration_20261126_081612_initial.up,
    down: migration_20261126_081612_initial.down,
    name: '20261126_081612_initial'
  },
];
