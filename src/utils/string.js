const suffixFound = (str, suffix, sensitive = true) => {
    if (!sensitive) str = str.toLowerCase()
    return str.endsWith((sensitive) ? suffix : suffix.toLowerCase())
}
const findSuffix = (str, suffixes, sensitive = true) => suffixes.find((suffix => suffixFound(str, suffix, sensitive)))
const trimSuffixes = (str, suffixes, sensitive = true) => {
    const suffix = findSuffix(str, suffixes, sensitive)
    if (suffix) {
        return str.substring(0, str.length - suffix.length)
    }
    return str
}
const getMatches = (str, regex) => {
    let m
    const matches = []
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        matches.push(m)
    }
    return matches
}

module.exports = { trimSuffixes, getMatches }
