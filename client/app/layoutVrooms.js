Meteor.call('isDevEnv', function(err, data) {
    Session.set('isDevEnv', data);
});

Template.layoutVrooms.helpers({
    isDevEnv: function(){
        return Session.get('isDevEnv');
    }
})
;
