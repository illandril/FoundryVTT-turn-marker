import module from './module';
import { registerListener } from './turnMonitor';

const listenerA = jest.fn();
const listenerB = jest.fn();
beforeAll(() => {
  registerListener(listenerA);
  registerListener(listenerB);
});

it('should call both listeners when the current user changes the combat turn', () => {
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

  expect(listenerA).toBeCalledTimes(1);
  expect(listenerB).toBeCalledTimes(1);
  expect(listenerA).toBeCalledWith(combat, true);
  expect(listenerB).toBeCalledWith(combat, true);
});

it('should call both listeners when a different user changes the combat turn', () => {
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

  expect(listenerA).toBeCalledTimes(1);
  expect(listenerB).toBeCalledTimes(1);
  expect(listenerA).toBeCalledWith(combat, false);
  expect(listenerB).toBeCalledWith(combat, false);
});

it('should call both listeners when the current user changes the combat round', () => {
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

  expect(listenerA).toBeCalledTimes(1);
  expect(listenerB).toBeCalledTimes(1);
  expect(listenerA).toBeCalledWith(combat, true);
  expect(listenerB).toBeCalledWith(combat, true);
});

describe('failure tests', () => {
  const errorSpy = jest.spyOn(module.logger, 'error');
  beforeAll(() => {
    errorSpy.mockImplementation(() => undefined);
  });
  afterAll(() => {
    errorSpy.mockReset();
  });

  it('should still call all listeners if A fails', () => {
    const error = new Error('mock error');
    listenerA.mockImplementationOnce(() => {
      throw error;
    });

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

    expect(listenerA).toBeCalledTimes(1);
    expect(listenerB).toBeCalledTimes(1);
    expect(listenerA).toBeCalledWith(combat, true);
    expect(listenerB).toBeCalledWith(combat, true);

    expect(errorSpy).toBeCalledTimes(1);
    expect(errorSpy).toBeCalledWith('Error in turnChangeCallback', error);
  });

  it('should still call all listeners if B fails', () => {
    const error = new Error('mock error');
    listenerB.mockImplementationOnce(() => {
      throw error;
    });

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

    expect(listenerA).toBeCalledTimes(1);
    expect(listenerB).toBeCalledTimes(1);
    expect(listenerA).toBeCalledWith(combat, true);
    expect(listenerB).toBeCalledWith(combat, true);

    expect(errorSpy).toBeCalledTimes(1);
    expect(errorSpy).toBeCalledWith('Error in turnChangeCallback', error);
  });
});


it('should call both listeners when a different user changes the combat round', () => {
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

  expect(listenerA).toBeCalledTimes(1);
  expect(listenerB).toBeCalledTimes(1);
  expect(listenerA).toBeCalledWith(combat, false);
  expect(listenerB).toBeCalledWith(combat, false);
});

it('should not call either listeners when the current user changes something else about the combat', () => {
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

  expect(listenerA).not.toBeCalled();
  expect(listenerB).not.toBeCalled();
});

it('should not call either listeners when the current user changes something else about the combat', () => {
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

  expect(listenerA).not.toBeCalled();
  expect(listenerB).not.toBeCalled();
});
