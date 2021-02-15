import React from 'react'
import { Box } from '@dhis2/ui-core'
import classes from './App.module.css'

export function generateWorkload (data) {

        var x = null
        var dueDate
        const todayDate = new Date()
        var overdue = []
        var due_today = []
        var due_1day = []
        var due_1week = []
        var due_2weeks = []
        for (x of data.events.events) {
            dueDate = new Date(x.dueDate)
			const dayDifference = (dueDate.getDate() - todayDate.getDate())
			console.log(dayDifference)
			if (x.status != "COMPLETED"
				&& (x.status != "CANCELLED" || x.status != "SKIPPED")
				&& (x.programStage == "sAV9jAajr8x" || x.programStage == "oqsk2Jv4k3s")) {
				if (dayDifference < 0) {
					overdue.push(x)
				}
				else {
					if (dayDifference <= 14) due_2weeks.push(x)
					if (dayDifference <= 7) due_1week.push(x)
					if (dayDifference <= 1) due_1day.push(x)
					if (dayDifference == 0) due_today.push(x)	
				}		
			}
        }

        return (
            [overdue.length,due_today.length, due_1day.length, due_1week.length, due_2weeks.length]
        )
}
