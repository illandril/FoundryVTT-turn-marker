import './turnAnnouncer';

const createChatMessageSpy = jest.spyOn(ChatMessage, 'create').mockImplementation(() => ({} as ChatMessage));

beforeAll(() => {
  Hooks.callAll('init');
});

const actor = {
  id: 'mock-actor-id',
} as Actor;
const scene = {
  id: 'mock-scene-id',
} as Scene;

describe('with turn announcer enabled', () => {
  beforeAll(() => {
    game.settings.set('illandril-turn-marker', 'enableTurnAnnouncer', true);
  });

  it('should create a chat message when the current user changes the combat turn', () => {
    const token = {
      id: 'mock-tocken-id',
      name: 'Abbie Normal',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).toBeCalledTimes(1);
  });

  it.each(['Abbie Normal', 'Bob Otherson', 'Chuck'])('should use the correct alias for the chat message (token.name=%j)', (tokenName) => {
    const token = {
      id: 'mock-tocken-id',
      name: tokenName,
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).toBeCalledWith({
      speaker: expect.objectContaining({
        alias: `mock-format[illandril-turn-marker.turnStartedMessage][{"token":"${tokenName}"}]`,
      }) as SpeakerType,
    });
  });

  it('should use the correct alias for the chat message (token.name is missing)', () => {
    const token = {
      id: 'mock-tocken-id',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).toBeCalledWith({
      speaker: expect.objectContaining({
        alias: 'mock-format[illandril-turn-marker.turnStartedMessage][{"token":"mock-localize[illandril-turn-marker.unknownTurnAlias]"}]',
      }) as SpeakerType,
    });
  });

  it('should use the correct alias for the chat message (combatant is hidden)', () => {
    const token = {
      id: 'mock-tocken-id',
      name: 'Abbie Normal',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: true,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).toBeCalledWith({
      speaker: expect.objectContaining({
        alias: 'mock-format[illandril-turn-marker.turnStartedMessage][{"token":"mock-localize[illandril-turn-marker.unknownTurnAlias]"}]',
      }) as SpeakerType,
    });
  });

  it('should use the correct actor for the chat message', () => {
    const token = {
      id: 'mock-tocken-id',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).toBeCalledWith({
      speaker: expect.objectContaining({
        actor,
      }) as SpeakerType,
    });
  });

  it('should use the correct scene for the chat message', () => {
    const token = {
      id: 'mock-tocken-id',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).toBeCalledWith({
      speaker: expect.objectContaining({
        scene,
      }) as SpeakerType,
    });
  });

  it('should use the correct token for the chat message', () => {
    const token = {
      id: 'mock-tocken-id',
    } as TokenDocument;


    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).toBeCalledWith({
      speaker: expect.objectContaining({
        token,
      }) as SpeakerType,
    });
  });

  it('should create a chat message when the current user changes the combat round', () => {
    const token = {
      id: 'mock-tocken-id',
      name: 'Abbie Normal',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      round: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).toBeCalledTimes(1);
  });

  it('should not create a chat message when a different user changes the combat turn', () => {
    const token = {
      id: 'mock-tocken-id',
      name: 'Abbie Normal',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-other-user-id');

    expect(createChatMessageSpy).not.toBeCalled();
  });

  it('should not create a chat message when the current user changes some other combat setting', () => {
    const token = {
      id: 'mock-tocken-id',
      name: 'Abbie Normal',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      active: true,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).not.toBeCalled();
  });
});

describe('with turn announcer disabled', () => {
  beforeAll(() => {
    game.settings.set('illandril-turn-marker', 'enableTurnAnnouncer', false);
  });

  it('should not create a chat message when the current user changes the combat turn', () => {
    const token = {
      id: 'mock-tocken-id',
      name: 'Abbie Normal',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      turn: 3,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).not.toBeCalled();
  });

  it('should not create a chat message when the current user changes the combat round', () => {
    const token = {
      id: 'mock-tocken-id',
      name: 'Abbie Normal',
    } as TokenDocument;

    Hooks.callAll('updateCombat', {
      combatant: {
        hidden: false,
        token,
        actor,
      } as Combatant,
      scene,
    } as Combat, {
      round: 5,
    }, {}, 'mock-user-id');

    expect(createChatMessageSpy).not.toBeCalled();
  });
});
