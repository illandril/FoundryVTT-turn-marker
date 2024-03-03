import module from '../module';
import { getMovementHotkeyName } from './allowMovementHotkey';

const WARN_DELAY = 3000;

let lastWarnedToken: TokenDocument | null = null;
let lastWarnedTime = 0;

const showOffTurnWarning = (token: TokenDocument) => {
  if (lastWarnedToken !== token || Date.now() - lastWarnedTime >= WARN_DELAY) {
    lastWarnedToken = token;
    lastWarnedTime = Date.now();
    const movementHotkey = game.user?.isGM ? getMovementHotkeyName() : null;
    ui.notifications.warn(module.localize(`notification.offTurnMovementBlocked.${movementHotkey ? 'GM' : 'player'}`, {
      token: token.name,
      ...movementHotkey ? { hotkey: movementHotkey } : {},
    }));
  }
};

export default showOffTurnWarning;
