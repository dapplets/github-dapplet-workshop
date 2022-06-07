import { PersistentUnorderedMap, MapEntry, Context } from 'near-sdk-core';

// MODELS

const accountsByCommentId = new PersistentUnorderedMap<string, string[]>('m');

// READ

/**
 * Retrieves a Map of all NEAR Account IDs by comments IDs
 * @returns Map of all NEAR Account IDs by comments IDs
 */
export function getAll(): MapEntry<string, string[]>[] {
  return accountsByCommentId.entries();
}

/**
 * Retrieves an array of NEAR Account IDs for given comment ID
 * @param commentId comment ID
 * @returns Array of NEAR Account IDs
 */
export function getAccountsByCommentId(commentId: string): string[] {
  return accountsByCommentId.contains(commentId) ? accountsByCommentId.getSome(commentId) : [];
}

// WRITE

/**
 * Adds NEAR Account ID by comment ID
 * @param commentId comment ID
 */
export function addLike(commentId: string): void {
  _insert(accountsByCommentId, commentId, Context.sender);
}

/**
 * Removes NEAR Account ID by comment ID
 * @param commentId comment ID
 */
export function removeLike(commentId: string): void {
  _delete(accountsByCommentId, commentId, Context.sender);
}

/**
 * Clears all storage of the contract (for development stage)
 */
export function clearAll(): void {
  accountsByCommentId.clear();
}

// HELPERS

/**
 * Inserts value to array stored in a map, if value is not exist
 * @param map Map where to insert the value
 * @param key Key in a map, by which array is stored
 * @param value Value to be added to array
 */
function _insert(map: PersistentUnorderedMap<string, string[]>, key: string, value: string): void {
  if (!map.contains(key)) map.set(key, [value]);

  const arr = map.getSome(key);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == value) return;
  }

  arr.push(value);
  map.set(key, arr);
}

/**
 * Deletes value from array stored in a map, if value is exist
 * @param map Map where to delete the value
 * @param key Key in a map, by which array is stored
 * @param value Value to be removed from array
 */
function _delete(map: PersistentUnorderedMap<string, string[]>, key: string, value: string): void {
  if (!map.contains(key)) return;

  const arr = map.getSome(key);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == value) {
      arr[i] = arr[arr.length - 1];
      arr.pop();
      break;
    }
  }

  map.set(key, arr);
}
