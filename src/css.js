export class CSSUtils {
    /**
	 * Get a CSS variable value from the page.
	 *
	 * @param name - name of the CSS variable.
	 * @returns Value of the CSS variable if found, null otherwise.
	 */
	static getVariable(name) {
		return getComputedStyle(document.body).getPropertyValue(name);
	}
}