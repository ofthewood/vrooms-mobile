Router.configure({
    layoutTemplate: 'layoutVrooms'
});

Meteor.startup(function () {
    if (Meteor.isClient) {
        var location = Iron.Location.get();
        if (location.queryObject.platformOverride) {
            Session.set('platformOverride', location.queryObject.platformOverride);
        }
    }
});

Router.map(function () {
    this.route('index');
    this.route('home', {
        path: '/',
        action: function(){
            this.redirect('/timeslotsDay/first');
        }});
    this.route('timeslots');
    /*
    this.route('timeslotsDay', { // sans param  avec param c'est plus bas ...
        action: function () {
            debugger;
            var currentMeetingDay = Agenda.currentMeetingDay().format('YYYY-MM-DD');
            Router.go('timeslotsDayName', {dayProcessed: currentMeetingDay}); // à rapprocher avec le name de timeslotsDay
        }
    });

    */
    this.route('timeslotsDay1/:product', { // sans param  avec param c'est plus bas ...
        name: 'timeslotsDay1show',
        action: function () {
            debugger;
            var currentMeetingDay = Agenda.currentMeetingDay().format('YYYY-MM-DD');
            Router.go('index'); // à rapprocher avec le name de timeslotsDay
        }
    });

    this.route('timeslotsDay/:dayProcessed', {
        name: 'timeslotsDay.show',
        onBeforeAction: function () { // check if day is correct ...
            var ListMeetingDay = Agenda.ListMeetingDay();
            var dayProcessed = this.params.dayProcessed;
            var data = _.find(ListMeetingDay, function (inDay) {
                return inDay.format('YYYY-MM-DD') == dayProcessed;
            });
            if (data) {
                this.next(); // correct
            } else {
                Router.go('timeslotsDay.show',  {dayProcessed: Agenda.currentMeetingDay().format('YYYY-MM-DD')});  // incorrect .
            }

        },
        waitOn: function() {
            return Meteor.subscribe("LastUpdate");
        },
        action: function () {
            this.render("timeslotsDay");
        }
    });
    this.route('actionSheet');
    this.route('backdrop');
    this.route('forms', {
        data: function () {
            return {
                post: Posts.find().fetch()[0]
            };
        }
    });
    this.route('contactForm');
    this.route('headersFooters');
    this.route('lists');
    this.route('loading');
    this.route('modal');
    this.route('navigation');
    this.route('navigation.one', {path: '/navigation/one'});
    this.route('navigation.two', {path: '/navigation/two'});
    this.route('navigation.three', {path: '/navigation/three'});
    this.route('popover');
    this.route('popup');
    this.route('sideMenu');
    this.route('slideBox');
    this.route('tabs.one', {path: '/tabs/one', layoutTemplate: 'tabsLayout'});
    this.route('tabs.two', {path: '/tabs/two', layoutTemplate: 'tabsLayout'});
    this.route('tabs.three', {path: '/tabs/three', layoutTemplate: 'tabsLayout'});
    this.route('tabs.four', {path: '/tabs/four', layoutTemplate: 'tabsLayout'});
    this.route('userAccounts');
});
