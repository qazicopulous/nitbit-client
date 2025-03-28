import styles from './Icon.module.css'
import Image from 'next/image'
import Link from 'next/link'

export interface IconProps {
  name: string,
  alt: string,
  href?: string,
  width?: number,
  doDisplayAlt?: boolean,
  color?: string,
}

const Icon: React.FC<IconProps & { children?: string }> = ({ name, alt, href, width, doDisplayAlt, color, children }) => {
  const iconWidth = width ? `${width}px` : '1em';
  const iconColor = color || 'inherit';

  const IconComponent = require(`../../public/assets/icons/${name}`).default;
  const icon = <IconComponent className={styles.icon} style={{ width: iconWidth, color: iconColor }} />;

  if (href) {
    return (
        <Link href={href} className={`${styles['icon-container']} ${doDisplayAlt ? styles.display : ''}`}>
          {icon}
          <span>{doDisplayAlt ? alt : null}</span>
        </Link>
      );
    }
  else
    return (
      <div className={styles['icon-container']}>
        {icon}
      </div>
    );
}

export default Icon;
