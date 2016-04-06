export interface IStorage<T> {

    /**
     * Get item.
     * @returns {Promise<*|Error>} Returns the object or error. Error if key is not found
     * or on IO/network failures.
     */
    get(key: string): Promise<T>;

    /**
     * Set item.
     * @returns {Promise<void|Error>} Successful fulfillment, or error (due to IO/network etc.)
     */
    set(key: string, value: T): Promise<void>;

    /**
     * Check if item exists
     * @returns {Promise<boolean|Error>} Errors may occur on IO/network failures.
     */
    exists(key: string): Promise<boolean>;

    /**
     * Remove item.
     * @returns {Promise<void|Error>} Successful fulfillment, or error (due to IO/network etc.) 
     */
    remove(key: string): Promise<void>;

    /**
     * Clears the entire store.
     * @returns {Promise<void>}
     * */
    clear(): Promise<void>;

    /**
     * Get item if it exists in one-go.
     * @returns {Promise<{exists: {Boolean}, result: *}} | Error>}. R.exists indicates if item exists.
     * If item exists, R.result is the item value, or else null.
     */
    tryGet(key: string): Promise<TryGetResult<T>>;

    /**
     * Get item if it exists in one-go, or set the provided value. (Eg: database, network i/o in one round trip)
     * @param key {string} The key
     * @param value {*} The default value to be set, if the key doesn't already exist. 
     * @param onSetValue {(*) => Promise<*>} Executed just before set, if and only if set is the provided
     * value is going to be set as the value for the key. Use this to perform operations on the value
     * that would be un-necessary if it returned an existing value.
     * @returns {Promise<{isNew: {Boolean}, result: *}} | Error>}. R.isNew indicates if the new value has
     * been used. False if it already existed. R.result is the item value.
     */
    tryGetOrSet(key: string, value: T, onBeforeSetValue?: (value: T) => Promise<any>): Promise<TryGetOrSetResult<T>>;
}

export interface TryGetResult<T> {
    exists: boolean;
    result: T;
}

export interface TryGetOrSetResult<T> {
    isNew: boolean;
    result: T;
}