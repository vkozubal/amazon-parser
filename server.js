var request = require('request');
var cheerio = require('cheerio');
var sleep = require('sleep');
var fs = require('fs');

var fileName = '../response.json';
var url = 'http://www.amazon.de/s/ref=sr_nr_p_89_6?fst=as%3Aoff&rh=n%3A340843031%2Cn%3A%21340844031%2Cn%3A427957031%2Cp_n_feature_eleven_browse-bin%3A7472561031%2Cp_n_feature_fifteen_browse-bin%3A8321956031%7C8321955031%2Cp_n_feature_browse-bin%3A1478227031%7C1478229031%2Cp_n_style_browse-bin%3A392618011%2Cp_89%3AApple&bbn=427957031&ie=UTF8&qid=1453576335';

setInterval(makeRequest, 5000);

function makeRequest() {
    request(url, function (error, response, html) {

        fs.writeFile(fileName, '');// clear file content

        var json = [];
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

            console.log($.text());
            $('.s-item-container').each(function (i, elem) {
                var item = {};
                json.push(item);
                var data = $(this);
                item.model = data.children('.a-spacing-mini').first().text();
                item.price = {};
                var priceBlock = $('a .a-color-price', data.children('.a-spacing-mini').last());

                console.log(priceBlock.contents());

                item.price.new = $(priceBlock).attr('href', 'condition=new').text();
                item.price.used = $(priceBlock).attr('href', 'condition=used').text();
            });
        }
        fs.appendFile(fileName, JSON.stringify(json, null, 2), function () {
            console.log('file was written');
        });
    })
}


