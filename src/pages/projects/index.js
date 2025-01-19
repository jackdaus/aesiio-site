import React from "react";
import Layout from "@theme/Layout";
import ProjectsList from "./projectsList";

export default function Projects() {
	return (
		<Layout title="Projects" description="Some projects I've made">
			<div className="container margin-vert--lg">
				<div className="row" style={{justifyContent: "center"}}>
					<div className="col col--8">
					<h1>Projects</h1>
					<p>Some of my personal projects!</p>
					<ProjectsList/>
					</div>
				</div>
			</div>
		</Layout>
	)
}