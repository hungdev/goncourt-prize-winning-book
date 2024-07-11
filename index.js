let cheerio = require('cheerio');
let axios = require('axios');
const fs = require('fs');
const path = require('path');
const url = 'https://vi.wikipedia.org/wiki/Gi%E1%BA%A3i_Goncourt';

const getInfo = async () => {
  const html = await axios.get(url);
  let $ = cheerio.load(html.data);
  const data = [];


  // Lặp qua các hàng của bảng, bỏ qua hàng tiêu đề và hàng thập niên
  $('table.wikitable tbody tr').each((index, element) => {
    const year = $(element).find('td').eq(0).text().trim();
    const author = $(element).find('td').eq(2).text().trim();
    const work = $(element).find('td').eq(3).text().trim();
    // const vnTranslation = $(element).find('td').eq(5).text().trim();
    const vnTranslationElement = $(element).find('td').eq(5);

    // Loại bỏ thẻ <sup> nếu có
    vnTranslationElement.find('sup').remove();

    // Lấy nội dung văn bản không chứa thẻ <sup>
    const vnTranslation = vnTranslationElement.text().trim();

    data.push({ year, author, work, vnTranslation });

  });

  const dataNewFormat = data?.filter(b => b.vnTranslation)?.map(el => `${el.year} - ${el.vnTranslation} - ${el.author}`);

  // const jsonData = JSON.stringify(data, null, 2);
  const jsonData = JSON.stringify(dataNewFormat, null, 2);

  const outputPath = path.join(__dirname, 'output.json');

  // Ghi dữ liệu vào file
  fs.writeFile(outputPath, jsonData, (err) => {
    if (err) {
      console.error('Có lỗi khi ghi file:', err);
    } else {
      console.log('Dữ liệu đã được ghi vào file:', outputPath);
    }
  });
};
getInfo();