const getTokenPosition = (
  token: TokenDocument,
) => {
  return token.object.bounds;
};

export default getTokenPosition;
