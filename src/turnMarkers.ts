import './blockOffTurnMovement';
import getCombatantPosition from './getCombatantPosition';
import Marker from './marker';
import module from './module';
import { getStartPosition, setStartPosition } from './startPosition';
import { registerListener } from './turnMonitor';

const startMarker = new Marker('start');
const activeMarker = new Marker('active');

const refreshMarkers = () => {
  module.logger.debug('refreshMarkers');
  if (!game.combat) {
    module.logger.debug('No combat');
    startMarker.hide();
    activeMarker.hide();
    return;
  }
  const startPosition = getStartPosition(game.combat);
  if (!startPosition) {
    module.logger.debug('No start position');
    startMarker.hide();
    activeMarker.hide();
    return;
  }
  startMarker.update(startPosition);
  activeMarker.update(getCombatantPosition(game.combat.combatant));
};


Hooks.on('updateToken', (token: TokenDocument) => {
  if (game.combat?.combatant?.token === token) {
    refreshMarkers();
  }
});

Hooks.on('renderHeadsUpDisplay', () => {
  refreshMarkers();
});

Hooks.on('ready', () => {
  game.combats.forEach((combat) => {
    const startPosition = getStartPosition(combat);
    if (combat.started && !startPosition) {
      module.logger.debug('initializing start position', combat);
      setStartPosition(combat);
    }
  });
  refreshMarkers();
});

Hooks.on('deleteCombat', (combat) => {
  module.logger.debug('deleteCombat', combat);
  refreshMarkers();
});

Hooks.on('deleteCombatant', (combatant: Combatant) => {
  module.logger.debug('deleteCombatant', combatant);
  const startPosition = getStartPosition(combatant.combat);
  if (startPosition?.combatant === combatant.id) {
    module.logger.debug('deleted combatant was active combatant - resetting start position');
    setStartPosition(combatant.combat);
  }
  refreshMarkers();
});

Hooks.on('updateCombat', () => {
  refreshMarkers();
});

registerListener((combat) => {
  setStartPosition(combat);
});

