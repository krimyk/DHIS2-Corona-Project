import React, { useState } from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import { Box, Checkbox,
         Button, Switch,
         AlertBar, Card,
         CenteredContent,
         Modal, ModalContent,
         ModalTitle, ModalActions,
         ButtonStrip} from '@dhis2/ui-core'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import { generateWorkload, Workload } from './workload.js'
import { MainTable } from './Table';


const query = {
    indexTei: {
      resource: "trackedEntityInstances",
      params: {
          ou : "MyfUagrB0XA",
          program: "uYjxkTbwRNf",
      },
    },
    contactTei: {
        resource: "trackedEntityInstances",
        params: {
            ou : "MyfUagrB0XA",
            program: "DM9n1bUw8W8",
        },
      },
    enrollments: {
        resource: "enrollments",
        params: {
            ou : "MyfUagrB0XA",
        },
    },
    events: {
        resource: "events",
        params: {
            orgUnit : "MyfUagrB0XA",
        },
    },
	optionals: {
		resource: "trackedEntityAttributes",
		params: {
			ou: "MyfUagrB0XA",
		},
    },
    me: {
        resource: 'me',
    }
  }
  
const apiUrl = "https://course.dhis2.org/api/trackedEntityInstances"
var x;
var y;
var fullNames = []
var fullNamesItems = []
var workload = "default"

const MyApp = (props) =>  {
    const [indexCheck, setIndex] = useState(true)
    const [contactCheck, setContact] = useState(true)
    const [date, setMyDate] = useState(new Date())
    const [isClicked, setClicked] = useState(false)

    return (
        <DataQuery query={query} variables={x, y, fullNames, fullNamesItems, workload}>
            {({ error, loading, data }) => {
                if (error) return <span>ERROR</span>
                if (loading) 
                return (
                    <>
                        {isClicked ? 
                        <Modal className={classes.modalText}>
                            <ModalContent>
                                Loading Working list...
                            </ModalContent></Modal> :
                        <Modal  className={classes.modalText}> 
                            <ModalTitle>
                            Welcome to Working list, [username loading...]
                            </ModalTitle>
                            <ModalContent>
                            This is an an app for covid-19 contact tracers </ModalContent>

<ModalContent>
This app keep track of the cases and contacts they need to follow up on.</ModalContent>


<ModalContent>
    This app show an overview of index cases and contacts to be contacted on a particular day (default = today). 
    You can view both cases and contacts together in the same list and separately. 
    From the list, it is be possible to go directly to the data entry form for a specific case (by opening the Tracker Capture app for that particular case).
    It is also possible to see an overview of the workload for the coming days. 
    I the app you will see the number of follow-up calls to be made today, tomorrow and in the coming weeks. 
    These numbers are based on scheduled events in the index and contact programmes.         
                            </ModalContent>
                            <ModalContent className= {classes.loadingInfo}>
                                Working list is currently loading
                            </ModalContent>
                            <ModalActions>
                                <ButtonStrip end>
                                    <Button
                                        primary
                                        type="button"
                                        onClick={function() {
                                        setClicked(true)                                     
                                        }}>
                                        OK
                                    </Button>
                                </ButtonStrip>
                            </ModalActions>
                        </Modal>
                        }
                    </>
                ) 
                workload = generateWorkload(data)

                let numOverdue = false;
                if (workload[0] > 0){
                    numOverdue = true;
                }
                
                return ( 
                    <>
                        {isClicked ? 
                    <div className={classes.container}>
                        <div className={classes.listTitle}>
                            Working list
                        </div>
                        <div className={classes.filters}>
                            <text className={classes.tableRoboto}>Filter by:</text>
                                <div className={classes.filterBox}>
                                    <Switch className={classes.filterBox}
                                            label="Index"
                                            dense
                                            valid= {indexCheck}
                                            checked={indexCheck} 
                                            value="checked" 
                                            onFocus={function onFocus(){ setIndex(!indexCheck)}}/>
                                </div>
                                <div className={classes.filterBox}>
                                    <Switch className={classes.filterBox}
                                        label= "Contact"
                                        dense
                                        valid = {contactCheck}
                                        checked={contactCheck} 
                                        value="checked"
                                        onFocus={function onFocus(){ setContact(!contactCheck)}}/>
                                </div>
                        </div>
						<div className={classes.dateFilterContainer}>
                            <Button small onClick = {() => setMyDate(new Date())}>
                                <img className={classes.todayIcon} src={require("./today.png")} /> <pre> Today</pre>
                            </Button>
                            <Button small onClick = {() => setMyDate(new Date(date.setDate(date.getDate() - 1)))}> {"< prev"} </Button>
                            <Card className={classes.dateFilter}>  
                                <CenteredContent postion="middle">{(date.getDate() == new Date().getDate()
                                    && date.getMonth() == new Date().getMonth()
                                    && date.getFullYear() == new Date().getFullYear()) 
                                    ? <text className={classes.dateFilter}>Today</text>
                                    : date.getFullYear() 
                                    + "." + (date.getMonth() +1) 
                                    + "." + date.getDate()}</CenteredContent></Card>
                                <Button small onClick = {() => setMyDate(new Date(date.setDate(date.getDate() + 1)))}> {"next >"} </Button>
                                    </div>
                                <div className={classes.mainFrame}>
                                    <div className={classes.mainFrameContainer}>   
                                        <MainTable className={classes.main} 
                                                   queryData={data} 
                                                   filterIndex={indexCheck} 
                                                   filterContact={contactCheck}
                                                   showDate = {date}/>
                                    </div>
                                </div>
                                    <Box className={numOverdue ? classes.overdue : classes.notOverdue}>
                                    {numOverdue ?  
                                    <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={classes.warningsvg}>
                                            <path d="M2 42h44L24 4 2 42zm24-6h-4v-4h4v4zm0-8h-4v-8h4v8z">
                                            </path>
                                        </svg>
                                        Overdue : 
                                        </div> :    
                                        <div>                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={classes.successsvg}>
                                            <path d="M24 4C12.95 4 4 12.95 4 24c0 11.04 8.95 20 20 20 11.04 0 20-8.96 20-20 0-11.05-8.96-20-20-20zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z">
                                            </path>
                                        </svg>
                                        Overdue : 
                                        </div>}
                                        <div>{workload[0]}</div>
                                    </Box>
                                    <div className={classes.workloadTitle}>
                                        Follow-ups
                                    </div>
                                    <Box className={classes.workDisplay}>
                                        <Box className = {classes.numDisplay}>
                                            Today: <div> {workload[1]} </div>
                                        </Box>
                                        <Box className = {classes.numDisplay}>
                                            Tomorrow: <div> {workload[2]} </div>
                                        </Box>
                                        <Box className = {classes.numDisplay}> 
                                            Coming week: <div> {workload[3]} </div>
                                        </Box>
                                        <Box className = {classes.numDisplay}>
                                            Next two weeks: <div> {workload[4]} </div>
                                        </Box>  
                                    </Box>
                            </div>:                         
                        <Modal className={classes.modalText}> 
                            <ModalTitle>
                            Welcome to Working list, {data.me.name}
                            </ModalTitle>
                            <ModalContent>
                            This is an an app for covid-19 contact tracers </ModalContent>

<ModalContent>
This app keep track of the cases and contacts they need to follow up on.</ModalContent>


<ModalContent>
    This app show an overview of index cases and contacts to be contacted on a particular day (default = today). 
    You can view both cases and contacts together in the same list and separately. 
    From the list, it is be possible to go directly to the data entry form for a specific case (by opening the Tracker Capture app for that particular case).
    It is also possible to see an overview of the workload for the coming days. 
    I the app you will see the number of follow-up calls to be made today, tomorrow and in the coming weeks. 
    These numbers are based on scheduled events in the index and contact programmes.         
                            </ModalContent>
                            <ModalContent className= {classes.loadingInfo}>
                                Loading is now complete
                            </ModalContent>
                            <ModalActions>
                                <ButtonStrip end>
                                    <Button
                                            primary
                                            type="button"
                                            onClick={function() {
                                            setClicked(true)
                                                                
                                            }}>OK</Button>
                    
                                </ButtonStrip>
                            </ModalActions>
                        </Modal>}
                    </>)}}     
        </DataQuery>
    )
}
export default MyApp
