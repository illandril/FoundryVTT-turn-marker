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
  const primaryKeyBinding = game.keybindings.get(module.id, 'allowMovement')?.[0];
  if (!primaryKeyBinding) {
    return null;
  }
  return [
    ...primaryKeyBinding.modifiers ?? [],
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

const movementFields = ['x', 'y', 'elevation', 'rotation'] as const;

Hooks.on('preUpdateToken', (token, changes) => {
  const combat = game.combat;
  if (!combat?.started || combat.combatant?.token === token) {
    return;
  }
  const hasMovement = movementFields.some((field) => changes[field] !== undefined);
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
    if (lastWarnedToken !== token || Date.now() - lastWarnedTime >= WARN_DELAY) {
      lastWarnedToken = token;
      lastWarnedTime = Date.now();
      const movementHotkey = isGM ? getMovementHotkeyName() : null;
      ui.notifications.warn(module.localize(`notification.offTurnMovementBlocked.${movementHotkey ? 'GM' : 'player'}`, {
        token: token.name,
        ...movementHotkey ? { hotkey: movementHotkey } : {},
      }));
    }
    for (const field of movementFields) {
      delete changes[field];
    }
    module.logger.debug('Remaining changes', changes);
    if (Object.keys(changes).length === 1) {
      // If there are no other changes - prevent the change
      // eslint-disable-next-line consistent-return
      return false;
    }
  }
});
