import { generateEndpointFromQuery } from '../../../utils';

export default function preview(req: any, res: any) {
    const endpoint = generateEndpointFromQuery(req.query.pageRoute);
    res.setPreviewData({});
    res.writeHead(307, { Location: endpoint });
    res.end();
}
