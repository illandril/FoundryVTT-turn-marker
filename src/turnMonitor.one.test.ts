import { registerListener } from './turnMonitor';

const listener = jest.fn();
beforeAll(() => {
  registerListener(listener);
});

it('should call the listener when the current user changes the combat turn', () => {
  const combat = {
    combatant: {
      hidden: false,
      token: {
        id: 'mock-tocken-id',
        name: 'Abbie Normal',
      } as TokenDocument,
      actor: { id: 'mock-actor-id' } as Actor,
    } as Combatant,
    scene: { id: 'mock-scene-id' } as Scene,
  } as Combat;

  Hooks.callAll('updateCombat', combat, {
    turn: 3,
  }, {}, 'mock-user-id');

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(combat, true);
});

it('should call the listener when a different user changes the combat turn', () => {
  const combat = {
    combatant: {
      hidden: false,
      token: {
        id: 'mock-tocken-id',
        name: 'Abbie Normal',
      } as TokenDocument,
      actor: { id: 'mock-actor-id' } as Actor,
    } as Combatant,
    scene: { id: 'mock-scene-id' } as Scene,
  } as Combat;

  Hooks.callAll('updateCombat', combat, {
    turn: 3,
  }, {}, 'mock-other-user-id');

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(combat, false);
});

it('should call the listener when the current user changes the combat round', () => {
  const combat = {
    combatant: {
      hidden: false,
      token: {
        id: 'mock-tocken-id',
        name: 'Abbie Normal',
      } as TokenDocument,
      actor: { id: 'mock-actor-id' } as Actor,
    } as Combatant,
    scene: { id: 'mock-scene-id' } as Scene,
  } as Combat;

  Hooks.callAll('updateCombat', combat, {
    round: 5,
  }, {}, 'mock-user-id');

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(combat, true);
});

it('should call the listener when a different user changes the combat round', () => {
  const combat = {
    combatant: {
      hidden: false,
      token: {
        id: 'mock-tocken-id',
        name: 'Abbie Normal',
      } as TokenDocument,
      actor: { id: 'mock-actor-id' } as Actor,
    } as Combatant,
    scene: { id: 'mock-scene-id' } as Scene,
  } as Combat;

  Hooks.callAll('updateCombat', combat, {
    round: 5,
  }, {}, 'mock-other-user-id');

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(combat, false);
});

it('should not call the listener when the current user changes something else about the combat', () => {
  const combat = {
    combatant: {
      hidden: false,
      token: {
        id: 'mock-tocken-id',
        name: 'Abbie Normal',
      } as TokenDocument,
      actor: { id: 'mock-actor-id' } as Actor,
    } as Combatant,
    scene: { id: 'mock-scene-id' } as Scene,
  } as Combat;

  Hooks.callAll('updateCombat', combat, {
    active: true,
  }, {}, 'mock-user-id');

  expect(listener).not.toHaveBeenCalled();
});

it('should not call the listener when the current user changes something else about the combat', () => {
  const combat = {
    combatant: {
      hidden: false,
      token: {
        id: 'mock-tocken-id',
        name: 'Abbie Normal',
      } as TokenDocument,
      actor: { id: 'mock-actor-id' } as Actor,
    } as Combatant,
    scene: { id: 'mock-scene-id' } as Scene,
  } as Combat;

  Hooks.callAll('updateCombat', combat, {
    active: true,
  }, {}, 'mock-other-user-id');

  expect(listener).not.toHaveBeenCalled();
});
