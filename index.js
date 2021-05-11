#!/usr/bin/env node
const
    path = require('path'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(3))

const FORMAT = 'srt'
const NEWLINE = '\r\n' // apparently this is the most used one
const SKIP_ME = {}

let ofs = process.argv[2] // the minus with negative numbers drives minimist crazy
ofs = ofs && Number(ofs.replace(',','.'))

if (!ofs) {
    print('subtlefixer <offset-in-seconds> [<path>] [--overwrite]')
    process.exit()
}
const folder = argv._[0] || process.cwd()

print('Working path',folder)
const { overwrite } = argv
print(overwrite ? 'overwrite mode' : `I'll append "-fixed" to destination files`)
let index = 1
eachFile(folder, '.'+FORMAT, fn=>{
    print('file',fn.startsWith(folder) ? fn.substr(folder.length+1) : fn,'...')
    const content = fs.readFileSync(fn, {encoding:'utf8', flag:'r'})
    const normalized = content.replace(/\r/g,'') // make it easy
    const pieces = normalized.split('\n\n')
    const newPieces = pieces.map(piece=>{
        if (!piece)
            return ''
        const lines = piece.split('\n')
        const times = lines[1].split(/ *-+> */,2)
        const newTimes = times.map(t=> {
            const x = t.split(':')
            const secs = 3600*x[0] + 60*x[1] + 1*x[2].replace(',','.')
            const newSecs = secs + ofs
            return newSecs >= 0 && secsToSRT(newSecs)
        })
        if (newTimes.some(x=> !x)) // whole piece must be discarded
            return SKIP_ME
        lines[0] = index++
        lines[1] = newTimes.join(' --> ')
        return lines.join(NEWLINE)
    }).filter(x=> x!==SKIP_ME)
    const newContent = newPieces.join(NEWLINE+NEWLINE)
    if (!overwrite)
        fn += '-fixed'
    fs.writeFileSync(fn, newContent)
    const discarded = pieces.length - newPieces.length
    print('done', discarded ? ` (${discarded} discarded)` : '')
})
|| print('No',FORMAT,'file found')

function print(...args) {
    console.log(...args)
}

function eachFile(folder, ext, cb) {
    const files = fs.readdirSync(folder)
    let n = 0
    for (const file of files)
        if (file.endsWith(ext)) {
            cb(path.join(folder, file))
            n++
        }
    return n
}

function secsToSRT(secs) {
    return new Date(secs*1000).toISOString().split('T')[1]
        .replace('.',',') // "this is the way"
        .substr(0,12) // remove final Z
}