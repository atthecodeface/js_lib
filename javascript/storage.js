"use strict";
/**
 * This contains Directory, LocalStorage
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = exports.Directory = void 0;
/* History
 *
 * 12 April:
 *  Converted to TypeScript (temporarily removed DbStorage)
 *  Renamed FileSet to LocalStorage
 *
 * 31 March: Directory methods take files in root, suffix rather than the other ways round
 *
 */
/**
 * A directory that contains sets of files identified by the 'root' with specific 'suffixes'
 *
 * The aim is to provide a simple means to list files of a specific 'suffix'
 */
class Directory {
    /**
     * Create a new Directory with no contents
     */
    constructor() {
        this.files = new Map();
    }
    /**
     * Split the filename into a root and suffix
     */
    split_filename(filename) {
        const suffix = filename.split(".").pop();
        if (suffix) {
            const root = filename.slice(0, -suffix.length - 1);
            return [root, suffix];
        }
        else {
            return [filename, ""];
        }
    }
    /**
     * Clear the contents
     */
    clear() {
        this.files.clear();
    }
    /**
     * Determine if a file with a given suffix is in the directory
     *
     * @param root The root (basename) of the file
     * @param suffix The suffix (type) of the file
     * @return True if the file 'root.suffix' is in the directory
     */
    contains_file(root, suffix = "") {
        if (suffix == "") {
            [root, suffix] = this.split_filename(root);
        }
        if (!this.files.has(suffix)) {
            return false;
        }
        return this.files.get(suffix).has(root);
    }
    /**
     * Add file to the directory; if it already exists, then keep it
     *
     * @param root The root (basename) of the file
     * @param suffix The suffix (type) of the file
     */
    add_file(root, suffix = "") {
        if (suffix == "") {
            [root, suffix] = this.split_filename(root);
        }
        if (!this.files.has(suffix)) {
            this.files.set(suffix, new Set());
        }
        const files_of_suffix = this.files.get(suffix);
        if (files_of_suffix.has(root)) {
            return false;
        }
        else {
            files_of_suffix.add(root);
            return true;
        }
    }
    /**
     * Remove a file from the directory; if it does not exist, then do nothing
     *
     * @param root The root (basename) of the file
     * @param suffix The suffix (type) of the file
     */
    delete_file(root, suffix = "") {
        if (suffix == "") {
            [root, suffix] = this.split_filename(root);
        }
        if (!this.files.has(suffix)) {
            return false;
        }
        const files_of_suffix = this.files.get(suffix);
        const has_file = files_of_suffix.has(root);
        files_of_suffix.delete(root);
        if (files_of_suffix.size == 0) {
            this.files.delete(suffix);
        }
        return has_file;
    }
    /**
     *  Retrieve all of the files with a particular suffix in this Directory
     *
     * @param {string} suffix The suffix (type) of the file
     * @return {Set<string>} Set of all the root names of the files with the given suffix in the Directory
     */
    files_of_type(suffix) {
        const file_set = this.files.get(suffix);
        if (!file_set) {
            return new Set();
        }
        return file_set;
    }
}
exports.Directory = Directory;
/**
 * A class that manages local storage using a 'prefix' into the actual storage (to permit more than one such class with an 'application')
 *
 */
class LocalStorage {
    /**
     * Construct a new LocalStorage for a given prefix, and retrieve the directory contents
     *
     */
    constructor(storage, prefix) {
        this.storage = storage;
        this.prefix = prefix;
        this.directory = new Directory();
        this.load_dir();
    }
    /**
     * Load the directory from the storage
     *
     */
    load_dir() {
        this.directory.clear();
        const n = this.storage.length;
        const pl = this.prefix.length;
        for (let i = 0; i < n; i++) {
            let k = this.storage.key(i);
            if (k.startsWith(this.prefix)) {
                const f = k.slice(pl);
                this.directory.add_file(f);
            }
        }
    }
    /**
     * Load a file from Storage immediately
     *
     * This does not check to see if it is in the directory - it goes straight to the storage
     *
     */
    load_file(filename) {
        if (!this.directory.contains_file(filename)) {
            return null;
        }
        let f = this.prefix + filename;
        return this.storage.getItem(f);
    }
    /**
     * Save a file to Storage
     *
     * This will add the file to the directory as well as storing it
     *
     */
    save_file(filename, data) {
        let f = this.prefix + filename;
        this.storage.setItem(f, data);
        this.directory.add_file(filename);
    }
    /**
     * Delete a file from Storage
     *
     * This will remove the file from the directory as well as deleting it
     *
     * Returns true if the file was in the storage
     */
    delete_file(filename) {
        let f = this.prefix + filename;
        this.storage.removeItem(f);
        return this.directory.delete_file(filename);
    }
    /**
     * Request to get the file list
     *
     */
    request_get_file_list(user_callback) {
        user_callback(true);
    }
    request_rename_file(old_filename, new_filename, user_callback) {
        if (!this.directory.contains_file(old_filename) ||
            this.directory.contains_file(new_filename)) {
            user_callback(false);
            return;
        }
        let data = this.load_file(old_filename);
        this.save_file(new_filename, data);
        this.delete_file(old_filename);
        user_callback(true);
    }
    /**
     * Request to delete a file from Storage, and invoke callback when it completes
     *
     */
    request_delete_file(filename, user_callback) {
        const success = this.delete_file(filename);
        user_callback(success);
    }
    /**
     * Request to load a file from Storage, and invoke callback when it completes
     *
     */
    request_load_file(filename, user_callback) {
        const data = this.load_file(filename);
        user_callback(data);
    }
    /**
     * Request to save a file to Storage, and invoke callback when it completes (with an indication of success or failure)
     *
     * This will add the file to the directory as well as storing it
     *
     */
    request_save_file(filename, data, user_callback) {
        this.save_file(filename, data);
        user_callback(true);
    }
    /**
     * Return the directory contents
     *
     */
    dir() {
        return this.directory;
    }
}
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=storage.js.map