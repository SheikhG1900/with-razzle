import { trimSuffixes } from './string'
test('trim suffix case sensitive', () => {
    expect(trimSuffixes('Hello world!.txt', ['.txt','.js','.jsx'])).toBe('Hello world!')
    expect(trimSuffixes('Hello world!.txt', ['.txT','.js','.jsx'])).toBe('Hello world!.txt')
    expect(trimSuffixes('Hello world!.js', ['.txt','.js','.jsx'])).toBe('Hello world!')
})

test('trim suffix case insensitive', () => {
    expect(trimSuffixes('Hello world!.txt', ['.txt','.js','.jsx'], false)).toBe('Hello world!')
    expect(trimSuffixes('Hello world!.txt', ['.txT','.js','.jsx'], false)).toBe('Hello world!')
    expect(trimSuffixes('Hello world!.JS', ['.txt','.js','.jsx'], false)).toBe('Hello world!')
})