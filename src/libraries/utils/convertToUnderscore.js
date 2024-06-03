function convertToUnderscore(value) {
  return value
    .split(/\.?(?=[A-Z])/)
    .join("_")
    .toLowerCase();
}

module.exports = convertToUnderscore;
