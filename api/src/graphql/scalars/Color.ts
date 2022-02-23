import { scalarType } from "nexus";

// !: MAKE THIS WORK
// TODO: Make this better
export const Color = scalarType({
	name: "Color",
	asNexusMethod: "color",
	description: "Hexadecimal color code",
	parseValue(value) {
		return value;
	},
	serialize(value) {
		return value;
	},
});
