import { JSDOM } from 'jsdom';

const normaliseURL = (url) => {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const path = urlObj.pathname.replace(/\/$/, '');
    return `${hostname}${path}`;
}

const getURLsFromHTML = (htmlBody, baseURL) => {
    let processedUrls = [];
    const dom = new JSDOM(htmlBody);
    const anchors = dom.window.document.querySelectorAll('a');

    for (const anchor of anchors) {
        if (!anchor.href) {
            continue;
        }
        let href = anchor.href;
        console.log(href);
        try {
            href = new URL(href, baseURL).toString();
            processedUrls.push(href);
        } catch (err) {
            console.log(`Error: ${err.message}: ${href}`)
        }
    };
    return processedUrls;
}

const getHost = (url) => {
    const urlObj = new URL(url)
    return urlObj.hostname
}

const fetchPage = async (url) => {
    let response
    try {
        response = await fetch(url, {})
    } catch(err) {
        throw new Error(`Error: ${err.message}`)
    }

    if (response.status > 399) {
        console.log("Error 4XX")
        return
    }
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
        console.log("Error not html")
        return
    }
    return await response.text()
}

const crawlPage = async (baseURL, currentURL, pages={}) => {
    if (getHost(baseURL) !== getHost(currentURL)) {
        return pages
    }
    const currentNormalised = normaliseURL(currentURL)
    if (pages[currentNormalised]) {
        pages[currentNormalised]++
        return pages
    } else {
        pages[currentNormalised] = 1
    }

    let response
    try {
        response = await fetchPage(currentURL)
    } catch(err) {
        console.log(`Error: ${error}`)
        return pages
    }
    for (let url of getURLsFromHTML(response, baseURL)) {
        pages = await crawlPage(baseURL, url, pages)
    }
    return pages
}

const printReport = (pages) => {
    console.log('==========')
    console.log('REPORT')
    console.log('==========')
    const sortedUrls = Object.fromEntries(
        Object.entries(pages).sort((a,b) =>  b[1] - a[1])
      );

    for (const [url, count] of Object.entries(sortedUrls)) {
        console.log(`Found ${count} internal links to ${url}`);
    }
}


export { normaliseURL, getURLsFromHTML, crawlPage, printReport };

