import readline from "readline"

export const getUserConfirmation = (question: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })

        reader.question(`${question} (type 'yes' to confirm) `, (answer) => {
            resolve(answer === 'yes')
            reader.close()
        })    
    })
}
