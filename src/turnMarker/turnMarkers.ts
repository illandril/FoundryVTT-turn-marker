import module from '../module';
import { registerListener } from '../turnMonitor';
import getCombatantPosition from './getCombatantPosition';
import getTokenPosition from './getTokenPosition';
import isTokenVisible from './isTokenVisible';
import Marker from './marker';
import { VisibilityOption, VISIBILITY_OPTIONS, showMarker } from './markerVisibilityOptions';
import { getStartPosition, setStartPosition } from './startPosition';

const clearMarkers = () => {
  startMarker.hide();
  activeMarker.hide();
  clearFootsteps();
};

const _refreshMarkers = () => {
  module.logger.debug('refreshMarkers');

  if (!game.combat) {
    module.logger.debug('No combat');
    clearMarkers();
    return;
  }
  if (!game.combat.combatant) {
    module.logger.debug('No combatant');
    clearMarkers();
    return;
  }

  if (!isTokenVisible(game.combat.combatant.token)) {
    module.logger.debug('Combatant not visible');
    clearMarkers();
    return;
  }

  const startPosition = getStartPosition(game.combat);
  if (!startPosition) {
    module.logger.debug('No start position');
    clearMarkers();
    return;
  }

  startMarker.update(startPosition);
  activeMarker.update(getCombatantPosition(game.combat.combatant));
};

const refreshMarkers = foundry.utils.debounce(_refreshMarkers, 10);

export const EnableCurrentTurnMarker = module.settings.register<VisibilityOption>(
  'enableCurrentTurnMarker', String, 'ALL', {
    hasHint: true,
    choices: VISIBILITY_OPTIONS,
    onChange: refreshMarkers,
  },
);

export const EnableTurnStartMarker = module.settings.register<VisibilityOption>(
  'enableTurnStartMarker', String, 'ALL', {
    hasHint: true,
    choices: VISIBILITY_OPTIONS,
    onChange: refreshMarkers,
  },
);

export const EnableMovementMarkers = module.settings.register<VisibilityOption>(
  'enableMovementMarkers', String, 'ALL', {
    hasHint: true,
    choices: VISIBILITY_OPTIONS,
    onChange: () => {
      if (!showMarker(EnableMovementMarkers)) {
        clearFootsteps();
      }
      refreshMarkers();
    },
  },
);

const startMarker = new Marker(EnableTurnStartMarker, 'start');
const activeMarker = new Marker(EnableCurrentTurnMarker, 'active');

const footsteps: Marker[] = [];
const clearFootsteps = () => {
  for (const footstep of footsteps) {
    footstep.hide();
  }
  footsteps.splice(0, footsteps.length);
};

Hooks.on('updateToken', (token, changes) => {
  if (game.combat?.combatant?.token === token) {
    refreshMarkers();
    if (isTokenVisible(token) && (changes.x !== undefined || changes.y !== undefined)) {
      const footstep = new Marker(EnableMovementMarkers, 'footsteps', footsteps.length + 1);
      footstep.update(getTokenPosition(token));
      footsteps.push(footstep);
    }
  }
});

Hooks.on('refreshToken', (token) => {
  if (game.combat?.combatant?.token === token.document) {
    refreshMarkers();
  }
});

Hooks.on('renderHeadsUpDisplay', () => {
  refreshMarkers();
});

Hooks.on('ready', () => {
  if (game.user?.isGM) {
    game.combats.forEach((combat) => {
      const startPosition = getStartPosition(combat);
      if (combat.started && !startPosition) {
        module.logger.debug('initializing start position', combat);
        setStartPosition(combat);
      }
    });
  }
  refreshMarkers();
});

Hooks.on('deleteCombat', (combat) => {
  module.logger.debug('deleteCombat', combat);
  refreshMarkers();
});

Hooks.on('deleteCombatant', (combatant, _options, userId) => {
  module.logger.debug('deleteCombatant', combatant);
  if (userId === game.userId) {
    const startPosition = getStartPosition(combatant.combat);
    if (startPosition?.combatant === combatant.id) {
      module.logger.debug('deleted combatant was active combatant - resetting start position');
      setStartPosition(combatant.combat);
    }
  }
  refreshMarkers();
});

Hooks.on('updateCombat', () => {
  refreshMarkers();
});

registerListener((combat, changedByCurrentUser) => {
  if (changedByCurrentUser) {
    setStartPosition(combat);
    clearFootsteps();
  }
});

