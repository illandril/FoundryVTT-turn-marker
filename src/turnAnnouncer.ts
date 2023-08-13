import module from './module';
import { registerListener } from './turnMonitor';

const EnableTurnAnnouncer = module.settings.register('enableTurnAnnouncer', Boolean, true, {
  hasHint: true,
});

registerListener((combat, changedByCurrentUser) => {
  if (changedByCurrentUser && EnableTurnAnnouncer.get()) {
    ChatMessage.create({
      speaker: {
        alias: module.localize('turnStartedMessage', {
          token: (combat.combatant.hidden ? null : combat.combatant.token.name) || module.localize('unknownTurnAlias'),
        }),
        actor: combat.combatant.hidden ? undefined : combat.combatant.actor,
        token: combat.combatant.hidden ? undefined : combat.combatant.token,
        scene: combat.scene,
      },
    });
  }
});
