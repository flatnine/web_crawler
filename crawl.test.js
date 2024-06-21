import { jest, expect } from '@jest/globals';
import { normaliseURL, getURLsFromHTML } from './crawl';


test('check normaliseURL', () => {
  expect(normaliseURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
  expect(normaliseURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path');
  expect(normaliseURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
  expect(normaliseURL('http://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});


test('getURLsFromHTML absolute', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/' ]
    expect(actual).toEqual(expected)
  })

  test('getURLsFromHTML relative', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one' ]
    expect(actual).toEqual(expected)
  })

  test('getURLsFromHTML both', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
    expect(actual).toEqual(expected)
  })
