const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getPosts() {
  const response = await fetch(`${API_BASE_URL}/api/posts`);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  const data = await response.json();
  return data.posts;
}

export async function addPost(postData) {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to save post');
  }

  const data = await response.json();
  return data.post;
}