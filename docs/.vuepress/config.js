const path = require('path');
const highlight = require('./highlight');
const helpers = require('./helpers');
const examples = require('./containers/examples');
const sourceCodeLink = require('./containers/sourceCodeLink');

const buildMode = process.env.BUILD_MODE;
const environmentHead = buildMode === 'production' ?
  [
    // Google Tag Manager, an extra element within the `ssr.html` file.
    ['script', {}, `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-55L5D3');
    `],
  ]
  : [];

module.exports = {
  patterns: ['**/*.md', '!README.md', '!README-EDITING.md', '!README-DEPLOYMENT.md'], // to enable vue pages add: '**/*.vue'.
  description: 'Handsontable',
  base: '/docs/',
  head: [
    ['link', { rel: 'icon', href: 'https://handsontable.com/static/images/template/ModCommon/favicon-32x32.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    // Cookiebot - cookie consent popup
    ['script', {
      id: 'Cookiebot',
      src: 'https://consent.cookiebot.com/uc.js',
      'data-cbid': 'ef171f1d-a288-433f-b680-3cdbdebd5646'
    }],
    ...environmentHead
  ],
  markdown: {
    toc: {
      includeLevel: [2, 3],
      containerHeaderHtml: '<div class="toc-container-header">Table of contents</div>'
    },
  },
  plugins: [
    'tabs',
    ['sitemap', {
      hostname: 'https://handsontable.com',
    }],
    ['@vuepress/active-header-links', {
      sidebarLinkSelector: '.table-of-contents a',
      headerAnchorSelector: '.header-anchor'
    }],
    ['container', examples],
    ['container', sourceCodeLink],
    {
      extendMarkdown(md) {
        const render = function(tokens, options, env) {
          let i; let type;
          let result = '';
          const rules = this.rules;

          for (i = 0; i < tokens.length; i++) { // overwritten here
            type = tokens[i].type;

            if (type === 'inline') {
              result += this.renderInline(tokens[i].children, options, env);
            } else if (typeof rules[type] !== 'undefined') {
              result += rules[tokens[i].type](tokens, i, options, env, this);
            } else {
              result += this.renderToken(tokens, i, options, env);
            }
          }

          return result;
        };

        // overwrite markdown `render` function to allow extending tokens array (remove caching before loop).
        md.renderer.render = (tokens, options, env) => render.call(md.renderer, tokens, options, env);
      },
      chainMarkdown(config) {
        // inject custom markdown highlight with our snippet runner
        config
          .options
          .highlight(highlight)
          .end();
      },
      chainWebpack: (config) => {
        config.module
          .rule('md')
          .test(/\.md$/)
          .use(path.resolve(__dirname, 'docs-links'))
          .loader(path.resolve(__dirname, 'docs-links'))
          .end();
      },
    },
  ],
  extendPageData($page) {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const twoDigitDay = date.getDate();
      const shortMonthName = date.toLocaleString('default', { month: 'short' });

      return `${shortMonthName} ${twoDigitDay}, ${date.getFullYear()}`;
    };

    $page.versions = helpers.getVersions();
    $page.latestVersion = helpers.getLatestVersion();
    $page.currentVersion = helpers.parseVersion($page.path);
    $page.lastUpdatedFormat = formatDate($page.lastUpdated);

    if ($page.currentVersion === $page.latestVersion && $page.frontmatter.permalink) {
      $page.frontmatter.permalink = $page.frontmatter.permalink.replace(/^\/[^/]*\//, '/');
      $page.frontmatter.canonicalUrl = undefined;
    }
    if ($page.currentVersion !== $page.latestVersion && $page.frontmatter.canonicalUrl) {
      $page.frontmatter.canonicalUrl = `https://handsontable.com/docs${$page.frontmatter.canonicalUrl}`;
    }
  },
  themeConfig: {
    nextLinks: true,
    prevLinks: true,
    repo: 'handsontable/handsontable',
    docsRepo: 'handsontable/handsontable',
    docsDir: 'docs',
    docsBranch: 'develop',
    editLinks: true,
    editLinkText: 'Suggest edits',
    lastUpdated: true,
    smoothScroll: false,
    nav: [
      // Guide & API Reference has defined in: theme/components/NavLinks.vue
      { text: 'GitHub', link: 'https://github.com/handsontable/handsontable' },
      { text: 'Blog', link: 'https://handsontable.com/blog' },
      { text: 'Support',
        items: [
          { text: 'Contact support', link: 'https://handsontable.com/contact?category=technical_support' },
          { text: 'Report an issue', link: 'https://github.com/handsontable/handsontable/issues/new/choose' },
          { text: 'Forum', link: 'https://forum.handsontable.com' },
        ]
      },
    ],
    displayAllHeaders: true, // collapse other pages
    activeHeaderLinks: true,
    sidebarDepth: 0,
    sidebar: helpers.getSidebars(buildMode),
    search: true,
    searchPlaceholder: 'Search...',
    searchMaxGuidesSuggestions: 5,
    searchMaxAPISuggestions: 10,
    fuzzySearchDomains: ['Core', 'Hooks', 'Options'],
  }
};
