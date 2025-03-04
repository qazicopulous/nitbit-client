import styles from './Posts.module.css';
import Title from '../Title/Title';
import PostPreview from './PostPreview';
import CategoricalSymbol from '../CategoricalSymbol/CategoricalSymbol';
import { parsedPosts } from './parsedPosts'
import { useState, useEffect, useRef } from 'react';
import { getFilterBy, Filter, getAdditionalPosts } from '@/utils/states';
import { toDate } from '@/utils/time';
import Icon from '@/components/Icon/Icon';


const Posts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  const { filterBy, setFilterBy } = getFilterBy();
  const [ updateState, setUpdateState ] = useState({});

  const handleCategoryClick = (clickedCategory: string) => {
    let newCategory = clickedCategory === filterBy.category ? undefined : clickedCategory;
    const newFilter = {
      ...filterBy,
      category: newCategory
    };
    setFilterBy(newFilter);
    setUpdateState({});
  };

  const filteredSortedPosts = (() => {
    const filteredPosts = parsedPosts.filter((post) => {
      if (filterBy.category && post.properties.category !== filterBy.category) return false;
      return true;
    });
    return filteredPosts.sort((a, b) => { return toDate(b.properties.lastUpdated).getTime() - toDate(a.properties.lastUpdated).getTime() })
  })();



  return (
    <div ref={containerRef} className={styles["posts-container"]}>
      <div style={{ padding: '0 10px 0 50px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: 'max-content' }}>
        <div
          className={styles['posts-header']}
          // style={{ width: `${postsRef.current ? postsRef.current.scrollWidth : 100}px`}}
        >
          <div style={{ flexGrow: 1 }}>
            <Title>POSTS</Title>
          </div>
          <div
            className={styles.categories}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {["Release", "Devlog", "Notes"].map((category, index) => {
              return (
                <div key={index} style={{ margin: "0 5px" }}>
                  <CategoricalSymbol
                    for={category}
                    dark={
                      filterBy.category ? filterBy.category !== category : false
                    }
                    onClick={() => handleCategoryClick(category)}
                  ></CategoricalSymbol>
                </div>
              );
            })}
          </div>
        </div>
        <div ref={postsRef} className={styles.posts}>
          {filteredSortedPosts.length === 0 ? (
            <div className={styles.nothing}>null</div>
          ) : (
            filteredSortedPosts.map((post, index) => (
              <PostPreview key={index} post={post}></PostPreview>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
