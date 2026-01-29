export const getTypeTextColor = (type?: number) => {
  switch (type) {
    case 1:
      return "text-green-500";
    case 2:
      return "text-yellow-500";
    case 3:
      return "text-red-500";
    default:
      return "text-blue-500";
  }
};

export const getTypeColor = (type?: number) => {
  switch (type) {
    case 1:
      return "bg-green-50 border-green-200"; // success
    case 2:
      return "bg-yellow-50 border-yellow-200"; // warning
    case 3:
      return "bg-red-50 border-red-200"; // error
    default:
      return "bg-blue-50 border-blue-200"; // info
  }
};
