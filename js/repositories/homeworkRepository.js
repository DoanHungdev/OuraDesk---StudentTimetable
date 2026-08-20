/**
 * HomeworkRepository: Unified Local-First Repository for Homework & Assignments (High School THPT Mode)
 * Implements clean CRUD, Single Source of Truth, and Seed Versioning.
 */
import { INITIAL_HIGH_SCHOOL_HOMEWORK } from '../data/highSchoolData.js';

export const HomeworkRepository = {
  SEED_VERSION_KEY: 'class_schedule_homework_seed_version_v1',
  STORAGE_KEY: 'class_schedule_thpt_hw_v2',
  CURRENT_SEED_VERSION: 'v1.0.0',

  /**
   * Seed demo homework ONLY on first launch
   */
  seedIfEmpty(initialData = INITIAL_HIGH_SCHOOL_HOMEWORK) {
    try {
      const seededVersion = localStorage.getItem(this.SEED_VERSION_KEY);
      const existingData = localStorage.getItem(this.STORAGE_KEY);

      if (!seededVersion && existingData === null) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
        localStorage.setItem(this.SEED_VERSION_KEY, this.CURRENT_SEED_VERSION);
        return initialData;
      }
    } catch (e) {
      console.error('Failed to seed homework:', e);
    }
    return this.getAll();
  },

  /**
   * Get all homework from storage (User Data Always Wins)
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data !== null) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read homework from storage:', e);
    }
    return this.seedIfEmpty();
  },

  getById(id) {
    const list = this.getAll();
    return list.find(h => h.id === id) || null;
  },

  create(hw) {
    const list = this.getAll();
    const newItem = {
      ...hw,
      id: hw.id || ('hw-' + Date.now()),
      status: hw.status || 'todo',
      completed: hw.status === 'done' || Boolean(hw.completed),
      createdAt: hw.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newItem);
    this._saveAll(list);
    return newItem;
  },

  update(id, updates) {
    let list = this.getAll();
    let updatedItem = null;
    list = list.map(item => {
      if (item.id === id) {
        const isDone = updates.status === 'done' || (updates.completed !== undefined ? Boolean(updates.completed) : item.status === 'done');
        updatedItem = { 
          ...item, 
          ...updates, 
          status: isDone ? 'done' : 'todo',
          completed: isDone,
          updatedAt: new Date().toISOString() 
        };
        return updatedItem;
      }
      return item;
    });
    this._saveAll(list);
    return updatedItem;
  },

  toggleComplete(id, completed) {
    return this.update(id, { 
      status: completed ? 'done' : 'todo',
      completed: Boolean(completed)
    });
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(item => item.id !== id);
    this._saveAll(filtered);
    return filtered;
  },

  clear() {
    this._saveAll([]);
  },

  resetToDemo(demoData = INITIAL_HIGH_SCHOOL_HOMEWORK) {
    this._saveAll(demoData);
    localStorage.setItem(this.SEED_VERSION_KEY, this.CURRENT_SEED_VERSION);
    return demoData;
  },

  _saveAll(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list || []));
    } catch (e) {
      console.error('Failed to persist homework:', e);
    }
  }
};
