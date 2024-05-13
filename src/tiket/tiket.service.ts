/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';


@Injectable()
export class TicketService {

    async getListTicket({
        from,
        to
    }: {
        from: string;
        to: string;
    }) {
        const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        },
        );

        const page = await browser.newPage();
        page.setUserAgent(ua)


        await page.goto('https://tiket.tokopedia.com/kereta-api/',
            {
                waitUntil: 'networkidle2'
            }
        );

        // input asal kota
        await page.click('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-16j44w0 > div.location > div:nth-child(1)')
        await page.type('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-16j44w0 > div.location > div:nth-child(1) > input', from);
        await page.waitForSelector('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-1q62ntx > div > div:nth-child(2) > img')
        await page.click('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-1q62ntx > div > div:nth-child(2)')

        // input tujuan kota    
        await page.click('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-16j44w0 > div.location > div:nth-child(3)')
        await page.type('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-16j44w0 > div.location > div:nth-child(3) > input', to)
        await page.waitForSelector('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-1q62ntx > div > div:nth-child(2) > img')

        await page.$$eval('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-1q62ntx > div > div', (elements, searchText) => {
            const matchedElements = [];
            elements.forEach(element => {
                if (element.textContent.includes(searchText)) {
                    element.style.border = '2px solid red'; // Highlighting matching elements
                    matchedElements.push(element);
                }
            });
            // Click on the first matched element
            if (matchedElements.length > 0) {
                matchedElements[0].click();
            }
        }, 'Yogyakarta - Yogyakarta (YK)');

        await page.click('#content > div.css-14u6y52 > div.css-8atqhb.e1iwxiko0 > div.css-npnzn1 > div > div > div.css-1m9l7hb > section > div.css-wkfdkq > button')
        await page.waitForSelector('#content > div.css-14u6y52 > div > div.css-1g5fbxl > div > div > div.css-xpculq > div.css-1chsdlq > div.css-c198ni > div > div')
        const data = await page.$$eval('#content > div.css-14u6y52 > div > div.css-1g5fbxl > div > div > div.css-xpculq > div.css-1chsdlq > div.css-c198ni > div > div', elements => {
            const dataArray = [];
            elements.forEach(element => {
                const departure = element.querySelector('.css-1yyzyn5.journey .journey_route:nth-child(1)');
                const arrival = element.querySelector('.css-1yyzyn5.journey .journey_route:nth-child(3)');

                const item = {
                    trainName: element.querySelector('.vehicle_name > span.name').textContent.trim(),
                    price: element.querySelector('.fare_title').textContent.trim(),
                    duration: element.querySelector('.duration').textContent.trim(),
                    departureInfo: {
                        time: departure ? departure.querySelector('.time').textContent.trim() : '',
                        station: departure ? departure.querySelector('.station').textContent.trim() : ''
                    },
                    arrivalInfo: {
                        time: arrival ? arrival.querySelector('.time').textContent.trim() : '',
                        station: arrival ? arrival.querySelector('.station').textContent.trim() : ''
                    },
                    capasityInfo: element.querySelector('div.css-tmxjfp')?.textContent?.trim() ?? element.querySelector('div.full_booked')?.textContent?.trim() ?? 'Capacity Available',
                };
                dataArray.push(item);
            });
            return dataArray;
        });



        await browser.close()
        return data ?? []
    }
}
