import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight-ssr";
import math from "@bytemd/plugin-math-ssr";
import mermaid from "@bytemd/plugin-mermaid";

export const plugins = [gfm(), highlight(), math(), mermaid()];
