export function areObjectsEqual(obj1, obj2) {
  // Check if both objects are objects
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return obj1 === obj2;
  }

  // Get the keys of obj1 and obj2
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Iterate over the keys and compare the values
  for (let key of keys1) {
    // Check if the key exists in obj2
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }

    // Recursively compare nested objects
    if (!areObjectsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  // If all keys and values are the same, return true
  return true;
}
