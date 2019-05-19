const suffixFound = (str, suffix, sensitive = true) => {
    if(!sensitive) str = str.toLowerCase()
    return str.endsWith((sensitive)? suffix: suffix.toLowerCase())
} 
const findSuffix = (str, suffixes, sensitive = true) => suffixes.find((suffix => suffixFound(str, suffix, sensitive))) 
const trimSuffixes = (str, suffixes, sensitive = true) => {
    const suffix = findSuffix(str,suffixes, sensitive)
    if(suffix) {
        return str.substring(0, str.length - suffix.length)
    }
    return str
}

module.exports = { trimSuffixes }
