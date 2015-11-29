Template.registerHelper.helpers({
    shortTimeslot: function(date){
    return moment(date).format('HH') + 'h-' + moment(date).add(1, 'hour').format('HH') + 'h';
    },
    decodeSalleName: function() {
        var SalleInfo = Agenda.decodeRoomName(this.name);
        this.place = SalleInfo.place;
        this.fullType = SalleInfo.fullType;
        switch (SalleInfo.aile) {
            case "V":
                this.badgeColor = "badge-primary";
                break;
            case "J":
                this.badgeColor = "badge-warning";
                break;
            case "B":
                this.badgeColor = "badge-success";
                break;
            case "R":
                this.badgeColor = "badge-danger";
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
    icsfile: function(){
        return Meteor.absoluteUrl() + 'icsfile?id=' + this._id;
    },
    counter: function(){
        var meeting = Meetings.findOne(this._id);
        if(! meeting){return null};
        if(! meeting.counter){return null};
        if( meeting.counter == 0){return null};
        return meeting.counter;
    },
    isNewDay: function(){
        //debugger;
        var isNewDay = false;
        if (moment(this.horaire).hour() == 9 || Session.get('FirstTimeSlotId') == this._id ) {
            isNewDay = true;
        }
        return isNewDay;
    },
    timeslot: function(date){
        return moment(date).format('ddd DD MMM HH:mm') + ' - ' + moment(date).add(1, 'hour').format('HH:mm');
    },
    shortTimeslot: function(date){
        return moment(date).format('HH') + 'h-' + moment(date).add(1, 'hour').format('HH') + 'h';
    },
    listeSalles: function(){
        //debugger;
        var liste  = "";
        this.listSalle;
        for (var i = 0; i < (this.listSalle.length); i++) {
            liste = liste + " <BR> " +  this.listSalle[i].name;

        }
        return  liste ;
    },
    hasToShowed: function(categorie){
        //  in this.categorie
        // in this .horaire
        //  2 cas   affichage globale catégorie
        // affichage  demandée de horaire / categorie

        // hidden show
        //debugger;
        Session.get('flipFlapFilter');
        Session.get('flipFlapFilter');
        var isFound = Filters.findOne({horaire: this.horaire, categorie: categorie});
        if(isFound){
            return true;
        }else{
            return false;
        }

    },
    isShowed: function(categorie){
        //  in this.categorie
        // in this .horaire
        //  2 cas   affichage globale catégorie
        // affichage  demandée de horaire / categorie

        // hidden show
        //debugger;
        Session.get('flipFlapFilter');
        var isFound = Filters.findOne({horaire: this.horaire, categorie: categorie});
        if(isFound){
            return "show"
        }else{
            return "hidden"
        }

    },
    formatedDay: function(date){
        return moment(date).format('dddd LL');
    },
    dispos: function(){
        return "(" + this.iNbSalle + "/"+ this.iNbBox + "/"+ this.iNbAutre + ")";
    },
    lastUpdate: function(){
        Session.get('refreshInterval');
        var lastUdpateRoom = Rooms.findOne({}, {sort: {updatedAt: -1}});
        if (! lastUdpateRoom) { return null;}
        var a = moment();
        var b = moment(lastUdpateRoom.updatedAt);
        return " Maj: " + moment(lastUdpateRoom.updatedAt).fromNow();
    },
    actu: function(){
        Session.get('refreshInterval');
        var a = moment();
        var b = moment(this.updatedAt);
        var diff = a.diff(b, 'minutes');
        if ( !(typeof this.updatedAt === 'undefined')) {
            if (diff < 16 && this.mvt != 0 ) {
                return "(" + this.mvt + ") " + moment(this.updatedAt).fromNow();
            }
        }
    },
    timeslotsList: function () {
        debugger;
        var  deb = moment().add(-1, 'hour').toDate();
        var  cursor =    Timeslots.find({horaire: { $gt: deb}}, {sort: {horaire: 1}}).fetch(); // sans le fetch pastop ...
        if(! cursor[0]) {return};
        Session.set('FirstTimeSlotId',cursor[0]._id);
        return cursor;
    }
});