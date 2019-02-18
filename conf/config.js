module.exports = {
	MAIN: {
		ENTRIES: {
			main: './src',
			homepage: './src/pages/homepage',
		},
		PAGES: [{
			chunks: ['main', 'homepage'],
			title: 'Home page title',
			slug: 'homepage',
			// bodyClass: 'home-page',
			// bodyHtmlSnippet: '<div id="app"></div>',
		}],
	},
};
