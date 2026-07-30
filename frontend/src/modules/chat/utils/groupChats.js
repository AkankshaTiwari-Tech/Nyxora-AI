export function getChatGroup(dateString) {
  const created = new Date(dateString);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const chatDay = new Date(
    created.getFullYear(),
    created.getMonth(),
    created.getDate()
  );

  const diff = (today - chatDay) / (1000 * 60 * 60 * 24);

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff <= 7) return "Previous 7 Days";

  return "Older";
}

export function groupChats(chats = []) {
  return chats.reduce((groups, chat) => {
    const group = getChatGroup(chat.createdAt);

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(chat);

    return groups;
  }, {});
}

export const GROUP_ORDER = [
  "Today",
  "Yesterday",
  "Previous 7 Days",
  "Older",
];