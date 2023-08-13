const getTokenPosition = (
  token?: TokenDocument | null,
) => {
  const bounds = token?.object?.bounds;
  if (bounds) {
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };
  }
  return undefined;
};

export default getTokenPosition;
