import module from './module';

const WARN_DELAY = 3000;

let allowMovement = false;
Hooks.once('init', () => {
  game.keybindings.register(module.id, 'allowMovement', {
    name: module.localize('hotkey.allowMovement.label'),
    hint: module.localize('hotkey.allowMovement.hint'),
    editable: [
      {
        key: 'KeyM',
      },
    ],
    onDown: () => {
      module.logger.debug('Allow movement hotkey pressed');
      allowMovement = true;
    },
    onUp: () => {
      module.logger.debug('Allow movement hotkey released');
      allowMovement = false;
    },
    precedence: foundry.CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
});

const getMovementHotkeyName = () => {
  const primaryKeyBinding = game.keybindings.get('illandril-turn-marker', 'allowMovement')[0];
  return [
    ...primaryKeyBinding.modifiers,
    KeyboardManager.getKeycodeDisplayString(primaryKeyBinding.key),
  ].join(' + ');
};

const BlockPlayerOffTurnMovement = module.settings.register('blockPlayerOffTurnMovement', Boolean, true, {
  hasHint: true,
});
const BlockGMOffTurnMovement = module.settings.register('blockGMOffTurnMovement', Boolean, true, {
  hasHint: true,
});

let lastWarnedToken: TokenDocument | null = null;
let lastWarnedTime = 0;
Hooks.on('preUpdateToken', (token: TokenDocument, changes) => {
  const combat = game.combat as Combat | undefined;
  if (!combat?.started || combat.combatant?.token === token) {
    return;
  }
  const hasMovement = changes.x !== undefined || changes.y !== undefined || changes.elevation !== undefined;
  if (!hasMovement) {
    return;
  }
  module.logger.debug('preUpdateToken with movement', changes);

  const isGM = !!game.user?.isGM;
  const blockMovement = isGM
    ? BlockGMOffTurnMovement.get() && !allowMovement
    : BlockPlayerOffTurnMovement.get();
  if (blockMovement) {
    module.logger.debug('Blocking movement');
    if (lastWarnedToken !== token || Date.now() - lastWarnedTime > WARN_DELAY) {
      lastWarnedToken = token;
      lastWarnedTime = Date.now();
      ui.notifications.warn(module.localize(`notification.offTurnMovementBlocked.${isGM ? 'GM' : 'player'}`, {
        token: token.name,
        hotkey: isGM ? getMovementHotkeyName() : undefined,
      }));
    }
    delete changes.x;
    delete changes.y;
    module.logger.debug('Remaining changes', changes);
    if (Object.keys(changes).length === 1) {
      // If there are no other changes - prevent the change
      return false;
    }
  }
});
