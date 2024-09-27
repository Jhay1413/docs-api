type AnyObject = { [key: string]: any };

export function convertDatesToISOString(obj: AnyObject): AnyObject {
  // If the current value is an array, recursively convert each element
  if (Array.isArray(obj)) {
    return obj.map((item) => convertDatesToISOString(item));
  }

  // If the current value is an object, recursively convert each key-value pair
  if (typeof obj === 'object' && obj !== null) {
    const newObj: AnyObject = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        // If the value is a Date, convert it to ISO string
        if (value instanceof Date) {
          newObj[key] = value.toISOString();
        } 
        // If it's an object (including arrays), recursively convert
        else if (typeof value === 'object') {
          newObj[key] = convertDatesToISOString(value);
        } 
        // Otherwise, keep the original value
        else {
          newObj[key] = value;
        }
      }
    }
    return newObj;
  }

  // If the value is not an object or array, return it as is
  return obj;
}
