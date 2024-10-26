'use client';

import MainButton from '@/components/MainButton/MainButton';
import ActivityGraph from '@/components/ActivityGraph/ActivityGraph';
import Icon from '@/components/Icon/Icon';
import Logo from '@/components/Logo/Logo';
import Posts from '@/components/Post/Posts';
import styles from './page.module.css';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image';

const Home: React.FC = () => {
  const router = useRouter()
  const [isExpandPosts, setIsExpandPosts] = useState(false);
  const [upperHomeHeight, setUpperHomeHeight] = useState(0);


  const upperHomeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (upperHomeRef.current) {
      setUpperHomeHeight(upperHomeRef.current.clientHeight);
    }
  }, [upperHomeRef])

  const handleExpandPosts = () => {
    setIsExpandPosts(true);
    router.prefetch('/posts');
    setTimeout(()=>{
      router.push('/posts');
    }, 1000)
  };

  return (
    <>
      <div
        ref={upperHomeRef}
        className={`${isExpandPosts ? styles['expanded'] : ''} ${styles['upper-home'] }`}
        style={{ filter: 'hue-rotate(290deg) sepia(10%) saturate(200%)', marginTop: isExpandPosts ? `${-upperHomeHeight}px` : undefined }}
      >
        <div className={styles['main-buttons']}>
          <MainButton color='#ff8e2b' text='**WIP***' href='/' />
          <MainButton color='#387eb6' text='POSTS' href='/posts' />
          <MainButton color='#38ac54' text='***WIP***' href='/' />
        </div>

        <ActivityGraph />
        <div style={{ flexGrow: 1, marginLeft: '20px', marginRight: '50px' }}>
        </div>

        <div
          onClick={handleExpandPosts}
          className={`${styles['expand-posts']} ${
            isExpandPosts ? styles['expanded'] : ''
          }`}
          style={{
            position: 'absolute',
            bottom: '-85px',
            right: '20px',
            zIndex: 7,
            filter: 'brightness(0) invert(1)',
          }}
        >
          <Icon name='arrow-up-right-light.svg' alt='expand' width={20}></Icon>
        </div>
        <div className='skeleton' style={{ position: 'absolute', bottom: '0', right: '0', overflow:'hidden', zIndex:'-1'}}>
          <Image
            style={{height:'auto', width:'370px', position: 'relative', bottom: '-11px', right: '-40px', transform: "rotateZ(-2.5deg)"}}
            src="/assets/media/skeleton.png"
            alt="skeleton"
            width="1000"
            height="700"
          ></Image>
        </div>

        {/* <div style={{ position: 'relative', paddingRight: '20px' }}>
          <Logo />
        </div> */}
      </div>
      <Posts />
    </>
  );
}

export default Home;
