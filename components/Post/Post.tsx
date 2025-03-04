'use client'

import sanitizeHtml from 'sanitize-html';
import styles from './Post.module.css'
import hljs from 'highlight.js/lib/common';
import { useTheme } from '@/components/ThemeProvider';
import { Theme } from '@/components/ThemeChooser/ThemeChooser';
import { useEffect, useState } from "react";
import { getRepoLink } from '@/utils/states'
import Head from 'next/head';

const Post: React.FC<{ post: React.ReactNode, repoLink: string }> = ({ post, repoLink }) => {
	// const postComponent = post;
	const { theme } = useTheme();
	const [ updateState, setUpdateState ] = useState({});
	const [themePath, setThemePath] = useState('');

	useEffect(() => {
		document.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
			//sanitize and highlight
			const sanitizedCode = sanitizeHtml(block.innerHTML, {
				allowedTags: [],
				allowedAttributes: {},
			});
			block.innerHTML = sanitizedCode;
			hljs.highlightElement(block as HTMLElement);
		})

	},[]);

	useEffect(() => {
		const existingLink = document.getElementById('hljs-theme');
		if (existingLink) {
			existingLink.remove();
		}

		// Dynamically set the theme path
		let themePath = '';
		if (theme === Theme.Default) {
			themePath = '/assets/themes/nord.css';
		} else if (theme === Theme.PitchBlack) {
			themePath = '/assets/themes/github-dark.css';
		} else if (theme === Theme.EInk) {
			themePath = '/assets/themes/isbl-editor-light.css';
		}

		if (themePath) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = themePath;
			link.id = 'hljs-theme';
			document.head.appendChild(link);
		}
  }, [theme]);

	useEffect(()=>{
		const { repoLink: repoLinkState, setRepoLink } = getRepoLink();
		if (repoLink) {
			setRepoLink(repoLink);
			setUpdateState({});
			// console.log(repoLink)
		} else {
			setRepoLink("https://github.com/qazicopulous");
		}
	}, [repoLink]);

	return (
		<>
			{post}
		</>
	)
}

export default Post;