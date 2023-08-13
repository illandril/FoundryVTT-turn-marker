import module from '../module';

const isTokenVisible = (token?: TokenDocument | null) => {
  if (!token) {
    module.logger.debug('Token not visible - it is null/undefined');
    return false;
  }
  if (!token.object) {
    module.logger.debug('Token not visible - it has no associated object');
    return false;
  }
  if (token.object.scene !== game.scenes.current) {
    module.logger.debug('Token not visible - it is on a different scene');
    return false;
  }
  if (token.hidden && !game.user?.isGM) {
    module.logger.debug('Token not visible - it is hidden');
    return false;
  }
  return true;
};

export default isTokenVisible;
