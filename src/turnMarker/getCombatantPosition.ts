import getTokenPosition from './getTokenPosition';

const getCombatantPosition = (combatant: Combatant) => {
  return getTokenPosition(combatant.token);
};

export default getCombatantPosition;
