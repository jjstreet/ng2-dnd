export class Point {

	constructor(public x: number, public y: number) {}
}

export function getMouseRelativeTo(event: MouseEvent, element: HTMLElement): Point {
	return {
		x: event.pageX - element.offsetLeft,
		y: event.pageY - element.offsetTop
	};
}
