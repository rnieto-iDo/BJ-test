import React, { FC } from 'react';
import Script from 'next/script';

type HubSpotScriptProps = {
    // eslint-disable-next-line react/require-default-props
    formId?: string;
};

const HubSpotScript: FC<HubSpotScriptProps> = ({ formId }): any => {
    if (!formId) return;

    const jsCode = `hbspt.forms.create({
        region: "na1", 
        portalId: "${process.env.HUBSPOT_PORTAL_ID}", 
        formId: "${formId}"});`;

    // eslint-disable-next-line consistent-return
    return (
        <Script key="hubspot-script-local" id="hubspot-script-local" strategy="afterInteractive">
            {jsCode}
        </Script>
    );
};

export default HubSpotScript;
