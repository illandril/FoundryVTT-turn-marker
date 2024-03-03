import module from '../module';

const getEffectiveCombatant = (combat: Combat, token: TokenDocument) => {
  let combatant: Combatant | null = null;
  if (token.combatant) {
    // The easy and most common case - the token is directly a combatant
    module.logger.debug('getEffectiveCombatant: token.combatant');
    combatant = token.combatant;
  } else if ('combatant' in token.actor && token.actor.combatant instanceof Combatant) {
    // pf2e handles "minions" this way... and some other systems might do the same
    module.logger.debug('getEffectiveCombatant: token.actor.combatant');
    combatant = token.actor.combatant;
  } else {
    // Two tokens for the same actor (two scenes, mirror image type of spell, etc)
    module.logger.debug('getEffectiveCombatant: combat.getCombatantByActor(token.actor)');
    combatant = combat.getCombatantByActor(token.actor) ?? null;
  }
  module.logger.debug('getEffectiveCombatant', combat, token, combatant);

  return combatant;
};

export default getEffectiveCombatant;
