/**
 * ContentMind Service Layer (src/services/api.js)
 *
 * Current State:
 *   Wraps localStorage and the local deterministic strategy engine.
 *   Provides an async Promise interface so UI components interact cleanly.
 *
 * Future Backend Transition:
 *   When the backend and Hindsight integration are deployed, replace the
 *   functions below with real network fetch calls:
 *     - getPosts()          => GET  /api/posts
 *     - addPost(post)       => POST /api/posts
 *     - deletePost(id)      => DELETE /api/posts/:id
 *     - generateStrategy()  => POST /api/strategy (proxies to Hindsight memory agent)
 *     - resetPosts()        => POST /api/posts/reset
 */

import * as storage from '../utils/storage.js';
import { generateMockStrategy } from '../utils/strategy.js';

// Simulated latency to mimic server network round-trip during demo
const SIMULATED_LATENCY_MS = 150;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all stored posts
 * @returns {Promise<Array>} List of content posts
 */
export async function getPosts() {
  await delay(SIMULATED_LATENCY_MS);
  return storage.getPosts();
}

/**
 * Add a new content post to memory
 * @param {Object} postData - Form data from user
 * @returns {Promise<Object>} The created post with generated id
 */
export async function addPost(postData) {
  await delay(SIMULATED_LATENCY_MS);
  return storage.addPost(postData);
}

/**
 * Delete a post by id
 * @param {string} id - Post identifier
 * @returns {Promise<Array>} The updated posts array
 */
export async function deletePost(id) {
  await delay(SIMULATED_LATENCY_MS);
  return storage.deletePost(id);
}

/**
 * Generate content strategy recommendation from stored memory
 * @returns {Promise<Object>} Strategy recommendation object
 */
export async function generateStrategy() {
  // Give a slightly longer realistic calculation time for the agent step
  await delay(600);
  const posts = storage.getPosts();
  return generateMockStrategy(posts);
}

/**
 * Reset posts to default demo dataset
 * @returns {Promise<Array>} Initial 8 demo posts
 */
export async function resetPosts() {
  await delay(SIMULATED_LATENCY_MS);
  return storage.resetDemoData();
}
