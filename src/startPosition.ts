import getCombatantPosition from './getCombatantPosition';
import module from './module';

const START_POSITION_KEY = 'startPosition';

export type StartPosition = {
  combatant: string
  x: number
  y: number
  width: number
  height: number
};

export const getStartPosition = (combat: Combat) => {
  if (!combat) {
    return undefined;
  }
  return combat.getFlag(module.id, START_POSITION_KEY) as StartPosition | undefined;
};

export const setStartPosition = (combat: Combat) => {
  if (combat.started && combat.combatant) {
    const startPosition: StartPosition = {
      combatant: combat.combatant.id,
      ...getCombatantPosition(combat.combatant),
    };
    combat.setFlag(module.id, START_POSITION_KEY, startPosition);
  } else {
    combat.unsetFlag(module.id, START_POSITION_KEY);
  }
};
