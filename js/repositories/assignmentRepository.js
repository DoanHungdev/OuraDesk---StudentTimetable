/**
 * AssignmentRepository: Unified Local-First Repository for Assignments & Deadlines (University Mode)
 * Implements clean CRUD, Single Source of Truth, and Seed Versioning.
 */
import { INITIAL_ASSIGNMENTS } from '../data/mockData.js';

export const AssignmentRepository = {
  SEED_VERSION_KEY: 'class_schedule_assignment_seed_version_v1',
  STORAGE_KEY: 'class_schedule_univ_asg_v2',
  CURRENT_SEED_VERSION: 'v1.0.0',

  /**
   * Seed demo assignments ONLY on first launch
   */
  seedIfEmpty(initialData = INITIAL_ASSIGNMENTS) {
    try {
      const seededVersion = localStorage.getItem(this.SEED_VERSION_KEY);
      const existingData = localStorage.getItem(this.STORAGE_KEY);

      if (!seededVersion && existingData === null) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
        localStorage.setItem(this.SEED_VERSION_KEY, this.CURRENT_SEED_VERSION);
        return initialData;
      }
    } catch (e) {
      console.error('Failed to seed assignments:', e);
    }
    return this.getAll();
  },

  /**
   * Get all assignments from storage (User Data Always Wins)
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data !== null) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read assignments from storage:', e);
    }
    // If null and not seeded, seed initial data once
    return this.seedIfEmpty();
  },

  getById(id) {
    const list = this.getAll();
    return list.find(a => a.id === id) || null;
  },

  create(assignment) {
    const list = this.getAll();
    const newItem = {
      ...assignment,
      id: assignment.id || ('asg-' + Date.now()),
      completed: Boolean(assignment.completed),
      createdAt: assignment.createdAt || new Date().toISOString(),
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
        updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return item;
    });
    this._saveAll(list);
    return updatedItem;
  },

  toggleComplete(id, completed) {
    return this.update(id, { 
      completed: Boolean(completed), 
      status: completed ? 'done' : 'todo' 
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

  resetToDemo(demoData = INITIAL_ASSIGNMENTS) {
    this._saveAll(demoData);
    localStorage.setItem(this.SEED_VERSION_KEY, this.CURRENT_SEED_VERSION);
    return demoData;
  },

  _saveAll(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list || []));
    } catch (e) {
      console.error('Failed to persist assignments:', e);
    }
  }
};
