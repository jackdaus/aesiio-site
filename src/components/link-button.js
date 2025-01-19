import { Icon } from "@iconify/react";

export function LinkButtonGithub({ children, href }) {
  return (
		<LinkButtonIcon href={href} icon="mdi:github">{children}</LinkButtonIcon>
  );
}

export function LinkButtonYoutube({ children, href }) {
  return (
		<LinkButtonIcon href={href} icon="mdi:youtube">{children}</LinkButtonIcon>
  );
}

function LinkButtonIcon({ children, icon, href }) {
	return (
		<a
			className="button button--secondary inline-flex align-items-center"
			href={href}
		>
			<Icon icon={icon} height="24" className="margin-right--sm"/> 
			<span>{children}</span>
		</a>
	);
}
