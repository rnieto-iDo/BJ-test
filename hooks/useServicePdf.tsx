import { servicePDF, sendPDF } from "../public/services/pdf/service";
import { IPDFDownload, IPDFShare } from "../interfaces/pdfInerfaces";

export async function servicePdf(data: IPDFDownload) {
  return await servicePDF(data).then(res => res);
};
export async function servicePdfEmail(data: IPDFShare) {
  return await sendPDF(data).then(res => res);
};