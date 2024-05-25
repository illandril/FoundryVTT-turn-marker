import module from '../module';
import { isAllowMovement } from './allowMovementHotkey';
import isActiveCombatant from './isActiveCombatant';
import { BlockGMOffTurnMovement, BlockPlayerOffTurnMovement } from './settings';
import showOffTurnWarning from './showOffTurnWarning';

const movementFields = ['x', 'y', 'elevation', 'rotation'] as const;

Hooks.on('preUpdateToken', (token, changes) => {
  const hasMovement = movementFields.some((field) => changes[field] !== undefined);
  if (!hasMovement) {
    // Token isn't moving, so nothing to block
    return;
  }
  if (isActiveCombatant(token)) {
    // It's their turn, so go ahead and move
    return;
  }

  module.logger.debug('preUpdateToken with off-turn movement', changes);

  const isGM = !!game.user?.isGM;
  const blockMovement = isGM ? BlockGMOffTurnMovement.get() && !isAllowMovement() : BlockPlayerOffTurnMovement.get();

  if (blockMovement) {
    module.logger.debug('Blocking movement');
    showOffTurnWarning(token);
    for (const field of movementFields) {
      delete changes[field];
    }
    module.logger.debug('Remaining changes', changes);
    if (Object.keys(changes).length === 1) {
      // If there are no other changes - prevent the change
      return false;
    }
  }
});
