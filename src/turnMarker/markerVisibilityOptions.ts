import module from '../module';

export type VisibilityOption = 'ALL' | 'GMS' | 'PLAYERS' | 'NONE';

export const VISIBILITY_OPTIONS: Record<VisibilityOption, string> = {
  // biome-ignore lint/style/useNamingConvention: Legacy
  ALL: `${module.id}.setting.visibility.choice.ALL`,
  // biome-ignore lint/style/useNamingConvention: Legacy
  GMS: `${module.id}.setting.visibility.choice.GMS`,
  // biome-ignore lint/style/useNamingConvention: Legacy
  PLAYERS: `${module.id}.setting.visibility.choice.PLAYERS`,
  // biome-ignore lint/style/useNamingConvention: Legacy
  NONE: `${module.id}.setting.visibility.choice.NONE`,
};

export type Setting = { get: () => VisibilityOption };

export const showMarker = (option: Setting) => {
  const setting = option.get();
  switch (setting) {
    case 'ALL':
      return true;
    case 'NONE':
      return false;
    case 'GMS':
      return !!game.user?.isGM;
    case 'PLAYERS':
      return !game.user?.isGM;
    default:
      module.logger.error('Unexpected visibility setting value', setting);
      return false;
  }
};
