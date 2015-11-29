Template.contactForm.rendered = function () {
  Tracker.afterFlush(function () {
    IonSideMenu.snapper.disable();

  });
};
Template.contactForm.events({
  "click .submit, tap .submit": function (event, t) {
    event.preventDefault();
    var text = t.find('textarea[  name="at-field-password"]') ? t.find('textarea[name="at-field-password"]').value : void 0;
    var userMail = t.find('input[name="at-field-email"]') ? t.find('input[name="at-field-email"]').value : '';
    Meteor.call('sendFeedbackMail' , text, userMail) ;
    IonPopup.show({
      title: 'Envoyé !',
      template: 'Merci de votre commentaire.',
      buttons: [{
        text: 'Fermer',
        type: 'button-positive',
        onTap: function() {
          IonPopup.close();
          Router.go('timeslotsDay.show',{dayProcessed: "firstDay"});
        }
      }]
    });
  }
});
