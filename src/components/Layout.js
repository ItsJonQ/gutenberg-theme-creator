import React from "react";
import {
	Badge,
	CardHeader,
	Container,
	Grid,
	Heading,
	HStack,
	Scrollable,
	Subheading,
	Spacer,
	Button,
	Surface,
	Card,
	VStack,
	View
} from "@wp-g2/components";
import { ThemeProvider, css, ui } from "@wp-g2/styles";
import { useConfig } from "../store";
import { useClipboard } from "@wp-g2/utils";

export const CopyToClipboardButton = React.memo(
	({ label = "Copy", onClick, value, ...props }) => {
		const { hasCopied, onCopy } = useClipboard(value);

		const handleOnClick = () => {
			onCopy();
			onClick && onClick();
		};

		return (
			<Button onClick={handleOnClick} size="small" variant="primary" {...props}>
				{hasCopied ? "Copied!" : label}
			</Button>
		);
	}
);

export const Logo = React.memo(() => {
	return (
		<HStack>
			<VStack>
				<Subheading>Gutenberg</Subheading>
				<HStack alignment="left" spacing={3}>
					<Heading>Theme.json Creator</Heading>
					<Badge color="purple" isBold>
						Experimental
					</Badge>
				</HStack>
			</VStack>
			<View>
				<Button
					href="https://github.com/WordPress/gutenberg/blob/master/docs/designers-developers/developers/themes/theme-json.md"
					target="_blank"
					size="small"
				>
					Learn More
				</Button>
			</View>
		</HStack>
	);
});

const CodePreview = React.memo(() => {
	const { config } = useConfig();

	return (
		<ThemeProvider
			isDark
			css={`
				height: 100vh;
			`}
		>
			<Surface
				variant="secondary"
				css={`
					height: 100vh;
				`}
			>
				<Scrollable
					css={`
						padding: 40px;
					`}
				>
					<Card>
						<CardHeader size="small">
							<Subheading>Theme.json</Subheading>
							<CopyToClipboardButton value={JSON.stringify(config, null, 2)} />
						</CardHeader>
						<View>
							<View
								as="pre"
								tabIndex={0}
								spellCheck={false}
								autoComplete="off"
								contentEditable={true}
								readOnly
								css={css(ui.font.monospace, ui.padding(4), {
									whiteSpace: "break-spaces"
								})}
								dangerouslySetInnerHTML={{
									__html: JSON.stringify(config, null, 2)
								}}
							/>
						</View>
					</Card>

					<Spacer pb={8} />
				</Scrollable>
				<View
					css={`
						position: fixed;
						bottom: 30px;
						right: 30px;
						z-index: 10;
					`}
				>
					<CopyToClipboardButton
						value={window.location.href}
						size="large"
						label="Share"
					/>
				</View>
			</Surface>
		</ThemeProvider>
	);
});

export const Layout = React.memo(({ children }) => {
	return (
		<Grid
			gap={0}
			css={`
				position: fixed;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
			`}
			templateColumns="1fr minmax(400px, 35%)"
		>
			<Surface
				borderRight
				css={`
					height: 100vh;
				`}
			>
				<Scrollable
					css={`
						padding: 40px;
					`}
				>
					<Container width={640}>{children}</Container>
					<Spacer pb="20vh" />
				</Scrollable>
			</Surface>
			<CodePreview />
		</Grid>
	);
});
