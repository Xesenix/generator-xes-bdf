/**
 * Linear interpolation for style between specific screen sizes.
 * @param style style name to interpolate
 * @param min style value at low end of screen size
 * @param max style value at high end of screen size
 * @param minWidth low end of screen size
 * @param maxWidth high end of screen size
 */
export function fluidSize(style, min, max, minWidth, maxWidth) {
	return {
		[style]: `${max}px`,
		[`@media (max-width: ${maxWidth}px)`]: {
			[style]: `calc(${min}px + ${(max - min) / (maxWidth - minWidth)} * (100vw - ${minWidth}px))`,
		},
		[`@media (max-width: ${minWidth}px)`]: {
			[style]: `${min}px`,
		},
	};
}
