/** "★★★★☆" for a 0-5 rating; empty string when the rating is hidden (0). */
export function renderStars( rating: number ): string {
	const value = Math.min( 5, Math.max( 0, Math.round( rating ) ) );
	return value === 0 ? '' : '★'.repeat( value ) + '☆'.repeat( 5 - value );
}
