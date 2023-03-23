import React from "react";
import Layout from "@theme/Layout";
import ProjectsList from "./projectsList";

export default function Projects() {
	return (
		<Layout title="Projects" description="Some projects I've made">
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '50vh',
					fontSize: '20px',
				}}>
                <p>🚧 UNDER CONSTRUCTION 🚧</p>
				<h1>Projects</h1>
				<p>Some of my personal projects</p>
				<main>
					<ProjectsList/>
				</main>
			</div>
		</Layout>
	)
}