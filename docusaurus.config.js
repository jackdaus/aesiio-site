// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Aesiio',
	tagline: 'Frogmented reality',
	favicon: 'img/favicon.ico',

	// Set the production url of your site here
	url: 'https://aesiio.com',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'aesiio', // Usually your GitHub org/user name.
	projectName: 'aesiio-site', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					// editUrl:
					// 	'https://github.com/jackdaus/aesiio-site/tree/main/docs',
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/jackdaus/aesiio-site/tree/main/blog',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			image: 'img/frogvr.png',
			navbar: {
				title: 'Aesiio',
				logo: {
					alt: 'My Site Logo',
					src: 'img/frogvr.png',
				},
				items: [
					// {
					// 	type: 'doc',
					// 	docId: 'intro',
					// 	position: 'left',
					// 	label: 'Tutorial',
					// },
					{ to: '/blog', label: 'Blog', position: 'left' },
					{ to: '/projects', label: 'Projects', position: 'left' },
					{ to: '/about', label: 'About', position: 'right' },
				],
			},
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Social',
						items: [
							{
								label: 'LinkedIn',
								href: 'https://www.linkedin.com/in/jack-daus-25207583/',
							},
							{
								label: 'Twitter',
								href: 'https://twitter.com/aesiio',
							},
						],
					},
					{
						title: 'More',
						items: [
							{
								label: 'About',
								to: '/about',
							},
							{
								label: 'GitHub',
								href: 'https://github.com/jackdaus',
							},
						],
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()} Jack Daus`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
                additionalLanguages: ['csharp']
			},
		}),
};

module.exports = config;
