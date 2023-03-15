import React from "react";
import Link from "@docusaurus/Link";

const ProjectList = [
  {
    title: 'AR Inventory',
    link: 'projects/ar-inventory',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Xposure Therapy',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
];

export default function ProjectsList() {
    return (
        <div className="container">
            {ProjectList.map((props, idx) => (
                <div className="row">
                    <Link to={props.link}>{props.title}</Link>
                </div>
            ))}
        </div>
    );
}