import { crawlPage, printReport } from './crawl.js';

const main = async () => {
    var args = process.argv.slice(2);
    if (args.length < 1) {
        console.log('Less than one arg');
        process.exit(1);
    }
    if (args.length > 1) {
        console.log('More than one arg');
        process.exit(1);
    }
    const baseURL = args[0];
    let pages = await crawlPage(baseURL, baseURL)
    printReport(pages)
    process.exit(0);
};

main();
