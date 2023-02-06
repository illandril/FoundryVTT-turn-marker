import module from './module';

type TurnChangeCallback = (combat: Combat, changedByCurrentUser: boolean) => void;
const callbacks: TurnChangeCallback[] = [];

Hooks.on('updateCombat', async (combat: Combat, update, _options, userId) => {
  const changedByCurrentUser = game.user?.id === userId;
  module.logger.debug('updateCombat', combat, update, userId, changedByCurrentUser);
  if (update.turn === undefined && update.round === undefined) {
    module.logger.debug('Combat turn did not change');
    return;
  }
  for (const callback of callbacks) {
    try {
      callback(combat, changedByCurrentUser);
    } catch (err) {
      module.logger.error('Error in turnChangeCallback', err);
    }
  }
});

export const registerListener = (callback: TurnChangeCallback) => {
  callbacks.push(callback);
};
