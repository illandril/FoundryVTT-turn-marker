import module from './module';
import { registerListener } from './turnMonitor';

registerListener((combat, changedByCurrentUser) => {
  if (changedByCurrentUser) {
    ChatMessage.create({
      speaker: {
        alias: module.localize('turnStartedMessage', {
          token: combat.combatant.token.name,
        }),
        actor: combat.combatant.actor,
        token: combat.combatant.token,
        scene: combat.scene,
      },
    });
  }
});
