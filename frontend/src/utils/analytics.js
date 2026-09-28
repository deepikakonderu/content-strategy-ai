/**
 * ContentMind Analytics Utility
 * Computes performance metrics, engagement rates, and topic distributions.
 */

/**
 * Calculate engagement percentage for a single post:
 * ((likes + comments + shares) / views) * 100
 */
export function calculateEngagement(post) {
  if (!post || typeof post !== 'object') return 0;
  const views = Number(post.views) || 0;
  const likes = Number(post.likes) || 0;
  const comments = Number(post.comments) || 0;
  const shares = Number(post.shares) || 0;

  if (views <= 0) {
    // If no views recorded yet, engagement is 0%
    return 0;
  }

  const interactions = likes + comments + shares;
  const rate = (interactions / views) * 100;
  return Number(rate.toFixed(2));
}

/**
 * Calculate total views across all posts
 */
export function getTotalViews(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return 0;
  return posts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
}

/**
 * Calculate total likes across all posts
 */
export function getTotalLikes(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return 0;
  return posts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
}

/**
 * Calculate total comments across all posts
 */
export function getTotalComments(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return 0;
  return posts.reduce((sum, p) => sum + (Number(p.comments) || 0), 0);
}

/**
 * Calculate total shares across all posts
 */
export function getTotalShares(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return 0;
  return posts.reduce((sum, p) => sum + (Number(p.shares) || 0), 0);
}

/**
 * Calculate average engagement rate (%) across all posts
 */
export function getAverageEngagement(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return 0;
  const totalRate = posts.reduce((sum, post) => sum + calculateEngagement(post), 0);
  return Number((totalRate / posts.length).toFixed(2));
}

/**
 * Find the top-performing topic by total view volume (and engagement as tiebreaker)
 */
export function getTopTopic(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return 'No data';
  const breakdown = getTopicBreakdown(posts);
  if (breakdown.length === 0) return 'No data';
  return breakdown[0].topic;
}

/**
 * Find the single highest-performing post by view count
 */
export function getTopPerformingPost(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return null;
  return [...posts].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))[0];
}

/**
 * Aggregate metrics grouped by topic
 * Returns array sorted by totalViews descending
 */
export function getTopicBreakdown(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return [];

  const map = new Map();

  posts.forEach((post) => {
    const rawTopic = (post.topic || 'General').trim();
    const topic = rawTopic || 'General';

    if (!map.has(topic)) {
      map.set(topic, {
        topic,
        postCount: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        engagements: []
      });
    }

    const item = map.get(topic);
    item.postCount += 1;
    item.totalViews += Number(post.views) || 0;
    item.totalLikes += Number(post.likes) || 0;
    item.totalComments += Number(post.comments) || 0;
    item.totalShares += Number(post.shares) || 0;
    item.engagements.push(calculateEngagement(post));
  });

  return Array.from(map.values())
    .map((item) => {
      const avgViews = Math.round(item.totalViews / item.postCount);
      const avgEngagement = Number(
        (item.engagements.reduce((a, b) => a + b, 0) / item.postCount).toFixed(2)
      );
      return {
        ...item,
        avgViews,
        avgEngagement
      };
    })
    .sort((a, b) => b.totalViews - a.totalViews);
}

/**
 * Aggregate metrics grouped by platform
 */
export function getPlatformBreakdown(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) return [];

  const map = new Map();

  posts.forEach((post) => {
    const platform = (post.platform || 'Other').trim();
    if (!map.has(platform)) {
      map.set(platform, {
        platform,
        count: 0,
        views: 0
      });
    }
    const item = map.get(platform);
    item.count += 1;
    item.views += Number(post.views) || 0;
  });

  return Array.from(map.values()).sort((a, b) => b.views - a.views);
}
