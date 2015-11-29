Template.timeslotsDay.rendered = function () {
    var hammerArea = document.getElementById('hammerDiv');
    var hammertime = new Hammer(hammerArea,{});
    hammertime.get('swipe').set({ velocity: 0.30, threshold: 4});

    hammertime.on('swiperight', function(e) {
        var dayContext = Agenda.daysContext(Router.current().params.dayProcessed);
        if (! dayContext.isFirstDay) Router.go('timeslotsDay.show',{dayProcessed: dayContext.previousDay} ) ;
    });
    hammertime.on('swipeleft', function(e) {
        var dayContext = Agenda.daysContext(Router.current().params.dayProcessed);
        if (! dayContext.isLastDay) Router.go('timeslotsDay.show',{dayProcessed: dayContext.nextDay} ) ;
    });

    Tracker.afterFlush(function () {
        IonSideMenu.snapper.disable();
    });
};

Template.timeslotsDay.destroyed = function () {
    IonSideMenu.snapper.enable();
};

Template.timeslotsDay.helpers({
    /*
     return last update time.
     */
    infoMaj: function(){
        var lastupdate = LastUpdate.findOne({});
        return moment(lastupdate.lastdate).format('HH:mm:ss');
    },
    /*
     return all data the the Day
     */
    daySetting: function () {
        debugger;
        var dayContext = Agenda.daysContext(Router.current().params.dayProcessed);
        _.extend(this,dayContext);
        return this;
    },
    /*
     Date format court
     */
    shortTimeslot: function (date) {
        return moment(date).format('HH') + 'h-' + moment(date).add(1, 'hour').format('HH') + 'h';
    },
    /*
     expand flag  for  horaire and category
     */
    hasToShowed: function (categorie) {
        var isFound = Filters.findOne({horaire: this.horaire, categorie: categorie});
        return !! isFound;
    },
    timeslotsList: function () {
        var deb = moment().add(-1, 'hour').toDate();
        var params = _.extend({}, Router.current().params);
        ;
        if (moment().add(-1, 'hour') > moment(params.dayProcessed, "YYYY-MM-DD")) {
            var dateMin = moment().add(-1, 'hour').toDate();
        } else {
            var dateMin = moment(params.dayProcessed, "YYYY-MM-DD").toDate();
        }
        var dateMax = moment(params.dayProcessed, "YYYY-MM-DD").add(1, 'day').toDate();

        var cursor = Timeslots.find({$and: [{horaire: {$gt: dateMin}}, {horaire: {$lt: dateMax}}]}, {sort: {horaire: 1}}).fetch(); // sans le fetch pastop ...
        if (!cursor[0]) {
            return;
        }
        Session.set('FirstTimeSlotId', cursor[0]._id);
        return cursor;
    }
})
;

Template.timeslotsDay.events({
    "click .item-salle, tap .item-salle": function () {
        Agenda.flipFlapFilter(this.horaire, this.iNbSalle, "listSalle");
        Session.set("selectedRoom", "");
    },
    "click .item-box, tap .item-box": function () {
        Agenda.flipFlapFilter(this.horaire, this.iNbBox, "listBox");
        Session.set("selectedRoom", "");
    },
    "click .item-autre, tap .item-autre": function () {
        Agenda.flipFlapFilter(this.horaire, this.iNbAutre, "listAutre");
        Session.set("selectedRoom", "");
    },
    "click .uploadCalendar, tap .uploadCalendar": function (e) {
        try {
            //  window.plugins.calendar.openCalendar();
            // create an event interactively with the calOptions object as shown above
            // debugger;
            Session.set("selectedRoom", this._id);
            IonLoading.show({
                duration: 4000
            });

            var startDate = this.debut;
            var endDate = new moment(startDate).add(60, 'm').toDate();

            var title = "Réunion importante .. ";
            var eventLocation = this.name;
            var eventLocationMail = this.mail;
            var notes = "provided by Le Tech app.";

            var success = function (message) {
                RoomsBooked.insert({horaire: startDate, roomMail: eventLocationMail});
                IonLoading.hide();
                // alert("Success: " + JSON.stringify(message));
            };
            var error = function (message) {
                IonLoading.hide();
                Session.set("selectedRoom", "");
                // alert("Error: " + message);
            };

            var calOptions = window.plugins.calendar.getCreateCalendarOptions();
            // createCalOptions.calendarName = "My Cal Name";
            calOptions.calendarColor = "#FF0000"; // an optional hex color (with the # char), default is null, so the OS picks a color
            calOptions.firstReminderMinutes = 15; // 15 minute.
            // create an event interactively with the calOptions object as shown above
            window.plugins.calendar.createEventInteractivelyWithOptions(title, eventLocation,eventLocationMail,  notes, startDate, endDate, calOptions, success, error);
        }
        catch (err) {
            alert(err);
        }

    }
});

Template.roomsList.helpers({
    isRoomBooked: function(){
        debugger;
        var isFound = RoomsBooked.findOne({horaire: this.debut, roomMail: this.mail});
        if (!! isFound) return true ;
        else return false;
    },
    hasToShowed: function (parentContext) {
        this.listeRooms = parentContext[ this.ressourceType ];
        var isFound = Filters.findOne({horaire: parentContext.horaire, categorie: this.ressourceType});
        return !! isFound;
    },
    decodeSalleName: function () {
        var SalleInfo = Agenda.decodeRoomName(this.name);
        this.place = SalleInfo.place;
        this.fullType = SalleInfo.fullType;
        switch (SalleInfo.aile) {
            case "V":
                this.badgeColor = "balanced";
                break;
            case "J":
                this.badgeColor = "energized";
                break;
            case "B":
                this.badgeColor = "positive";
                break;
            case "R":
                this.badgeColor = "assertive";
                break;
            default :
                this.badgeColor = "";
                break;
        }
        this.shortName = SalleInfo.shortName;
        this.infoName = SalleInfo.infoName;
        if (this.horaire.getTime() != this.debut.getTime()) {
            this.demiheure = true;
        }
        return;
    },
    Selected: function(){
        if (Session.equals("selectedRoom", this._id)) return "room-item-selected";
        else return "room-item-notselected";
    }
});