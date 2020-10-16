// Thank you to: https://hoangtrinhj.com/using-google-analytics-with-next-js

const GA_TRACKING_ID = 'UA-171089496-1' // This is your GA Tracking ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export default {
	GA_TRACKING_ID,

	pageview(url: string) {
		// @ts-ignore
		window.gtag('config', GA_TRACKING_ID, { page_path: url })
	},

	// https://developers.google.com/analytics/devguides/collection/gtagjs/events
	// @ts-ignore
	event({ action, event_category, event_label, value }) {
		// @ts-ignore
		window.gtag('event', action, {
			event_category,
			event_label,
			value,
		})
	}
}
