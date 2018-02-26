# MyMetrics

[Live Demo](https://mymetrics-app.herokuapp.com)

### MyMetrics is a project aiming to help patients log their daily intakes in order to help both the patient and their primary care doctor monitor their disease.

## Team Members
* [Albert Shin](https://github.com/BertShin)
* [Eddy Shin](https://github.com/masag0)
* [Lawrence Guintu](https://github.com/Lawrenccee)
* [Samuel Chia](https://github.com/cheeeya)

## Background and Overview

The main focus of a hospital is to prevent people from dying. One of the most preventative deaths is congestive heart failure. As of now, there is no real way for patients to monitor their biometric data in order to know when to see their primary care doctor. This app would help patients monitor their daily information and notify them when it is the appropriate time to see their doctor, rather than coming in when they are at their worst.

MyMetrics is a tool made in a span of a 7 days that allows:
* Patients to log their daily metrics
* Doctors to view all their patients and their metrics 
* Doctors and patients to see when certain thresholds have been met, indicating the patient to see their doctor or the doctor to contact the patient.

## Features

MyMetrics gives patients the following features:
* Ability to log daily intakes
* Ability to edit previous days intakes
* Ability to see a graph of their intakes from day to day
* Ability to input medications and symptoms
* Warnings of when to contact their doctor for certain thresholds being met

MyMetrics gives doctors the following features: 
* Ability to view a patient's data
* Search through their patients
* Indication of which patients are in bad health

### Log In and Sign Up
Users are able to sign up as a patient or a doctor. This is done with different fields to indicate whether a user is created as a patient or a doctor.

<img src="https://raw.githubusercontent.com/Lawrenccee/MyMetrics/master/readme/signup.gif">

On the backend, code was made in order to reflect this and have validations for doctors and patients:

```javascript
if (user.doc_email) {
  User.findOne({ email: user.doc_email }, (err, doc) => {
    if (err) {
      res.send(err);
    }
    if (doc) {
      user.save((saveError, u) => {
        if (saveError) {
          res.send(saveError);
          res.status(422);
        } else {
          doc.patients.push(u);
          doc.save();
          req.logIn(user, function(error) {
            let isDoctor = false;
            if (error) res.send(422);
            if (user.license) isDoctor = true;
            res.send( { email: user.email, id: user._id, isDoctor } );
          });
        }
      });
  ...
```

There was also code implemented using the bcrypt and passport packages in order to authenticate users when signing in:

```javascript
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
```

Bcrypt is used to hash passwords in order to make them more secure. Comparesync checks where or not the input password is a solution to the bcrypted password to indicate whether or not the password sent is correct.

```javascript
passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(401).json( { message: info.message }); }
      req.logIn(user, function(error) {
        if (error) { return next(error); }
        let isDoctor = false;
        if (user.license) isDoctor = true;
        res.send( { email: user.email, id: user._id, isDoctor } );
      });
    })
```

Passport is used to authenticate a user when logging in, in addition to Bcrypt it helps validate when loggin in a user to create a session.

### Logging Information
Patients are able to log their daily vitals and edit previous days' information. When certain thresholds have been reached patients are shown a warning, indicating that they should see their doctor and that their doctor has also been notified.

<img src="https://raw.githubusercontent.com/Lawrenccee/MyMetrics/master/readme/input_intakes.gif">

This is done through AngularJS's two-way binding:

```html
<div class="inputs">
  <label><input type="number" ng-model="$ctrl.patient.weight">lbs</label>
  <label><input type="number" ng-model="$ctrl.patient.sodium">mg</label>
  <label><input type="number" ng-model="$ctrl.patient.fluid">ml</label>
</div>
```

A controller for the patient view passes the patient's information into the view as input. With this two-way binding, if either the view or controller values change it is reflected in the other. When a submit is sent the user is updated with the values in the patient.

### Adding Medications and Setting Next Appointment
Patients are also able to update a list of their current medications. They are also able to input when their next appointment.

<img src="https://raw.githubusercontent.com/Lawrenccee/MyMetrics/master/readme/medication_appt.gif">

The patient's information is updated whenever a new medication is added or an old one is removed:

```javascript
this.addMedication = (medication) => {
  let index = this.patient.medications.indexOf(medication);

  if (index < 0 && medication && medication.length > 0) {
    this.patient.medications.push(medication);

    $http({
      method: "PUT",
      url: `/api/users/${this.patient.id}`,
      data: { userInfo: { medications: this.patient.medications } }
    }).then(
      r => {
        this.patient.medications = r.data.medications;
      },
      e => console.log(e)
    );
  }

  this.medication = "";
};
```

By checking the current medications in the list and making sure none of them are already match the input, a new medication can be added to the list and sent for an update.

### Doctor View
The doctor view allows for searching through the patients, viewing patient's information, and indications of their patient's status.

<img src="https://raw.githubusercontent.com/Lawrenccee/MyMetrics/master/readme/doctor_view.gif">

When a doctor view is loaded, a request is made on the backend to populate the doctor's patient array with information about the patients. This is then sent to the front end where the doctor can click on a patient's list item in order to get the patient and show their information.

```javascript
User.findById(id).populate({
  path: 'patients',
  select: '-password',
  populate: {
    path: 'log'
  }
}).populate('log').lean().then(
  u => {
    if (u.patients.length > 0) {
      for (let i = 0; i < u.patients.length; i++) {
        u.patients[i] = formatUser(u.patients[i]);
      }
    }
```

```javascript
this.getPatient = (event) => {
  this.currentPatient = JSON.parse(event.target.dataset.patient);
  GraphService.createChart('patient-graph', this.currentPatient.logData);
};
```

## Architecture and Technologies
The project was implemented with the following Technologies:

* Javascript for the main coding language
* MEAN stack
  * MongoDB for the database
  * Express for Node conventions
  * AngularJS for the frontend
  * Node for the backend
* Highcharts for the graphs of the patient data
* BCrypt and Passport were used for validation and authentication of users
* Angular Material was used for loaders
* FontAwesome was used for any symbols

## Bonus Features for Future Improvement
- [ ] Modal to allow patients to add/change their doctor and password
- [ ] Give Doctors a way to change patient statuses and delete warnings
- [ ] Emails to allow patients and doctors to send messages to each other
- [ ] Making it Mobile friendly
