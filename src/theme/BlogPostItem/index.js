import React from 'react'
import { DiscussionEmbed } from 'disqus-react'
import { useBlogPost } from '@docusaurus/theme-common/internal'
import BlogPostItem from '@theme-original/BlogPostItem'
import Admonition from '@theme/Admonition';

export default function BlogPostItemWrapper(props) {
	const { metadata, isBlogPostPage } = useBlogPost()
	const { frontMatter, slug, title } = metadata
	const { comments = false } = frontMatter

	return (
		<>
			<BlogPostItem {...props} />

			{comments && isBlogPostPage && (
				<div>
					<div className='padding-top--xl'>
						<Admonition type="info">
							<p>Notice something off? Something unclear? Please leave a comment below so I can fix it! 😊 </p>
						</Admonition>
					</div>
					<DiscussionEmbed
						shortname='aesiio'
						config={{
							url: slug,
							identifier: slug,
							title,
							language: 'en_US',
						}}
					/>
				</div>
			)}
		</>
	)
}