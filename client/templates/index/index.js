Template.index.helpers({
    timeslotsCount: function () {
        return Timeslots.find().count();
    },
    status: function(){
        return Meteor.status().connected;
    }
});