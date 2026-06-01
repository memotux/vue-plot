import { createElement } from "./markFactory";
import {
	insert,
	parentNode,
	nextSibling,
	createComment,
	createText,
	setText,
	setElementText,
	querySelector,
	setScopeId,
	cloneNode,
	insertStaticContent,
} from "./renderer";
import { remove, patchProp } from "./patcher";

/**
 * Composes the custom renderer's node operations from the split modules.
 *
 * Returns a RendererOptions-shaped object consumed by Vue's createRenderer().
 */
export default function () {
	return {
		insert,
		remove,
		createElement,
		patchProp,
		parentNode,
		createText,
		createComment,
		setText,
		setElementText,
		nextSibling,
		querySelector,
		setScopeId,
		cloneNode,
		insertStaticContent,
	};
}
