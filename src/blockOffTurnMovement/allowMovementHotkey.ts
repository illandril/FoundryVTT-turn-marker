import module from '../module';

let allowMovement = false;

Hooks.once('init', () => {
  module.settings.registerKeybinding('allowMovement', () => {
    module.logger.debug('Allow movement hotkey pressed');
    allowMovement = true;
  }, () => {
    module.logger.debug('Allow movement hotkey released');
    allowMovement = false;
  }, {
    hasHint: true,
    defaultKeybindings: [{
      key: 'KeyM',
    }],
    precedence: foundry.CONST.KEYBINDING_PRECEDENCE.NORMAL,
    restricted: true,
  });
});

export const isAllowMovement = () => allowMovement;

export const getMovementHotkeyName = () => {
  const primaryKeyBinding = game.keybindings.get(module.id, 'allowMovement')?.[0];
  if (!primaryKeyBinding) {
    return null;
  }
  return [
    ...primaryKeyBinding.modifiers ?? [],
    KeyboardManager.getKeycodeDisplayString(primaryKeyBinding.key),
  ].join(' + ');
};
