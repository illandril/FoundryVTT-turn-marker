import './turnAnnouncer';

const createChatMessageSpy = jest.spyOn(ChatMessage, 'create').mockImplementation(() => ({}) as ChatMessage);

beforeAll(() => {
  Hooks.callAll('init');
});

const token = {
  id: 'mock-tocken-id',
  name: 'Token Name',
} as TokenDocument;
const actor = {
  id: 'mock-actor-id',
  name: 'Actor Name',
} as Actor;
const scene = {
  id: 'mock-scene-id',
} as Scene;

const combatant = {
  hidden: false,
  token,
  actor,
  name: 'Abbie Normal',
} as Combatant;

const hiddenCombatant = {
  ...combatant,
  hidden: true,
};

const unnamedCombatant = {
  ...combatant,
  name: '',
};

describe('with turn announcer enabled', () => {
  beforeAll(() => {
    game.settings.set('illandril-turn-marker', 'enableTurnAnnouncer', true);
  });

  it('should create a chat message when the current user changes the combat turn', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        turn: 3,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).toHaveBeenCalledTimes(1);
  });

  it.each(['Abbie Normal', 'Bob Otherson', 'Chuck'])(
    'should use the correct alias for the chat message (combatant.name=%j)',
    (name) => {
      Hooks.callAll(
        'updateCombat',
        {
          combatant: {
            hidden: false,
            token,
            actor,
            name,
          } as Combatant,
          scene,
        } as Combat,
        {
          turn: 3,
        },
        {},
        'mock-user-id',
      );

      expect(createChatMessageSpy).toHaveBeenCalledWith({
        speaker: expect.objectContaining({
          alias: `mock-format[illandril-turn-marker.turnStartedMessage][{"name":"${name}"}]`,
        }) as SpeakerType,
      });
    },
  );

  it('should use the correct alias for the chat message (combatant.name missing)', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant: unnamedCombatant,
        scene,
      } as Combat,
      {
        turn: 3,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).toHaveBeenCalledWith({
      speaker: expect.objectContaining({
        alias:
          'mock-format[illandril-turn-marker.turnStartedMessage][{"name":"mock-localize[illandril-turn-marker.unknownTurnAlias]"}]',
      }) as SpeakerType,
    });
  });

  it('should use the correct alias for the chat message (combatant is hidden)', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant: hiddenCombatant,
        scene,
      } as Combat,
      {
        turn: 3,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).toHaveBeenCalledWith({
      speaker: expect.objectContaining({
        alias:
          'mock-format[illandril-turn-marker.turnStartedMessage][{"name":"mock-localize[illandril-turn-marker.unknownTurnAlias]"}]',
      }) as SpeakerType,
    });
  });

  it('should use the correct actor for the chat message', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        turn: 3,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).toHaveBeenCalledWith({
      speaker: expect.objectContaining({
        actor,
      }) as SpeakerType,
    });
  });

  it('should use the correct scene for the chat message', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        turn: 3,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).toHaveBeenCalledWith({
      speaker: expect.objectContaining({
        scene,
      }) as SpeakerType,
    });
  });

  it('should use the correct token for the chat message', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        turn: 3,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).toHaveBeenCalledWith({
      speaker: expect.objectContaining({
        token,
      }) as SpeakerType,
    });
  });

  it('should create a chat message when the current user changes the combat round', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        round: 3,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).toHaveBeenCalledTimes(1);
  });

  it('should not create a chat message when a different user changes the combat turn', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        turn: 3,
      },
      {},
      'mock-other-user-id',
    );

    expect(createChatMessageSpy).not.toHaveBeenCalled();
  });

  it('should not create a chat message when the current user changes some other combat setting', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        active: true,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).not.toHaveBeenCalled();
  });
});

describe('with turn announcer disabled', () => {
  beforeAll(() => {
    game.settings.set('illandril-turn-marker', 'enableTurnAnnouncer', false);
  });

  it('should not create a chat message when the current user changes the combat turn', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        turn: 3,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).not.toHaveBeenCalled();
  });

  it('should not create a chat message when the current user changes the combat round', () => {
    Hooks.callAll(
      'updateCombat',
      {
        combatant,
        scene,
      } as Combat,
      {
        round: 5,
      },
      {},
      'mock-user-id',
    );

    expect(createChatMessageSpy).not.toHaveBeenCalled();
  });
});
