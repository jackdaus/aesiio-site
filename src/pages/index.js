import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/blog">
            Hop in to my bog
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="A Blog Of Augmented Reality How-Tos For Beginners">
      <HomepageHeader />
      <main style={{display: 'flex', flexGrow: 1}}>
        {/* <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
            <img src="img/frogvr.png" style={{height: '300px'}}/>
        </div> */}
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
