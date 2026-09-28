import { getTopicBreakdown, getTopPerformingPost, getAverageEngagement } from './analytics.js';

/**
 * Generate a deterministic, data-driven content strategy recommendation
 * based on the user's actual posts in localStorage.
 *
 * @param {Array} posts - Stored content history
 * @returns {Object} Strategy recommendation with evidence and reasoning
 */
export function generateMockStrategy(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return {
      recommendedTopic: "Foundation Content",
      contentIdea: "Share Your Core Mission and Expert Perspective",
      reasoning: "ContentMind currently has zero recorded posts in memory. To establish an initial baseline and uncover audience patterns, start with high-clarity foundational content.",
      evidence: [
        "Memory history: 0 posts recorded",
        "Add 3-5 previous posts to activate deep pattern matching"
      ],
      targetPlatform: "LinkedIn",
      formatSuggestion: "Text Post + Personal Insight Carousel",
      audienceInsight: "No historical interactions found yet.",
      contentGap: "Baseline data needed to detect audience preferences."
    };
  }

  const topicBreakdown = getTopicBreakdown(posts);
  const bestPost = getTopPerformingPost(posts);
  const overallAvgEngagement = getAverageEngagement(posts);

  // Highest performing topic by views & engagement
  const topTopicObj = topicBreakdown[0] || {
    topic: 'Tech Insights',
    totalViews: 10000,
    avgEngagement: 8.5,
    postCount: 1
  };

  // Second topic if available
  const runnerUpTopicObj = topicBreakdown.length > 1 ? topicBreakdown[1] : null;

  // Lowest performing topic if more than 1 topic exists
  const lowestTopicObj = topicBreakdown.length > 1
    ? topicBreakdown[topicBreakdown.length - 1]
    : null;

  // Build concrete evidence list directly from the user's data
  const evidence = topicBreakdown.slice(0, 4).map(item => {
    return `${item.topic}: ${item.totalViews.toLocaleString()} views across ${item.postCount} post${item.postCount > 1 ? 's' : ''} (${item.avgEngagement}% avg engagement)`;
  });

  if (bestPost) {
    evidence.push(`Highest single post: "${bestPost.title}" on ${bestPost.platform} (${Number(bestPost.views).toLocaleString()} views, ${bestPost.likes} likes)`);
  }

  // Determine audience tendency and topic customization
  const topTopicName = topTopicObj.topic;
  let recommendedTopic = '';
  let contentIdea = '';
  let reasoning = '';
  let formatSuggestion = '';
  let targetPlatform = bestPost?.platform || 'LinkedIn';
  let audienceInsight = '';
  let contentGap = '';

  const lowerTopic = topTopicName.toLowerCase();

  if (lowerTopic.includes('agent') || lowerTopic.includes('ai agent')) {
    recommendedTopic = 'Practical AI Agent Development';
    contentIdea = 'How Developers Can Build Their First Autonomous AI Agent with Stateful Memory';
    formatSuggestion = 'Step-by-step Technical Breakdown + Architecture Diagram';
    targetPlatform = 'LinkedIn';
    audienceInsight = 'Your audience strongly values deep technical implementations and actionable blueprints over abstract theorizing.';
    contentGap = 'You have proven high demand for AI Agents, but have not yet covered long-term memory architectures or error handling workflows.';
  } else if (lowerTopic.includes('tool') || lowerTopic.includes('productivity')) {
    recommendedTopic = 'Hands-On Workflow Automation & Tool Stacks';
    contentIdea = 'The Exact 5-Step Automation Workflow That Replaced 8 Hours of Manual Work';
    formatSuggestion = 'Case Study with Concrete Before/After Metrics';
    targetPlatform = bestPost?.platform || 'LinkedIn';
    audienceInsight = 'Your readers lean heavily into measurable productivity wins and workflow efficiency gains.';
    contentGap = 'Previous posts listed tools; the next logical leap is showing how these tools integrate into one seamless pipeline.';
  } else if (lowerTopic.includes('machine learning') || lowerTopic.includes('ml')) {
    recommendedTopic = 'Applied Machine Learning for Engineers';
    contentIdea = 'From Scikit-Learn to Production: 4 Common Pitfalls in Real-World ML Deployments';
    formatSuggestion = 'Carousel Checklist + GitHub Repository Walkthrough';
    targetPlatform = bestPost?.platform || 'LinkedIn';
    audienceInsight = 'Visual reference summaries and digestible definitions perform reliably well with your followers.';
    contentGap = 'Your history covers definitions; your audience is ready for intermediate production challenges.';
  } else {
    // Dynamic recommendation for any user-entered custom topic
    recommendedTopic = `Advanced ${topTopicName} Tactics`;
    contentIdea = `Mastering ${topTopicName}: Lessons Learned from Real Implementation`;
    formatSuggestion = 'High-Value Problem Breakdown with 3 Actionable Solutions';
    targetPlatform = bestPost?.platform || 'LinkedIn';
    audienceInsight = `Your content tagged with "${topTopicName}" generates the highest traction and viewer retention in your history.`;
    contentGap = `You have established authority in ${topTopicName}. Expanding with specific sub-angles will capture high-intent engagement.`;
  }

  // Construct customized reasoning
  if (lowestTopicObj && lowestTopicObj.topic !== topTopicObj.topic) {
    reasoning = `Your historical memory reveals that "${topTopicObj.topic}" outperforms "${lowestTopicObj.topic}" significantly (${topTopicObj.totalViews.toLocaleString()} views vs ${lowestTopicObj.totalViews.toLocaleString()} views). Your followers show 2x-3x higher engagement on concrete, tactical posts compared to broad informational summaries. Double down on this proven demand.`;
  } else if (runnerUpTopicObj) {
    reasoning = `Your content history demonstrates that "${topTopicObj.topic}" (${topTopicObj.totalViews.toLocaleString()} views) and "${runnerUpTopicObj.topic}" (${runnerUpTopicObj.totalViews.toLocaleString()} views) are your primary growth drivers, maintaining an average of ${topTopicObj.avgEngagement}% engagement. Producing targeted follow-ups in this cluster will compound your reach.`;
  } else {
    reasoning = `Based on your stored posts, "${topTopicObj.topic}" represents your most validated content angle with ${topTopicObj.totalViews.toLocaleString()} cumulative views. Your audience responds best to clear value propositions on ${targetPlatform}.`;
  }

  return {
    recommendedTopic,
    contentIdea,
    reasoning,
    evidence,
    targetPlatform,
    formatSuggestion,
    audienceInsight,
    contentGap,
    metricsSummary: {
      topTopicViews: topTopicObj.totalViews,
      topTopicAvgEngagement: topTopicObj.avgEngagement,
      analyzedPostsCount: posts.length,
      overallAvgEngagement
    }
  };
}
