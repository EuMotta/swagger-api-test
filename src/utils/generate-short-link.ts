export const generateUniqueShortLink = async (
  model: any,
  field: string = 'short_link',
): Promise<string> => {
  let shortLink: string;
  let shortLinkExists: boolean;

  do {
    shortLink = Math.random().toString(36).substr(2, 8);

    shortLinkExists = !!(await model.findOne({ [field]: shortLink }));
  } while (shortLinkExists);

  return shortLink;
};
