const fullDateTime = (val?: string): string => {
  if (val) {
    const date = new Date(val);
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return time + " " + date.toLocaleDateString("vi-VN");
  } else {
    return "";
  }
};

const fullDate = (val?: string): string => {
  if (val) {
    const date = new Date(val);
    return date.toLocaleDateString("vi-VN");
  } else {
    return "";
  }
};

export const dateFormat = {
  fullDate,
  fullDateTime,
};
