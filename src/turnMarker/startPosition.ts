import module from '../module';
import getCombatantPosition from './getCombatantPosition';

const START_POSITION_KEY = 'startPosition';

export type StartPosition = {
  combatant: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getStartPosition = (combat: Combat) => {
  if (!combat) {
    return undefined;
  }
  return combat.getFlag(module.id, START_POSITION_KEY) as StartPosition | undefined;
};

export const setStartPosition = (combat: Combat) => {
  const position = combat.started ? getCombatantPosition(combat.combatant) : null;
  if (position) {
    const startPosition: StartPosition = {
      // biome-ignore lint/style/noNonNullAssertion: combatant must be defined ,because we got a position
      combatant: combat.combatant!.id,
      ...position,
    };
    combat.setFlag(module.id, START_POSITION_KEY, startPosition);
  } else {
    combat.unsetFlag(module.id, START_POSITION_KEY);
  }
};
