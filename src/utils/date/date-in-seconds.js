/**
 * Converts a given timestamp to seconds since the Unix epoch.
 *
 * @param {Date | string | number} [timeStamp=new Date()] - The timestamp to convert.
 * It can be a Date object, a date string, or a numeric timestamp.
 * Defaults to the current date and time if not provided.
 *
 * @returns {number} The number of seconds since the Unix epoch.
 */
export const datedInSeconds = (timeStamp = new Date()) =>
  Math.floor(new Date(timeStamp).getTime() / 1000);


