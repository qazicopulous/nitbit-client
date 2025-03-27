import { getPostBySlug, getPostSlugs, getNames } from '@/utils/parsedPosts';
import { notFound } from 'next/navigation';
import Post from '@/components/Post/Post'

export async function generateStaticParams() {
  return (await getNames()).map((slug) => ({ slug }));
}
export const revalidate = false;
const PostPage: React.FC<{ params: Promise<{ slug: string }>}> = async ({ params }) => {
  let { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  let repoLink;
  if (post.properties.urls) {
    repoLink = post.properties.urls.filter(({ name, alt, href }: { name: string, alt: string, href: string }) => alt.includes('repo'))[0];
    repoLink = repoLink?.href;
  }

  return (
    <Post post={post.component} repoLink={repoLink}></Post>
  );
}

export default PostPage;