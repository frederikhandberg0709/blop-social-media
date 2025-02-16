export const extractQuotedPostIds = (content: any): string[] => {
  const postIds: string[] = [];

  if (typeof content === "string") {
    const matches = content.matchAll(/\/post\/([a-zA-Z0-9-_]+)/g);
    return [...new Set(Array.from(matches, (m) => m[1]))];
  }

  if (Array.isArray(content)) {
    content.forEach((item) => {
      if (typeof item === "string") {
        const matches = item.matchAll(/\/post\/([a-zA-Z0-9-_]+)/g);
        const ids = Array.from(matches, (m) => m[1]);
        postIds.push(...ids);
      }
    });
  }

  return [...new Set(postIds)];
};
