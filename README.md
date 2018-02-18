# CHF Tracker

### CHF Tracker is a project aiming to help patients log their daily intakes in order to help both the patient and their primary care doctor monitor their disease.

## Background and Overview

The main focus of a hospital is to prevent people from dying. One of the most preventative deaths is congestive heart failure. As of now, there is no real way for patients to monitor their biometric data in order to know when to see their primary care doctor. This app would help patients monitor their daily information and notify them when it is the appropriate time to see their doctor, rather than coming in when they are at their worst.

## Functionality & MVP

   - [ ] We will allow patients to log their daily biometrics such as sodium intake, daily weight gain, fluid intake, swelling, and etc.
   - [ ] We will notify patients and their doctor when their biometrics reach certain thresholds
   - [ ] We will allow doctors to see their patients' info

#### Bonus Features
   - [ ] Expand to other diseases
   - [ ] Implement machine learning to analyze data collected for extra symptoms
   - [ ] Mobile friendly

## Technologies & Technical Challenges
  ##### Backend: Mongodb/Express.js
  ##### Frontend: Angular.js

#### User Interface
  + ##### Patient View
    + Patient view includes input forms for their data, simple as possible
    + Other co-morbidities and Ejection Fractions
    + Quick and easy way to send email to their doctor
    + Graphs for their weekly data
    + Prompt for things like age, stage (ranges from hospital), how many times theyve been admitted, list of their medications, weight gain, sodium, fluids, symptoms, etc. (weight is the biggest factor)
    + list of upcoming appointments
    + Recommended foods to eat and not eat
    + Exercise reminders

  + ##### Doctor View
    + Doctor view includes list of their patients and notifications on patients statistics
    + Easy way to notify patients who haven't been filling out their data
    + Input patients' upcoming appointments
    + Section to give notes to patient

#### Privacy
  + ##### Hiding patients' biometrics
    + Only allow the patient and their primary care doctor to see their information
    + Verifying whether or not someone is actually a doctor for account privileges

#### UX
  + ##### Frontend Interface
    + We have to make the views as simple and intuitive as possible as doctors don't have much time and patients are forgetful
    + Easy for older patients to use
    + Interactive graph for biometrics over week, month, year, etc.
    + More visual, the better

  + #### Backend
    + Managing all of the data with Mongo
    + Managing queries

## Accomplished over the Weekend
 - Decided on a project
 - Look into Express Docs, watch youtube videos from Traversy Media
 - Created simple Angular application and read through documentation
 - Watch videos on Node
 - Learn differences between Mongo and Postgres
 - Reached out to a nurse for more information on how to structure the application and common pitfalls
 
## Group Members & Work Breakdown

**Albert Shin**,
**Eddy Shin**,
**Lawrence Guintu**,
**Sam Chia**

### Day 1
  - Backend
    - Figure out schema and structure of data **SAM**
    - Simple user auth/doctor verification **EDDY**
  - Frontend
    - Simple Login and wireframes **ALBERT**
    - Find state manager, tutorials, and design state **Lawrence**
  - Framework should be set up **GROUP**

### Day 2
  - Patient View **ALBERT/LAWRENCE**
  - Set up database **EDDY/SAM**
  - Connecting requests and view together **GROUP**

### Day 3

  - Set graphs for Patient View **ALBERT/LAWRENCE**
  - Style Patient View/Login/Splash **ALBERT/LAWRENCE**
  - Make routes and API requests **SAM/EDDY** 
  - Assignments for day 4/5

### Day 4
  - Doctor View **TBD**
  - Separating doctor and patient auth **TBD**
  - Set up notifcations and emailing **TBD**

### Day 5
  - Style Doctor View **TBD**
  - Set Doctor's View of Patient **TBD**
  - Get hosting set up **TBD**

### Day 6
 - improve UX/UI
 - write README