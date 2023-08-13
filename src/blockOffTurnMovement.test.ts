import './blockOffTurnMovement';

beforeAll(() => {
  Hooks.callAll('init');
});
afterEach(() => {
  jest.useRealTimers();
});

const notificationWarnSpy = jest.spyOn(ui.notifications, 'warn').mockImplementation(() => 0);

describe.each([true, false])('isGM=%j', (isGM) => {
  beforeAll(() => {
    (game.user as { isGM: boolean }).isGM = isGM;
  });

  describe('both settings off', () => {
    beforeAll(() => {
      game.settings.set('illandril-turn-marker', 'blockPlayerOffTurnMovement', false);
      game.settings.set('illandril-turn-marker', 'blockGMOffTurnMovement', false);
    });

    it('should not block on turn movement', () => {
      const token = { name: 'Token Name' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const changes = { _id: 'mock-id', x: 100, y: 150 };
      const result = Hooks.call('preUpdateToken', token, changes, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
      expect(changes).toEqual({ _id: 'mock-id', x: 100, y: 150 });
    });

    it('should not block off turn movement', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const changes = { _id: 'mock-id', x: 100, y: 150 };
      const result = Hooks.call('preUpdateToken', otherToken, changes, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
      expect(changes).toEqual({ _id: 'mock-id', x: 100, y: 150 });
    });

    it('should not block movement if combat has not started', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: false,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const changes = { _id: 'mock-id', x: 100, y: 150 };
      const result = Hooks.call('preUpdateToken', otherToken, changes, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
      expect(changes).toEqual({ _id: 'mock-id', x: 100, y: 150 });
    });

    it('should not block movement if there is no combat', () => {
      const token = { name: 'Token Name' } as TokenDocument;

      (game as { combat?: Combat }).combat = undefined;

      const changes = { _id: 'mock-id', x: 100, y: 150 };
      const result = Hooks.call('preUpdateToken', token, changes, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
      expect(changes).toEqual({ _id: 'mock-id', x: 100, y: 150 });
    });
  });

  describe('both settings on', () => {
    beforeAll(() => {
      game.settings.set('illandril-turn-marker', 'blockPlayerOffTurnMovement', true);
      game.settings.set('illandril-turn-marker', 'blockGMOffTurnMovement', true);
    });

    it('should not block on turn movement', () => {
      const token = { name: 'Token Name' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const changes = { _id: 'mock-id', x: 100, y: 150 };
      const result = Hooks.call('preUpdateToken', token, changes, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
      expect(changes).toEqual({ _id: 'mock-id', x: 100, y: 150 });
    });

    it.each(['x', 'y', 'elevation', 'rotation'])('should block off turn movement (%s)', (field) => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', [field]: 100 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(1);
    });

    it.each([['width', 10], ['name', 'Bob']])('should not block off turn non-movement updates (%s=%j)', (field, value) => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const changes = { _id: 'mock-id', [field]: value };
      const result = Hooks.call('preUpdateToken', otherToken, changes, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
      expect(changes).toEqual({ _id: 'mock-id', [field]: value });
    });

    it('should filter out movement updates in mixed off turn updates (%s=%j)', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const changes = { _id: 'mock-id', width: 10, x: 100, y: 150, elevation: 15, rotation: 60, name: 'Bob' };
      const result = Hooks.call('preUpdateToken', otherToken, changes, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).toBeCalledTimes(1);
      expect(changes).toEqual({ _id: 'mock-id', width: 10, name: 'Bob' });
    });

    it('should block off turn movement', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(1);
    });

    it('should only notify once every 3 seconds when moving the same token', () => {
      jest.useFakeTimers();
      jest.setSystemTime(1691888450000);

      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      let result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(1);

      jest.setSystemTime(1691888452999);
      result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(1);

      jest.setSystemTime(1691888453000);
      result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(2);

      jest.setSystemTime(1691888453001);
      result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');
      jest.setSystemTime(1691888454000);
      result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');
      jest.setSystemTime(1691888455000);
      result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');
      jest.setSystemTime(1691888455999);
      result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(2);

      jest.setSystemTime(1691888456000);
      result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(3);
    });

    it('should only notify immediately when switching tokens', () => {
      jest.useFakeTimers();

      const token = { name: 'Token Name' } as TokenDocument;
      const otherTokenA = {} as TokenDocument;
      const otherTokenB = {} as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      let result = Hooks.call('preUpdateToken', otherTokenA, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(1);

      result = Hooks.call('preUpdateToken', otherTokenB, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(2);
    });

    it('should not block movement if combat has not started', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: false,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
    });

    it('should not block movement if there is no combat', () => {
      const token = { name: 'Token Name' } as TokenDocument;

      (game as { combat?: Combat }).combat = undefined;

      const result = Hooks.call('preUpdateToken', token, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
    });
  });
});

describe('isGM=true', () => {
  beforeAll(() => {
    (game.user as { isGM: boolean }).isGM = true;
  });

  describe('player setting on, GM setting off', () => {
    beforeAll(() => {
      game.settings.set('illandril-turn-marker', 'blockGMOffTurnMovement', false);
      game.settings.set('illandril-turn-marker', 'blockPlayerOffTurnMovement', true);
    });

    it('should not block off turn movement when setting is disabled', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
    });
  });

  describe('player setting off, GM setting on', () => {
    beforeAll(() => {
      game.settings.set('illandril-turn-marker', 'blockGMOffTurnMovement', true);
      game.settings.set('illandril-turn-marker', 'blockPlayerOffTurnMovement', false);
    });

    it('should use the correct notification when blocking off turn movement', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(1);
      expect(notificationWarnSpy).toBeCalledWith('mock-format[illandril-turn-marker.notification.offTurnMovementBlocked.GM][{"token":"Bob Otherson","hotkey":"mock-keycode-display-string"}]');
    });

    describe('with missing keybinding', () => {
      const keybindingSpy = jest.spyOn(game.keybindings, 'get');
      beforeEach(() => {
        keybindingSpy.mockReturnValue([]);
      });
      afterEach(() => {
        keybindingSpy.mockReset();
      });

      it('should use the correct notification when blocking off turn movement', () => {
        const token = { name: 'Token Name' } as TokenDocument;
        const otherToken = { name: 'Bob Otherson' } as TokenDocument;

        (game as { combat?: Combat }).combat = {
          started: true,
          combatant: {
            token,
          } as Combatant,
        } as Combat;

        const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

        expect(result).toBe(false);
        expect(notificationWarnSpy).toBeCalledTimes(1);
        expect(notificationWarnSpy).toBeCalledWith('mock-format[illandril-turn-marker.notification.offTurnMovementBlocked.player][{"token":"Bob Otherson"}]');
      });
    });


    it('should not block off turn movement when key is pressed', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      SIMULATE.keyDown('illandril-turn-marker', 'allowMovement');

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      SIMULATE.keyUp('illandril-turn-marker', 'allowMovement');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
    });
  });
});

describe('isGM=false', () => {
  beforeAll(() => {
    (game.user as { isGM: boolean }).isGM = false;
  });

  describe('player setting off, GM setting on', () => {
    beforeAll(() => {
      game.settings.set('illandril-turn-marker', 'blockGMOffTurnMovement', true);
      game.settings.set('illandril-turn-marker', 'blockPlayerOffTurnMovement', false);
    });

    it('should not block off turn movement when setting is disabled', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(true);
      expect(notificationWarnSpy).not.toBeCalled();
    });
  });

  describe('player setting on, GM setting off', () => {
    beforeAll(() => {
      game.settings.set('illandril-turn-marker', 'blockGMOffTurnMovement', false);
      game.settings.set('illandril-turn-marker', 'blockPlayerOffTurnMovement', true);
    });

    it('should use the correct notification when blocking off turn movement', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(1);
      expect(notificationWarnSpy).toBeCalledWith('mock-format[illandril-turn-marker.notification.offTurnMovementBlocked.player][{"token":"Bob Otherson"}]');
    });

    it('should block off turn movement even when key is pressed', () => {
      const token = { name: 'Token Name' } as TokenDocument;
      const otherToken = { name: 'Bob Otherson' } as TokenDocument;

      (game as { combat?: Combat }).combat = {
        started: true,
        combatant: {
          token,
        } as Combatant,
      } as Combat;

      SIMULATE.keyDown('illandril-turn-marker', 'allowMovement');

      const result = Hooks.call('preUpdateToken', otherToken, { _id: 'mock-id', x: 100, y: 150 }, {}, 'mock-user-id');

      SIMULATE.keyUp('illandril-turn-marker', 'allowMovement');

      expect(result).toBe(false);
      expect(notificationWarnSpy).toBeCalledTimes(1);
    });
  });
});
