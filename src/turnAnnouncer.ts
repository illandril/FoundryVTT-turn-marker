import module from './module';
import { registerListener } from './turnMonitor';

const EnableTurnAnnouncer = module.settings.register('enableTurnAnnouncer', Boolean, true, {
  hasHint: true,
});

registerListener((combat, changedByCurrentUser) => {
  if (changedByCurrentUser && EnableTurnAnnouncer.get() && combat.combatant) {
    ChatMessage.create({
      speaker: {
        alias: module.localize('turnStartedMessage', {
          name: (combat.combatant.hidden ? undefined : combat.combatant.name) || module.localize('unknownTurnAlias'),
        }),
        actor: combat.combatant.hidden ? undefined : combat.combatant.actor || undefined,
        token: combat.combatant.hidden ? undefined : combat.combatant.token || undefined,
        scene: combat.scene || undefined,
      },
    });
  }
});
