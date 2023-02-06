const getCombatantPosition = (combatant: Combatant) => {
  const gridSize = combatant.combat.scene.dimensions.size;
  return {
    x: combatant.token.x,
    y: combatant.token.y,
    width: combatant.token.width * gridSize,
    height: combatant.token.height * gridSize,
  };
};

export default getCombatantPosition;
