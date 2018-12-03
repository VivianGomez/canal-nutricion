import {
  Meteor
} from 'meteor/meteor';
import '../imports/api/patients';
import '../imports/api/users';
import '../imports/api/doctors';
import '../imports/api/nutritionists';

Meteor.startup(() => {
  // code to run on server at startup
  Inject.rawModHtml("addLanguage", function (html) {
    return html.replace(/<html>/, '<!-- HTML 5 -->\n<html lang="en">');
  });
});