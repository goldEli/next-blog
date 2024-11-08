import { compileMDX } from 'next-mdx-remote/rsc'
import { readFile } from 'node:fs/promises';
import path from 'path';

async function getMDXContent(name) {
  try {
    const filePath = path.join(process.cwd(), '/posts/', `${name}.mdx`)
    const contents = await readFile(filePath, { encoding: 'utf8' });
    return await compileMDX({ source: contents, options: { parseFrontmatter: true }})
  } catch (err) {
    return null
  }
}

export async function generateMetadata({ params, searchParams }, parent) {
  const res = await getMDXContent(params.id);
  if (!res) return { title: ''}
  const { frontmatter } = res;
  return { title: frontmatter.title }
}

export default async function Home({ params }) {
  const res = await getMDXContent(params.id);
  if (!res) return <h1>Page not Found!</h1>
  const {content, frontmatter} = res;

  return (
    <>
      {content}
    </>
  )
}
