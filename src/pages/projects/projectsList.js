import React from "react";
import Link from "@docusaurus/Link";
import minimapSearchUrl from "./ar-inventory/minimap-search.jpg";
import xposureTherapyUrl from "./xposure-therapy/xposure-therapy.png";

const ProjectList = [
  {
    title: "AR Inventory",
    link: "/projects/ar-inventory",
    date: "2022",
    imageUrl: minimapSearchUrl,
    description:
      "A prototype for an augmented reality inventory system. A user can virtually label real-world locations"
			+ " and then later search and navigate to these labels.",
  },
  {
    title: "Xposure Therapy",
    link: "/projects/xposure-therapy",
    date: "2022",
    imageUrl: xposureTherapyUrl,
    description:
      "A prototype to illustrate how augmented reality can be used to treat phobias through exposure therapy. This was completed"
			+ " as part of Mixed Reality Dev Days Hackathon 2022.",
  },
];

export default function ProjectsList() {
  return (
    <div className="container padding--none">
      {ProjectList.map((project, idx) => (
        <div className="margin-bottom--lg" key={idx}>
          <div className={`card shadow--md ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`} style={{ height: "250px" }} >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="project-image"
              style={{ width: "33.33%", height: "100%", objectFit: "cover" }}
            />
            <div 
              className="padding-horiz--lg" 
              style={{ 
                width: "66.67%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div style={{ maxHeight: "160px" }}> 
                <h2 className="padding-top--md">{project.title}</h2>
                <h3 className="text--subtlest">{project.date}</h3>
                <p style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3", // Number of lines before ellipsis
                  WebkitBoxOrient: "vertical",
                  margin: 0
                }}>{project.description}</p>
              </div>
              <div className="padding-bottom--md">
                <Link
                  className="button button--primary button--block"
                  to={project.link}
                >
                  View Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}