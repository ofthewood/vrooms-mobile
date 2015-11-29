Package.describe({
  name: 'ofthewood:vrooms-mobile',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  /* Add our packages that we depend on on both mobile/desktop sides */
  // https://thesauceco.de/blog/Add-Cordova-specific-styling-to-your-Meteor-project/
  // exemple interssant ...

  api.use([
    'iron:router',
    'meteor-platform',
    'templating',
    'handlebars',
    'session',
    'underscore',
    'less',
    'fourseven:scss',
    'useraccounts:ionic',
    'matb33:collection-hooks',
    'aldeed:autoform',
    'aldeed:collection2',
    'ofthewood:vrooms-base'
  ],['client','server']);


  api.imply([
    'meteoric:ionic-sass',
    'meteoric:ionicons-sass',
    'meteoric:ionic',
    'meteoric:autoform-ionic',
    'useraccounts:ionic',
 //   'hammer:hammer@2.0.4_1'
  ],['client','server']);


  /* Add each of our files that are a part of this package */
  api.add_files([

    'client/app/layoutVrooms.html',
    'client/app/layoutVrooms.js',
    'client/app/timeslotsDay/timeslotsDay.html',
    'client/app/timeslotsDay/timeslotsDay.js',
    'client/app/contactForm/contactForm.html',
    'client/app/contactForm/contactForm.js',


    'client/stylesheets/app.scss',
    'client/index.html',
    'client/layout.html',
    'client/broken.js',

    'client/templates/sideMenu/sideMenu.html',

    'client/templates/slideBox/slideBox.html',
    'client/templates/slideBox/slideBox.js',

    'client/templates/tabs/tabsTwo.html',
    'client/templates/tabs/_tabs.html',
    'client/templates/tabs/tabsOne.html',
    'client/templates/tabs/tabsFour.html',
    'client/templates/tabs/tabsLayout.html',
    'client/templates/tabs/_tabsHeader.html',
    'client/templates/tabs/tabsThree.html',
    'client/templates/tabs/tabsLayout.js',

    'client/templates/modal/modal.html',
    'client/templates/modal/_myModal.html',

    'client/templates/navigation/navigationOne.html',
    'client/templates/navigation/navigationTwo.html',
    'client/templates/navigation/navigationThree.html',
    'client/templates/navigation/navigation.html',

    'client/templates/popover/_myPopover.html',
    'client/templates/popover/popover.html',

    'client/templates/popup/popup.html',
    'client/templates/popup/popup.js',

    'client/templates/loading/loading.html',
    'client/templates/loading/loading.js',

    'client/templates/actionSheet/actionSheet.html',
    'client/templates/actionSheet/actionSheet.js',

    'client/templates/backdrop/backdrop.html',
    'client/templates/backdrop/backdrop.js',

    'client/templates/forms/forms.html',
    'client/templates/forms/autoformConfig.js',
    'client/templates/forms/forms.js',

    'client/templates/lists/lists.html',
    'client/templates/lists/lists.js',

    'client/templates/timeslots/timeslots.html',
    'client/templates/timeslots/timeslots.js',


    'client/templates/index/index.html',
    'client/templates/index/index.js',
    'client/templates/headersFooters/headersFooters.html',
    'client/templates/userAccounts/userAccounts.html',
    'client/templates/userAccounts/userAccounts.js',
    'client/templates/userAccounts/accountsConfig.js',

    'lib/router.js',
    'lib/hammer.min.js'
  ],['web.cordova']);
 // ],['web.cordova','web.browser']);

});




Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('vrooms-mobile');
  api.addFiles('vrooms-mobile-tests.js');
});
