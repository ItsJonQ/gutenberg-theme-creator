import React from "react";
import { Layout, Logo } from "./components/Layout";
import { SwitchControl } from "./components/Controls";
import {
	Button,
	Heading,
	HStack,
	ListGroup,
	ListGroupHeader,
	ListGroups,
	Link,
	Separator,
	Spacer,
	VStack,
	Text
} from "@wp-g2/components";
import { ConfigSearch } from "./components/Search";
import { GradientControl } from "./components/GradientControl";
import { PaletteControl } from "./components/PaletteControl";
import { UnitControl } from "./components/UnitControl";
import { FontSizeControl } from "./components/FontSizeControl";
import { useUrlSync, useConfig } from "./store";

const ColorPanel = React.memo(() => {
	return (
		<ListGroup>
			<ListGroupHeader>Color</ListGroupHeader>
			<SwitchControl
				label="Custom"
				helpText="Enable custom colors"
				prop="settings.defaults.color.custom"
			/>
			<SwitchControl
				label="Custom Gradient"
				helpText="Enable custom gradients"
				prop="settings.defaults.color.customGradient"
			/>
			<SwitchControl
				label="Link"
				helpText="Enables custom link color controls"
				prop="settings.defaults.color.link"
			/>
			<PaletteControl />
			<GradientControl />
		</ListGroup>
	);
});

const SpacingPanel = React.memo(() => {
	return (
		<ListGroup>
			<ListGroupHeader>Spacing</ListGroupHeader>
			<SwitchControl
				label="Custom Padding"
				helpText="Enable padding controls"
				prop="settings.defaults.spacing.customPadding"
			/>
			<UnitControl />
		</ListGroup>
	);
});

const TypographyPanel = React.memo(() => {
	return (
		<ListGroup>
			<ListGroupHeader>Typography</ListGroupHeader>
			<SwitchControl
				label="Custom Font Sizes"
				helpText="Enable custom font sizes"
				prop="settings.defaults.typography.customFontSize"
			/>
			<SwitchControl
				label="Custom Line Height"
				helpText="Enable line height controls"
				prop="settings.defaults.typography.customLineHeight"
			/>
			<SwitchControl
				label="Dropcap"
				helpText="Enable drop cap controls"
				prop="settings.defaults.typography.dropCap"
			/>
			<FontSizeControl />
		</ListGroup>
	);
});

const Header = React.memo(() => {
	const { reset, hasChange } = useConfig();

	return (
		<HStack>
			<Heading size={4}>Global</Heading>
			<Button
				onClick={reset}
				size="small"
				isSubtle
				isControl
				disabled={!hasChange}
			>
				Reset Changes
			</Button>
		</HStack>
	);
});

const AppUrlSync = React.memo(() => {
	useUrlSync();
	return null;
});

const Footer = React.memo(() => {
	return (
		<Spacer my={12}>
			<Separator />
			<Text size={12}>
				Made with <strong>imagination</strong> and{" "}
				<Link
					href="https://g2components.wordpress.com/"
					target="_blank"
					weight={600}
				>
					G2
				</Link>
				. By{" "}
				<Link href="https://jonquach.com/" target="_blank" weight={600}>
					Q
				</Link>
				.
			</Text>
		</Spacer>
	);
});

function App() {
	return (
		<Layout>
			<AppUrlSync />
			<Spacer mb={8}>
				<Logo />
			</Spacer>
			<Spacer mb={8}>
				<VStack>
					<Header />
					<ConfigSearch />
				</VStack>
			</Spacer>
			<ListGroups spacing={20}>
				<ColorPanel />
				<SpacingPanel />
				<TypographyPanel />
			</ListGroups>
			<Footer />
		</Layout>
	);
}

export default App;
