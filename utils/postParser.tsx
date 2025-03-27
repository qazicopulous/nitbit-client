import styles from '@/components/Post/Post.module.css';
import React from 'react';
import { IconProps } from '@/components/Icon/Icon';
import { timeAgo } from '@/utils/time';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon/Icon'
import sanitizeHtml from 'sanitize-html';

let postNameLabel: string;
let repoLink: string = "https://github.com/qazicopulous", setRepoLink: any;


export class Section {
  tag: Tag;
  content: Array<string | Section>;
  properties: { [key: string]: any };

  constructor(
    tag: Tag,
    content: Array<string | Section> = [],
    properties: { [key: string]: string }
  ) {
    this.tag = tag;
    this.content = content;
    this.properties = properties;
  }

  generateComponent() {
    // console.log(this.tag)
    const buildChildren = (
      itemCallback?: (
        parseItem: (item: string | Section) => React.ReactNode,
        item: string | Section,
        index: number
      ) => React.ReactNode
    ): React.ReactNode => {
      return (
        <>
          {this.content.map((item, index) => {
            function parseItem(item: string | Section) {
              if (typeof item === "string") {
                const str = item.toString();
                return <>{str}</>;
              }
              else return item.generateComponent();
            }
            const result = itemCallback
              ? itemCallback(parseItem, item, index)
              : parseItem(item);
            return <React.Fragment key={index}>{result}</React.Fragment>;
          })}
        </>
      );
    };

    switch (this.tag) {
      case Tag.Body:
        const {
          title,
          postName,
          category,
          lastUpdated,
          summary,
          authors,
          urls,
        } = this.properties;
        console.log(`==> compiling ${postName}`)
        postNameLabel = postName
        const lastUpdatedAgo = timeAgo(lastUpdated);
        return (
          <div className={styles["article"]}>
            <div className={styles["article-header"]}>
              <div className={styles["article-title"]}>{title}</div>
              <div className={styles["details"]}>
                <div className={styles["last-updated"]}>
                  {lastUpdatedAgo}
                  <div className={styles["last-updated-date"]}>
                    {lastUpdated}
                  </div>
                </div>
                <div className={styles["header-links"]}>
                  {(authors as IconProps[])?.map((author, index) => (
                    <span key={index} className={styles["header-link"]}>
                      <Icon name={author.name} alt={author.alt} href={author.href} doDisplayAlt={true} width={16}></Icon>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {buildChildren()}
          </div>
        );

      case Tag.SubHeader:
        return <h2 className={styles['sub-header']}>{buildChildren()}</h2>
      case Tag.P:
        return <p className={styles.p}>{buildChildren()}</p>
      case Tag.P2:
        return <p className={styles.p2}>{buildChildren()}</p>

      case Tag.Note:
        return (
          <>
            <span className={styles["note-reference"]}></span>
            <div className={styles.note}>{buildChildren()}</div>
          </>
        );
      case Tag.Exhibit:
        return <div className={styles.exhibit}>{buildChildren()}</div>;
      case Tag.Ol:
        return (
          <ol start={this.properties.start} className={styles["o-list"]}>{buildChildren()}</ol>
            // {buildChildren((parseItem, item, index) => {
            //   item = typeof item === 'string' ? item.trim() : item
            //   return <li className={styles.li}>{parseItem(item)}</li>;
            // })}
        );
      case Tag.Ul:
        return (
          <ul className={styles["u-list"]}>{buildChildren()}</ul>
        );
      case Tag.Li:
          return <li className={styles.li}>{buildChildren()}</li>;

      // case Tag.Reveal:
      // case Tag.RevealButton:
      // case Tag.RevealContent:
      case Tag.InlineImage:
        return (
          <>
            {' '}
            <span className={`${styles['inline-image']} ${this.properties.large ? styles['large'] : ''}`}>
              <Image
                src={`/assets/media/posts/${postNameLabel}/${this.properties.name}`}
                alt={this.properties.alt}
                width={300}
                height={300}
              ></Image>
              <Image
                className={styles.enlarged}
                src={`/assets/media/posts/${postNameLabel}/${this.properties.name}`}
                alt={this.properties.alt}
                width={300}
                height={300}
              ></Image>
              {buildChildren()}
            </span>
          </>
        );
      case Tag.Image:
        return (
          <div className={styles.image}>
            <Image
              src={`/assets/media/posts/${postNameLabel}/${this.properties.name}`}
              alt={this.properties.caption ? this.properties.caption : this.properties.alt}
              style={{ maxWidth: `min(${this.properties.width}px, 100%)`, height: "auto", transform: "translate3d(0, 0, 0)" }}
              placeholder="blur"
              blurDataURL={`/assets/media/posts/${postNameLabel}/${this.properties.name}`}
              width={this.properties.width}
              height={480}
              loading="lazy"
            />
            <div className={styles.caption}>
              {this.properties.caption}
              {" "}
              {this.properties.source &&
                <>
                  <Link className={styles.hyperlink} href={this.properties.source}>
                    Source.
                  </Link>
                </>
              }
            </div>
          </div>

        )
      case Tag.Video:
        return (
          <div className={styles.video}>
            <video controls preload='metadata'>
              <source src={`/assets/media/posts/${postNameLabel}/${this.properties.name}#t=0.1`}/>
              Your browser cannot show this video.
            </video>
            <div className={styles.caption}>
              {this.properties.caption}
              {this.properties.source &&
                <>
                  {' '}
                  <Link className={styles.hyperlink} href={this.properties.source}>
                    Source.
                  </Link>
                </>
              }
            </div>
          </div>
        )
      case Tag.VideoExt:
        return (
          <div className={styles['video-ext']}>
            <iframe
              width="300"
              height="300"
              src={`https://www.youtube.com/embed/${this.properties.id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
            <div className={styles.caption}>
              {this.properties.caption}
              {this.properties.source &&
                <>
                  {' '}
                  <Link className={styles.hyperlink} href={this.properties.source}>
                    Source.
                  </Link>
                </>
              }
            </div>
          </div>
          )
      case Tag.Distinct:
        return <span className={styles.distinct}>{buildChildren()}</span>
      case Tag.Link:
        const url = this.properties.urls[0];
        return (
          <>
            {' '}
            <Link className={styles.hyperlink} href={this.properties.urls[0].href}>
              { url.alt ? url.alt : url.href }{buildChildren()}
            </Link>
          </>
        );
      case Tag.Code:
        // const lang = this.properties.lang;
        return (
          <div className={styles['code-container']}>
            <pre className={styles.code}>
              <code>{buildChildren()}</code>
            </pre>
            <div className={styles['code-background']}></div>
          </div>
        );
      case Tag.CodeWide:
        // const lang = this.properties.lang;
        return (
          <div className={`${styles['code-container']} ${styles.wide}`}>
            <pre className={styles.code}>
              <code>{buildChildren()}</code>
            </pre>
            <div className={`${styles['code-background']} ${styles.wide}`}></div>
          </div>
        );
      case Tag.InlineCode:
        return <code className={styles['inline-code']}>{buildChildren()}</code>
      case Tag.Italics:
        return <i>{buildChildren()}</i>
      case Tag.Bold:
        return <b>{buildChildren()}</b>
      case Tag.Weird:
        return <span className={styles.weird}>{buildChildren()}</span>
      case Tag.Group:
        return <div className={styles.group}>{buildChildren()}</div>
    }
  }
}

enum Tag {
  Body,
  SubHeader,
  P,
  P2,
  Note,
  Exhibit,
  Ol,
  Ul,
  Li,
  Reveal,
  RevealButton,
  RevealContent,
  InlineImageLarge,
  InlineImage,
  Image,
  Video,
  VideoExt,
  Distinct,
  Link,
  Code,
  CodeWide,
  InlineCode,
  Italics,
  Bold,
  Weird,
  Group,
}

function countIndents(line: string): number {
  const leadingSpaces = line.match(/^\s*/)?.[0].length || 0;

  return Math.floor(leadingSpaces / 2);
}


function parseString(input: string): Array<string | Section> {
  const patterns = [
    { regex: /\*\*([^*]+)\*\*/, tag: Tag.Bold },
    { regex: /\*([^*]+)\*/, tag: Tag.Italics },
    { regex: /\`([^`]+)\`/, tag: Tag.InlineCode },
    { regex: /\^([^^]+)\^/, tag: Tag.Distinct },
    { regex: /\~([^~]+)\~/, tag: Tag.Weird },
    { regex: /^- (.*)/, tag: Tag.Li }
  ];

  const result: Array<string | Section> = [];
  let lastIndex = 0;

  // Create a combined regex pattern for all the cases
  const combinedRegex = new RegExp(
    patterns.map(({ regex }) => `(?:${regex.source})`).join('|'),
    'g'
  );

  // Match tags using the combined regex
  let match: RegExpExecArray | null;
  while ((match = combinedRegex.exec(input)) !== null) {
    // Push plain text before the match
    if (match.index > lastIndex) {
      result.push(input.slice(lastIndex, match.index));
    }

    // Find which pattern matched and create a section for it
    patterns.forEach(({ regex, tag }, i) => {
      if (match) {
        const groupMatch = match[i + 1]; // Shifted by 1 for capture group
        if (groupMatch) {
          result.push(new Section(tag, [...parseString(groupMatch)], {}));
        }
      }
    });

    lastIndex = combinedRegex.lastIndex;
  }

  // Push remaining plain text after the last tag
  if (lastIndex < input.length) {
    result.push(input.slice(lastIndex));
  } else {
    result.push('');
  }

  return result;
}

export class Post {
  component: React.ReactNode;
  properties: { [key: string]: any };

  constructor(
    section: Section
  ) {
    this.component = section.generateComponent();
    this.properties = section.properties;
  }
}

export function parseRawPost(input: string): Post {
  const result = new Section(Tag.Body, [], {});

  const tagRegex = /^§(.*)/;
  const propsRegex = /^\* ([^:]+): (.+)$/;

  let stack: Section[] = [];
  let currentSection: Section = result;
  let currentSectionIndent: number = -1;

  const lines = input.trim().split("\n");

  for (let [index, line] of lines.entries()) {
    const currentIndent = countIndents(line);
    let trimmedLine = line.trim()

    if (propsRegex.test(trimmedLine)) {
      const match = trimmedLine.match(propsRegex);
      if (match) {
        const [_, key, value] = match;
        if (key === "url" || key === "author") {
          const urlProps = value.split(", ");
          const url: IconProps = {
            name: urlProps[0],
            alt: urlProps[1],
            href: urlProps[2],
          };
          currentSection.properties[`${key}s`] = (
            currentSection.properties[`${key}s`] || []
          ).concat(url);
        } else currentSection.properties[key] = value;
      }
      continue;
    }

    // console.log({currentIndent})
    if (currentIndent <= currentSectionIndent) {
      const diff = currentSectionIndent - currentIndent;
      stack.splice(-diff, diff);
      currentSection = stack.pop() as Section;

      currentSectionIndent = currentIndent - 1;
    }


    let match = trimmedLine.match(tagRegex);
    if (match) {
      if (currentIndent > currentSectionIndent + 1)
        throw new Error(
          `No tag found on line ${index + 1} at indent ${
            currentSectionIndent + 1
          }`
        );
      let tag = match[1];
      if (!(tag in Tag)) throw new Error(`No tag defined for ${tag} on line ${index + 1}`);

      if (currentIndent === currentSectionIndent + 1)
        stack.push(currentSection);

      const newSection: Section = new Section(
        Tag[tag as keyof typeof Tag],
        [],
        {}
      );
      currentSection.content.push(newSection);
      currentSection = newSection;

      currentSectionIndent = currentIndent;
    } else {
      line = line.substring((currentSectionIndent + 1) * 2);
      line = line.replace(/\r$/, '');

      // add \n for block of text
      let prevContent = currentSection.content.at(-1);
      if (prevContent && typeof prevContent === 'string') {
        line = '\n' + line;
      }
      let content;
      if (currentSection.tag !== Tag.Code && currentSection.tag !== Tag.CodeWide) {
        content = parseString(line);
      } else {
        content = line;
      }
      currentSection.content.push(...content);
      // currentSection.content = currentSection.content.concat(contents)
    }
  }
  // console.dir(result)
  return new Post(result);
}