import React from "react";
import { useState, useEffect } from "react";
import { useConfig } from "@dhis2/app-runtime";
import { Button, Chip } from "@dhis2/ui-core";
import classes from './App.module.css'

import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
    TableFoot,
    CenteredContent
} from "@dhis2/ui-core";

const apiUrl = "https://course.dhis2.org/api/trackedEntityInstances";

const MainTable = (props) => {

    var x;
    var y;
    var z;
    var i;
    var j;
    var k;
    var l;
    var fullNames = [];
    const personData = [];
    var name
    var tempPerson;
    const { baseUrl } = useConfig()
    const[isEmpty, setEmpty] = useState(false)
    const fakeNums = ["11223344", "27864299", "36817721", "91682220",
"74770314","78121679","71558992"]

    let both_programs = props.queryData.indexTei.trackedEntityInstances.concat(props.queryData.contactTei.trackedEntityInstances)

    // Uthenting av persondata
    for (x of both_programs) {
        const fullName = [null, null];
        var inIndex = false;
        var inContact = false;
        var correctDate = false;
        var personDue = "";
        var name = "";
        var phone = "";
        var age = "";
		var itemType = null;

        var teiId = x.trackedEntityInstance;
        var url = baseUrl + "/dhis-web-tracker-capture/index.html#/dashboard?tei=" + teiId + "&program=DM9n1bUw8W8&ou=MyfUagrB0XA";

        if (props.filterIndex) {
            for (y of props.queryData.enrollments.enrollments) {
                if (y.program == "uYjxkTbwRNf" && y.trackedEntityInstance == teiId) {
                    inIndex = true
					itemType = "Index Case"
                    for (z of props.queryData.events.events) {
                        if (z.trackedEntityInstance == teiId && z.status != "COMPLETED"
							&& (z.status != "CANCELLED" || z.status != "SKIPPED")
							&& (z.programStage == "sAV9jAajr8x" || z.programStage == "oqsk2Jv4k3s")) {
								let date = new Date(z.dueDate)
								if (date.getMonth() == props.showDate.getMonth() && date.getDate() == props.showDate.getDate()) {
									correctDate = true
									personDue = date.getFullYear() + "." + (date.getMonth() +1) + "." + date.getDate()
								}
                        }
                    }
                }
            }
        }
        if (props.filterContact) {
            for (i of props.queryData.enrollments.enrollments) {
                if (i.program == "DM9n1bUw8W8" && i.trackedEntityInstance == teiId) {
                    inContact = true
					itemType = "Contact"
                    for (j of props.queryData.events.events) {
                        if (j.trackedEntityInstance == teiId && j.status != "COMPLETED"
							&& (j.status != "CANCELLED" || j.status != "SKIPPED")
							&& (j.programStage == "sAV9jAajr8x" || j.programStage == "oqsk2Jv4k3s")) {
								let date = new Date(j.dueDate)
								if (date.getMonth() == props.showDate.getMonth() && date.getDate() == props.showDate.getDate()) {
									correctDate = true
									personDue = date.getFullYear() + "." + (date.getMonth() +1) + "." + date.getDate()
								}
                          
                        }
                    }
                }
            }
        }

        if ((inIndex || inContact) && correctDate) {     
            for (k of x.attributes) {
                if (k.code == "first_name") {
                    fullName[0] = k.value;
                }
                if (k.code == "surname") {
                    fullName[1] = k.value;
                }
                if (k.code == "patinfo_ageonsetunit") {
                    let date = new Date()
                    let k_date = new Date(k.value)
                    age = date.getFullYear() - k_date.getFullYear()
                }
                if (k.code == "phone_local") {
                    phone = k.value
                }
            }
            if (fullName[0] != null && fullName[1] != null) {
                const stringFullName = fullName[0] + " " + fullName[1];
                fullNames.push(stringFullName);
                name = stringFullName;
            }
            tempPerson = {
                "name": name,
                "age": age,
                "phone": phone,
                "urlValue": url,
                "date": personDue,
				"itemType": itemType,
            }
            personData.push(tempPerson);
        }
    }

    // Funksjon som går gjennom hele personlista og lager en tabellrad for hver person
    function MultipleRows(props) {
        const items = [];
        var person;
        useEffect(() => {
            setEmpty(false);
          });
        for (person of personData) {
            items.push(
                <Rows
                    name={person.name}
                    age={person.age}
                    phone={person.phone}
                    date={person.date}
					itemType={person.itemType}
                    urlValue={person.urlValue}
                    key = {person.name}
                />
            );
        }
        if (items.length == 0) {
            useEffect(() => {
                setEmpty(true);
              });
            return  (
            <TableBody>
                <TableRow>
                    <TableCell colSpan="5">
                        <CenteredContent position="middle">
                            No scheduled follow-ups
                        </CenteredContent>
                    </TableCell>
                </TableRow>
            </TableBody>
            )
        }
        return <TableBody>{items}</TableBody>;
    }


    // Metode som tar inn parameterne i props og returnerer en tabellrad
    function Rows(props) {
        return (
            <TableRow dataTest="dhis2-uicore-tablerow">
                <TableCell dataTest="dhis2-uicore-tablecell"
                className={classes.tableRoboto}>
                    {props.name}
                </TableCell>
                <TableCell dataTest="details-id"
                className={classes.tableRoboto}>{props.age}</TableCell>
                <TableCell dataTest="details-id"
                className={classes.tableRoboto}>{props.phone}</TableCell>
				<TableCell dataTest="details-id"
                className={classes.tableRoboto}>
                    <Chip className={classes.tableRoboto}>{props.itemType}</Chip></TableCell>
                <TableCell dataTest="details-id"
                className={classes.tableRoboto}>
                    <Button className={classes.tableButton}
                        dataTest="dhis2-uicore-button"
                        name="Basic button"
                        type="button"
                        value="default"
                        onClick={() => window.open(props.urlValue, "_blank")}
                        primary
                    >
                        Edit
                    </Button>
                </TableCell>
            </TableRow>
        );
    }


    // Returnerer hele tabellelementet
    return (
        <Table dataTest="dhis2-uicore-table">
            <TableHead dataTest="dhis2-uicore-tablehead">
                <TableRowHead   dataTest="dhis2-uicore-tablerowhead"
                                className={isEmpty ? classes.tableHeadEmpty : classes.tableHead}>
                    <TableCellHead dataTest="dhis2-uicore-tablecellhead">
                        Name
                    </TableCellHead>
                    <TableCellHead dataTest="dhis2-uicore-tablecellhead">
                        Age
                    </TableCellHead>
                    <TableCellHead dataTest="dhis2-uicore-tablecellhead">
                        Phone
                    </TableCellHead>
					<TableCellHead dataTest="dhis2-uicore-tablecellhead">
                        Type
                    </TableCellHead>
                </TableRowHead>
            </TableHead>

            <MultipleRows />
            

            <TableFoot dataTest="dhis2-uicore-tablefoot">
                <TableRow dataTest="dhis2-uicore-tablerow">
                    <TableCell
                        colSpan="5"
                        dataTest="dhis2-uicore-tablecell"
                    ></TableCell>
                </TableRow>
            </TableFoot>
        </Table>
    );
};
export { MainTable };
