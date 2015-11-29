Template.timeslots.rendered = function () {
    Tracker.afterFlush(function(){
        IonSideMenu.snapper.disable();
    });
    //IonSideMenu.snapper.disable();
};

Template.timeslots.destroyed = function () {
    IonSideMenu.snapper.enable();
};

Template.timeslots.helpers({
    decodeSalleName: function () {
        debugger;
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
    icsfile: function () {
        return Meteor.absoluteUrl() + 'icsfile?id=' + this._id;
    },
    counter: function () {
        var meeting = Meetings.findOne(this._id);
        if (!meeting) {
            return null
        }
        ;
        if (!meeting.counter) {
            return null
        }
        ;
        if (meeting.counter == 0) {
            return null
        }
        ;
        return meeting.counter;
    },
    isNotFirstDay: function () {
        //debugger;
        var isNotFirstDay = true;
        if (Session.get('FirstTimeSlotId') == this._id) {
            isNotFirstDay = false;
        }
        return isNotFirstDay;
    },
    isNewDay: function () {
        //debugger;
        var isNewDay = false;
        if (moment(this.horaire).hour() == 9 || Session.get('FirstTimeSlotId') == this._id) {
            isNewDay = true;
        }
        return isNewDay;
    },
    timeslot: function (date) {
        return moment(date).format('ddd DD MMM HH:mm') + ' - ' + moment(date).add(1, 'hour').format('HH:mm');
    },
    shortTimeslot: function (date) {
        return moment(date).format('HH') + 'h-' + moment(date).add(1, 'hour').format('HH') + 'h';
    },
    listeSalles: function () {
        //debugger;
        var liste = "";
        this.listSalle;
        for (var i = 0; i < (this.listSalle.length); i++) {
            liste = liste + " <BR> " + this.listSalle[i].name;

        }
        return liste;
    },
    hasToShowed: function (categorie) {
        //  in this.categorie
        // in this .horaire
        //  2 cas   affichage globale cat?gorie
        // affichage  demand?e de horaire / categorie

        // hidden show
        //debugger;
        Session.get('flipFlapFilter');
        var isFound = Filters.findOne({horaire: this.horaire, categorie: categorie});
        if (isFound) {
            return true;
        } else {
            return false;
        }

    },
    isShowed: function (categorie) {
        //  in this.categorie
        // in this .horaire
        //  2 cas   affichage globale cat?gorie
        // affichage  demand?e de horaire / categorie

        // hidden show
        //debugger;
        Session.get('flipFlapFilter');
        var isFound = Filters.findOne({horaire: this.horaire, categorie: categorie});
        if (isFound) {
            return "show"
        } else {
            return "hidden"
        }

    },
    formatedDay: function (date) {
        return moment(date).format('dddd LL');
    },
    dispos: function () {
        return "(" + this.iNbSalle + "/" + this.iNbBox + "/" + this.iNbAutre + ")";
    },
    lastUpdate: function () {
        Session.get('refreshInterval');
        var lastUdpateRoom = Rooms.findOne({}, {sort: {updatedAt: -1}});
        if (!lastUdpateRoom) {
            return null;
        }
        var a = moment();
        var b = moment(lastUdpateRoom.updatedAt);
        return " Maj: " + moment(lastUdpateRoom.updatedAt).fromNow();
    },
    actu: function () {
        Session.get('refreshInterval');
        var a = moment();
        var b = moment(this.updatedAt);
        var diff = a.diff(b, 'minutes');
        if (!(typeof this.updatedAt === 'undefined')) {
            if (diff < 16 && this.mvt != 0) {
                return "(" + this.mvt + ") " + moment(this.updatedAt).fromNow();
            }
        }
    },
    timeslotsList: function () {
        var deb = moment().add(-1, 'hour').toDate();
        var cursor = Timeslots.find({horaire: {$gt: deb}}, {sort: {horaire: 1}}).fetch(); // sans le fetch pastop ...
        if (!cursor[0]) {
            return
        }
        ;
        Session.set('FirstTimeSlotId', cursor[0]._id);
        return cursor;
    },
    times: function () {
        var times = [];
        _(20).times(function (n) {
            times.push(n);
        });
        return times;
    },
    ndays: function () {
        var days = [];
        _(8).times(function (n) {
            days.push(n);
        });
        return days;
    }
});


Template.timeslots.events({
    "click .item-salle, tap .item-salle": function () {
        Agenda.flipFlapFilter(this.horaire, this.iNbSalle, "salle");
    },
    "click .item-box, tap .item-box": function () {
        Agenda.flipFlapFilter(this.horaire, this.iNbBox, "box");
    },
    "click .item-autre, tap .item-autre": function () {
        Agenda.flipFlapFilter(this.horaire, this.iNbAutre, "autre");
    },
    "click .sendMail, tap .sendMail": function (e) {
        if (!Meteor.user()) {
            alert('Veuillez saisir votre @mail d\'abord');
            return;
        }
        var userMail = Meteor.user().emails[0].address || '';
        Meteor.call("sendMeetingMail", this._id, userMail);
        $(e.currentTarget).removeClass("animated tada").addClass("animated wobble");
        //Meetings.update(this._id, {$inc: { counter: 1 }});

    },
    "click .uploadCalendar, tap .uploadCalendar": function (e) {
        try {
            //  window.plugins.calendar.openCalendar();
            // create an event interactively with the calOptions object as shown above
            debugger;
            var startDate = this.horaire;

            var endDate = new moment(startDate).add(60, 'm').toDate();

            var title = "My nice event";
            var eventLocation = this.name;
            var eventLocationMail = this.mail;
            var notes = "Some notes about this event.";
            var success = function (message) {
                alert("Success: " + JSON.stringify(message));
            };
            var error = function (message) {
                alert("Error: " + message);
            };


            var calOptions = window.plugins.calendar.getCreateCalendarOptions();
            // createCalOptions.calendarName = "My Cal Name";
            calOptions.calendarColor = "#FF0000"; // an optional hex color (with the # char), default is null, so the OS picks a color

            // create an event interactively with the calOptions object as shown above
            window.plugins.calendar.createEventInteractivelyWithOptions(title, eventLocation,eventLocationMail,  notes, startDate, endDate, calOptions, success, error);

        }
        catch (err) {
            alert(err);
        }
        // $(e.currentTarget).removeClass("animated tada").addClass("animated wobble");
        //var fileUrl = Meteor.absoluteUrl() + '/icsfile?id=' + this._id;
        //alert("open");
        //Router.go(fileUrl);


    }

});