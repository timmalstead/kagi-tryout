const benchmark = ({callbackToBenchmark, callbackArgs, expectedOutput, timesToRun = 1}) => {
    const output = callbackToBenchmark(...callbackArgs)
    const outputIsExpected = output === expectedOutput
    
    for (let i = 0; i < timesToRun; i++) {
        performance.mark("callbackStart") 
        callbackToBenchmark(...callbackArgs)
        performance.mark("callbackEnd") 
        performance.measure("callbackExecutionTime", "callbackStart", "callbackEnd")
    }
    
    const entries = performance.getEntriesByName("callbackExecutionTime")
    const totalExecutionTimes = entries.reduce((sum, {duration}) => (sum += duration), 0)

    performance.clearMarks() 
    performance.clearMeasures() 

    return JSON.stringify({args: callbackArgs, averageExecutionTime: totalExecutionTimes / timesToRun, output, outputIsExpected})
}
//
const determineCourtHearingTime1 = (nameToTarget, numberOfJudges, namesOfOthers) => {
    const nameQueue = [...namesOfOthers.split(" "), nameToTarget].sort() 
    
    let timeUntilMyHearingIsOver = 0
    while (nameQueue.length) {
        const currentGroupBeingSeen = nameQueue.splice(0, numberOfJudges) 
        ++timeUntilMyHearingIsOver 
        if (currentGroupBeingSeen.includes(nameToTarget)) break 
    }
    
    return timeUntilMyHearingIsOver * 30
}
//
const determineCourtHearingTime2 = (nameToTarget, numberOfJudges, namesOfOthers) => {
    let myNameHasBeenAssigned = false 
    const nameQueue = [...namesOfOthers.split(" "), nameToTarget].sort().map((name) => {
        const isMyName = name === nameToTarget
        const identity = {
            name,
            isMe: isMyName && !myNameHasBeenAssigned,
        } 
        myNameHasBeenAssigned = isMyName
        return identity
    })

    let timeUntilMyHearingIsOver = 0
    while (nameQueue.length) {
        const currentGroupBeingSeen = nameQueue.splice(0, numberOfJudges)
        ++timeUntilMyHearingIsOver
        if (currentGroupBeingSeen.find(({ name, isMe }) => name === nameToTarget && isMe))
            break
    }

    return timeUntilMyHearingIsOver * 30
}
//
const determineCourtHearingTime3 = (nameToTarget, numberOfJudges, namesOfOthers) => {
    let nameQueue = [nameToTarget]
    
    let currentName = ""
    for (let i = 0; i < namesOfOthers.length; i++) {
        const isLastChar = i + 1 === namesOfOthers.length
        if (namesOfOthers[i] === " " || isLastChar) {
            if (isLastChar) {
                currentName += namesOfOthers[namesOfOthers.length - 1]
            }
            nameQueue[nameQueue.length] = currentName
            currentName = ""
        }
        else currentName += namesOfOthers[i]
    }

    let tempQueue = []
    for (let i = 0; i < nameQueue.length; i++) {
        for (let j = 0; j < nameQueue.length; j++) {
            if (nameQueue[i] < nameQueue[j]) {
                tempQueue = nameQueue[j]
                nameQueue[j] = nameQueue[i]
                nameQueue[i] = tempQueue
            }
        }
    }

    let timeUntilMyHearingIsOver = 0
    while (nameQueue.length) {
        const currentGroupBeingSeen = []
        for (let i = 0; i < numberOfJudges; i++) currentGroupBeingSeen[currentGroupBeingSeen.length] = nameQueue[i]

        ++timeUntilMyHearingIsOver

        let myNameHasBeenFound = false
        for (let i = 0; i < numberOfJudges; i++) {
            myNameHasBeenFound = currentGroupBeingSeen[i] === nameToTarget
            if (myNameHasBeenFound) break
        }

        if (myNameHasBeenFound) break
        else {
            const tempNameArr = []
            for (let i = numberOfJudges; i < nameQueue.length; i++) tempNameArr[tempNameArr.length] = nameQueue[i]
            nameQueue = tempNameArr
        }
    }
    
    return timeUntilMyHearingIsOver * 30
}
//
console.log(`
    determineCourtHearingTime1:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime1, 
        callbackArgs: ["Timothy", 3, "Adam Betty Frank Mike"], 
        expectedOutput: 60,
        timesToRun: 100
    })}
`)
console.log(`
    determineCourtHearingTime1:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime1, 
        callbackArgs: ["Timothy", 1, "Adam Betty Frank Mike"], 
        expectedOutput: 150,
        timesToRun: 100
    })}
`)
console.log(`
    determineCourtHearingTime1:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime1, 
        callbackArgs: ["Timothy", 1, "Timothy Timothy Timothy Timothy"], 
        expectedOutput: 30,
        timesToRun: 100
    })}
`)

console.log(`
    determineCourtHearingTime2:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime2, 
        callbackArgs: ["Timothy", 3, "Adam Betty Frank Mike"], 
        expectedOutput: 60,
        timesToRun: 100
    })}
`)
console.log(`
    determineCourtHearingTime2:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime2, 
        callbackArgs: ["Timothy", 1, "Adam Betty Frank Mike"], 
        expectedOutput: 150,
        timesToRun: 100
    })}
`)
console.log(`
    determineCourtHearingTime2:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime2, 
        callbackArgs: ["Timothy", 1, "Timothy Timothy Timothy Timothy"], 
        expectedOutput: 30,
        timesToRun: 100
    })}
`)


console.log(`
    determineCourtHearingTime3:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime3, 
        callbackArgs: ["Timothy", 3, "Adam Betty Frank Mike"], 
        expectedOutput: 60,
        timesToRun: 100
    })}
`)
console.log(`
    determineCourtHearingTime3:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime3, 
        callbackArgs: ["Timothy", 1, "Adam Betty Frank Mike"], 
        expectedOutput: 150,
        timesToRun: 100
    })}
`)
console.log(`
    determineCourtHearingTime3:
    ${benchmark({
        callbackToBenchmark: determineCourtHearingTime3, 
        callbackArgs: ["Timothy", 1, "Timothy Timothy Timothy Timothy"], 
        expectedOutput: 30,
        timesToRun: 100
    })}
`)
