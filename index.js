import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import axios from "axios";

const urlBase = "https://atallah.myvtex.com/api/catalog/pvt/stockkeepingunit/";
// const urlBase = "https://kliqueainternacional.myvtex.com/api/catalog/pvt/stockkeepingunit/";
const filePath = path.resolve("src", "Book.xlsx");
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: "buffer" });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);


const processData = async () => {
  for (const row of data) {
    const SkuId = row["Sku Id"];
    const payload1 = {
      FieldName: row["Field name"],
      GroupName: row["Field name"] + "s",
      RootLevelSpecification: true,
      FieldValues: [row["Field values"]],
    };

console.log(processData);

    try {
      const response1 = await axios.patch(`${urlBase}${SkuId}/specificationvalue`, payload1, {
        headers: {
          "Content-Type": "application/json",
        //   "X-VTEX-API-AppKey": "vtexappkey-kliqueainternacional-CTARQF",
        //   "X-VTEX-API-AppToken": "JPCDZDJTSGKBWASEOALBFATEQQCGGUSXBVMDZEQDCJSHGBTIAMMXNGJNCBVUKDROYAMSIXFCBZAEUEVWKKAOLYPXFOXLGEIRCASEEQRLICMZSTSPUIZCJMVOHFPTJOZQ",
          "X-VTEX-API-AppKey": "vtexappkey-atallah-RQMUHG",
          "X-VTEX-API-AppToken": "ARDPTKOEHQAWQMBYVLZZAVZKIEKLUJLKQJKMAVQUPVHVLPMNFOCTYAIWKJFSUNHZJQCSYKXFIUFSRBUWOLRHDFRBKTJZZNXYABRWGOPNOHHLZXEEHZKVGOQBNYDSGYPF",
        },
      });
      console.log(`SKU ${SkuId} actualizado en specificationvalue:`, response1.data);


      for (const item of response1.data) {
        const payload2 = {
          Id: item.Id,
          SkuId: item.SkuId,
          FieldId: item.FieldId,
          FieldValueId: item.FieldValueId,
          Text: item.Text,
        };

        const response2 = await axios.patch(`${urlBase}${SkuId}/specification`, payload2, {
          headers: {
            "Content-Type": "application/json",
        //     "X-VTEX-API-AppKey": "vtexappkey-kliqueainternacional-CTARQF",
        //     "X-VTEX-API-AppToken": "JPCDZDJTSGKBWASEOALBFATEQQCGGUSXBVMDZEQDCJSHGBTIAMMXNGJNCBVUKDROYAMSIXFCBZAEUEVWKKAOLYPXFOXLGEIRCASEEQRLICMZSTSPUIZCJMVOHFPTJOZQ",
                "X-VTEX-API-AppKey": "vtexappkey-atallah-RQMUHG",
                "X-VTEX-API-AppToken": "ARDPTKOEHQAWQMBYVLZZAVZKIEKLUJLKQJKMAVQUPVHVLPMNFOCTYAIWKJFSUNHZJQCSYKXFIUFSRBUWOLRHDFRBKTJZZNXYABRWGOPNOHHLZXEEHZKVGOQBNYDSGYPF",

          },
        });
        console.log(`SKU ${SkuId} actualizado en specification:`, response2.data);
      }
    } catch (error) {
      console.error(`Error con SKU ${SkuId}:`, error.response?.data || error.message);
    }
  }
};

processData();