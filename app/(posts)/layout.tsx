'use client'
import { useRepoLink } from '@/components/ContextProvider'
import Path from '@/components/Path/Path'
import Icon from '@/components/Icon/Icon'
import ThemeChooser, { Theme } from '@/components/ThemeChooser/ThemeChooser';

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { repoLink } = useRepoLink();

  return (
    <>
      {children}
      <div className='toolbar'>
        <div style={{ padding: '0 20px' }}>
          <Path></Path>
        </div>
        <div style={{ color: "inherit", display: "flex", alignItems: "center", gap: "1.2em", padding: "0 1em" }}>
          <ThemeChooser></ThemeChooser>
          <Icon name='github.svg' alt='github' href={ repoLink } width={30}/>
        </div>
      </div>
    </>
  )
}