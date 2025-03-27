"use server"

import fs from 'fs';
import path from 'path';
import { Post } from '@/utils/postParser';
import { parseRawPost } from './postParser';

const postsDirectory = path.join(process.cwd(), 'posts');
let cachedPosts: Record<string, Post> | null = null;
let postNames: string[] = [];

loadPosts()

export async function getNames() {
  return postNames;
}

function loadPosts(): Record<string, Post> {
  if (cachedPosts) return cachedPosts;

  const files = fs.readdirSync(postsDirectory);
  const posts: Record<string, Post> = {};

  for (const file of files) {
    if (file.includes('sample')) continue;
    const slug = file.replace('.txt', '');
    const filePath = path.join(postsDirectory, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    posts[slug] = parseRawPost(content);
    postNames.push(slug);
  }

  cachedPosts = posts;
  return posts;
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = loadPosts();
  return Object.keys(posts);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = loadPosts();
  return posts[slug] || null;
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = loadPosts();
  return Object.values(posts);
}

export async function getAllPostProperties(): Promise<{ [key: string]: any }[]> {
  const posts = loadPosts();
  return Object.values(posts).map((post) => post.properties);
}