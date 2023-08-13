import isTokenVisible from './isTokenVisible';

const currentScene = game.scenes.current;
const otherScene = {} as Scene;

describe.each([true, false])('isGM=%j', (isGM) => {
  beforeAll(() => {
    (game.user as { isGM: boolean }).isGM = isGM;
  });

  it('returns false if token is undefined', () => {
    const isVisible = isTokenVisible(undefined);
    expect(isVisible).toBe(false);
  });

  it('returns false if token is null', () => {
    const isVisible = isTokenVisible(null);
    expect(isVisible).toBe(false);
  });

  it('returns false if token.object is undefined', () => {
    const isVisible = isTokenVisible({ hidden: false } as TokenDocument);
    expect(isVisible).toBe(false);
  });

  it('returns false if token.object.scene is not the current scene', () => {
    const isVisible = isTokenVisible({
      hidden: false,
      object: {
        scene: otherScene,
      },
    } as TokenDocument);

    expect(isVisible).toBe(false);
  });

  it('returns true if current scene, non-hidden', () => {
    const isVisible = isTokenVisible({
      hidden: false,
      object: {
        scene: currentScene,
      },
    } as TokenDocument);

    expect(isVisible).toBe(true);
  });
});

describe('isGM=true', () => {
  beforeAll(() => {
    (game.user as { isGM: boolean }).isGM = true;
  });

  it('returns true if current scene, hidden', () => {
    const isVisible = isTokenVisible({
      hidden: true,
      object: {
        scene: currentScene,
      },
    } as TokenDocument);

    expect(isVisible).toBe(true);
  });
});

describe('isGM=false', () => {
  beforeAll(() => {
    (game.user as { isGM: boolean }).isGM = false;
  });

  it('returns false if current scene, hidden', () => {
    const isVisible = isTokenVisible({
      hidden: true,
      object: {
        scene: currentScene,
      },
    } as TokenDocument);

    expect(isVisible).toBe(false);
  });
});
