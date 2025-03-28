import Icon from '../Icon/Icon'
import styles from './PostPreview.module.css'
import { IconProps } from '../Icon/Icon'
import Link from 'next/link'
import CategoricalSymbol from '../CategoricalSymbol/CategoricalSymbol'
import { Post } from '@/utils/postParser'
import { timeAgo } from '@/utils/time'

const PostPreview: React.FC<{ properties: { [ item: string ]: any } }> = ({properties}) => {
  let { postName, title, category, lastUpdated, summary, urls } = properties;
  urls = urls ? urls : []
  return (
    <div className={styles['post-preview']}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Link href={`./posts/${postName}`} className={styles['post-preview-title']}>
          <div>
            {title}
          </div>
        </Link>
        <div style={{ position: 'absolute', left: '-2.5em' }}>
          <CategoricalSymbol for={category as string} small={true}></CategoricalSymbol>
        </div>
      </div>
      <div className={styles['post-preview-summary']}>
        {summary}
      </div>
      <div className={styles['post-preview-date']}>
        {lastUpdated}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
        {(urls as IconProps[]).map((url, index) => (
          <span key={index} className={styles.hyperlink}>
            <Icon name={url.name} alt={url.alt} href={url.href} doDisplayAlt={true} width={16}></Icon>
          </span>
        ))}
      </div>
    </div>
  )
}

export default PostPreview;
