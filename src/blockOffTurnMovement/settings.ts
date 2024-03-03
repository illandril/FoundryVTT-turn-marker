import module from '../module';

export const BlockPlayerOffTurnMovement = module.settings.register('blockPlayerOffTurnMovement', Boolean, true, {
  hasHint: true,
});

export const BlockGMOffTurnMovement = module.settings.register('blockGMOffTurnMovement', Boolean, true, {
  hasHint: true,
});

export const AllowSameInitiativeMovement = module.settings.register('allowSameInitiativeMovement', Boolean, false, {
  hasHint: true,
});

export const AllowNonCombatantMovement = module.settings.register('allowNonCombatantMovement', Boolean, false, {
  hasHint: true,
});
