import module from '../module';
import getEffectiveCombatant from './getEffectiveCombatant';
import { AllowNonCombatantMovement, AllowSameInitiativeMovement } from './settings';

const isActiveCombatant = (token: TokenDocument) => {
  const combat = game.combat;
  if (!combat?.started) {
    // Combat hasn't started, so it's "everybody"'s turn
    module.logger.debug('isActiveCombatant: true - combat not started');
    return true;
  }

  const combatant = getEffectiveCombatant(combat, token);
  if (!combatant) {
    // Non-combatant
    if (AllowNonCombatantMovement.get()) {
      module.logger.debug('isActiveCombatant: true - non-combatant and AllowNonCombatMovement enabled');
      return true;
    }
    module.logger.debug('isActiveCombatant: false - non-combatant and AllowNonCombatMovement disabled');
    return false;
  }

  if (!combat.combatant) {
    // Combat has started... but there's no active combatant... so it's "nobody"'s turn
    module.logger.debug('isActiveCombatant: false - no active combatant');
    return false;
  }

  if (combat.combatant === combatant) {
    // Easy one - the token is the current active combatant
    module.logger.debug('isActiveCombatant: true - combat.combatant === combatant');
    return true;
  }

  if (AllowSameInitiativeMovement.get()) {
    if (combatant.initiative === combat.combatant.initiative) {
      module.logger.debug('isActiveCombatant: true - same initiative', token, combatant, combat);
      return true;
    }
  }

  module.logger.debug('isActiveCombatant: false - all other checks failed', token, combat);
  return false;
};

export default isActiveCombatant;
