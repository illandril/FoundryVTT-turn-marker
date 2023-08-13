import getTokenPosition from './getTokenPosition';

const getCombatantPosition = (combatant?: Combatant | null) => {
  return getTokenPosition(combatant?.token);
};

export default getCombatantPosition;
