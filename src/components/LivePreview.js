import React from "react";
import { View } from "@wp-g2/components";
import Frame from "react-frame-component";
import TwentyTwentyThemeStyles from "../styles/twentytwenty";
import { useConfigProp } from "../store";

const htmlContent = `
<!-- wp:paragraph -->
<p>The goal of this new editor is to make adding rich content to WordPress simple and enjoyable. This whole post is composed of <em>pieces of content</em>—somewhat similar to LEGO bricks—that you can move around and interact with. Move your cursor around and you’ll notice the different blocks light up with outlines and arrows. Press the arrows to reposition blocks quickly, without fearing about losing things in the process of copying and pasting.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->
<h1>A Picture is Worth a Thousand Words</h1>
<!-- /wp:heading -->

<!-- wp:heading -->
<h2>A Picture is Worth a Thousand Words</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>A Picture is Worth a Thousand Words</h3>
<!-- /wp:heading -->

<!-- wp:heading {"level":4} -->
<h4>A Picture is Worth a Thousand Words</h4>
<!-- /wp:heading -->

<!-- wp:heading {"level":5} -->
<h5>A Picture is Worth a Thousand Words</h5>
<!-- /wp:heading -->

<!-- wp:heading {"level":6} -->
<h6>A Picture is Worth a Thousand Words</h6>
<!-- /wp:heading -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:pullquote -->
<figure class="wp-block-pullquote"><blockquote><p>Code is Poetry</p><cite>The WordPress community</cite></blockquote></figure>
<!-- /wp:pullquote -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Thanks for testing Gutenberg!</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">👋</p>
<!-- /wp:paragraph -->
`;

function createMarkup(html) {
	return { __html: html };
}

export const LivePreview = () => {
	const [coreParagraphFontSize] = useConfigProp(
		`core/paragraph.styles.typography.fontSize`
	);

	const [colorPalette] = useConfigProp(`global.settings.color.palette`);
	const [primaryColor, secondaryColor, separatorColor] = colorPalette;

	const bodyBackgroundStyles = `
		body {
			background-color: ${secondaryColor?.color || "initial"};
		}
	`;

	const bodyTextStyles = `
		body {
			color: ${primaryColor?.color || "initial"};
		}

		.wp-block-pullquote::before {
			color: ${primaryColor?.color || "initial"};
		}
	`;

	const hrStyles = `
		hr.wp-block-separator {
			color: ${separatorColor?.color || "initial"};
		}
	`;

	const previewStyles = `
		p {
			font-size: ${coreParagraphFontSize};
		}

	`;

	return (
		<Frame style={{ width: "100%", height: "100%", border: "none" }}>
			<style dangerouslySetInnerHTML={createMarkup(TwentyTwentyThemeStyles)} />
			<style dangerouslySetInnerHTML={createMarkup(previewStyles)} />
			{primaryColor && (
				<style dangerouslySetInnerHTML={createMarkup(bodyTextStyles)} />
			)}
			{secondaryColor && (
				<style dangerouslySetInnerHTML={createMarkup(bodyBackgroundStyles)} />
			)}
			{separatorColor && (
				<style dangerouslySetInnerHTML={createMarkup(hrStyles)} />
			)}
			<div dangerouslySetInnerHTML={createMarkup(htmlContent)} />
		</Frame>
	);
};
