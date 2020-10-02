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
	SearchInput,
	VStack,
	Text
} from "@wp-g2/components";
import { GradientControl } from "./components/GradientControl";
import { PaletteControl } from "./components/PaletteControl";
import { UnitControl } from "./components/UnitControl";
import { FontSizeControl } from "./components/FontSizeControl";
import { useUrlSync, useConfig, useSearchQuery } from "./store";

const ColorPanel = React.memo(() => {
	return (
		<ListGroup>
			<ListGroupHeader>Color</ListGroupHeader>

			<SwitchControl
				label="Custom"
				helpText="Enable custom colors"
				prop="global.settings.color.custom"
			/>
			<SwitchControl
				label="Custom Gradient"
				helpText="Enable custom gradients"
				prop="global.settings.color.customGradient"
			/>
			<SwitchControl
				label="Link"
				helpText="Enables custom link color controls"
				prop="global.settings.color.link"
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
				prop="global.settings.spacing.customPadding"
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
				prop="global.settings.typography.customFontSize"
			/>
			<SwitchControl
				label="Custom Line Height"
				helpText="Enable line height controls"
				prop="global.settings.typography.customLineHeight"
			/>
			<SwitchControl
				label="Dropcap"
				helpText="Enable drop cap controls"
				prop="global.settings.typography.dropCap"
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

const ConfigSearch = React.memo(() => {
	const [value, onChange] = useSearchQuery();
	return <SearchInput value={value} onChange={onChange} />;
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
			<ListGroups spacing={12}>
				<ColorPanel />
				<SpacingPanel />
				<TypographyPanel />
			</ListGroups>
			<Footer />
		</Layout>
	);
}

export default App;
