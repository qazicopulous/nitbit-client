import styles from './MainButton.module.css'
import Link from 'next/link'

interface MainButtonProps {
  type: string
}

interface ButtonProps {
  class: string;
  text: string;
  href: string;
}


const Buttons: Record<string, ButtonProps> = {
  Dashboard: {
    class: styles.dashboard,
    text: "ZOOPBOARD",
    href: '/zoopboard'
  },
  Posts: {
    class: styles.posts,
    text: "POSTS",
    href: '/posts'
  },
  Wip: {
    class: styles.wip,
    text: '***WIP***',
    href: '/files'
  },
};


const MainButton: React.FC<MainButtonProps> = ({ type }) => {
  const button = Buttons[type];

  return (
    <Link href={button.href} className={`${styles['main-button']} ${button.class}`}>
      <div className={styles['main-button-small']}/>
      <div className={styles['main-button-large']}>
        {button.text}
      </div>
    </Link>
  );
}

export default MainButton;