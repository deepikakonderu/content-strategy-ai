import { initialDemoPosts } from '../data/demoData.js';

const STORAGE_KEY = 'contentmind_posts';

/**
 * Safely parse JSON from localStorage, falling back to initialDemoPosts if empty
 */
export function getPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First-time app load: seed with 8 realistic demo posts
      savePosts(initialDemoPosts);
      return initialDemoPosts;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      savePosts(initialDemoPosts);
      return initialDemoPosts;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to read posts from localStorage:', error);
    return initialDemoPosts;
  }
}

/**
 * Persist posts array into localStorage
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error);
    return false;
  }
}

/**
 * Prepend a new post to storage and return updated list
 */
export function addPost(postData) {
  const currentPosts = getPosts();
  const newPost = {
    id: postData.id || `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: (postData.title || '').trim(),
    description: (postData.description || '').trim(),
    topic: (postData.topic || '').trim(),
    platform: postData.platform || 'LinkedIn',
    date: postData.date || new Date().toISOString().split('T')[0],
    views: Math.max(0, Number(postData.views) || 0),
    likes: Math.max(0, Number(postData.likes) || 0),
    comments: Math.max(0, Number(postData.comments) || 0),
    shares: Math.max(0, Number(postData.shares) || 0),
    createdAt: new Date().toISOString()
  };

  const updatedPosts = [newPost, ...currentPosts];
  savePosts(updatedPosts);
  return newPost;
}

/**
 * Delete a post by id
 */
export function deletePost(id) {
  const currentPosts = getPosts();
  const filtered = currentPosts.filter(p => p.id !== id);
  savePosts(filtered);
  return filtered;
}

/**
 * Reset posts back to the default demo data
 */
export function resetDemoData() {
  savePosts(initialDemoPosts);
  return initialDemoPosts;
}
