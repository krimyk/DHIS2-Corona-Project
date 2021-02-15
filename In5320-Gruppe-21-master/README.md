# In5320-Gruppe-21
An app which displays a working list, intended for infection trackers/health workers. The app is developed as a DHIS2-application using the React framework.

## Functionality
The application has two main features, which are separated into two different files: table.js and workload.js. They each represent the two main functionalities, the Table, which displays contacts and index cases, and the Workload-overview, which is an overview of upcoming workload. Our assumption is that we only need to display the index cases and contacts from a specific organisation unit, in which case we have chosen Gol Kommune as our test case. We recognize that further functionality could include the choice to change organisation unit, such as when several small kommuner might work together tracking infection.

### Table
This functionality is represented in the main app as the component MainTable, and consists primarily of a DHIS2 Table component. This table displays name, age, phone number, due date, type of program, and provides a button which links directly to that event's tracker capture form. The table defaults to showing cases which are due today, but you are also able to shift around the date, in order to see past and present events which aren't completed yet.

Regarding implementation, we have chosen to do filtration client-side, as we wanted to reduce the number of queries that are sent to the API. This is quick on a small sample size, but might introduce issues with a bigger data set. The definitive benefit of this implementation, is that we only need to query the API once at the beginning, as all later filtrations/calculations are done client-side to present the filtered table.

### Workload
This feature shows how many enrollments which are currently not COMPLETED. These are displayed as a counter with the labels: "Today", "Tomorrow", "1 Week" and "2 Weeks". The purpose of the feature is to allow health workers to have an overview of their upcoming workload. The different workload labels are intended to display how many follow-up and health status follow-ups need to be done within that amount of time. We also wanted to add some extra functionality here, showing work that is overdue as well, assuming that this ever happens.

Similarly to the Table functionality, the workload is also computed client-side, using the same query data we get from the first DataQuery. To do this, we simply check today's date, and compute how many future events are within today, tomorrow etc. The workload is then represented as five different DHIS2 Boxes, having their assigned labels and values.

## Missing Functionality
We have implemented all the functionality we wanted to. However, the amount of client-side calculations we do might not be optimal. We were aiming to implement the functionality without ever querying more than once, which we have succeeded in doing.

## Group project
This project was done during IN5320 at institute of informatics at the university of Oslo. This project was assinged as a group project with krimyk and nikolajo.